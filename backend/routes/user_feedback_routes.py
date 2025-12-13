from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Feedback

feedback_bp = Blueprint('feedback', __name__, url_prefix='/api/feedback')

@feedback_bp.route('', methods=['POST'])
@jwt_required()
def submit_feedback():
    data = request.get_json()
    user_id = get_jwt_identity()
    
    message = data.get('message')
    rating = data.get('rating', 0)
    
    if not message and not rating:
        return jsonify({"error": "Message or rating required"}), 400
        
    fb = Feedback(
        user_id=user_id,
        message=message or "No text provided",
        rating=rating,
        type='user_submission'
    )
    
    db.session.add(fb)
    db.session.commit()
    
    return jsonify({"message": "Feedback submitted successfully"}), 201
