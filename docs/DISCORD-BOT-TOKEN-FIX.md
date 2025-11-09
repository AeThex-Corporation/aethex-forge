# Discord Bot Token Invalid - Troubleshooting & Fix

## Problem

The Discord bot is failing to login with error:

```
❌ Unhandled Promise Rejection: Error [TokenInvalid]: An invalid token was provided.
```

This means the `DISCORD_BOT_TOKEN` environment variable is either:

- Expired or revoked
- Invalid/malformed
- For a bot that was deleted from Discord Developer Portal
- Not properly synced to the deployment environment

## Solution: Get a New Bot Token

### Step 1: Go to Discord Developer Portal

1. Visit: https://discord.com/developers/applications
2. Sign in with your Discord account
3. Click on the application named **"AeThex"** (or your app name)

### Step 2: Get the Bot Token

1. Click on the **"Bot"** tab on the left sidebar
2. Under the "TOKEN" section, click **"Reset Token"**
3. Click **"Yes, do it!"** to confirm (the old token will be revoked)
4. Click **"Copy"** to copy the new token

### Step 3: Update the Environment Variable

The new token looks like: `NTc4OTcxMjQ1NDU0OTUwNDIx.GxxxXX.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

**For Railway/Spaceship Deployment:**

1. Go to your Railway/Spaceship dashboard
2. Go to environment variables
3. Update or add: `DISCORD_BOT_TOKEN=<new_token_here>`
4. Save changes
5. Redeploy the bot

**For Local Development:**

1. Update `.env` file in `code/discord-bot/`:
   ```
   DISCORD_BOT_TOKEN=your_new_token_here
   ```
2. Restart the bot: `npm start`

### Step 4: Verify the Bot

After updating the token, the bot should:

1. Login successfully: `✅ Bot logged in as AeThex#xxxx`
2. Load all commands: `��� Loaded command: verify`, etc.
3. Start health check server: `🏥 Health check server running on port 8044`

## Token Format Validation

A valid Discord bot token:

- ✅ Starts with a number (user ID)
- ✅ Contains 3 parts separated by dots: `part1.part2.part3`
- ✅ Is ~70+ characters long
- ✅ Contains only alphanumeric characters, dots, hyphens, and underscores

Example: `NTc4OTcxMjQ1NDU0OTUwNDIx.GxxxXX.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Common Issues & Fixes

### Issue: "Token has been exposed"

Discord automatically revokes tokens if they appear in public repositories (GitHub, etc.).

**Fix:** Reset the token in Discord Developer Portal as described above.

### Issue: Bot not in any servers

Even with a valid token, the bot might not connect to your servers.

**Fix:**

1. In Discord Developer Portal, go to **OAuth2 > URL Generator**
2. Select scopes: `bot`
3. Select permissions: `Administrator` (or specific permissions)
4. Copy the generated URL and open it in browser
5. Select your server and authorize

### Issue: "TokenInvalid" but token looks correct

The token might be:

- Copied with extra whitespace
- Not fully copied (missing characters)
- From a different bot application

**Fix:**

1. Go back to Discord Developer Portal
2. Reset the token again (this revokes the old one)
3. Copy the full new token carefully (no extra spaces)
4. Update environment variable immediately

## Environment Variables Checklist

Before deploying, verify these are set:

- ✅ `DISCORD_BOT_TOKEN` - Valid bot token from Developer Portal
- ✅ `DISCORD_CLIENT_ID` - Usually `578971245454950421`
- ✅ `DISCORD_PUBLIC_KEY` - From General Information tab
- ✅ `SUPABASE_URL` - Database connection
- ✅ `SUPABASE_SERVICE_ROLE` - Database authentication
- ✅ `BOT_PORT` - Usually `3000` or `8044` for Railway

## Still Having Issues?

If the token is valid but bot still won't login:

1. **Check Discord Server Status**: https://status.discord.com/
2. **Verify Bot Permissions**: Make sure bot has "Send Messages", "Read Messages"
3. **Check Firewall**: Some firewalls block Discord API connections
4. **Review Recent Changes**: Did you recently update discord.js version?
5. **Clear Cache**: Delete `node_modules/` and run `npm install` again

## References

- Discord Developer Portal: https://discord.com/developers/applications
- Discord.js Documentation: https://discord.js.org/
- Creating a Discord Bot: https://discordjs.guide/preparations/setting-up-a-bot-application.html
