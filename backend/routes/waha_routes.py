from flask import Blueprint, jsonify, request, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
import requests
import io
import base64

waha_bp = Blueprint('waha', __name__)

WAHA_URL = "http://waha:3000"

@waha_bp.route('/auth/whatsapp/waha/start', methods=['POST'])
@jwt_required()
def start_session():
    user_id = get_jwt_identity()
    session_name = f"user_{user_id}"
    
    try:
        # Check if session exists
        # Waha API: GET /api/sessions/{session}
        # If 404, create it
        
        # Start Session
        # POST /api/sessions
        payload = {"name": session_name}
        res = requests.post(f"{WAHA_URL}/api/sessions", json=payload)
        
        if res.status_code in [200, 201]:
             return jsonify({"message": "Session started", "session": session_name}), 200
        elif res.status_code == 409: # Already exists
             return jsonify({"message": "Session already exists", "session": session_name}), 200
        else:
             return jsonify({"error": f"Failed to start session: {res.text}"}), 500
             
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@waha_bp.route('/auth/whatsapp/waha/qr', methods=['GET'])
@jwt_required()
def get_qr():
    user_id = get_jwt_identity()
    session_name = f"user_{user_id}"
    
    try:
        # Get QR Screenshot
        # GET /api/sessions/{session}/auth/qr?format=image
        # Note: Waha endpoints might vary slightly by version, checking docs standard.
        # Waha Plus standard: /api/screenshot?session={session}
        # Core: /api/default/auth/qr 
        
        res = requests.get(f"{WAHA_URL}/api/screenshot?session={session_name}")
        
        if res.status_code == 200:
            # It returns the image binary
            return send_file(
                io.BytesIO(res.content),
                mimetype='image/png',
                as_attachment=False,
                download_name='qr.png'
            )
        else:
             return jsonify({"error": "QR code not available yet (Session starting?)"}), 404
             
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@waha_bp.route('/auth/whatsapp/waha/status', methods=['GET'])
@jwt_required()
def check_status():
    user_id = get_jwt_identity()
    session_name = f"user_{user_id}"
    
    try:
        # GET /api/sessions/{session}
        res = requests.get(f"{WAHA_URL}/api/sessions/{session_name}")
        if res.status_code == 200:
            data = res.json()
            # Status: STOPPED, STARTING, SCAN_QR_CODE, WORKING, FAILED
            return jsonify({"status": data.get('status', 'UNKNOWN')}), 200
        return jsonify({"status": "NOT_FOUND"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
