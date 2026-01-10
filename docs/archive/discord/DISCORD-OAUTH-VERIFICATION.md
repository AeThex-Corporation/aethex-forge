# Discord OAuth Connection Verification & Testing

## Current Status ✅

**Bot Token**: Updated with new token (as of latest deployment)
**Environment Variables**: All configured
**Endpoints**: Live and responding

## What Should Work

### ✅ 1. Login with Discord (New Scenario)

**Scenario**: User clicks "Continue with Discord" on `/login` with Discord email matching existing account

**Steps**:

1. Go to `https://aethex.dev/login`
2. Click **"Continue with Discord"** button
3. Authorize on Discord
4. Should show success and redirect to `/dashboard`

**Expected Result**: User logged in with Discord account linked

---

### ✅ 2. Login with Discord (Email Mismatch)

**Scenario**: Discord email doesn't match any existing AeThex account

**Steps**:

1. Go to `https://aethex.dev/login`
2. Click **"Continue with Discord"** button
3. Authorize with Discord account that has different email
4. Should show error: "Discord email not found"
5. Click back to login and sign in with your email instead

**Expected Result**: User shown helpful error message, redirected to login

---

### ✅ 3. Link Discord from Dashboard

**Scenario**: User already logged in, wants to link Discord

**Steps**:

1. Sign in with email/password on `/login`
2. Go to `/dashboard?tab=connections`
3. Find Discord card
4. Click **"Link Discord"** button
5. Authorize Discord
6. Should see Discord as "Linked" in connections

**Expected Result**: Discord account linked to existing user

---

### ✅ 4. Discord Bot Commands

**Scenario**: User types Discord commands in a server where bot is present

**Commands to Test**:

```
/verify              - Bot sends verification code
/set-realm gameforge - Bot confirms realm change + assigns role
/profile             - Bot shows user profile card
/verify-role         - Bot shows assigned roles
/unlink              - Bot unlinks Discord account
```

**Expected Result**: All commands respond without errors

---

## OAuth Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│             Discord OAuth Login Flow                    │
└─────────────────────────────────────────────────────────┘

1. User clicks "Continue with Discord"
   ↓
2. Frontend redirects to:
   /api/discord/oauth/start
   ↓
3. Backend redirects to:
   https://discord.com/api/oauth2/authorize?
     client_id=578971245454950421
     &redirect_uri=https://aethex.dev/api/discord/oauth/callback
     &response_type=code
     &scope=identify%20email
     &state=...
   ↓
4. User authorizes on Discord
   ↓
5. Discord redirects to:
   /api/discord/oauth/callback?code=XXX&state=...
   ↓
6. Backend:
   a) Exchanges code for Discord access token
   b) Fetches Discord user profile (email, username, avatar)
   c) Checks if Discord email matches existing account
   d) If YES → Links to existing user
   d) If NO → Shows error "Discord email not found"
   e) Creates session cookies
   f) Redirects to /dashboard
   ↓
7. ✅ User logged in with Discord linked
```

---

## Environment Variables (Current)

```
DISCORD_CLIENT_ID=578971245454950421
DISCORD_CLIENT_SECRET=<from Discord Developer Portal>
DISCORD_BOT_TOKEN=<new token with GmEHDt prefix>
DISCORD_PUBLIC_KEY=d9771dd29e3a6f030cb313e33bb4b51384c7c36829bd551df714681dcf1e1eb0
```

---

## Discord Developer Portal Checklist

Make sure these are configured in Discord Developer Portal:

- [ ] **General Information**:

  - [ ] Application name: "AeThex"
  - [ ] Client ID: `578971245454950421`
  - [ ] Public Key: `d9771dd29e3a6f030cb313e33bb4b51384c7c36829bd551df714681dcf1e1eb0`

- [ ] **OAuth2 > General**:

  - [ ] Client Secret configured
  - [ ] Redirect URIs includes: `https://aethex.dev/api/discord/oauth/callback`

- [ ] **Bot**:

  - [ ] Bot token set (new GmEHDt token)
  - [ ] Intents enabled: `Message Content`, `Guilds`
  - [ ] Permissions: `Administrator` or specific permissions

- [ ] **Interactions Endpoint URL**:
  - [ ] URL: `https://aethex.dev/api/discord/interactions`
  - [ ] ✅ Verified by Discord

---

## Testing Checklist

### Basic Connectivity

- [ ] API endpoint responds: `curl https://aethex.dev/api/discord/oauth/start -I`
- [ ] Discord bot online (shows in server member list)
- [ ] Discord bot can execute commands (`/verify` works)

### OAuth Login Tests

- [ ] **Test 1**: Login with Discord email matching existing account

  - [ ] Click "Continue with Discord"
  - [ ] Authorize
  - [ ] Redirects to dashboard ✅

- [ ] **Test 2**: Login with Discord email NOT in system
  - [ ] Click "Continue with Discord"
  - [ ] Authorize
  - [ ] Shows error message ✅
  - [ ] Can sign in with email instead ✅

### OAuth Linking Tests

- [ ] **Test 3**: Link Discord from Dashboard

  - [ ] Sign in with email
  - [ ] Go to Dashboard → Connections
  - [ ] Click "Link Discord"
  - [ ] Authorize
  - [ ] Discord appears as linked ✅

- [ ] **Test 4**: Unlink and re-link Discord
  - [ ] From connections tab, click "Unlink Discord"
  - [ ] Confirm unlink
  - [ ] Click "Link Discord" again
  - [ ] Authorize
  - [ ] Successfully re-linked ✅

### Bot Command Tests

- [ ] **Test 5**: `/verify` command generates code

  - [ ] Type `/verify` in Discord
  - [ ] Bot sends code with link
  - [ ] Link works: `https://aethex.dev/discord-verify?code=...` ✅

- [ ] **Test 6**: `/set-realm` command works

  - [ ] Type `/set-realm`
  - [ ] Select an arm (gameforge, labs, etc)
  - [ ] Bot confirms change ✅
  - [ ] Logs show role assignment ✅

- [ ] **Test 7**: `/profile` command shows user
  - [ ] Type `/profile`
  - [ ] Bot shows user profile card ✅

---

## Troubleshooting

### "Redirect URI mismatch" error

- Problem: Discord OAuth callback failing
- Solution: Verify `https://aethex.dev/api/discord/oauth/callback` is registered in Discord Developer Portal

### "Invalid token" error

- Problem: Bot token expired or revoked
- Solution: Get new token from Discord Developer Portal

### Bot commands not working

- Problem: Commands not registered with Discord
- Solution: Run `/api/discord/admin-register-commands` endpoint with DISCORD_ADMIN_REGISTER_TOKEN

### Session lost during linking

- Problem: User logged out after Discord OAuth redirect
- Solution: This should NOT happen anymore - we use database sessions instead of cookies

---

## Success Indicators ✅

All flows working when you see:

1. ✅ Discord button visible on login page
2. ✅ Can authorize on Discord and return to aethex.dev
3. ✅ Discord appears in Dashboard connections
4. ✅ Bot commands work in Discord
5. ✅ No session loss during OAuth redirects
6. ✅ Helpful error messages when things go wrong
