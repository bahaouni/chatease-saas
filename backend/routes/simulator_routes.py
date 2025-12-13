from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, MessageLog, db
from services.ai_service import generate_ai_reply

simulator_bp = Blueprint('simulator', __name__)

@simulator_bp.route('/test/chat', methods=['POST'])
@jwt_required()
def test_chat():
    current_identity = get_jwt_identity()
    user_id = int(current_identity) # Cast back to int for DB lookup
    user = User.query.get(user_id)
    
    if not user:
         return jsonify({"error": "User not found"}), 404
         
    data = request.get_json()
    message = data.get('message', '')
    
    if not message:
        return jsonify({"reply": "Please type a message."}), 400
        
    # Generate reply using the same logic as the real bot
    reply = generate_ai_reply(user.id, message, user)
    
    # Save to MessageLog (Simulator)
    try:
        log = MessageLog(
            user_id=user.id, 
            incoming_msg=message, 
            ai_reply=reply
        )
        db.session.add(log)
        db.session.commit()
    except Exception as e:
        print(f"Error logging simulator message: {e}")

    return jsonify({"reply": reply}), 200
