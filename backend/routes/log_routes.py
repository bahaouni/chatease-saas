from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import CommandLog, db

log_bp = Blueprint('log', __name__)

@log_bp.route('/logs', methods=['GET'])
@jwt_required()
def get_logs():
    user_id = get_jwt_identity()
    
    # Pagination
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    logs_pagination = CommandLog.query.filter_by(user_id=user_id)\
        .order_by(CommandLog.timestamp.desc())\
        .paginate(page=page, per_page=per_page)
        
    return jsonify({
        'logs': [log.to_dict() for log in logs_pagination.items],
        'total': logs_pagination.total,
        'pages': logs_pagination.pages,
        'current_page': page
    }), 200

from models import MessageLog

@log_bp.route('/chat-history', methods=['GET'])
@jwt_required()
def get_chat_history():
    user_id = get_jwt_identity()
    
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    logs_pagination = MessageLog.query.filter_by(user_id=user_id)\
        .order_by(MessageLog.timestamp.desc())\
        .paginate(page=page, per_page=per_page)
        
    return jsonify({
        'logs': [log.to_dict() for log in logs_pagination.items],
        'total': logs_pagination.total,
        'pages': logs_pagination.pages,
        'current_page': page
    }), 200
