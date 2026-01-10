# Discord Activity Troubleshooting Guide

## Error: 403 Forbidden on Directory API + X-Frame-Options Error

### Symptoms

- Discord Activity shows blank screen
- Browser console shows: `GET https://discord.com/api/v9/application-directory-static/applications/578971245454950421?locale=en-US 403 (Forbidden)`
- Browser console shows: `Refused to display 'https://578971245454950421.discordsays.com/' in a frame because it set 'X-Frame-Options' to 'sameorigin'`

### Root Causes

1. **Activities feature not enabled** in Discord Developer Portal
2. **Activity URL not configured** in Discord Developer Portal
3. **Interactions Endpoint URL not set** or not responding correctly
4. **Missing OAuth2 configuration** for Activity scopes

---

## Solution: Step-by-Step Configuration

### Step 1: Enable Activities Feature

1. Go to **[Discord Developer Portal](https://discord.com/developers/applications)**
2. Click on your app: **AeThex** (ID: `578971245454950421`)
3. Navigate to **General Information** tab
4. Scroll to **Activity Settings** section
5. Look for "Enable Activities" button/toggle
   - If you see it, click to enable
   - If Activities is already enabled, proceed to Step 2

### Step 2: Configure Activity URL

1. In **Activity Settings**, you should now see:
   - **Activity URL** field
   - Set it to: `https://aethex.dev/activity`
2. **Interactions Endpoint URL**:
   - Set to: `https://aethex.dev/api/discord/interactions`
3. **Instance URL** (if present):
   - Set to: `https://aethex.dev`
4. Click **Save**
5. **Wait 1-2 minutes** for Discord to process the configuration

### Step 3: Verify Interactions Endpoint

Discord will test your Interactions Endpoint by sending a PING request.

**Expected behavior:**

- You should see a green checkmark next to the Interactions Endpoint URL
- If it fails, check:
  1. Is `https://aethex.dev/api/discord/interactions` responding?
  2. Is `DISCORD_PUBLIC_KEY` set in your environment?
  3. Run this to test: `curl -X POST https://aethex.dev/api/discord/interactions -H "Content-Type: application/json" -d '{}'`

### Step 4: Check OAuth2 Settings

1. Go to **OAuth2** → **General**
2. Verify **Client ID**: `578971245454950421`
3. Ensure **Client Secret** is populated
4. Go to **OAuth2** → **Scopes**
5. Check that at least these scopes are selected:
   - ✅ `identify`
   - ✅ `guilds`

### Step 5: Test the Activity

1. Add your bot to a test Discord server:
   - Go to **OAuth2** → **URL Generator**
   - Select scopes: `bot`, `applications.commands`
   - Copy the generated URL and open it in browser
2. In Discord, right-click your bot and select "Apps" → "AeThex Activity"
3. The Activity should open in a modal
4. Check browser console for any errors (press `F12`)

---

## Debugging Checklist

### Server-Side Checks

#### 1. Verify Interactions Endpoint is Responding

```bash
# Test if endpoint is reachable
curl -v https://aethex.dev/api/discord/interactions

# Should return 401 (because we're not sending a valid Discord signature)
# If it returns 403 or 404, there's a routing issue
```

#### 2. Check DISCORD_PUBLIC_KEY is Set

```bash
# On your server/hosting platform, verify:
echo $DISCORD_PUBLIC_KEY
# Should output a 64-character hex string
```

#### 3. Check X-Frame-Options Headers

```bash
# Verify the server is allowing iframe embedding
curl -I https://aethex.dev/api/discord/interactions
# Look for: X-Frame-Options: ALLOWALL
# Should NOT be: X-Frame-Options: SAMEORIGIN
```

### Client-Side Checks

#### 1. Open Browser Console (F12)

- Look for `[Discord Activity]` log messages
- They should show:
  - `Initialization starting...`
  - `Creating SDK with clientId: 578971245454950421`
  - `SDK is ready`
  - Either `Current user: exists` or `Authorizing user...`

#### 2. Check frame_id Parameter

- When inside Discord Activity, the URL should contain `?frame_id=...`
- If no `frame_id`, Discord hasn't launched the Activity properly
- This usually means the Activity URL is misconfigured

#### 3. Check Discord SDK Loading

- The Discord SDK should load from: `https://cdn.discordapp.com/assets/embedded/lazyload.min.js`
- If this fails, check your CORS settings or ISP blocks

---

## Common Issues & Solutions

### Issue 1: "Not in Discord Activity context (no frame_id)"

**Cause:** Discord is not launching the Activity with the required parameter

**Solution:**

1. Verify Activity URL is set to: `https://aethex.dev/activity` (exactly)
2. Wait 5 minutes for Discord to cache the configuration
3. Try again in Discord

### Issue 2: "Failed to initialize Discord Activity"

**Cause:** Discord SDK failed to initialize or authorize

**Solution:**

1. Check browser console for specific error message
2. Verify `VITE_DISCORD_CLIENT_ID=578971245454950421` is set
3. Ensure `identify` scope is selected in OAuth2 settings
4. Try opening Activity in an incognito window (clear cache)

### Issue 3: "X-Frame-Options: sameorigin" Error

**Cause:** Server is sending restrictive frame headers

**Solution:**

1. Verify `/api/discord/interactions` endpoint exists and is reachable
2. Check that `X-Frame-Options: ALLOWALL` is being set (line 159 of code/server/index.ts)
3. Check that `Access-Control-Allow-Origin: *` is being set
4. Restart the server to apply header changes

### Issue 4: 403 Forbidden on Directory API

**Cause:** Discord can't validate your app configuration

**Solution:**

1. Ensure Activities feature is fully enabled
2. Wait 10 minutes after changing any settings
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try in a different browser
5. Contact Discord support if issue persists

---

## Testing Activity in Development

### Using Discord's Embedded Test

1. Go to your app's Activity Settings
2. Click "Test Activity" or "Preview" button
3. Activity should open in a modal window
4. Check console (F12) for errors

### Using a Test Server

1. Create a private Discord server
2. Add bot to the server
3. Right-click bot name → Apps → Select your activity
4. Activity modal should open

---

## Environment Variables to Verify

On your hosting platform (Vercel, Railway, etc.), ensure these are set:

```
DISCORD_BOT_TOKEN=<your_bot_token_from_discord_portal>
DISCORD_PUBLIC_KEY=<your_public_key_from_discord_portal>
DISCORD_CLIENT_ID=578971245454950421
DISCORD_CLIENT_SECRET=<your_client_secret_from_discord_portal>
VITE_DISCORD_CLIENT_ID=578971245454950421
```

**⚠️ CRITICAL SECURITY WARNING:**

- **NEVER** include real tokens, secrets, or keys in documentation
- **NEVER** commit these to git or public repositories
- Only set these values in your hosting platform's environment variables dashboard
- Get these values from: Discord Developer Portal > Your App

---

## Still Not Working?

1. **Check the logs**: Look at your hosting platform's logs for errors
2. **Check browser console**: Press F12 and look for `[Discord Activity]` messages
3. **Verify Discord Portal**: Screenshot your Activity Settings to confirm configuration
4. **Test endpoint manually**: Try `curl -v https://aethex.dev/api/discord/interactions`
5. **Clear everything**: Clear browser cache, restart bot, wait 10 minutes, try again

---

## Discord Developer Portal Checklist

- [ ] Activities feature is enabled
- [ ] Activity URL is set to `https://aethex.dev/activity`
- [ ] Interactions Endpoint URL is set to `https://aethex.dev/api/discord/interactions`
- [ ] Instance URL is set to `https://aethex.dev`
- [ ] Client ID matches: `578971245454950421`
- [ ] Client Secret is set and correct
- [ ] OAuth2 scopes include `identify` and `guilds`
- [ ] Interactions Endpoint shows green checkmark (verified)
- [ ] You waited at least 2 minutes after saving changes
