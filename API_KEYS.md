# Required API Keys & Credentials

For ChatEase AI to fully function, you need to obtain the following keys and enter them in your **Dashboard > Settings**.

## 1. OpenAI API Key
- **Purpose**: Powers the AI Logic to generate answers when no exact FAQ match is found.
- **Where to get it**: [OpenAI Platform](https://platform.openai.com/api-keys)
- **Cost**: You need a paid account (pay-as-you-go).

## 2. WhatsApp Business Connection (Meta Embedded Signup)

**Purpose**: To receive and send messages via WhatsApp.

### ✅ NEW: Embedded Signup Flow (Recommended for MVP)

ChatEase now uses **Meta's official Embedded Signup** - no Facebook login or Business Verification required!

**What you need:**
1. **System User Token** - See [SYSTEM_USER_TOKEN_GUIDE.md](./SYSTEM_USER_TOKEN_GUIDE.md) for step-by-step instructions
2. **App ID** and **App Secret** - From your Meta Developer App
3. **Business ID** - From Meta Business Settings

**How it works:**
1. Go to **Dashboard → Settings → WhatsApp Connection**
2. Enter your phone number (E.164 format: +1234567890)
3. Meta sends you a verification code via SMS
4. Enter the code to complete connection
5. Done! No Facebook login needed.

**Environment Variables Required:**
```env
META_SYSTEM_USER_TOKEN=your_system_user_token_here
FB_APP_ID=your_app_id_here
FB_APP_SECRET=your_app_secret_here
META_BUSINESS_ID=your_business_id_here
```

### Alternative: Manual Connection

If you already have a WABA ID and Phone Number ID, you can connect manually:
1. Go to **Dashboard → Settings → Manual Connection**
2. Enter your WABA ID, Phone Number ID, and Access Token
3. Save

**Note**: The old OAuth flow has been deprecated in favor of Embedded Signup.

## 3. Stripe Keys (Optional for Billing)
- **Purpose**: To handle subscriptions.
- **Where to get it**: [Stripe Dashboard](https://dashboard.stripe.com/apikeys) (Developers > API Keys).
- **Need**: `Publishable Key` and `Secret Key`.
