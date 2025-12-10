# How to Connect ChatEase to WhatsApp

ChatEase uses the **Official WhatsApp Business Cloud API**. This is different from the standard WhatsApp app on your phone.

## 1. Do I need a WhatsApp Business Account?
**YES.** You need a **Meta Developer Account** and a **WhatsApp Business API** setup.

> **⚠️ IMPORTANT:** You cannot use your current personal WhatsApp number on the API and the Phone App at the same time. If you register your personal number for the API, it will stop working on your mobile app.
> **Recommendation:** For testing, use the **Test Number** provided by Meta. For production, buy a new dedicated SIM/number.

## 2. Step-by-Step Setup

### Step A: Create Meta App
1.  Go to [developers.facebook.com](https://developers.facebook.com/).
2.  Click **My Apps** > **Create App**.
3.  Select **Other** > **Business**.
4.  Give it a name (e.g., "ChatEase Bot").
5.  Scroll down to "Add products to your app" and select **WhatsApp**.

### Step B: Get Credentials
1.  In the sidebar, go to **WhatsApp > API Setup**.
2.  You will see a **Temporary Access Token** and a **Test Phone Number**.
    *   **Phone Number ID**: Copy this (e.g., `10593...`).
    *   **Access Token**: Copy this (begins with `EAAG...`).
3.  **Add a Recipient**: In the "To" field, add your *real* personal phone number so you can send messages *to* the bot for testing.

### Step C: Connect to ChatEase
1.  Open your ChatEase Dashboard > **Settings**.
2.  Paste the **Phone Number ID**.
3.  Paste the **WhatsApp Access Token**.
4.  Click **Save**.

## 3. How does ChatEase know it's me?
Connection logic:
1.  When someone messages your Bot Number, Meta sends the message to ChatEase.
2.  Meta includes the **Phone Number ID** of the bot receiving the message.
3.  ChatEase looks in its database: *"Which user has this Phone Number ID?"*
4.  It finds your account and uses **your** configured AI and FAQ to reply.

## 4. Going Live (Real Phone)
To use a real phone number instead of the test one:
1.  Go to **WhatsApp > Configuration** in Meta Developers.
2.  Click **Add Phone Number**.
3.  Follow the verification steps (SMS code).
4.  **Warning:** This number will be deregistered from the WhatsApp mobile app. You will manage chats via the API (or tools like ChatEase if we build a chat UI).

## 5. Receiving Messages (Webhook)
For ChatEase to *receive* messages while running on your laptop (`localhost`):
1.  You must expose your specific port to the internet.
    *   Download **ngrok**.
    *   Run: `ngrok http 5000`
2.  Copy the HTTPS URL (e.g., `https://abc-123.ngrok-free.app`).
3.  Go to **WhatsApp > Configuration** in Meta.
4.  Click **Edit** next to Callback URL.
5.  Paste: `https://abc-123.ngrok-free.app/whatsapp/webhook`
6.  Verify Token: `chatease_verify_token` (This is hardcoded in `whatsapp_routes.py` for now).
