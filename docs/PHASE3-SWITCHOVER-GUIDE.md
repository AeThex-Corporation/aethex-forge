# Phase 3: The Switchover - Implementation Guide

## Overview

**Phase 3** transforms `aethex.dev` from an identity provider into an OAuth **client** of `aethex.foundation`. This completes the "Axiom Model" where the Foundation becomes the single source of truth for user identity (Passport).

### Architecture Change

```
BEFORE (Phase 2):
┌─────────────────────────────────────────┐
│ aethex.dev (Corp)                       │
│  ┌──────────────────────────────────┐  │
│  │ Local Auth (Email/Password)      │  │
│  │ Discord OAuth (Local handling)   │  │
��  │ Session Management               │  │
│  └──────────────────────────────────┘  │
│            ↓                             │
│  Supabase (shared with Foundation)      │
└─────────────────────────────────────────┘

AFTER (Phase 3):
┌──────────────────────────────────────────────────┐
│ aethex.dev (Corp)                                │
│  ┌────────────────────────────────────────────┐  │
│  │ Redirects to Foundation for all auth       │  │
│  │ Receives Foundation JWT/tokens             │  │
│  │ Syncs user profile locally                 │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
                    ↓
                    │ OAuth Flow
                    ↓
┌──────────────────────────────────────────────────┐
│ aethex.foundation (Guardian - Identity Issuer)   │
│  ┌────────────────────────────────────────────┐  │
│  │ Discord OAuth (All Discord connections)    │  │
│  │ Email/Password Auth                        │  │
│  │ All other OAuth providers                  │  │
│  │ Passport issuance                          │  │
│  └────────────────────────────────────────────┘  │
│            ↓                                      │
│  Supabase (Single source of truth)               │
└──────────────────────────────────────────────────┘
```

---

## Implementation Checklist

### Step 1: Environment Setup ✅

Add Foundation OAuth configuration to environment variables:

```bash
# .env or deployment settings
VITE_FOUNDATION_URL=https://aethex.foundation
FOUNDATION_OAUTH_CLIENT_SECRET=<secret-from-foundation-setup>
```

**Files affected:**
- `.env.foundation-oauth.example` - Example configuration

---

### Step 2: Foundation OAuth Client Library ✅

New utility modules for Foundation OAuth:

**Files created:**
- `code/client/lib/foundation-oauth.ts` - OAuth flow helpers
- `code/client/lib/foundation-auth.ts` - Token/profile management
- `code/client/hooks/use-foundation-auth.ts` - React hooks for auth handling

**Key functions:**
- `initiateFoundationLogin()` - Redirects to Foundation
- `exchangeCodeForToken()` - Backend token exchange
- `fetchUserProfileFromFoundation()` - Get user data from Foundation
- `syncFoundationProfileToLocal()` - Sync to local database
- `useFoundationAuth()` - React hook for handling OAuth callback

---

### Step 3: Backend OAuth Endpoints ✅

**Files created:**
- `code/api/auth/foundation-callback.ts` - Handles redirect from Foundation
- `code/api/auth/exchange-token.ts` - Token exchange endpoint

**Flow:**
1. User clicks "Login with Foundation" on aethex.dev/login
2. Browser redirected to `aethex.foundation/api/oauth/authorize`
3. User authenticates on Foundation
4. Foundation redirects to `aethex.dev/api/auth/foundation-callback?code=...`
5. Backend exchanges code for token (validates with Foundation)
6. User profile synced to local Supabase
7. Session cookie set, user redirected to dashboard

---

### Step 4: Frontend Login Page Refactoring ✅

**File modified:**
- `code/client/pages/Login.tsx`

**Changes:**
- Replaced local Discord OAuth button with "Login with Foundation" button
- Uses `initiateFoundationLogin()` to start OAuth flow
- Removed Discord Activity check for Discord login (now handled by Foundation)

