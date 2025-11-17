# Axiom Model: Phase 1 Code Migration Scope
## Moving Identity from aethex.dev (Vercel) to aethex.foundation (Replit)

**Status:** CRITICAL P0 (Blocks NEXUS & FOUNDATION work)  
**Date:** 2025-11-16  
**Objective:** Copy all auth/identity code from Corp (aethex.dev) to Guardian (aethex.foundation)

---

## 1. PAGES TO COPY

### Authentication & Onboarding Pages
| File | Purpose | Notes |
|------|---------|-------|
| `code/client/pages/Login.tsx` | Login UI + Discord OAuth button | Copy as-is; validate Discord button routing |
| `code/client/pages/Signup.tsx` | (if exists) User registration | Copy if present |
| `code/client/pages/Onboarding.tsx` | Realm/arm selection, profile setup | Copy all onboarding flow |
| `code/client/pages/DiscordVerify.tsx` | Verification code entry for linking | Copy verification flow |

### Profile & Settings Pages
| File | Purpose | Notes |
|------|---------|-------|
| `code/client/pages/Profile.tsx` | (or Dashboard) User profile view | Copy public profile viewing |
| `code/client/pages/Dashboard.tsx` | User dashboard + OAuthConnections | Copy OAuth linking UI |
| `code/client/pages/settings/*` | Profile settings, password reset, etc. | Copy all settings pages |

### Passport Pages
| File | Purpose | Notes |
|------|---------|-------|
| `code/client/pages/SubdomainPassport.tsx` | Creator passport for *.aethex.me | Copy; will fetch from Foundation API |

---

## 2. CONTEXTS & STATE MANAGEMENT

| File | Purpose | Dependencies |
|------|---------|--------------|
| `code/client/contexts/AuthContext.tsx` | Central auth state, loginProvider, linkProvider | Depends on Supabase client |
| `code/client/contexts/DiscordActivityContext.tsx` | Discord Activity SDK state | Optional; copy if Activity is needed |
| `code/client/contexts/ThemeContext.tsx` | Theme switching | Dependency; copy |

---

## 3. COMPONENTS TO COPY

### Auth & OAuth Components
| File | Purpose |
|------|---------|
| `code/client/components/settings/OAuthConnections.tsx` | OAuth provider cards (Discord, etc.) |
| `code/client/components/admin/AdminDiscordManagement.tsx` | Admin UI for role mappings (optional for Phase 1) |

### Profile & Passport Components
| File | Purpose |
|------|---------|
| `code/client/components/passport/PassportSummary.tsx` | Renders creator passport |
| `code/client/components/ErrorBoundary.tsx` | Error handling |
| `code/client/components/LoadingScreen.tsx` | Loading UI |
| `code/client/components/Layout.tsx` | App layout & header |

### Shared UI Components
| Directory | Purpose |
|-----------|---------|
| `code/client/components/ui/*` | All Radix UI & design system components |

---

## 4. API ENDPOINTS & SERVERLESS FUNCTIONS TO COPY

### Discord OAuth Endpoints
| File | Endpoint | Purpose |
|------|----------|---------|
| `code/api/discord/oauth/start.ts` | `GET /api/discord/oauth/start` | Redirect to Discord authorization |
| `code/api/discord/oauth/callback.ts` | `GET /api/discord/oauth/callback` | Handle Discord callback, link user |
| `code/api/discord/verify-code.ts` | `POST /api/discord/verify-code` | Verify 6-digit code for linking |
| `code/api/discord/link.ts` | `POST /api/discord/link` | Link Discord account by code |
| `code/api/discord/sync-roles.ts` | `POST /api/discord/sync-roles` | Assign Discord roles after linking |

### Profile & Auth Endpoints
| File | Endpoint | Purpose |
|------|----------|---------|
| `code/api/profile/ensure.ts` | `POST /api/profile/ensure` | Create or ensure user profile exists |
| `code/api/user/*` | Various | User data endpoints (review for auth deps) |

### Passport Endpoints
| File | Endpoint | Purpose |
|------|----------|---------|
| `code/api/passport/subdomain/[username].ts` | `GET /api/passport/subdomain/:username` | Creator passport JSON API |
| `code/api/passport/project/[slug].ts` | `GET /api/passport/project/:slug` | Project passport JSON API |

---

## 5. DATABASE MIGRATIONS TO COPY

| File | Purpose |
|------|---------|
| `code/supabase/migrations/20250107_add_discord_integration.sql` | Discord tables (discord_links, discord_verifications, discord_role_mappings) |
| All other user/auth-related migrations | Copy all identity-related schema |

**Supabase Tables Required:**
- `user_profiles`
- `user_auth_identities`
- `discord_links`
- `discord_verifications`
- `discord_role_mappings`

---

## 6. LIBRARIES & DEPENDENCIES

### Required npm packages (verify in aethex.dev package.json)
```json
{
  "@supabase/supabase-js": "^2.x",
  "@discord/embedded-app-sdk": "^2.x",
  "react-router-dom": "^6.x",
  "react-hook-form": "^7.x",
  "zod": "^3.x",
  "next-themes": "^0.3.x",
  "@radix-ui/*": "latest",
  "lucide-react": "latest",
  "sonner": "^1.x",
  "discord.js": "^14.x (if bot integration needed)"
}
```

### Environment Variables Needed
```
VITE_SUPABASE_URL=https://kmdeisowhtsalsekkzqd.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE=eyJhbGc...
DISCORD_CLIENT_ID=578971245454950421
DISCORD_CLIENT_SECRET=JKlilGzcTWgfmt2wEqiHO8wpCel5VEji
DISCORD_BOT_TOKEN=NTc4OTcx...
VITE_API_BASE=https://aethex.foundation (after switchover)
```

