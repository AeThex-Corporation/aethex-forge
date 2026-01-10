# Discord Developer Portal Setup for AeThex Activity

## Quick Overview

This guide walks you through configuring your Discord app for Activities support. Your app ID is: **578971245454950421**

---

## Part 1: Enable Activities Feature

### Step 1.1: Open Discord Developer Portal

1. Go to: https://discord.com/developers/applications
2. Find and click **"AeThex"** app in your applications list
3. You should be on the **General Information** tab

### Step 1.2: Locate and Enable Activities

1. Scroll down on the **General Information** tab
2. Look for **"Activity Settings"** section
3. If you see "Enable Activities" button:
   - Click to enable it
   - You'll see the Activity configuration form appear
4. If Activities is already shown, proceed to Step 2

### Step 1.3: Initial Configuration

In the Activity Settings section, you'll see these fields:

**Activity URL:**

```
https://aethex.dev/activity
```

_(Copy and paste exactly)_

**Interactions Endpoint URL:**

```
https://aethex.dev/api/discord/interactions
```

_(Copy and paste exactly)_

**Click "Save"** and wait 1-2 minutes for Discord to verify

---

## Part 2: Configure Interactions Endpoint

### Step 2.1: Wait for Discord Verification

After you save in Step 1.3, Discord will automatically send a test request to your Interactions Endpoint.

**Expected result:** Green checkmark appears next to the Interactions Endpoint URL

**If you see an error:**

1. Wait 30 seconds
2. Click "Save" again
3. Discord will retry the verification

### Step 2.2: What Discord is Testing

Discord sends a PING request like this:

```
POST https://aethex.dev/api/discord/interactions
Content-Type: application/json
X-Signature-Ed25519: <signature>
X-Signature-Timestamp: <timestamp>

{
  "type": 1,
  "application_id": "578971245454950421"
}
```

Your server should respond with:

```json
{
  "type": 1
}
```

This is already implemented in your `code/server/index.ts` file (lines 57-60).

---

## Part 3: OAuth2 Configuration

### Step 3.1: Go to OAuth2 Settings

1. Click **"OAuth2"** in the left sidebar
2. Click **"General"** sub-tab

### Step 3.2: Verify Client Credentials

You should see:

**Client ID:**

```
578971245454950421
```

**Client Secret:**

```
JKlilGzcTWgfmt2wEqiHO8wpCel5VEji
```