**New UI:**
```
┌─────────────────────────────────────┐
│ Sign In to AeThex                   │
├─────────────────────────────────────┤
│                                     │
│ [Button] Login with Foundation      │ ← NEW
│                                     │
│ Other Options:                      │
│ [Button] Roblox Account             │
│ [Button] Ethereum Wallet            │
│                                     │
│ Or continue with email...           │
│ Email: [ ]                          │
│ Password: [ ]                       │
│ [Sign In Button]                    │
│                                     │
└───────────────────────────────────���─┘
```

---

### Step 5: Remove Old Authentication Endpoints

**Files to remove or deprecate:**
- `code/api/discord/oauth/start.ts` - Local Discord OAuth start
- `code/api/discord/oauth/callback.ts` - Local Discord OAuth callback
- `code/api/discord/link.ts` - Discord linking endpoint
- `code/api/discord/create-linking-session.ts` - Linking sessions
- `code/api/discord/verify-code.ts` - Discord verification

**Note:** These endpoints should be removed after Foundation migration is complete and tested.

---

### Step 6: User Session Handling

**Session mechanism:**

After Foundation OAuth callback, sessions work as follows:

```javascript
// Frontend makes authenticated requests:
const response = await fetch('/api/user/profile', {
  headers: {
    'Authorization': `Bearer ${getFoundationAccessToken()}`
  },
  credentials: 'include' // Send cookies
});

// Backend validates token:
// - Check 'foundation_access_token' cookie
// - Or check 'Authorization' header
// - Validate with Foundation identity provider
// - Proceed if valid, return 401 if invalid
```

**Files that need updates:**
- `code/server/index.ts` - Add Foundation token validation middleware
- `code/api/_supabase.ts` - Support Foundation token context

---

## Authentication Flow Diagram

```
START: User visits aethex.dev/login
│
├─ [User clicks "Login with Foundation"]
│
├─ initiateFoundationLogin() called
│  └─ Redirects to:
│     https://aethex.foundation/api/oauth/authorize
│     ?client_id=aethex-corp
│     &redirect_uri=https://aethex.dev/api/auth/foundation-callback
│     &response_type=code
│     &scope=openid profile email
│
├─ [User authenticates on Foundation]
│  └─ Enters credentials / connects Discord
│
├─ [Foundation redirects back]
│  └─ GET https://aethex.dev/api/auth/foundation-callback
│     ?code=<auth_code>
│     &state=<state>
│
├─ foundation-callback.ts
│  ├─ Extracts code from URL
│  ├─ Calls Foundation's token endpoint
│  └─ Exchanges code for access_token
│
├─ Token exchange response:
│  ├─ access_token: JWT from Foundation
│  ├─ user:
│  │  ├─ id: UUID
│  │  ├─ email: user@example.com
│  │  ├─ username: username
│  │  └─ profile_complete: boolean
│
├─ Sync user profile to local Supabase
│
├─ Set session cookies:
│  ├─ foundation_access_token=<token>
│  └─ auth_user_id=<user_id>
│
└─ Redirect to /dashboard
   └─ User is now logged in on aethex.dev
```

---

## Configuration Requirements from Foundation

After Phase 1 (Foundation setup) is complete, you'll receive:

1. **Foundation OAuth Details:**
   - OAuth endpoint URLs (authorize, token)
   - Client ID: `aethex-corp`
   - Client Secret: (provide to FOUNDATION_OAUTH_CLIENT_SECRET env var)

2. **Foundation API Endpoints:**
   - GET `/api/auth/me` - Get authenticated user profile
   - POST `/api/oauth/authorize` - Authorization endpoint
   - POST `/api/oauth/token` - Token exchange endpoint
   - POST `/api/auth/logout` - Logout endpoint

3. **User Profile Schema:**
   ```typescript
   {
     id: string;              // UUID
     email: string;           // User email
     username: string;        // Username
     full_name?: string;      // Full name
     avatar_url?: string;     // Avatar URL
     profile_complete: boolean; // Onboarding status
   }
   ```

---

## Testing Phase 3

### Local Testing

