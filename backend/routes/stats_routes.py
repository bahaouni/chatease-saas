from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import MessageLog, User
from datetime import datetime, date
from utils.encryption import decrypt_value

stats_bp = Blueprint('stats', __name__)

@stats_bp.route('/stats/summary', methods=['GET'])
@jwt_required()
def get_stats_summary():
    user_id = get_jwt_identity()
    
    # Total Messages
    total_messages = MessageLog.query.filter_by(user_id=user_id).count()
    
    # Today's Messages
    today = date.today()
    # Filter by timestamp >= today's date at 00:00:00
    today_messages = MessageLog.query.filter(
        MessageLog.user_id == user_id,
        MessageLog.timestamp >= datetime.combine(today, datetime.min.time())
    ).count()
    
    return jsonify({
        "total_messages": total_messages,
        "today_messages": today_messages
    }), 200

@stats_bp.route('/stats/logs', methods=['GET'])
@jwt_required()
def get_message_logs():
    user_id = get_jwt_identity()
    page = request.args.get('page', 1, type=int)
    per_page = 20
    
    logs_pagination = MessageLog.query.filter_by(user_id=user_id)\
        .order_by(MessageLog.timestamp.desc())\
        .paginate(page=page, per_page=per_page)
        
    logs = [{
        "id": log.id,
        "user_message": log.incoming_msg,
        "bot_reply": log.ai_reply,
        "timestamp": log.timestamp.strftime("%Y-%m-%d %H:%M:%S")
    } for log in logs_pagination.items]
    
    return jsonify({
        "logs": logs,
        "total": logs_pagination.total,
        "pages": logs_pagination.pages,
        "current_page": page
    }), 200
