# How to Connect ChatEase to WhatsApp (Embedded Signup)

ChatEase uses **Meta's official Embedded Signup** for WhatsApp Business Cloud API. This is the MVP-friendly approach that **does NOT require Facebook Business Verification**.

## 🎯 What is Embedded Signup?

Instead of logging in with Facebook, you simply:
1. Enter your phone number in the ChatEase dashboard
2. Receive a verification code via SMS or voice call
3. Enter the code
4. Done! Your WhatsApp Business Account is created automatically

## ✅ Advantages

- ✅ **No Facebook login required**
- ✅ **No Business Verification needed** (for MVP/early users)
- ✅ **Phone verification only** (SMS or voice call)
- ✅ **WABA created programmatically** by ChatEase
- ✅ **Official Meta API** (same as Shopify, Zendesk, Intercom)

## 📋 Prerequisites

Before you can use Embedded Signup, you need to configure your Meta Developer App:

### 1. System User Token

You need a **System User Token** from Meta Business Settings. This allows ChatEase to create WhatsApp Business Accounts for your users.

👉 **Follow the guide**: [SYSTEM_USER_TOKEN_GUIDE.md](./SYSTEM_USER_TOKEN_GUIDE.md)

### 2. Meta App Configuration

1. Go to [developers.facebook.com](https://developers.facebook.com/)
2. Open your Meta App (or create one)
3. Add **WhatsApp** product if not already added
4. Note down:
   - **App ID** (Settings → Basic)
   - **App Secret** (Settings → Basic)
5. Go to [business.facebook.com](https://business.facebook.com)
6. Note down your **Business ID** (Business Settings → Business Info)

### 3. Add to Environment Variables

Add these to `backend/.env`:

```env
# Meta Embedded Signup
META_SYSTEM_USER_TOKEN=EAA...your_token_here
FB_APP_ID=your_app_id_here
FB_APP_SECRET=your_app_secret_here
META_BUSINESS_ID=your_business_id_here
```

## 🚀 How to Connect (User Flow)

### Step 1: Open Settings

1. Login to ChatEase dashboard
2. Go to **Settings** → **WhatsApp Connection**

### Step 2: Enter Phone Number

1. Enter your **Business Display Name** (e.g., "Pizza Shop")
2. Enter your **Phone Number** in E.164 format:
   - ✅ Correct: `+1234567890`
   - ❌ Wrong: `1234567890` (missing +)
   - ❌ Wrong: `+1 (234) 567-8900` (no spaces or special chars)
3. Click **Register Phone Number**

### Step 3: Verify Code

1. You'll receive a **6-digit code** via SMS
2. Enter the code in the verification field
3. Click **Verify Code**

**Didn't receive SMS?**
- Click **Resend SMS** to get another code
- Click **Call Me** to receive the code via voice call

### Step 4: Done!

✅ Your WhatsApp Business Account is now connected!
- Messages sent to your phone number will be received by ChatEase
- AI will automatically reply based on your FAQs and settings

## ⚠️ Important Notes

### Phone Number Requirements

- **Must be a real phone number** you own
- **Cannot be already registered** with WhatsApp Business API
- **Will NOT work on WhatsApp mobile app** once registered for API
  - ⚠️ If you register your personal number, it will stop working on your phone's WhatsApp app
  - 💡 **Recommendation**: Use a separate number for testing

### For Testing

Meta provides a **Test Number** you can use:
1. Go to Meta Developers → WhatsApp → API Setup
2. Use the test number provided (usually starts with +1555...)
3. You can send test messages to your personal number

### Going to Production

For production use with a real number:
1. Buy a new SIM card / phone number
2. Use that number in the embedded signup flow
3. Once verified, that number is dedicated to the API

## 🔧 Webhook Configuration

ChatEase automatically configures webhooks when you connect via Embedded Signup.

**If you need to manually configure:**
1. Go to Meta Developers → WhatsApp → Configuration
2. Set **Callback URL**: `https://your-domain.com/whatsapp/webhook`
3. Set **Verify Token**: `chatease_verify_token`
4. Subscribe to: `messages`

## 📊 When Do You Need Business Verification?

You **DON'T** need Facebook Business Verification for:
- ✅ MVP / Early testing
- ✅ Small user base (< 1000 messages/day)
- ✅ Free trial users
- ✅ Development / Staging

You **DO** need Business Verification when:
- ❌ Scaling to thousands of users
- ❌ Sending marketing templates
- ❌ Requesting higher messaging limits
- ❌ Getting the green checkmark

👉 This is a **later problem**, not an MVP blocker!

## 🆘 Troubleshooting

### "Server misconfiguration: META_SYSTEM_USER_TOKEN not set"

You haven't added the System User Token to your `.env` file. See [SYSTEM_USER_TOKEN_GUIDE.md](./SYSTEM_USER_TOKEN_GUIDE.md).

### "Phone number must be in E.164 format"

Make sure your number starts with `+` and includes the country code:
- ✅ `+14155552671` (USA)
- ✅ `+447911123456` (UK)
- ✅ `+33612345678` (France)

### "Registration failed: Phone number already registered"

This number is already registered with WhatsApp Business API (either by you or someone else). Try a different number.

### "Invalid verification code"

- Make sure you entered all 6 digits
- Code expires after a few minutes - request a new one
- Try using **Call Me** instead of SMS

### Webhook not receiving messages

1. Check your webhook URL is publicly accessible (use ngrok for local testing)
2. Verify the webhook is configured in Meta Developers
3. Check backend logs for errors

## 🔐 Security

- System User Token is stored in `.env` (never commit to Git!)
- Phone verification ensures you own the number
- All communication uses HTTPS
- Tokens are encrypted in the database

## 📚 Additional Resources

- [Meta Embedded Signup Docs](https://developers.facebook.com/docs/whatsapp/embedded-signup)
- [WhatsApp Cloud API Docs](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [System User Token Guide](./SYSTEM_USER_TOKEN_GUIDE.md)