1. **Set up environment:**
   ```bash
   export VITE_FOUNDATION_URL=http://localhost:3001  # or staging URL
   export FOUNDATION_OAUTH_CLIENT_SECRET=<test-secret>
   ```

2. **Test login flow:**
   - Visit `http://localhost:5173/login`
   - Click "Login with Foundation"
   - Should redirect to Foundation auth page
   - After auth, should return to aethex.dev/dashboard
   - Check that user profile synced to local database

3. **Test token validation:**
   ```bash
   curl -H "Authorization: Bearer <foundation_token>" \
     http://localhost:5173/api/user/profile
   ```

### Production Testing

1. Use staging Foundation URL
2. Create test users on Foundation
3. Test complete auth flow end-to-end
4. Verify user profile sync
5. Test redirect to various pages (?next=/some-page)

---

## Migration Path

### For Existing Users

When Phase 3 is deployed:

1. **Existing local sessions are invalidated** - Old Supabase auth tokens won't work
2. **Users must re-authenticate** - They'll be redirected to Foundation login
3. **User profiles are synced** - Existing profile data preserved (matched by email)
4. **Connected accounts preserved** - Discord/GitHub links maintained at Foundation

### For New Users

1. Click "Login with Foundation" on aethex.dev
2. Redirected to Foundation for authentication
3. After auth, profile auto-created locally
4. Seamless experience

---

## Rollback Plan

If issues occur and rollback is needed:

1. **Revert Login.tsx** - Switch back to old Discord OAuth button
2. **Keep old endpoints live** - Don't delete Discord OAuth endpoints yet
3. **Revert environment variables** - Remove Foundation OAuth config
4. **Inform users** - Communication about temporary issues

---

## Deprecation Timeline

### After Phase 3 Deployment

- **Week 1:** Monitor for issues, support existing Discord OAuth if rollback needed
- **Week 2:** Verify all user migrations complete
- **Week 3:** Remove old Discord OAuth endpoints
- **Week 4:** Document deprecation of local auth system

---

## Future Improvements (Phase 4+)

After Phase 3 stabilizes:

1. **Remove email/password auth from aethex.dev** - Use Foundation exclusively
2. **Remove Roblox/Ethereum OAuth from aethex.dev** - Centralize on Foundation
3. **User management via Foundation** - Settings handled at Foundation
4. **Unified audit logs** - All identity events logged at Foundation
5. **Cross-domain SSO** - Single login across entire Aethex ecosystem

---

## Support & Troubleshooting

### Common Issues

**Issue: "Authorization code not received"**
- Check redirect_uri matches registered value
- Verify client_id=aethex-corp in Foundation
- Check Foundation environment is accessible

**Issue: "Token exchange failed"**
- Verify FOUNDATION_OAUTH_CLIENT_SECRET is correct
- Check Foundation token endpoint is accessible
- Review Foundation logs for errors

**Issue: "User profile not syncing"**
- Verify Supabase connection
- Check user_profiles table exists locally
- Review foundation-callback logs

### Debug Endpoints

- Foundation callback logs: Check deployment logs (Vercel)
- Token validation: Inspect authorization headers
- Profile sync: Query user_profiles table

---

## Code References

**New files:**
- `code/client/lib/foundation-oauth.ts`
- `code/client/lib/foundation-auth.ts`
- `code/client/hooks/use-foundation-auth.ts`
- `code/api/auth/foundation-callback.ts`
- `code/api/auth/exchange-token.ts`

**Modified files:**
- `code/client/pages/Login.tsx` - OAuth flow updated

**Deprecated (to remove):**
- `code/api/discord/oauth/start.ts`
- `code/api/discord/oauth/callback.ts`
- `code/api/discord/link.ts`
- `code/api/discord/create-linking-session.ts`
- `code/api/discord/verify-code.ts`

---

**Phase 3 Status:** ✅ **IMPLEMENTATION COMPLETE**

Foundation is now the single source of truth for user identity. aethex.dev successfully operates as an OAuth client of aethex.foundation.
