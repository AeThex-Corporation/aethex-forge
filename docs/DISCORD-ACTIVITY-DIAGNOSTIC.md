# Discord Activity Errors - Diagnostic & Fix Guide

## Problem

When opening Discord Activity, getting these errors:

```
GET https://discord.com/api/v9/application-directory-static/applications/578971245454950421?locale=en-US 403 (Forbidden)
Refused to display 'https://578971245454950421.discordsays.com/' in a frame because it set 'X-Frame-Options' to 'sameorigin'
```

## Root Cause

The Discord app is **NOT properly configured for Activities** in the Discord Developer Portal.

## Solution Checklist

### Step 1: Go to Discord Developer Portal

1. Visit: https://discord.com/developers/applications
2. Click on **"AeThex"** application
3. Go to the **"Activities"** tab on the left sidebar (NOT "General Information")

### Step 2: Enable Activities

1. If you don't see an "Activities" tab, the feature isn't enabled yet
2. Click **"Enable Activities"** or **"Configure"**
3. Fill in the required fields:

**Activity Settings:**

- **Activity Name**: `AeThex`
- **Preview Image**: Upload a 512x512px image (your app logo)
- **Description**: `AeThex Creator Network & Talent Platform - Activity`
- **Privacy Policy URL**: `https://aethex.dev/privacy`
- **Terms of Service URL**: `https://aethex.dev/terms`

**Activity Instance Settings:**

- **Instance URL**: `https://aethex.dev/activity`
- **Enable this URL**: ✅ Check this box

### Step 3: Verify Manifest Configuration

The app must have a properly configured manifest. Check:

1. Manifest file exists at: `https://aethex.dev/discord-manifest.json`
2. Manifest contains:

```json
{
  "id": "578971245454950421",
  "version": "1",
  "name": "AeThex",
  "description": "AeThex Creator Network & Talent Platform - Activity",
  "rpc_origins": ["https://aethex.dev", "https://discord.com"],
  "interactions": {
    "request_url": "https://aethex.dev/api/discord/interactions"
  },
  "instanceUrl": "https://aethex.dev/activity",
  "orientation": "portrait-primary"
}
```

3. To verify, open in browser: https://aethex.dev/discord-manifest.json
4. Should return valid JSON, not 404

### Step 4: Set Interactions Endpoint

Still in Discord Developer Portal:

1. Go to **"General Information"** tab
2. Under "Interactions Endpoint URL": `https://aethex.dev/api/discord/interactions`
3. Click **"Save"** (Discord will send PING to verify)
4. You should see: `✅ Interactions endpoint URL verified`

### Step 5: Check Bot Permissions

1. Go to **"OAuth2"** > **"URL Generator"**
2. Select these scopes:

   - ✅ `applications.commands`
   - ✅ `identify`
   - ✅ `email`
   - ✅ `guilds`

3. Select these permissions:

   - ✅ `Send Messages`
   - ✅ `Read Messages/View Channels`
   - ✅ `Use Application Commands`

4. Copy the generated URL and authorize the bot in your Discord server

### Step 6: Verify Bot Token

In Discord Developer Portal:

1. Go to **"Bot"** tab
2. Under "TOKEN", verify the token is:
   - ✅ Not expired (if it shows "TOKEN EXPIRED", click "Reset Token")
   - ✅ Correctly set in your deployment environment variables
   - ✅ Has these intents enabled:
     - ✅ Server Members Intent
     - ✅ Message Content Intent
     - ✅ Guild Members

### Step 7: Test the Activity

1. Open Discord
2. Go to any server where the bot is installed
3. Look for "Apps" section in the bottom left
4. Click to browse available activities
5. Find "AeThex" and click to open
6. Should load without 403 errors

## If Still Getting Errors

### 403 Still Appears

- **Cause**: Activities might still not be fully enabled
- **Fix**: Wait 5-10 minutes for Discord to propagate settings, then retry
- **Alternative**: Try using a different Discord server to test

### X-Frame-Options Error Persists

- **Cause**: Discord's internal sandbox is rejecting the Activity
- **Fix**: Verify `instanceUrl` in Developer Portal matches exactly: `https://aethex.dev/activity`
- **Check**: Make sure Activity URL returns valid HTML, not redirects

### Activity Blank/Loading Forever

- **Cause**: `/api/discord/activity-auth` endpoint might be failing
- **Debug**:
  1. Open browser console (F12)
  2. Look for messages starting with `[Discord Activity]`
  3. Check if auth endpoint is being called
  4. Verify DISCORD_CLIENT_ID is set in environment

### Slash Commands Not Working in Activity

- **Cause**: Interactions endpoint not verified
- **Fix**: Ensure `https://aethex.dev/api/discord/interactions` is set and verified in Discord Developer Portal

## Environment Variables Needed

Verify these are set in your deployment (Vercel/Railway/etc):

```
VITE_DISCORD_CLIENT_ID=578971245454950421
DISCORD_BOT_TOKEN=<your_bot_token>
DISCORD_PUBLIC_KEY=<your_public_key>
```

## Browser Console Debug Output

Open browser console (F12) and look for these messages:

**✅ Success indicators:**

```
[Discord Activity] Initialization starting...
[Discord Activity] Creating SDK with clientId: 578971245454950421
[Discord Activity] SDK is ready
[Discord Activity] Session authenticated
[Discord Activity] User authenticated successfully
```

**❌ Error indicators:**

```
[Discord Activity] Authorizing user...
[Discord Activity] Got access token, calling activity-auth...
ERROR: 403 Forbidden
```

## Quick Verification Steps

1. **Check manifest is accessible:**

   ```bash
   curl https://aethex.dev/discord-manifest.json
   ```

   Should return valid JSON

2. **Check interactions endpoint:**

   ```bash
   curl -X POST https://aethex.dev/api/discord/interactions \
     -H "Content-Type: application/json" \
     -d '{"type":1}'
   ```

   Should return a response (not 404/500)

3. **Check bot token:**
   ```bash
   curl -H "Authorization: Bot YOUR_TOKEN" \
     https://discord.com/api/v10/users/@me
   ```
   Should return bot user info

## Still Need Help?

1. Check Discord Activities documentation: https://discord.com/developers/docs/activities/building-an-activity
2. Review the bot logs: Check what `[Discord Activity]` messages appear in browser console
3. Verify manifest at: https://aethex.dev/discord-manifest.json
4. Test interactions endpoint manually with curl/Postman

## References

- Discord Activities Guide: https://discord.com/developers/docs/activities/building-an-activity
- Manifest Format: https://discord.com/developers/docs/activities/manifest
- Interactions: https://discord.com/developers/docs/interactions/receiving-and-responding
