# Required API Keys & Credentials

For ChatEase AI to fully function, you need to obtain the following keys and enter them in your **Dashboard > Settings**.

## 1. OpenAI API Key
- **Purpose**: Powers the AI Logic to generate answers when no exact FAQ match is found.
- **Where to get it**: [OpenAI Platform](https://platform.openai.com/api-keys)
- **Cost**: You need a paid account (pay-as-you-go).

## 2. WhatsApp Business Credentials (Meta)
- **Purpose**: To receive and send messages via WhatsApp.
- **Where to get it**: [Meta for Developers](https://developers.facebook.com/)
- **Steps**:
  1. Create a "Business App" on Meta Developers.
  2. Add "WhatsApp" product.
  3. Go to **API Setup**.
  4. Copy **Phone Number ID**.
  5. Copy **Temporary Access Token** (or create a System User for permanent token).
  6. Go to **Configuration**:
     - Set Callback URL to your backend URL: `https://your-domain.com/whatsapp/webhook` (Use ngrok for local testing).
     - Set Verify Token to: `chatease_verify_token`.

## 3. Stripe Keys (Optional for Billing)
- **Purpose**: To handle subscriptions.
- **Where to get it**: [Stripe Dashboard](https://dashboard.stripe.com/apikeys) (Developers > API Keys).
- **Need**: `Publishable Key` and `Secret Key`.