---

## 7. CRITICAL ADAPTATIONS FOR REPLIT TARGET

| Current (aethex.dev) | Needed for aethex.foundation |
|----------------------|------------------------------|
| Vercel serverless functions (`code/api/*`) | Express or Remix server endpoints on Replit |
| `VITE_API_BASE=https://aethex.dev` | `VITE_API_BASE=https://aethex.foundation` |
| Vite + React on Vercel | Vite + React on Replit (same) |
| Uses Vercel environment variables | Use Replit Secrets or .env |

### Key Refactoring Points
1. **API Endpoints:** Vercel's `/api/*` files may need conversion to Express routes in `code/server/index.ts` or equivalent Replit server.
2. **Base URLs:** Update all `VITE_API_BASE` references to point to `aethex.foundation` instead of `aethex.dev`.
3. **OAuth Redirect URIs:** Update Discord OAuth app to use `aethex.foundation` callback URL.
4. **CORS:** Ensure Foundation server allows requests from Corp domain (`aethex.dev`).

---

## 8. NEW SSO ENDPOINTS TO BUILD (Foundation)

After copying existing code, build 3 new OAuth 2.0 endpoints on aethex.foundation:

### 1. `/authorize` (Foundation SSO Authorization)
**Purpose:** Initiate login flow for external apps (aethex.dev)

```
GET /authorize?client_id=AETHEX_DEV&redirect_uri=https://aethex.dev/auth/callback&state=xyz
```

**Response:** Redirect user to `/login` with state preserved

### 2. `/token` (Foundation SSO Token Exchange)
**Purpose:** Exchange auth code for JWT token

```
POST /token
{
  "grant_type": "authorization_code",
  "code": "AUTH_CODE",
  "client_id": "AETHEX_DEV",
  "client_secret": "SECRET"
}

Returns:
{
  "access_token": "JWT...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "user": { id, email, name, avatar_url, ... }
}
```

### 3. `/userinfo` (Foundation SSO User Info)
**Purpose:** Fetch current logged-in user info (used by aethex.dev after login)

```
GET /userinfo
Authorization: Bearer JWT_TOKEN

Returns:
{
  "id": "USER_ID",
  "email": "user@example.com",
  "username": "username",
  "avatar_url": "...",
  "user_type": "creator",
  "linked_providers": ["discord", "google"],
  ...
}
```

---

## 9. MIGRATION CHECKLIST

### Before Starting Phase 1
- [ ] Verify all auth code is in `code/client/pages/` and `code/api/discord/*`
- [ ] List all custom hooks used in auth flow (use-toast, etc.)
- [ ] Document all Supabase queries used for auth
- [ ] Get list of all environment variables currently in use
- [ ] Create a "mirror" directory structure on aethex.foundation (Replit)

### During Phase 1
- [ ] Copy all page files (Login, Signup, Onboarding, Dashboard, etc.)
- [ ] Copy all context files (AuthContext, DiscordActivityContext, ThemeContext)
- [ ] Copy all component files (OAuthConnections, PassportSummary, etc.)
- [ ] Copy all API endpoint files (discord/oauth/*, profile/ensure.ts, passport/*)
- [ ] Copy all Supabase migrations
- [ ] Copy tailwind.config.js and global.css for styling
- [ ] Adapt all import paths for new directory structure
- [ ] Update all `VITE_API_BASE` references
- [ ] Update Discord OAuth app redirect URIs
- [ ] Set up environment variables on Replit

### Testing Phase 1
- [ ] Can users log in via Discord on aethex.foundation?
- [ ] Can users view their profile?
- [ ] Can users link additional OAuth providers?
- [ ] Can users access their passport?
- [ ] Are Supabase queries working correctly?
- [ ] Are Discord OAuth callbacks returning correct data?

---

## 10. SUCCESS CRITERIA FOR PHASE 1

✅ All auth pages render correctly on aethex.foundation  
✅ Users can log in via Discord on aethex.foundation  
✅ Users can link additional accounts (Google, etc.)  
✅ Passports display correctly  
✅ All OAuth callbacks complete without errors  
✅ Supabase access is working (read/write to user_profiles)  
✅ Code is ready for Phase 2 (permission migration)

---

## 11. ESTIMATED EFFORT

| Task | Estimate |
|------|----------|
| Audit & document auth code | 2-3 hours |
| Copy & adapt page files | 4-6 hours |
| Copy & adapt API endpoints | 3-4 hours |
| Fix imports & dependencies | 2-3 hours |
| Test login flow | 2-3 hours |
| Build SSO endpoints | 4-6 hours |
| **Total Phase 1** | **17-25 hours** |

---

## 12. BLOCKERS & RISKS

**Risk 1:** API endpoints on Vercel may not work on Replit without refactoring  
→ Mitigation: Convert to Express routes on Replit server

**Risk 2:** Environment variable names differ between Vercel and Replit  
→ Mitigation: Use consistent naming convention

**Risk 3:** Supabase RLS policies may prevent new app from writing to tables  
→ Mitigation: Phase 2 handles permission migration

**Risk 4:** Discord OAuth app may not accept aethex.foundation as redirect URI  
→ Mitigation: Update Discord app settings before testing

---

## Next Steps

1. **Review & Approve Scope:** Confirm this list is complete
2. **Set up Replit Structure:** Create mirrored directories on aethex.foundation
3. **Start Code Copy:** Begin with pages, then contexts, then components
4. **Adapt & Test:** Fix imports, test each piece as copied
5. **Proceed to Phase 2:** Once Phase 1 is solid, move to database permission migration