If the Client Secret is hidden, click "Reset Secret" (you'll need to update your environment variables after this).

### Step 3.3: Add Redirect URIs

1. Scroll to **"Redirects"** section
2. Add these redirect URIs:
   - `https://aethex.dev/callback`
   - `https://aethex.dev/discord-verify`
   - `https://aethex.dev/roblox-callback`
3. Click **"Save Changes"**

### Step 3.4: Configure Scopes

1. Click **"Scopes"** sub-tab in OAuth2 section
2. For Activities, select at minimum:
   - ✅ `identify` (read user profile info)
   - ✅ `guilds` (read user's guilds)
3. For optional features, you might also want:
   - `email` (read user's email)
   - `connections` (read user's connected accounts)

---

## Part 4: Bot Configuration

### Step 4.1: Go to Bot Settings

1. Click **"Bot"** in the left sidebar
2. Look for **"TOKEN"** section
3. Copy your bot token (it will be a long string starting with your app ID)
4. **⚠️ NEVER share or commit your bot token to git or documentation**

### Step 4.2: Verify Public Key

1. In the same Bot section, look for **"PUBLIC KEY"**
2. Copy it (it's a 64-character hex string)
3. **⚠️ NEVER share or commit your public key to public documentation**

### Step 4.3: Ensure Bot Has Required Permissions

1. Scroll to **"Token Permissions"** or **"Scopes"**
2. Make sure bot has:
   - ✅ `applications.commands` (for slash commands)
   - ✅ `bot` (for general bot functionality)

---

## Part 5: Environment Variables

### Step 5.1: Verify Environment Variables on Your Hosting Platform

If you're using **Vercel**, **Railway**, or another hosting platform:

1. Go to your project settings
2. Under "Environment Variables", ensure these are set:

```
DISCORD_BOT_TOKEN=<your_bot_token_from_discord_portal>
DISCORD_CLIENT_ID=578971245454950421
DISCORD_CLIENT_SECRET=<your_client_secret_from_discord_portal>
DISCORD_PUBLIC_KEY=<your_public_key_from_discord_portal>
VITE_DISCORD_CLIENT_ID=578971245454950421
```

**⚠️ CRITICAL SECURITY: Never commit these secrets to git or upload to documentation!**

- Get `DISCORD_BOT_TOKEN` from Discord Developer Portal > Bot section
- Get `DISCORD_CLIENT_SECRET` from OAuth2 > General section
- Get `DISCORD_PUBLIC_KEY` from Bot section
- Only set these in your hosting platform's environment variables (Vercel, Railway, etc.)

**Do NOT commit these secrets to git!**

---

## Part 6: Test the Activity

### Step 6.1: Add Bot to Test Server

1. Go to **"OAuth2"** → **"URL Generator"** in your app settings
2. Under **"Scopes"**, select:
   - `bot`
   - `applications.commands`
3. Under **"Permissions"**, select:
   - `Send Messages`
   - `Read Messages`
4. Copy the generated URL and open it in your browser
5. Select a test Discord server to add the bot to

### Step 6.2: Launch the Activity

1. Go to your test Discord server
2. Right-click the bot's name (AeThex)
3. Select **"Apps"** → **"AeThex"** (or just "AeThex Activity")
4. The Activity modal should open

### Step 6.3: Debug

1. Open browser developer console: **F12**
2. Look for messages starting with `[Discord Activity]`
3. These logs will tell you exactly what's happening

**Expected log sequence:**

```
[Discord Activity] Initialization starting... {frameId: "...", isInDiscordActivity: true, ...}
[Discord Activity] Creating SDK with clientId: 578971245454950421
[Discord Activity] Waiting for SDK to be ready...
[Discord Activity] SDK is ready
[Discord Activity] Current user: exists
[Discord Activity] User already authenticated, fetching user data...
[Discord Activity] User data loaded successfully
```

---

## Troubleshooting Quick Links

| Error                             | Solution                                                |
| --------------------------------- | ------------------------------------------------------- |
| 403 Forbidden from Discord API    | Activities may not be enabled. See Part 1 Step 1.2      |
| X-Frame-Options: sameorigin       | Clear cache and try again. See Part 6 Step 6.3          |
| "Not in Discord Activity context" | Activity URL may be wrong. Check Part 1 Step 1.3        |
| SDK initialization failed         | Check VITE_DISCORD_CLIENT_ID in environment. See Part 5 |
| Interactions endpoint failed      | Endpoint URL must be exact. Check Part 2 Step 2.1       |

---

## Verification Checklist

Use this before contacting support:

- [ ] Activities feature is enabled (Part 1)
- [ ] Activity URL is set to `https://aethex.dev/activity` (Part 1)
- [ ] Interactions Endpoint URL is set to `https://aethex.dev/api/discord/interactions` (Part 1)
- [ ] Green checkmark appears next to Interactions Endpoint URL (Part 2)
- [ ] OAuth2 Client ID and Secret are correct (Part 3)
- [ ] All environment variables are set on hosting platform (Part 5)
- [ ] Bot can be added to test server (Part 6.1)
- [ ] Browser console shows `[Discord Activity]` logs without errors (Part 6.3)

---

## Still Having Issues?

1. Check the **Troubleshooting Guide**: [DISCORD-ACTIVITY-TROUBLESHOOTING.md](./DISCORD-ACTIVITY-TROUBLESHOOTING.md)
2. Check your **hosting platform's logs** for server errors
3. Check **browser console** (F12) for client errors
4. Wait **10 minutes** after changing Discord Portal settings (caching delay)
5. Clear browser cache completely (Ctrl+Shift+Delete)

---

## Support

For issues with:

- **Discord API/Portal**: Contact Discord Support (https://support.discord.com)
- **AeThex Activity Code**: Check this repo's issues or documentation
- **Hosting/Deployment**: Check your hosting platform's documentation
