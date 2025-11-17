# OAuth Federation Architecture

## Overview

**Federation** is the pattern where users can authenticate with **multiple OAuth providers** (GitHub, Discord, Google, Roblox, Ethereum), but all logins link to a **single Foundation Passport**.

This solves the problem of identity fragmentation: instead of one GitHub account, one Discord account, and one Google account being three separate users, they all represent the same person with one persistent identity.

---

## The Problem (Without Federation)

```
User logs in with GitHub (github_user_123)
  → Creates account A in aethex.dev

Same user logs in with Discord (discord_user_456)
  → Creates account B in aethex.dev (doesn't know this is the same person)

Same user logs in with Roblox (roblox_user_789)
  → Creates account C in aethex.dev (still doesn't know)

Result: 3 separate accounts, 3 separate identities, 3 separate dashboards
```

---

## The Solution (With Federation)

```
User logs in with GitHub (github_user_123)
  → Foundation creates Passport A
  → Stores: provider_identities { passport: A, provider: github, id: 123 }
  → User logged in with Passport A

Same user logs in with Discord (discord_user_456)
  → System looks up: Does discord_user_456 have a linked Passport?
  → No match found
  → System checks: Does this Discord email match any Passport email?
  → If match found → Link discord_user_456 to existing Passport A
  → User logged in with SAME Passport A

Same user later logs in with GitHub again (github_user_123)
  → System looks up: github_user_123 → linked to Passport A
  → User logged in with Passport A

Result: 1 Passport, 3 login methods, 1 unified identity
```

---

## Architecture

### Database Schema

```sql
-- provider_identities table
id              UUID PRIMARY KEY
user_id         UUID FOREIGN KEY → user_profiles.id (Foundation Passport)
provider        TEXT (github, discord, google, roblox, ethereum, etc)
provider_user_id TEXT (unique ID from the OAuth provider)
provider_email  TEXT
provider_data   JSONB (avatar, username, name, etc)
linked_at       TIMESTAMP

-- Constraints:
UNIQUE(provider, provider_user_id)  -- One Discord ID maps to one Passport
UNIQUE(user_id, provider)           -- One user can only link one Discord account
```

### Federation Flow

#### First Login with Provider X

```
1. User clicks "Login with GitHub"
2. OAuth redirects to GitHub consent
3. GitHub returns code
4. Backend exchanges code for GitHub user info
5. Backend calls federateOAuthUser("github", githubUserData)
   a. Check provider_identities: provider=github, provider_user_id=githubId
   b. NOT FOUND (new user)
   c. Create new Foundation Passport (user_profiles)
   d. Insert provider_identity linking Passport → GitHub
   e. Return new Passport user_id
6. Backend creates Supabase auth session with Passport user_id
7. User logged in
```

#### Second Login with Different Provider Y (Same Person)

**Case A: Direct Provider Match**

```
1. User clicks "Login with Discord"
2. OAuth returns discord user data
3. Backend calls federateOAuthUser("discord", discordUserData)
   a. Check provider_identities: provider=discord, provider_user_id=discordId
   b. FOUND (existing link)
   c. Return linked Passport user_id (same as first login!)
4. User logged in with SAME Passport
```

**Case B: Email Match (Account Recovery)**

```
1. User lost GitHub password, tries "Login with Discord"
2. Discord email matches existing Passport email
3. System optionally creates new provider_identity link (optional feature)
4. User logs in with same Passport
```

---

## API Implementation

### Foundation Helper: `federateOAuthUser()`

```typescript
async function federateOAuthUser(
  provider: string,
  oauthUser: OAuthUser,
): Promise<FederationResult>;
```

**Logic:**

1. Look up `provider_identities` table
   - If found → return linked Passport user_id
   - If not found → create new Passport + provider link
2. Always returns same user_id for same provider
3. Enables multiple providers to link to same Passport

### OAuth Callback Updates

Each OAuth callback (GitHub, Discord, Google, Roblox, Ethereum) now:

```typescript
// 1. Get OAuth user data
const oauthUser = await getGitHubUser(accessToken);

// 2. Federate to Foundation Passport
const federation = await federateOAuthUser("github", {
  id: oauthUser.id,
  email: oauthUser.email,
  name: oauthUser.name,
  avatar: oauthUser.avatar_url,
});

// 3. Create Supabase session with Passport user_id
const session = await supabase.auth.signInWithPassword({
  email: federation.email,
  password: federation.user_id, // Use Passport ID as credential
});

// 4. Redirect to dashboard
redirect("/dashboard");
```

---

## Login Flow (Updated)

### Before (No Federation)

```
GitHub → GitHub auth session
Discord → Discord auth session (different user)
Google → Google auth session (different user)
```

### After (Federation)

```
GitHub → Federate to Foundation → Passport A session
Discord → Federate to Foundation → Passport A session (same)
Google → Federate to Foundation → Passport A session (same)
```

---

## User Experience

### First Time User (Multi-Provider)

```
1. User signs up with GitHub
   → Creates Passport, logs in

2. User logs out, wants to use Discord
   → Logs in with Discord
   → System recognizes Discord is new
   → System checks email
   → "Is this the same person?" option (optional)
   → Links Discord to existing Passport
   → Logs in with same Passport
```

### Existing User (Adding Providers)

```
1. User logged in via Dashboard
2. Goes to Settings → OAuth Connections
3. Clicks "Link Discord"
   → Discord auth flow
   → Backend links Discord to current Passport
   → Success message
4. User can now login with GitHub OR Discord (same account)
```

---

## Security Considerations

### Provider ID Collision (Prevented)

```sql
UNIQUE(provider, provider_user_id)
```

→ Prevents provider ID from linking to multiple Passports

### Account Takeover (Prevented)

```sql
UNIQUE(user_id, provider)
```

→ User can't link same provider twice
→ User can't have duplicate providers

### Email Verification (Recommended)

→ For auto-linking on email match, require email verification
→ Prevent account takeover via unverified email addresses

---

## Supported Providers

- **GitHub** - OAuth 2.0
- **Google** - OAuth 2.0
- **Discord** - OAuth 2.0
- **Roblox** - Custom OAuth
- **Ethereum** - Web3 (sign message)

All providers federate to Foundation Passports via `federateOAuthUser()`.

---

## Migration Path (Existing Users)

If you had existing users with separate GitHub/Discord/Google accounts:

```typescript
// One-time migration:
// For each user, find provider_identities for that user
// Check if multiple providers exist
// If yes, they're already federated (same passport)
// If no, no migration needed

// New users created after federation enabled:
// Automatically federated
```

---

## Benefits

✅ **One Identity** - Users have one Passport regardless of provider  
✅ **Flexible Login** - Users can switch between providers seamlessly  
✅ **Data Consistency** - No duplicate user records  
✅ **Security** - Prevents account fragmentation  
✅ **Future Growth** - Easy to add new OAuth providers  
✅ **Account Recovery** - Email-based recovery across providers

---

## References

- `code/api/_oauth-federation.ts` - Federation helper functions
- `code/supabase/migrations/20250115_oauth_federation.sql` - Database schema
- OAuth endpoints: `/api/github/oauth/callback`, `/api/discord/oauth/callback`, etc.
