# AeThex Discord System - Complete Flow Documentation

## Overview

There are 5 completely separate Discord flows in AeThex. Each one is independent but some share infrastructure.

---

## FLOW 1: Discord OAuth Login

**When**: User clicks "Continue with Discord" on `/login` page
**Goal**: Create new account OR link Discord to existing email
**Files Involved**: Login.tsx → oauth/start.ts → oauth/callback.ts

### Step-by-Step

```
┌─ User on /login page
│
├─ Clicks "Continue with Discord" button
│  └─ code/client/pages/Login.tsx line ~180-185
│
├─ Browser → /api/discord/oauth/start (GET)
│  └─ code/api/discord/oauth/start.ts
│     • Builds Discord OAuth URL
│     • No state needed for login flow
│     • Redirects to: https://discord.com/api/oauth2/authorize?client_id=...
│
├─ User authorizes on Discord
│  └─ Discord redirects to: /api/discord/oauth/callback?code=XXX&state=...
│
├─ Backend processes callback (GET)
│  └─ code/api/discord/oauth/callback.ts
│
│  A) Parse state (action will be undefined or "login")
│  B) Exchange code for Discord access token
│  C) Fetch Discord user profile (id, username, email, avatar)
│  D) Check if email already in Supabase auth
│     └─ If YES: Just link to existing user (don't create)
│     └─ If NO: Create new auth user with email
│  E) Create/update user_profiles record (upsert)
│  F) Create discord_links record (links discord_id → user_id)
│  G) Create session (login user automatically)
��  H) Redirect to /dashboard or /onboarding based on profile_complete
│
└─ ✅ User logged in with Discord account linked
```

### Database Operations (Login Flow)

```
discord_links table:
  INSERT: { discord_id: "123", user_id: "uuid", linked_at: now() }

user_profiles table:
  UPSERT: { id: user_id, full_name: discord_username, email, avatar_url }

auth.users table:
  INSERT: { email, user_metadata: { full_name, avatar_url } }
    (only if email doesn't already exist)
```

### Success Path

✅ User sees dashboard or onboarding screen
✅ User is fully logged in
✅ Discord account is linked

### Failure Paths

❌ Email already exists → Redirect to `/login?error=account_exists&message=...`

- User must sign in with email first, then link from Dashboard
  ❌ Auth user creation fails → Redirect to `/login?error=auth_create`
  ❌ Profile creation fails → Redirect to `/login?error=profile_create`
  ❌ Discord link creation fails → Redirect to `/login?error=link_create`

---

## FLOW 2: Discord Account Linking (from Dashboard)

**When**: User clicks "Link Discord" button in `/dashboard?tab=connections`
**Goal**: Add Discord account to existing AeThex account (user already logged in)
**Files Involved**: Dashboard.tsx → AuthContext.linkProvider() → oauth/start.ts → oauth/callback.ts

### Step-by-Step

```
┌─ User on /dashboard?tab=connections (ALREADY LOGGED IN)
│
├─ Clicks "Link Discord" button
│  └─ code/client/pages/Dashboard.tsx line ~283-290
│     Calls: AuthContext.linkProvider("discord")
│
├─ AuthContext.linkProvider("discord")
│  └─ code/client/contexts/AuthContext.tsx line ~700-770
│
│  A) Get current user's auth token
│     └─ const session = await supabase.auth.getSession()
│
│  B) POST to /api/discord/create-linking-session
│     └─ code/server/index.ts line ~871-911
│        • Validates auth token
│        • Creates temporary session in discord_linking_sessions table
│        • Returns: { token: sessionToken } (5 min expiry)
│
│  C) Build Discord OAuth URL with state containing:
│     {
│       action: "link",
│       sessionToken: sessionToken,
│       redirectTo: "/dashboard?tab=connections"
│     }
│
│  D) Browser → https://discord.com/api/oauth2/authorize?...
│
├─ User authorizes on Discord
│  └─ Discord redirects to: /api/discord/oauth/callback?code=XXX&state=...
│
├─ Backend processes callback (GET)
│  └─ code/api/discord/oauth/callback.ts line ~38-100
│
│  A) Parse state
│     └─ stateData.action === "link" ��� (this is linking flow)
│     └─ stateData.sessionToken: "hex string"
│
│  B) Look up session in discord_linking_sessions table
│     └─ if expired or not found → Redirect to login with error
│
│  C) Extract authenticatedUserId from session
│
│  D) Exchange code for Discord access token
│
│  E) Fetch Discord user profile (id, username, email)
│
│  F) Check if Discord ID already linked to different user
│     └─ if YES: Show error (Discord can only be linked once)
│     └─ if NO: Continue
│
│  G) Create discord_links record with authenticatedUserId
│
│  H) Delete the temporary session (cleanup)
│
│  I) Redirect back to /dashboard?tab=connections
│     └─ User sees page refresh, Discord is now linked
│
└─ ✅ Discord account linked to existing AeThex account
```

