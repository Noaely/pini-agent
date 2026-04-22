# Green API Integration - Setup Guide

## Prerequisites
You need a Green API account with WhatsApp Business API access.

## Setup Steps

### 1. Get Green API Credentials
1. Sign up at https://green-api.com/
2. Create a new instance
3. Get your credentials:
   - Instance ID (e.g., `1101234567`)
   - API Token (long alphanumeric string)

### 2. Configure Environment Variables

Update `.env` file with your actual credentials:
```bash
GREEN_API_INSTANCE_ID=your_actual_instance_id
GREEN_API_TOKEN=your_actual_api_token
ANTHROPIC_API_KEY=your_anthropic_key
```

### 3. Configure Vercel Environment Variables

In Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add these variables:
   - `ANTHROPIC_API_KEY` → Your Anthropic API key
   - `GREEN_API_INSTANCE_ID` → Your Green API instance ID
   - `GREEN_API_TOKEN` → Your Green API token

### 4. Set Up Green API Webhook

After deploying to Vercel:

1. Go to Green API dashboard
2. Navigate to your instance settings
3. Set webhook URL to: `https://your-domain.vercel.app/api/webhook/whatsapp`
4. Enable webhook for "Incoming Messages"
5. Save settings

### 5. Test Integration

**Local Testing:**
```bash
npm install
npm run start
```

**Test Webhook (using curl):**
```bash
curl -X POST http://localhost:3001/api/webhook/whatsapp \
  -H "Content-Type: application/json" \
  -d '{
    "typeWebhook": "incomingMessageReceived",
    "messageData": {
      "typeMessage": "textMessage",
      "chatId": "972501234567@c.us",
      "textMessageData": {
        "textMessage": "שלום, מה המחיר של בשר בקר?"
      }
    }
  }'
```

**Test via WhatsApp:**
1. Send a message to your WhatsApp Business number
2. Agent should respond automatically
3. Check server logs for debugging

## Features

✅ **Automatic WhatsApp responses** - Agent responds to customer messages
✅ **Session management** - Maintains conversation history per phone number (24h)
✅ **Full menu access** - Agent can search products, check prices
✅ **Discount recommendations** - Suggests active discounts
✅ **Hebrew language** - Full Hebrew support
✅ **Order processing** - Can calculate totals with discounts

## Conversation Flow

1. Customer sends WhatsApp message → Green API
2. Green API sends webhook → `/api/webhook/whatsapp`
3. Server processes message with Claude AI
4. Server sends response → Green API
5. Green API delivers → Customer WhatsApp

## Session Cleanup

- Sessions auto-expire after 24 hours of inactivity
- Cleanup runs every hour
- Sessions stored in memory (reset on server restart)

## Troubleshooting

**No response from agent:**
- Check Green API webhook is configured correctly
- Verify environment variables are set
- Check server logs for errors

**Wrong responses:**
- Verify menu/discount data is loaded
- Check ANTHROPIC_API_KEY is valid

**Webhook not receiving messages:**
- Ensure webhook URL is publicly accessible (not localhost)
- Check Green API instance is active
- Verify webhook is enabled in Green API dashboard
