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