### Database Operations (Linking Flow)

```
discord_linking_sessions table:
  INSERT: { user_id: uuid, session_token: "hex", expires_at: now+5min }
  DELETE: WHERE session_token = sessionToken (cleanup)

discord_links table:
  UPSERT: { discord_id: "123", user_id: uuid, linked_at: now() }
```

### Success Path

✅ Browser redirects to `/dashboard?tab=connections`
✅ Discord appears as "linked" in connections section
✅ User can now use /verify command in Discord to link roles

### Failure Paths

❌ Auth token missing/invalid → User sees "Auth failed" toast
❌ Session creation fails → User sees "Link failed" toast
❌ Session expired during OAuth redirect → Redirect to login
❌ Discord ID already linked to different account → Redirect to login with error

### Critical: Session Persistence

⚠️ **KEY ISSUE THAT WAS FIXED**:

- During Discord OAuth redirect (step 2D above), browser leaves aethex.dev
- Session cookies might not be sent to Discord redirect back
- **SOLUTION**: We store user_id in temporary database session (discord_linking_sessions)
- On callback, we extract user_id from database, not from cookies
- This guarantees linking works even if cookies get lost

---

## FLOW 3: Discord Verification Code (Bot /verify Command)

**When**: User types `/verify` in Discord, bot sends code, user clicks link
**Goal**: Link Discord account without OAuth flow (alternative to Flow 2)
**Files Involved**: bot.js /verify command → DiscordVerify.tsx → api/discord/verify-code.ts

### Step-by-Step

```
┌─ User in Discord
│
├─ Types /verify command
│  └─ code/discord-bot/commands/verify.js
│
│  A) Bot generates 6-digit code
│  B) Stores in discord_verifications table:
│     { discord_id, verification_code, expires_at: now+15min }
│  C) Sends message with link:
│     "https://aethex.dev/discord-verify?code=123456"
│
├─ User clicks link
│  └─ Browser goes to /discord-verify?code=123456
│     code/client/pages/DiscordVerify.tsx
│
│  A) Check if user is logged in
│     └─ if NO: Redirect to /login?next=/discord-verify?code=123456
│        (code is preserved in URL)
│
│  B) If NOT logged in:
│     • User logs in with email/password or OAuth
│     • Browser returns to /discord-verify?code=123456
│
│  C) Show form with verification code (pre-filled if from URL)
│
│  D) User clicks "Verify" button
│
│  E) Frontend calls POST /api/discord/verify-code
│     └─ code/api/discord/verify-code.ts
│
│     A) Get current user ID from session
│     B) Query discord_verifications table for matching code
│     C) Check if code is not expired
│     D) Check if Discord ID already linked to different user
│     E) Create discord_links record
│     F) Delete the used verification code
│     G) Return success
│
│  F) Frontend shows success message
│
│  G) Browser redirects to /dashboard?tab=connections
│
└─ ✅ Discord linked via verification code
```

### Database Operations (Verification Flow)

