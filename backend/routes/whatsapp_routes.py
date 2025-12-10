import os
import requests
from flask import Blueprint, request, jsonify, current_app
from models import db, User, MessageLog
from services.ai_service import generate_ai_reply
from utils.encryption import decrypt_value

whatsapp_bp = Blueprint('whatsapp', __name__)

@whatsapp_bp.route('/whatsapp/webhook', methods=['GET'])
def verify_webhook():
    # Meta verification
    verify_token = request.args.get('hub.verify_token')
    mode = request.args.get('hub.mode')
    challenge = request.args.get('hub.challenge')

    # Hardcoded verify token for MVP "chatease_verify_token" (User should configure this on Meta dashboard)
    if mode == 'subscribe' and verify_token == 'chatease_verify_token':
        return challenge, 200
    return 'Forbidden', 403

@whatsapp_bp.route('/whatsapp/webhook', methods=['POST'])
def webhook_handler():
    data = request.get_json()
    print(f"DEBUG: Webhook Received: {data}")
    
    if not data or 'object' not in data:
        return jsonify({"status": "ignored"}), 200

    try:
        # Extract message details (Simplified for MVP)
        entry = data['entry'][0]
        changes = entry['changes'][0]
        value = changes['value']
        
        if 'messages' in value:
            message_data = value['messages'][0]
            phone_number_id = value['metadata']['phone_number_id']
            sender_phone = message_data['from']
            msg_type = message_data['type']
            
            text_body = ""
            
            # Find user first (needed for token)
            from models import WhatsAppConnection
            conn = WhatsAppConnection.query.filter_by(phone_number_id=phone_number_id).first()
            user = conn.user if conn else User.query.filter_by(whatsapp_phone_id=phone_number_id).first()

            if msg_type == 'text':
                text_body = message_data['text']['body']
            elif msg_type == 'audio':
                if not conn or not user:
                    print("Cannot download audio without valid connection/user")
                    return jsonify({"status": "ignored"}), 200

                # Handle Audio
                audio_id = message_data['audio']['id']
                from services.whatsapp_service import WhatsAppService
                from services.ai_service import transcribe_audio
                
                try:
                    # Get download URL
                    media_url = WhatsAppService.get_media_url(audio_id, conn.access_token)
                    # Download content
                    audio_data = WhatsAppService.download_media_content(media_url, conn.access_token)
                    # Transcribe
                    transcribed_text = transcribe_audio(audio_data, user)
                    
                    if transcribed_text and not transcribed_text.startswith("Sorry"):
                        text_body = transcribed_text
                        # Notify user what we heard (optional, good for UX)
                        # WhatsAppService.send_message(conn.phone_number_id, conn.access_token, sender_phone, "text", f"🎤 I heard: \"{text_body}\"")
                    else:
                        text_body = "I received a voice message but could not transcribe it. Please use text."
                except Exception as e:
                    print(f"Audio processing failed: {e}")
                    text_body = "Error processing voice message."
            else:
                print(f"Unsupported message type: {msg_type}")
                return jsonify({"status": "processed"}), 200
            
            if user and user.is_active:
                # Generate Reply
                reply_text = generate_ai_reply(user.id, text_body, user)
                
                # Send Reply to WhatsApp
                # If we have a connection object, use its token. If not, legacy user key.
                if conn:
                    # Use Service
                    from services.whatsapp_service import WhatsAppService
                    WhatsAppService.send_message(conn.phone_number_id, conn.access_token, sender_phone, "text", reply_text)
                else:
                    # Legacy
                    send_whatsapp_message(user, sender_phone, reply_text)

                # Log to DB
                log = MessageLog(user_id=user.id, incoming_msg=text_body, ai_reply=reply_text)
                db.session.add(log)
                db.session.commit()

        return jsonify({"status": "processed"}), 200
    except Exception as e:
        print(f"Webhook Error: {e}")
        return jsonify({"status": "error"}), 500

def send_whatsapp_message(user, recipient_phone, text):
    # Legacy support
    if not user.whatsapp_api_key or not user.whatsapp_phone_id:
        print("Missing WhatsApp Credentials")
        return
    
    decrypted_key = decrypt_value(user.whatsapp_api_key)

    url = f"https://graph.facebook.com/v24.0/{user.whatsapp_phone_id}/messages"
    headers = {
        "Authorization": f"Bearer {decrypted_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "messaging_product": "whatsapp",
        "to": recipient_phone,
        "type": "text",
        "text": {"body": text}
    }
    
    try:
        requests.post(url, headers=headers, json=payload)
    except Exception as e:
        print(f"Send Message Error: {e}")
