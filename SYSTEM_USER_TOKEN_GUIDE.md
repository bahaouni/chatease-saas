# How to Get a System User Token from Meta

## What is a System User Token?

A **System User Token** is a permanent access token that allows your app to create WhatsApp Business Accounts (WABAs) programmatically for your users. This is required for the Embedded Signup flow.

## Step-by-Step Guide

### 1. Go to Meta Business Settings

1. Visit [business.facebook.com](https://business.facebook.com)
2. Select your **Business Portfolio** (or create one if you don't have one)
3. Click **Business Settings** in the top right

### 2. Create a System User

1. In the left sidebar, scroll down to **Users** → **System Users**
2. Click **Add** button
3. Enter a name: `ChatEase System User` (or any name you prefer)
4. Select **Admin** role
5. Click **Create System User**

### 3. Generate Access Token

1. Click on the System User you just created
2. Click **Generate New Token** button
3. Select your **Meta App** (the one with WhatsApp enabled)
4. Under **Permissions**, select:
   - ✅ `whatsapp_business_management`
   - ✅ `whatsapp_business_messaging`
   - ✅ `business_management`
5. Click **Generate Token**
6. **IMPORTANT**: Copy this token immediately - you won't see it again!

### 4. Add to Your Environment Variables

Add this token to your backend `.env` file:

```env
META_SYSTEM_USER_TOKEN=your_token_here
```

## What I Need From You

Please provide the following from your Meta Developer account:

### Required:
1. **System User Token** (from steps above) - starts with `EAA...`
2. **App ID** - Found in Meta App Dashboard → Settings → Basic
3. **App Secret** - Found in Meta App Dashboard → Settings → Basic

### Optional (if you already have them):
4. **Business ID** - Found in Business Settings → Business Info
5. **WABA ID** - If you already created a WhatsApp Business Account

## Where to Add These

Once you have the tokens, add them to:

**Backend**: `c:\Users\keasar\Desktop1\whatschat\backend\.env`

```env
# Meta App Credentials
FB_APP_ID=your_app_id_here
FB_APP_SECRET=your_app_secret_here
META_SYSTEM_USER_TOKEN=your_system_user_token_here

# Optional
META_BUSINESS_ID=your_business_id_here
```

## Security Notes

⚠️ **Never commit these tokens to Git!**
- The `.env` file should already be in `.gitignore`
- These tokens have full access to your WhatsApp Business accounts
- Treat them like passwords

## Troubleshooting

**Q: I don't see "System Users" in Business Settings**
- Make sure you're in a **Business Portfolio**, not a personal account
- You need Admin access to the Business Portfolio

**Q: Token generation fails**
- Make sure your Meta App has WhatsApp product enabled
- Verify you selected the correct permissions
- Try using a different browser (Chrome/Firefox)

**Q: Where is my Business Portfolio?**
- Go to [business.facebook.com](https://business.facebook.com)
- If you don't have one, click "Create Account" and follow the steps
- You don't need Business Verification for this!