```
discord_verifications table:
  INSERT: { discord_id: "123", verification_code: "456789", expires_at: now+15min }
           (done by bot.js)
  DELETE: WHERE verification_code = code (cleanup after verification)

discord_links table:
  INSERT: { discord_id: "123", user_id: uuid, linked_at: now() }
```

### Success Path

✅ Page shows "Discord linked successfully!"
✅ Browser redirects to connections tab
✅ Discord appears as linked

### Failure Paths

❌ Code expired → Show error "Code expired, ask bot to run /verify again"
❌ Code not found → Show error "Invalid code"
❌ Discord ID already linked to different user → Show error "This Discord is already linked to another account"
❌ User not logged in when clicking link → Redirect to login (code preserved)

### Why This Flow Exists

- Simpler than OAuth (no redirect to discord.com)
- Works if user's Discord is not verified with email
- Manual process but more user-friendly for some

---

## FLOW 4: Discord Activity (Standalone SPA in Discord)

**When**: User opens Activity in Discord desktop app
**Goal**: Show AeThex dashboard inside Discord as an Activity
**Files Involved**: Activity.tsx → DiscordActivityContext.tsx → api/discord/activity-auth.ts

### Step-by-Step

```
┌─ User opens Discord Activity from context menu in Discord app
│
├─ Discord loads iframe with Activity URL
│  └─ https://aethex.dev/activity (or deep link)
│     code/client/pages/Activity.tsx
│
├─ Activity page initializes
│  └─ code/client/contexts/DiscordActivityContext.tsx
│
│  A) Detect if running inside Discord iframe
│  B) Initialize Discord SDK
│  C) Get Discord access token from SDK
│  D) POST to /api/discord/activity-auth with access token
│     └─ code/api/discord/activity-auth.ts
│
├─ Backend validates and creates/updates user
│  └─ code/api/discord/activity-auth.ts
│
│  A) Validate access token (from Discord SDK, not OAuth)
│  B) Get current user ID from token (or create if new)
│  C) Query user_profiles for that user
│  D) If user doesn't exist:
│     • Create with defaults: primary_arm="labs", user_type="community_member"
│  E) Return user profile data
│
├─ Activity page displays
│  └─ Shows user profile (name, avatar, discord_id)
│  └─ Shows current realm/arm
│  └─ Shows quick action buttons (browse, opportunities, settings)
│
├─ User can click buttons
│  └─ Each button opens new tab: window.open(url, "_blank")
│  └─ Keeps Activity in Discord while main app opens in browser tab
│
└─ ✅ Activity displayed successfully
```

### Database Operations (Activity Flow)

```
user_profiles table:
  SELECT: WHERE id = user_id (from token)
  INSERT: IF NOT EXISTS with defaults
```

### Success Path

✅ Activity loads in Discord
✅ Shows user profile
✅ Buttons open links in new tabs
✅ Activity stays in Discord

### Failure Paths

❌ Not in Discord iframe → Show message "Open this in Discord Activity"
❌ Token invalid → Show error "Authentication failed"
❌ SDK failed to load → Show error "Discord SDK unavailable"

### Key Difference from Other Flows

- This uses Discord SDK (embedded in iframe)
- NOT OAuth (no redirect to discord.com)
- NOT a regular login (Activity is ephemeral)
- User is verified by Discord SDK internally

---

## FLOW 5: Discord Bot Commands

**When**: User types slash commands in Discord
**Goal**: Manage Discord account, set realm, view profile, etc.
**Files Involved**: bot.js → /api/discord/interactions.ts

### Available Commands

#### /verify

```
User: /verify
Bot: "Click to link: https://aethex.dev/discord-verify?code=123456"
User: (clicks link, links Discord account)
Bot: Role assignment happens (if set in discord_role_mappings)
```

Uses: Flow 3 (Verification Code)

#### /set-realm [arm]

```
User: /set-realm
Bot: Shows dropdown with 5 arms (labs, gameforge, corp, foundation, devlink)
User: Clicks one
Bot: Updates discord_links.primary_arm
Bot: Assigns Discord role based on arm + user_type mapping
```

