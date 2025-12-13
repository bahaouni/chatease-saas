import requests
import os
from flask import current_app

class WhatsAppService:
    BASE_URL = "https://graph.facebook.com/v24.0"

    @staticmethod
    def exchange_code_for_token(code):
        app_id = os.getenv("FB_APP_ID")
        app_secret = os.getenv("FB_APP_SECRET")
        redirect_uri = os.getenv("REDIRECT_URI") # e.g. http://localhost:5000/auth/callback

        url = f"{WhatsAppService.BASE_URL}/oauth/access_token"
        params = {
            "client_id": app_id,
            "redirect_uri": redirect_uri,
            "client_secret": app_secret,
            "code": code
        }
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()

    @staticmethod
    def get_long_lived_token(short_lived_token):
        app_id = os.getenv("FB_APP_ID")
        app_secret = os.getenv("FB_APP_SECRET")

        url = f"{WhatsAppService.BASE_URL}/oauth/access_token"
        params = {
            "grant_type": "fb_exchange_token",
            "client_id": app_id,
            "client_secret": app_secret,
            "fb_exchange_token": short_lived_token
        }

        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()

    @staticmethod
    def fetch_waba_ids(access_token):
        # First get the user's businesses or just try to get owned WABAs if we have granularity
        # For simplicity, let's try getting WABAs directly if the token allows, 
        # or we might need to get the user's ID first.
        # A common pattern: Me -> Businesses -> WABAs
        
        # Get User ID first
        me_url = f"{WhatsAppService.BASE_URL}/me"
        me_res = requests.get(me_url, params={"access_token": access_token})
        me_res.raise_for_status()
        
        # Note: Granular scopes might require fetching businesses first
        # GET /v24.0/me/businesses
        businesses_url = f"{WhatsAppService.BASE_URL}/me/businesses"
        businesses_res = requests.get(businesses_url, params={"access_token": access_token})
        
        if businesses_res.status_code == 200:
            businesses = businesses_res.json().get('data', [])
            all_wabas = []
            
            for business in businesses:
                biz_id = business['id']
                # GET /v24.0/{business-id}/owned_whatsapp_business_accounts
                waba_url = f"{WhatsAppService.BASE_URL}/{biz_id}/owned_whatsapp_business_accounts"
                waba_res = requests.get(waba_url, params={"access_token": access_token})
                if waba_res.status_code == 200:
                    wabas = waba_res.json().get('data', [])
                    for waba in wabas:
                        waba['business_id'] = biz_id # Attach business ID
                    all_wabas.extend(wabas)
            
            return all_wabas
            
        return []

    @staticmethod
    def fetch_phone_numbers(waba_id, access_token):
        url = f"{WhatsAppService.BASE_URL}/{waba_id}/phone_numbers"
        response = requests.get(url, params={"access_token": access_token})
        if response.status_code == 200:
            return response.json().get('data', [])
        return []

    @staticmethod
    def get_media_url(media_id, access_token):
        """Fetches the download URL for a media object."""
        url = f"{WhatsAppService.BASE_URL}/{media_id}"
        response = requests.get(url, params={"access_token": access_token})
        response.raise_for_status()
        return response.json().get("url")

    @staticmethod
    def download_media_content(media_url, access_token):
        """Downloads the actual binary content of the media."""
        headers = {"Authorization": f"Bearer {access_token}"}
        response = requests.get(media_url, headers=headers)
        response.raise_for_status()
        return response.content
        
    @staticmethod
    def send_message(phone_number_id, access_token, to, type="text", body=None):
        url = f"{WhatsAppService.BASE_URL}/{phone_number_id}/messages"
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        payload = {
            "messaging_product": "whatsapp",
            "to": to,
            "type": type,
            "text": {"body": body} if type == "text" else None
        }
        # filter None
        payload = {k: v for k, v in payload.items() if v is not None}
        
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()

    # ============ EMBEDDED SIGNUP METHODS ============
    
    @staticmethod
    def register_phone_number(phone_number, display_name, system_user_token):
        """
        Register a phone number for WhatsApp Business API.
        This initiates phone verification via SMS or voice call.
        
        Args:
            phone_number: E.164 format (e.g., +1234567890)
            display_name: Business display name
            system_user_token: System User access token
            
        Returns:
            dict with verification_code_id and other details
        """
        # First, we need to create a WABA if one doesn't exist
        # For embedded signup, we typically use the Debug Token API
        # or create via Business Manager API
        
        # Step 1: Create WABA (if needed) - requires business_id
        business_id = os.getenv("META_BUSINESS_ID")
        if not business_id:
            raise ValueError("META_BUSINESS_ID not configured. Please add your Business ID to .env")
        
        # Create WABA
        waba_url = f"{WhatsAppService.BASE_URL}/{business_id}/owned_whatsapp_business_accounts"
        waba_payload = {
            "name": display_name,
            "timezone_id": "1"  # UTC, adjust as needed
        }
        headers = {"Authorization": f"Bearer {system_user_token}"}
        
        waba_response = requests.post(waba_url, json=waba_payload, headers=headers)
        waba_response.raise_for_status()
        waba_data = waba_response.json()
        waba_id = waba_data.get("id")
        
        # Step 2: Register phone number to WABA
        phone_url = f"{WhatsAppService.BASE_URL}/{waba_id}/phone_numbers"
        phone_payload = {
            "cc": phone_number[1:3] if phone_number.startswith('+') else phone_number[:2],  # Country code
            "phone_number": phone_number.replace('+', '').replace('-', '').replace(' ', ''),
            "migrate_phone_number": False
        }
        
        phone_response = requests.post(phone_url, json=phone_payload, headers=headers)
        phone_response.raise_for_status()
        phone_data = phone_response.json()
        
        return {
            "waba_id": waba_id,
            "phone_number_id": phone_data.get("id"),
            "verification_required": True,
            "display_name": display_name
        }
    
    @staticmethod
    def request_verification_code(phone_number_id, method, system_user_token):
        """
        Request verification code via SMS or VOICE.
        
        Args:
            phone_number_id: The phone number ID from registration
            method: 'SMS' or 'VOICE'
            system_user_token: System User access token
        """
        url = f"{WhatsAppService.BASE_URL}/{phone_number_id}/request_code"
        headers = {"Authorization": f"Bearer {system_user_token}"}
        payload = {
            "code_method": method,
            "language": "en_US"
        }
        
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return response.json()
    
    @staticmethod
    def verify_phone_code(phone_number_id, code, system_user_token):
        """
        Verify the code received via SMS/Voice.
        
        Args:
            phone_number_id: The phone number ID
            code: 6-digit verification code
            system_user_token: System User access token
        """
        url = f"{WhatsAppService.BASE_URL}/{phone_number_id}/verify_code"
        headers = {"Authorization": f"Bearer {system_user_token}"}
        payload = {"code": code}
        
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return response.json()
    
    @staticmethod
    def setup_webhook_subscription(waba_id, system_user_token):
        """
        Subscribe to webhook events for the WABA.
        
        Args:
            waba_id: WhatsApp Business Account ID
            system_user_token: System User access token
        """
        url = f"{WhatsAppService.BASE_URL}/{waba_id}/subscribed_apps"
        headers = {"Authorization": f"Bearer {system_user_token}"}
        
        response = requests.post(url, headers=headers)
        response.raise_for_status()
        return response.json()
    
    @staticmethod
    def get_phone_number_info(phone_number_id, system_user_token):
        """
        Get information about a registered phone number.
        """
        url = f"{WhatsAppService.BASE_URL}/{phone_number_id}"
        headers = {"Authorization": f"Bearer {system_user_token}"}
        params = {"fields": "verified_name,display_phone_number,quality_rating,account_mode"}
        
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        return response.json()
