<!-- INTERNAL: Operational doc - DO NOT PUBLISH TO PUBLIC DOCS -->

# Discord Activity Deployment Guide

## For Web-Based Development (No Terminal Access)

If you can't run `npm` in your development environment, follow this guide to deploy Discord Activity and register commands via the web.

---

## Step 1: Set Environment Variables

Add these to your deployment platform (Vercel, PebbleHost):

### Vercel (Frontend)

```
VITE_DISCORD_CLIENT_ID=578971245454950421
```

### PebbleHost (Discord Bot)

```
DISCORD_BOT_TOKEN=<your-token>
DISCORD_CLIENT_ID=578971245454950421
DISCORD_PUBLIC_KEY=<your-public-key>
SUPABASE_URL=https://kmdeisowhtsalsekkzqd.supabase.co
SUPABASE_SERVICE_ROLE=<your-service-role-key>
BOT_PORT=3000
```

### Vercel (Backend - for command registration)

```
DISCORD_BOT_TOKEN=<your-token>
DISCORD_CLIENT_ID=578971245454950421
DISCORD_ADMIN_REGISTER_TOKEN=<create-a-random-secure-token>
```

---

## Step 2: Enable Discord Activities

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application (AeThex)
3. Go to **Settings** → **General Information**
4. Scroll down to **Activities**
5. **Enable Activities** (toggle ON)
6. Set **Activity URL**: `https://aethex.dev/activity` or `https://aethex.dev/`
7. Save changes

When you enable Activities, Discord automatically creates an "Entry Point" command. **This is expected and OK.**

---

## Step 3: Register Discord Commands via Web API

Instead of running `npm run register-commands`, use this web endpoint:

### Option A: Using curl (if you have PebbleHost console access)

```bash
curl -X POST https://aethex.dev/api/discord/admin-register-commands \
  -H "Authorization: Bearer YOUR_DISCORD_ADMIN_REGISTER_TOKEN" \
  -H "Content-Type: application/json"
```

Replace `YOUR_DISCORD_ADMIN_REGISTER_TOKEN` with the value you set in environment variables.

### Option B: Call from Admin Panel (Future)

You can add a button to `/admin` panel that triggers this endpoint:

```typescript
async function registerCommands() {
  const response = await fetch("/api/discord/admin-register-commands", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.DISCORD_ADMIN_REGISTER_TOKEN}`,
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  console.log("Registration result:", data);
}
```

### Option C: Using Postman

1. Create a new POST request to: `https://aethex.dev/api/discord/admin-register-commands`
2. Go to **Headers** tab
3. Add:
   - Key: `Authorization`
   - Value: `Bearer YOUR_DISCORD_ADMIN_REGISTER_TOKEN`
4. Click **Send**

---

## Step 4: Deploy Bot to PebbleHost

1. Create a new Node.js app on PebbleHost
2. Point it to `code/discord-bot/` directory
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables (from Step 1)
6. Deploy

**The bot will start and listen for commands.** ✅

Command registration happens via the API endpoint (Step 3), not on bot startup.

---

## Step 5: Deploy Frontend to Vercel

1. Connect your GitHub repo to Vercel (or push code)
2. Add environment variables (from Step 1)
3. Deploy
4. Frontend will auto-build and serve `/activity` route

---

## Step 6: Test Discord Activity

1. Open Discord
2. Go to a server where your bot is installed
3. Click your bot's profile
4. Click **Launch** (or the Activity button if visible)
5. Your Activity should load in an iframe
6. You should be instantly authenticated (no login needed)

---

## Troubleshooting

### Error 50240: "Cannot remove Entry Point command"

**This happens if:**

- You enable Activities, then the bot tries to register commands via bulk update
- The bot is trying to overwrite the auto-generated Entry Point command

**Solution:**

- ✅ Your bot code has been fixed (bot no longer registers on startup)
- Just call the `/api/discord/admin-register-commands` endpoint (Step 3)
- The endpoint handles Error 50240 gracefully

### Activity not loading in Discord

**Check:**

1. Activities enabled in Discord Developer Portal ✅
2. Activity URL is set to `https://aethex.dev/activity` (not an IP) ✅
3. Frontend is deployed to Vercel ✅
4. Environment variable `VITE_DISCORD_CLIENT_ID` is set ✅
5. Check browser console for errors (F12)

### "Unauthorized" error when calling register endpoint

**Check:**

1. `DISCORD_ADMIN_REGISTER_TOKEN` is set in Vercel environment variables
2. You're passing the correct token in the `Authorization: Bearer` header
3. The token matches exactly (no extra spaces)

### Bot not responding to commands

**Check:**

1. Bot is online on PebbleHost (check logs)
2. Commands are registered (call `/api/discord/admin-register-commands` and check response)
3. Response shows commands registered successfully
4. Try the commands in Discord (`/verify`, `/profile`, etc.)

---

## Quick Reference

| What              | How                                                            |
| ----------------- | -------------------------------------------------------------- |
| Enable Activities | Discord Developer Portal → Settings → Activities → Enable      |
| Register Commands | POST to `/api/discord/admin-register-commands` with auth token |
| Deploy Bot        | Push to PebbleHost, bot starts with `npm start`                |
| Deploy Frontend   | Push to GitHub, Vercel auto-deploys                            |
| Test Activity     | Open Discord, click Activity button, should load               |

---

## Environment Variables Checklist

- [ ] `DISCORD_BOT_TOKEN` - Set on PebbleHost
- [ ] `DISCORD_CLIENT_ID` - Set on PebbleHost & Vercel
- [ ] `DISCORD_PUBLIC_KEY` - Set on PebbleHost
- [ ] `SUPABASE_URL` - Set on PebbleHost
- [ ] `SUPABASE_SERVICE_ROLE` - Set on PebbleHost
- [ ] `VITE_DISCORD_CLIENT_ID` - Set on Vercel (frontend)
- [ ] `DISCORD_ADMIN_REGISTER_TOKEN` - Set on Vercel (backend)

---

## What Happens When You Register Commands

The endpoint registers these 5 commands:

1. **`/verify`** - Generate linking code (15-min expiry)
2. **`/set-realm`** - Choose primary arm (labs, gameforge, corp, foundation, devlink)
3. **`/profile`** - View linked AeThex profile
4. **`/unlink`** - Disconnect Discord account
5. **`/verify-role`** - Check assigned Discord roles

Plus the auto-generated **Entry Point** command (managed by Discord for Activities).

---

## Summary

✅ No need to run `npm` in the web  
✅ Everything can be deployed via web interfaces  
✅ Commands registered via API endpoint  
✅ Error 50240 handled automatically  
✅ Activity loads instantly in Discord

**You're all set!** 🚀