#### /profile

```
User: /profile
Bot: Embeds card with user's AeThex profile
      (name, bio, avatar, primary_arm, avatar)
```

#### /unlink

```
User: /unlink
Bot: Removes discord_links record
Bot: Removes all Discord roles assigned by AeThex
User: Discord account no longer linked
```

#### /verify-role

```
User: /verify-role
Bot: Shows current assigned roles
Bot: Shows expected roles from discord_role_mappings
Bot: Option to auto-assign missing roles
```

---

## Database Schema

### discord_links

```sql
id UUID PRIMARY KEY
discord_id TEXT UNIQUE NOT NULL        -- Discord user ID
user_id UUID NOT NULL REFERENCES user_profiles(id)
primary_arm TEXT                       -- 'labs', 'gameforge', etc
linked_at TIMESTAMP DEFAULT now()
```

**Used by**: All flows
**Query patterns**:

- Find user by discord_id (Flow 2, 3, 4, 5)
- Find discord_id by user_id (Dashboard connections check)
- Update primary_arm (Flow 5 /set-realm)

### discord_linking_sessions

```sql
id UUID PRIMARY KEY
user_id UUID NOT NULL REFERENCES user_profiles(id)
session_token TEXT UNIQUE NOT NULL    -- Random hex string
expires_at TIMESTAMP NOT NULL         -- 5 minute expiry
```

**Used by**: Flow 2 (OAuth Linking)
**Query patterns**:

- Insert when user clicks "Link Discord" (create-linking-session endpoint)
- Select when OAuth callback received (lookup user_id from token)
- Delete after lookup (cleanup)

### discord_verifications

```sql
id UUID PRIMARY KEY
discord_id TEXT NOT NULL              -- Discord user ID
verification_code TEXT UNIQUE NOT NULL
expires_at TIMESTAMP NOT NULL         -- 15 minute expiry
```

**Used by**: Flow 3 (Verification Code)
**Query patterns**:

- Insert when bot /verify command runs (generate code)
- Select when user submits code (verify-code endpoint)
- Delete after verification (cleanup)

### discord_role_mappings

```sql
id UUID PRIMARY KEY
arm TEXT NOT NULL                     -- 'labs', 'gameforge', etc
user_type TEXT NOT NULL               -- 'game_developer', 'community_member', etc
discord_role_name TEXT NOT NULL       -- Role name in Discord
discord_role_id TEXT                  -- Role ID (optional)
server_id TEXT                        -- Optional (specific server)
```

**Used by**: Flow 5 (Bot role assignment)
**Query patterns**:

- Select by (arm, user_type) to find which role to assign
- Managed in Admin panel

### discord_user_roles

```sql
id UUID PRIMARY KEY
discord_id TEXT NOT NULL              -- Discord user ID
server_id TEXT NOT NULL               -- Discord server ID
role_id TEXT NOT NULL                 -- Discord role ID
role_name TEXT NOT NULL               -- Role name
assigned_at TIMESTAMP DEFAULT now()
last_verified TIMESTAMP               -- When role was last verified
UNIQUE(discord_id, server_id, role_id)
```

**Used by**: Flow 5 (Bot tracking)
**Query patterns**:

- Insert when role is assigned
- Update when verified
- Select to show /verify-role command

---

## Environment Variables

```bash
# Required (get from Discord Developer Portal)
DISCORD_CLIENT_ID="578971245454950421"
DISCORD_CLIENT_SECRET="<REDACTED - Get from Discord Developer Portal>"
DISCORD_PUBLIC_KEY="<REDACTED - Get from Discord Developer Portal>"
DISCORD_BOT_TOKEN="<REDACTED - Get from Discord Developer Portal Bot section>"

# Optional
DISCORD_ADMIN_REGISTER_TOKEN="<secure random token>"
DISCORD_BOT_HEALTH_URL="https://aethex.railway.internal:8044/health"
```

