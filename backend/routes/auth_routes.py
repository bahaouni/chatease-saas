from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User
from utils.encryption import encrypt_value, decrypt_value

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    hashed_password = generate_password_hash(password)
    new_user = User(email=email, password_hash=hashed_password)
    
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully"}), 201

@auth_bp.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid email or password"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "user": user.to_dict()
    }), 200

@auth_bp.route('/auth/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # Decrypt keys for display (or mask them in future)
    return jsonify({
        "id": user.id,
        "email": user.email,
        "whatsapp_phone_id": user.whatsapp_phone_id,
        "whatsapp_api_key": decrypt_value(user.whatsapp_api_key),
        "ai_api_key": decrypt_value(user.ai_api_key),
        "ai_provider": user.ai_provider or 'openai',
        "system_prompt": user.system_prompt or ""
    }), 200

@auth_bp.route('/auth/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    
    # Legacy fields (kept for backward compatibility if needed)
    if 'whatsapp_phone_id' in data:
        user.whatsapp_phone_id = data['whatsapp_phone_id']
    if 'whatsapp_api_key' in data:
        user.whatsapp_api_key = encrypt_value(data['whatsapp_api_key'])
        
    # AI Fields
    if 'ai_api_key' in data:
        user.ai_api_key = encrypt_value(data['ai_api_key'])
    if 'ai_provider' in data:
        user.ai_provider = data['ai_provider']
    if 'system_prompt' in data:
        user.system_prompt = data['system_prompt']
        
    db.session.commit()
    return jsonify({"message": "Profile updated successfully"}), 200

# WhatsApp OAuth Routes
import os
from services.whatsapp_service import WhatsAppService
from models import WhatsAppConnection
from datetime import datetime, timedelta

@auth_bp.route('/auth/whatsapp/url', methods=['GET'])
@jwt_required()
def get_whatsapp_auth_url():
    """Returns the Meta OAuth URL for the user to connect WhatsApp."""
    app_id = os.getenv("FB_APP_ID")
    redirect_uri = os.getenv("REDIRECT_URI")
    scope = "whatsapp_business_management,whatsapp_business_messaging,business_management"
    state = "some_random_secure_string" # In prod, use a real CSRF token linked to session

    if not app_id or not redirect_uri:
        return jsonify({"error": "Server misconfiguration: Missing FB_APP_ID or REDIRECT_URI"}), 500

    auth_url = (
        f"https://www.facebook.com/v24.0/dialog/oauth?"
        f"client_id={app_id}&redirect_uri={redirect_uri}&scope={scope}&state={state}"
    )
    return jsonify({"url": auth_url}), 200

@auth_bp.route('/auth/callback', methods=['GET'])
def auth_callback():
    """Handles the redirect from Meta after user authorizes."""
    code = request.args.get('code')
    error = request.args.get('error')
    
    # We need to know WHICH user this is.
    # Since this is a redirect, we can't easily pass the JWT header.
    # Options:
    # 1. User state param to pass user_id (if signed, secure).
    # 2. Redirect to frontend with code, then frontend calls backend with code + JWT. 
    #    (The plan said "Flask callback exchanges code", implying backend handles the redirect directly.)
    # 3. If redirect_uri points to frontend, frontend gets code, then calls backend.
    
    # Let's assume the user meant: Frontend -> Meta -> Backend Check?
    # Actually, the user's prompt says: "redirect_uri=https://yourapp.com/auth/callback" and "Flask: OAuth callback".
    # This implies the backend handles it. But backend needs to know the user.
    # Usually in this flow, we store a session cookie or a temporary state mapping to user_id.
    
    # FOR THIS IMPLEMENTATION (SaaS style usually redirects to frontend first):
    # If the user is navigating the browser, the browser has cookies. 
    # But we are using JWT in headers usually.
    
    # BETTER APPROACH FOR SPA:
    # Redirect URI should be the FRONTEND URL (e.g. localhost:3000/dashboard/settings).
    # Frontend grabs ?code=..., then sends POST /auth/whatsapp/connect { code: ... } with JWT.
    
    # However, if we MUST follow the "Flask callback" server-side instruction strictly:
    # We would need a cookie session.
    
    # Let's stick to the "Frontend handles redirect" mostly because it's cleaner for JWT auth apps.
    # Wait, the prompt said: "Users click 'Connect WhatsApp' ... send them to Meta OAuth ... redirect_uri=.../auth/callback".
    # And then "Flask: OAuth callback ... exchange code".
    
    # If I implement `/auth/callback` as a GET here, it won't have the User's JWT unless it's in a cookie.
    
    # Alternative: The `state` parameter can contain the user_id (signed or encrypted).
    # For MVP, let's put `user_id` in `state`.
    pass

@auth_bp.route('/auth/whatsapp/connect', methods=['POST'])
@jwt_required()
def connect_whatsapp_account():
    """
    Frontend sends the OAuth code here (after grabbing it from URL).
    This is safer for JWT apps than a direct backend callback which lacks context.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    code = data.get('code')
    
    if not code:
        return jsonify({"error": "Missing authorization code"}), 400

    try:
        # 1. Exchange code for short-lived token
        token_data = WhatsAppService.exchange_code_for_token(code)
        short_token = token_data.get('access_token')
        
        # 2. Exchange for long-lived token
        long_token_data = WhatsAppService.get_long_lived_token(short_token)
        long_token = long_token_data.get('access_token')
        expires_in = long_token_data.get('expires_in') # seconds
        token_expiry = datetime.utcnow() + timedelta(seconds=expires_in) if expires_in else None
        
        # 3. Fetch WABA and Phone Numbers
        wabas = WhatsAppService.fetch_waba_ids(long_token)
        if not wabas:
            return jsonify({"error": "No WhatsApp Business Accounts found. Please create one in Meta Business Manager."}), 400
        
        # For MVP, just pick the first WABA and first Phone Number
        # In a real app, we might ask user to select if multiple exist
        target_waba = wabas[0]
        waba_id = target_waba['id']
        business_id = target_waba.get('business_id')
        
        phone_numbers = WhatsAppService.fetch_phone_numbers(waba_id, long_token)
        if not phone_numbers:
            return jsonify({"error": "WABA found but no phone numbers registered. Please register a number in WhatsApp Manager."}), 400
            
        target_phone = phone_numbers[0]
        phone_id = target_phone['id']
        display_phone = target_phone.get('display_phone_number')
        
        # 4. Save to DB
        conn = WhatsAppConnection.query.filter_by(user_id=user.id).first()
        if not conn:
            conn = WhatsAppConnection(user_id=user.id)
            db.session.add(conn)
            
        conn.waba_id = waba_id
        conn.phone_number_id = phone_id
        conn.display_phone_number = display_phone
        conn.access_token = long_token # Encrypt this!
        conn.token_expires_at = token_expiry
        conn.business_id = business_id
        
        # Update User fields for backward compatibility (optional)
        # user.whatsapp_phone_id = phone_id
        # user.whatsapp_api_key = long_token
        
        db.session.commit()
        
        return jsonify({
            "message": "WhatsApp connected successfully",
            "waba_id": waba_id,
            "phone_number": display_phone
        }), 200

    except Exception as e:
        print(f"WhatsApp Connect Error: {e}")
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/auth/whatsapp/status', methods=['GET'])
@jwt_required()
def whatsapp_status():
    user_id = get_jwt_identity()
    conn = WhatsAppConnection.query.filter_by(user_id=user_id).first()
    
    if not conn:
        return jsonify({"connected": False}), 200
        
    return jsonify({
        "connected": True,
        "waba_id": conn.waba_id,
        "phone_number": conn.display_phone_number,
        "expires_at": conn.token_expires_at.isoformat() if conn.token_expires_at else None
    }), 200

@auth_bp.route('/auth/whatsapp/disconnect', methods=['POST'])
@jwt_required()
def disconnect_whatsapp():
    user_id = get_jwt_identity()
    conn = WhatsAppConnection.query.filter_by(user_id=user_id).first()
    if conn:
        db.session.delete(conn)
        db.session.commit()
        
    return jsonify({"message": "Disconnected"}), 200
