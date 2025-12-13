from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, MessageLog, WhatsAppConnection, Feedback
from datetime import datetime, timedelta

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

def is_admin(user_id):
    user = User.query.get(user_id)
    return user and user.role == 'admin'

@admin_bp.before_request
@jwt_required()
def check_admin():
    if request.method == 'OPTIONS':
        return
    user_id = get_jwt_identity()
    if not is_admin(user_id):
        return jsonify({"error": "Admin access required"}), 403

@admin_bp.route('/stats', methods=['GET'])
def get_dashboard_stats():
    total_users = User.query.count()
    active_bots = User.query.filter_by(bot_enabled=True).count()
    
    # Simple message count (last 24h)
    yesterday = datetime.utcnow() - timedelta(days=1)
    msgs_24h = MessageLog.query.filter(MessageLog.timestamp >= yesterday).count()
    
    # Feedback count
    new_feedback = Feedback.query.filter_by(status='new').count()

    return jsonify({
        "total_users": total_users,
        "active_bots": active_bots,
        "messages_24h": msgs_24h,
        "pending_feedback": new_feedback,
        "system_status": "Operational"
    })

@admin_bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    # Serialize manually for admin view
    users_list = []
    for u in users:
        conn = WhatsAppConnection.query.filter_by(user_id=u.id).first()
        users_list.append({
            "id": u.id,
            "email": u.email,
            "created_at": u.created_at.isoformat() if u.created_at else None,
            "is_active": u.is_active,
            "bot_enabled": u.bot_enabled,
            "role": u.role,
            "connected_phone": conn.display_phone_number if conn else "N/A"
        })
    return jsonify({"users": users_list})

@admin_bp.route('/users/<int:user_id>/suspend', methods=['POST'])
def suspend_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    user.is_active = not user.is_active # Toggle
    db.session.commit()
    return jsonify({"message": f"User {'activated' if user.is_active else 'suspended'}", "is_active": user.is_active})

@admin_bp.route('/users/<int:user_id>/delete', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    # Cascade delete (manual for safety if models don't cascade)
    Feedback.query.filter_by(user_id=user_id).delete()
    MessageLog.query.filter_by(user_id=user_id).delete()
    WhatsAppConnection.query.filter_by(user_id=user_id).delete()
    
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"})

@admin_bp.route('/feedback', methods=['GET', 'POST'])
def handle_feedback():
    if request.method == 'POST':
        data = request.get_json()
        fb = Feedback(
            user_id=get_jwt_identity(), # Admin creating note? Or pass user_id?
            message=data.get('message'),
            type=data.get('type', 'general')
        )
        db.session.add(fb)
        db.session.commit()
        return jsonify({"message": "Feedback logged"}), 201
        
    # GET
    feedbacks = Feedback.query.order_by(Feedback.created_at.desc()).all()
    return jsonify({"feedback": [f.to_dict() for f in feedbacks]})

@admin_bp.route('/feedback/<int:fb_id>/resolve', methods=['POST'])
def resolve_feedback(fb_id):
    fb = Feedback.query.get(fb_id)
    if not fb:
        return jsonify({"error": "Feedback not found"}), 404
    
    fb.status = 'resolved'
    db.session.commit()
    return jsonify({"message": "Feedback resolved"})