⚠️ **SECURITY NOTE**: Never put actual tokens in documentation or version control. Keep them in environment variables only.

---

## Quick Comparison

| Flow                     | Entry                  | Goal                                     | Auth Type             | Endpoints                                                    | Status     |
| ------------------------ | ---------------------- | ---------------------------------------- | --------------------- | ------------------------------------------------------------ | ---------- |
| **1: OAuth Login**       | /login button          | Create account or link to existing email | OAuth + email         | /api/discord/oauth/start, /callback                          | ✅ Working |
| **2: OAuth Linking**     | Dashboard button       | Link to logged-in account                | OAuth + session token | /api/discord/create-linking-session, /oauth/start, /callback | ✅ Working |
| **3: Verification Code** | Discord bot /verify    | Link to logged-in account                | Manual code           | /api/discord/verify-code                                     | ✅ Working |
| **4: Activity**          | Discord Activity       | Show dashboard in Discord                | Discord SDK           | /api/discord/activity-auth                                   | ✅ Working |
| **5: Bot Commands**      | Discord slash commands | Manage account & roles                   | None (bot to backend) | /api/discord/interactions                                    | ✅ Working |

---

## Common Issues & Solutions

### Session Lost During OAuth Linking

**Problem**: User logs in with email, clicks "Link Discord", gets redirected to login page
**Cause**: Session cookies not sent during Discord redirect
**Solution**: We use `discord_linking_sessions` table to store user_id before redirect ✅

### Forced Onboarding After Email Login

**Problem**: User logs in with email, is sent to onboarding even though they completed it before
**Cause**: Profile not marked as `onboarded: true` after completion
**Solution**: Onboarding now sets `onboarded: true` flag ✅

### Discord Already Linked Error

**Problem**: User tries to link Discord account that's already linked to different AeThex account
**Cause**: discord_links.discord_id is UNIQUE
**Solution**: Check if discord_id exists and belongs to different user, show error ✅

### Verification Code Expired

**Problem**: User takes too long to click Discord link or verify
**Cause**: discord_verifications has 15-min expiry
**Solution**: Tell user to ask bot to run /verify again ✅

---

## Testing Checklist

- [ ] **Flow 1**: Login with Discord (new account)
- [ ] **Flow 1**: Login with Discord (existing email account)
- [ ] **Flow 2**: Login with email, then link Discord from Dashboard
- [ ] **Flow 3**: Login with email, use bot /verify code to link
- [ ] **Flow 4**: Open Activity in Discord desktop app
- [ ] **Flow 5**: Try /verify, /set-realm, /profile commands
- [ ] **Flow 5**: Check roles are assigned correctly after /set-realm
- [ ] Unlink Discord and re-link via different flow
- [ ] Multiple users linking same Discord fails gracefully
- [ ] Expired codes show proper error message

---

## Architecture Summary

```
┌─────────────────────────────────────────────────────────────┐
│                    DISCORD FLOWS                            │
├────────────────────────────────────────────────────────────���┤
│                                                              │
│  Flow 1: OAuth Login          ──→ /oauth/start → /callback  │
│  Flow 2: OAuth Linking        ──→ Session + /oauth/start    │
│  Flow 3: Verify Code          ──→ bot /verify + manual code │
│  Flow 4: Activity SPA         ──→ Activity.tsx + SDK auth   │
│  Flow 5: Bot Commands         ──→ /interactions endpoint    │
│                                                              │
│  All flows converge on:      discord_links table            │
│  All require:                DISCORD_CLIENT_ID + CLIENT_ID  │
│                                                              │
│  Authentication:                                            │
│    • Flow 1: OAuth (Discord)                               │
│    • Flow 2: Session token (database stored)               │
│    • Flow 3: User session (already logged in)              │
│    • Flow 4: Discord SDK token                             │
│    • Flow 5: Bot token (server-side only)                  │
│                                                              │
└────────────────────────────────────────��────────────────────┘
```
