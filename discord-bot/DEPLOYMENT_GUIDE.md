# AeThex Discord Bot - Spaceship Deployment Guide

## 📋 Prerequisites

- Spaceship hosting account with Node.js support
- Discord bot credentials (already in your environment variables)
- Supabase project credentials
- Git access to your repository

## 🚀 Deployment Steps

### Step 1: Prepare the Bot Directory

Ensure all bot files are committed:

```
code/discord-bot/
├── bot.js
├── package.json
├── .env.example
├── Dockerfile
└── commands/
    ├── verify.js
    ├── set-realm.js
    ├── profile.js
    ├── unlink.js
    └── verify-role.js
```

### Step 2: Create Node.js App on Spaceship

1. Log in to your Spaceship hosting dashboard
2. Click "Create New Application"
3. Select **Node.js** as the runtime
4. Name it: `aethex-discord-bot`
5. Select your repository and branch

### Step 3: Configure Environment Variables

In Spaceship Application Settings → Environment Variables, add:

```
DISCORD_BOT_TOKEN=<your_bot_token_from_discord_developer_portal>
DISCORD_CLIENT_ID=<your_client_id>
DISCORD_PUBLIC_KEY=<your_public_key>
SUPABASE_URL=<your_supabase_url>
SUPABASE_SERVICE_ROLE=<your_service_role_key>
BOT_PORT=3000
NODE_ENV=production
```

**Note:** Get these values from:

- Discord Developer Portal: Applications → Your Bot → Token & General Information
- Supabase Dashboard: Project Settings → API

### Step 4: Configure Build & Run Settings

In Spaceship Application Settings:

**Build Command:**

```bash
npm install
```

**Start Command:**

```bash
npm start
```

**Root Directory:**

```
code/discord-bot
```

### Step 5: Deploy

1. Click "Deploy" in Spaceship dashboard
2. Monitor logs for:
   ```
   ✅ Bot logged in as <BOT_NAME>#<ID>
   📡 Listening in X server(s)
   ✅ Successfully registered X slash commands.
   ```

### Step 6: Verify Bot is Online

Once deployed:

1. Go to your Discord server
2. Type `/verify` - the command autocomplete should appear
3. Bot should be online with status "Listening to /verify to link your AeThex account"

## 📡 Discord Bot Endpoints

The bot will be accessible at:

```
https://<your-spaceship-domain>/
```

The bot uses Discord's WebSocket connection (not HTTP), so it doesn't need to expose HTTP endpoints. It listens to Discord events via `client.login(DISCORD_BOT_TOKEN)`.

## 🔌 API Integration

Frontend calls to link Discord accounts:

- **Endpoint:** `POST /api/discord/link`
- **Body:** `{ verification_code, user_id }`
- **Response:** `{ success: true, message: "..." }`

Discord Verify page (`/discord-verify?code=XXX`) will automatically:

1. Call `/api/discord/link` with the verification code
2. Link the Discord ID to the AeThex user account
3. Redirect to dashboard on success

## 🛠️ Debugging

### Check bot logs on Spaceship:

- Application → Logs
- Filter for "bot.js" or "error"

### Common issues:

**"Discord bot not responding to commands"**

- Check: `DISCORD_BOT_TOKEN` is correct
- Check: Bot is added to the Discord server with "applications.commands" scope
- Check: Spaceship logs show "✅ Logged in"

**"Supabase verification fails"**

- Check: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE` are correct
- Check: `discord_links` and `discord_verifications` tables exist
- Run migration: `code/supabase/migrations/20250107_add_discord_integration.sql`

**"Slash commands not appearing in Discord"**

- Check: Logs show "✅ Successfully registered X slash commands"
- Discord may need 1-2 minutes to sync commands
- Try typing `/` in Discord to force refresh
- Check: Bot has "applications.commands" permission in server

## 📊 Monitoring

### Key metrics to monitor:

- Bot uptime (should be 24/7)
- Command usage (in Supabase)
- Verification code usage (in Supabase)
- Discord role sync success rate

### View in Admin Dashboard:

- AeThex Admin Panel → Discord Management tab
- Shows:
  - Bot status
  - Servers connected
  - Linked accounts count
  - Role mapping status

## 🔄 Updating the Bot

1. Make code changes locally
2. Test with `npm start`
3. Commit and push to your branch
4. Spaceship will auto-deploy on push
5. Monitor logs to ensure deployment succeeds

## 🆘 Support

For issues:

1. Check Spaceship logs
2. Review `/api/discord/link` endpoint response
3. Verify all environment variables are set correctly
4. Ensure Supabase tables exist and have correct schema

## 📝 Database Setup

Run this migration on your AeThex Supabase:

```sql
-- From code/supabase/migrations/20250107_add_discord_integration.sql
-- This creates:
-- - discord_links (links Discord ID to AeThex user)
-- - discord_verifications (temporary verification codes)
-- - discord_role_mappings (realm → Discord role mapping)
-- - discord_user_roles (tracking assigned roles)
```

## 🎉 You're All Set!

Once deployed, users can:

1. Click "Link Discord" in their profile settings
2. Type `/verify` in Discord
3. Click the verification link
4. Their Discord account is linked to their AeThex account
5. They can use `/set-realm`, `/profile`, `/unlink`, and `/verify-role` commands

---

**Deployment Date:** `<date>`  
**Bot Status:** `<status>`  
**Last Updated:** `<timestamp>`
