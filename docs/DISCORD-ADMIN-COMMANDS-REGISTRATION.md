<!-- INTERNAL: Operational doc - DO NOT PUBLISH TO PUBLIC DOCS -->

# Discord Commands Registration - Admin Panel

## Overview

You can now register Discord slash commands directly from the Admin Panel, without needing terminal access.

---

## How to Register Commands

### Step 1: Go to Admin Panel

1. Navigate to `https://aethex.dev/admin`
2. Click on the **"Discord"** tab

### Step 2: Click "Register Commands"

You'll see a new card titled **"Discord Commands"** at the top with a blue button that says **"Register Commands"**.

Click this button.

### Step 3: Enter Admin Token

A popup will appear asking for your **admin registration token**.

This token is:

- Set in your Vercel environment variables as `DISCORD_ADMIN_REGISTER_TOKEN`
- A random secure string (e.g., `sk-admin-aethex-discord-2024`)

**Example popup:**

```
Enter admin registration token (from environment variables):
[_________________________]  [OK]  [Cancel]
```

### Step 4: Wait for Confirmation

The button will show **"Registering..."** with a spinning loader.

Once complete, you'll see one of:

**✅ Success:**

```
✅ Registered 5 new commands (Entry Point already exists)
```

**⚠️ Partial Success (Error 50240):**

```
✅ Registered 5 new commands (Entry Point managed by Discord)
```

**❌ Error:**

```
❌ Invalid or expired access token
```

---

## What Gets Registered

The button registers these 5 Discord slash commands:

1. **`/verify`** - Link your Discord account to AeThex
2. **`/set-realm`** - Choose your primary arm (Labs, GameForge, Corp, Foundation, Dev-Link)
3. **`/profile`** - View your linked AeThex profile
4. **`/unlink`** - Disconnect your Discord account
5. **`/verify-role`** - Check your assigned Discord roles

Plus Discord's auto-generated **"Entry Point"** command (for Discord Activities).

---

## Troubleshooting

### "Unauthorized" Error

**Issue:** Getting this error when registering.

**Solution:**

1. Check your `DISCORD_ADMIN_REGISTER_TOKEN` environment variable in Vercel
2. Make sure you entered the token exactly as it's set (case-sensitive)
3. Verify token doesn't have extra spaces

### "Failed to register commands" Error

**Issue:** Generic error when clicking the button.

**Check:**

1. Is your bot deployed on PebbleHost?
2. Are your `DISCORD_BOT_TOKEN` and `DISCORD_CLIENT_ID` env vars set on Vercel (backend)?
3. Open browser console (F12) → Network tab → Check the POST request to `/api/discord/admin-register-commands`

### "Entry Point command already exists" (Not an Error)

**This is expected!** When you enable Discord Activities:

1. Discord auto-creates an "Entry Point" command
2. Our script recognizes this and doesn't try to overwrite it
3. Your bot's 5 commands live alongside it peacefully

---

## Environment Variables Required

**On Vercel (Backend):**

```
DISCORD_BOT_TOKEN=<your-bot-token>
DISCORD_CLIENT_ID=578971245454950421
DISCORD_ADMIN_REGISTER_TOKEN=sk-admin-aethex-discord-2024
```

**On PebbleHost (Bot):**

```
DISCORD_BOT_TOKEN=<your-bot-token>
DISCORD_CLIENT_ID=578971245454950421
DISCORD_PUBLIC_KEY=<your-public-key>
SUPABASE_URL=https://kmdeisowhtsalsekkzqd.supabase.co
SUPABASE_SERVICE_ROLE=<your-service-role>
```

---

## Alternative Methods

If the admin button doesn't work, you can also register commands using:

### curl (if you have PebbleHost console access)

```bash
curl -X POST https://aethex.dev/api/discord/admin-register-commands \
  -H "Authorization: Bearer YOUR_DISCORD_ADMIN_REGISTER_TOKEN" \
  -H "Content-Type: application/json"
```

### Postman

1. Create POST request to `https://aethex.dev/api/discord/admin-register-commands`
2. Add header: `Authorization: Bearer YOUR_DISCORD_ADMIN_REGISTER_TOKEN`
3. Click Send

---

## Summary

✅ Click "Register Commands" in Admin → Discord tab  
✅ Enter your admin token  
✅ Wait for success confirmation  
✅ Commands are now live in Discord

Done! 🎉
