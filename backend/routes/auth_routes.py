from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
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

    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))
    return jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": user.to_dict(),
        "role": user.role
    }), 200

@auth_bp.route('/auth/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user_id = get_jwt_identity()
    new_access_token = create_access_token(identity=str(current_user_id))
    return jsonify({"access_token": new_access_token}), 200

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
        "system_prompt": user.system_prompt or "",
        # Bot Controls
        "bot_enabled": user.bot_enabled,
        "active_outside_business_hours": user.active_outside_business_hours,
        "business_start_hour": user.business_start_hour,
        "business_end_hour": user.business_end_hour,
        "bot_language": user.bot_language
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

    # Bot Controls
    if 'bot_enabled' in data:
        user.bot_enabled = data['bot_enabled']
    if 'active_outside_business_hours' in data:
        user.active_outside_business_hours = data['active_outside_business_hours']
    if 'business_start_hour' in data:
        user.business_start_hour = int(data['business_start_hour'])
    if 'business_end_hour' in data:
        user.business_end_hour = int(data['business_end_hour'])
    if 'bot_language' in data:
        user.bot_language = data['bot_language']
        
    db.session.commit()
    return jsonify({"message": "Profile updated successfully"}), 200

# WhatsApp OAuth Routes
import os
from services.whatsapp_service import WhatsAppService
from models import WhatsAppConnection
from datetime import datetime, timedelta

# ============ EMBEDDED SIGNUP ENDPOINTS ============

@auth_bp.route('/auth/whatsapp/embedded/register', methods=['POST'])
@jwt_required()
def embedded_register_phone():
    """
    Step 1: Register a phone number for WhatsApp Business.
    This creates a WABA and registers the phone number.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    phone_number = data.get('phone_number')  # E.164 format: +1234567890
    display_name = data.get('display_name', 'My Business')
    
    if not phone_number:
        return jsonify({"error": "Phone number is required"}), 400
    
    # Validate E.164 format
    if not phone_number.startswith('+'):
        return jsonify({"error": "Phone number must be in E.164 format (e.g., +1234567890)"}), 400

    system_token = os.getenv("META_SYSTEM_USER_TOKEN")
    if not system_token:
        return jsonify({"error": "Server misconfiguration: META_SYSTEM_USER_TOKEN not set"}), 500

    try:
        # Register phone number and create WABA
        result = WhatsAppService.register_phone_number(
            phone_number=phone_number,
            display_name=display_name,
            system_user_token=system_token
        )
        
        # Store temporary data in session or database
        # For now, we'll return it to frontend and expect it back in verify step
        return jsonify({
            "message": "Phone number registered. Verification code will be sent.",
            "waba_id": result['waba_id'],
            "phone_number_id": result['phone_number_id'],
            "display_name": result['display_name'],
            "next_step": "request_code"
        }), 200

    except Exception as e:
        print(f"Embedded Signup Error: {e}")
        return jsonify({"error": f"Registration failed: {str(e)}"}), 500

@auth_bp.route('/auth/whatsapp/embedded/request-code', methods=['POST'])
@jwt_required()
def embedded_request_code():
    """
    Step 2: Request verification code via SMS or VOICE.
    """
    data = request.get_json()
    phone_number_id = data.get('phone_number_id')
    method = data.get('method', 'SMS')  # SMS or VOICE
    
    if not phone_number_id:
        return jsonify({"error": "phone_number_id is required"}), 400
    
    if method not in ['SMS', 'VOICE']:
        return jsonify({"error": "method must be SMS or VOICE"}), 400

    system_token = os.getenv("META_SYSTEM_USER_TOKEN")
    if not system_token:
        return jsonify({"error": "Server misconfiguration"}), 500

    try:
        result = WhatsAppService.request_verification_code(
            phone_number_id=phone_number_id,
            method=method,
            system_user_token=system_token
        )
        
        return jsonify({
            "message": f"Verification code sent via {method}",
            "success": result.get('success', True)
        }), 200

    except Exception as e:
        print(f"Request Code Error: {e}")
        return jsonify({"error": f"Failed to send code: {str(e)}"}), 500

@auth_bp.route('/auth/whatsapp/embedded/verify', methods=['POST'])
@jwt_required()
def embedded_verify_code():
    """
    Step 3: Verify the code received via SMS/Voice.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    phone_number_id = data.get('phone_number_id')
    waba_id = data.get('waba_id')
    code = data.get('code')
    
    if not phone_number_id or not code or not waba_id:
        return jsonify({"error": "phone_number_id, waba_id, and code are required"}), 400

    system_token = os.getenv("META_SYSTEM_USER_TOKEN")
    if not system_token:
        return jsonify({"error": "Server misconfiguration"}), 500

    try:
        # Verify the code
        verify_result = WhatsAppService.verify_phone_code(
            phone_number_id=phone_number_id,
            code=code,
            system_user_token=system_token
        )
        
        if not verify_result.get('success', False):
            return jsonify({"error": "Invalid verification code"}), 400
        
        # Get phone number info
        phone_info = WhatsAppService.get_phone_number_info(
            phone_number_id=phone_number_id,
            system_user_token=system_token
        )
        
        # Setup webhook subscription
        WhatsAppService.setup_webhook_subscription(
            waba_id=waba_id,
            system_user_token=system_token
        )
        
        # Save to database
        conn = WhatsAppConnection.query.filter_by(user_id=user.id).first()
        if not conn:
            conn = WhatsAppConnection(user_id=user.id)
            db.session.add(conn)
            
        conn.waba_id = waba_id
        conn.phone_number_id = phone_number_id
        conn.display_phone_number = phone_info.get('display_phone_number', 'Unknown')
        conn.access_token = system_token  # Using system token for now
        conn.token_expires_at = None  # System tokens don't expire
        conn.signup_method = 'embedded'
        
        db.session.commit()
        
        return jsonify({
            "message": "WhatsApp connected successfully!",
            "waba_id": waba_id,
            "phone_number": phone_info.get('display_phone_number'),
            "verified_name": phone_info.get('verified_name')
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"Verification Error: {e}")
        return jsonify({"error": f"Verification failed: {str(e)}"}), 500

# ============ LEGACY OAUTH ENDPOINTS (DEPRECATED) ============
# Keeping for reference, but these are no longer used

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

@auth_bp.route('/auth/whatsapp/manual', methods=['POST'])
@jwt_required()
def manual_connect_whatsapp():
    """
    Allows user to manually paste their Phone ID, WABA ID, and Permanent Token.
    Bypasses the "Tech Provider" verification requirement.
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    phone_id = data.get('phone_id')
    waba_id = data.get('waba_id')
    access_token = data.get('access_token')
    
    if not phone_id or not waba_id or not access_token:
        return jsonify({"error": "Missing required fields (Phone ID, WABA ID, Access Token)"}), 400

    try:
        # Check if already connected
        conn = WhatsAppConnection.query.filter_by(user_id=user.id).first()
        if not conn:
            conn = WhatsAppConnection(user_id=user.id)
            db.session.add(conn)
            
        conn.waba_id = waba_id
        conn.phone_number_id = phone_id
        # In a real app, verify these IDs by calling Meta Graph API manually here?
        # For now, trust the user input.
        conn.display_phone_number = "Manual Config" # We could fetch this from Meta if we wanted
        conn.access_token = access_token
        conn.token_expires_at = None # Assume permanent token
        conn.signup_method = 'manual'  # Mark as manual connection
        
        db.session.commit()
        
        return jsonify({
            "message": "WhatsApp connected manually",
            "connected": True
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Database Error: {str(e)}"}), 500

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
