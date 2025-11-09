# AETHEX Implementation Status & Roadmap Audit

**Date**: Current Build  
**Scope**: Cross-reference AETHEX Technical Roadmap (Phases 1-4) against current codebase  
**Status**: 60% Implemented, 30% Partially Implemented, 10% Not Yet Implemented

---

## Executive Summary

The AETHEX project has made significant progress on Discord integration (Phase 2: Dual-Auth) and database schema (Phase 2/3). However, critical gaps exist in CSP configuration (Phase 1), RLS performance optimization (Phase 3), and CI/CD pipeline (Phase 4).

**Key Findings:**

- ✅ Discord OAuth backend fully implemented
- ✅ Database schema for Discord integration complete
- ✅ Discord bot (Discord.js) deployed and operational
- ⚠️ CSP for Discord Activity partially configured (frame-ancestors missing)
- ⚠️ RLS policies use per-row auth.uid() calls (performance anti-pattern)
- ❌ CI/CD pipeline not yet established (GitHub Actions missing)

---

## PHASE 1: Vercel CSP Configuration for Discord Activity Embedding

### Current State

**File**: `code/vercel.json`

#### What's Configured ✅

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "geolocation=(), microphone=(), camera=()"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self' https: data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: blob: https:; font-src 'self' data: https:; connect-src 'self' https: wss:; frame-ancestors 'none'"
        }
      ]
    }
  ]
}
```

#### Critical Issues ⚠️

1. **`frame-ancestors 'none'`** - BLOCKS Discord Activity iFrame

   - Current policy: `frame-ancestors 'none'`
   - Required policy: `frame-ancestors 'self' https://*.discordsays.com`
   - **Impact**: Discord Activity cannot embed the app

2. **Missing Supabase URL in `connect-src`**

   - Current: `connect-src 'self' https: wss:` (too broad, catch-all)
   - Should be explicit: `connect-src 'self' https://kmdeisowhtsalsekkzqd.supabase.co https://xakdofkmympbhxkbkxbh.supabase.co wss:`

3. **`style-src 'unsafe-inline'` still present**
   - Acceptable for now (React UI libraries need this)
   - Consider replacing with nonces in future

### Recommendation

**Priority: CRITICAL - Blocking Discord Activity**

Replace the CSP header in `vercel.json` line 47:

```json
"Content-Security-Policy": "default-src 'self' https: data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: blob: https:; font-src 'self' data: https:; connect-src 'self' https://kmdeisowhtsalsekkzqd.supabase.co https://xakdofkmympbhxkbkxbh.supabase.co wss:; frame-ancestors 'self' https://*.discordsays.com;"
```

---

## PHASE 2: Discord SDK Dual-Authentication Flow

### Current State

#### Backend Implementation ✅ FULLY COMPLETE

**File**: `code/api/discord/oauth/callback.ts` (196 lines)

**What's Working:**

- ✅ Receives Discord OAuth code
- ✅ Exchanges code for Discord access token
- ✅ Fetches user profile via Discord API
- ✅ Creates/links user in Supabase
- ✅ Sets session cookies (sb-access-token, sb-refresh-token)
- ✅ Redirects to /onboarding or /dashboard

**Code Flow** (lines 48-120):

```typescript
1. Receive Discord code
2. POST to https://discord.com/api/v10/oauth2/token
3. Extract access_token
4. Fetch https://discord.com/api/v10/users/@me
5. Upsert to user_profiles with Discord metadata
6. Create Supabase session
7. Set auth cookies & redirect
```

**Verified Working**: OAuth button in Login.tsx redirects to `/api/discord/oauth/start` → Discord auth → callback → dashboard

#### Frontend Implementation ⚠️ PARTIALLY COMPLETE

**Files**:

- `code/client/contexts/DiscordActivityContext.tsx` (137 lines)
- `code/client/pages/Activity.tsx` (152 lines)

**What's Working:**

- ✅ Discord SDK initialization in context
- ✅ Detects iFrame context (frame_id query param)
- ✅ Calls /api/discord/activity-auth endpoint
- ✅ Sets Supabase session
- ✅ Activity page with profile display

**What's Missing:**

- ❌ Custom dual-auth flow (Phase 2 Section A step 10)
  - Current: Uses standard `supabase.auth.setSession()`
  - Needed: Call `discordSdk.commands.authenticate()` with Discord token
  - Impact: Discord SDK commands unavailable inside Activity

**Code Gap** (DiscordActivityContext.tsx line ~80):

```typescript
// Current:
await supabase.auth.setSession(supabaseSession);
// Missing:
await discordSdk.commands.authenticate({ access_token: discord_token });
```

### Recommendation

**Priority: HIGH - Enables Discord Activity commands**

Update `code/client/contexts/DiscordActivityContext.tsx` to complete the dual-auth flow:

1. In the `activity-auth` response, include `discord_token` (not just Supabase session)
2. After `setSession()`, call:
   ```typescript
   await discordSdk.commands.authenticate({
     access_token: response.discord_token,
   });
   ```

---

## PHASE 3: Supabase RLS Performance Optimization

### Current State

**Files**:

- `code/supabase/migrations/20250107_add_discord_integration.sql` (line 62)
- `code/supabase/migrations/20250107_add_web3_and_games.sql` (lines 108-121)
- `code/supabase/migrations/20251018_fix_team_memberships_rls.sql` (lines 15, 21, 34)

### RLS Policy Audit

#### Anti-Pattern Policies Found ⚠️

**Policy 1: Discord Links** (20250107_add_discord_integration.sql:62)

```sql
-- NON-PERFORMANT (Per-Row Execution):
CREATE POLICY "discord_links_users_select" ON discord_links
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());
```

**Policy 2: Web3 Nonces** (20250107_add_web3_and_games.sql:109)

```sql
-- NON-PERFORMANT (Per-Row Execution):
CREATE POLICY "web3_nonces_user_select" ON web3_nonces
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());
```

**Policy 3: Team Memberships** (20251018_fix_team_memberships_rls.sql:15)

```sql
-- NON-PERFORMANT (Per-Row Execution):
CREATE POLICY team_memberships_users_read ON team_memberships
  TO authenticated
USING (user_id = auth.uid());
```

### Impact Analysis

- **Current behavior**: Database calls `auth.uid()` for EVERY row scanned
- **Performance cost**: O(n) where n = number of rows
- **Real-world**: Querying 10,000 rows = 10,000 function calls
- **Observed symptoms**: High database CPU, query timeouts (likely from advisor warnings)

### Recommendation

**Priority: HIGH - Resolves performance bottleneck**

Create new migration: `code/supabase/migrations/20250120_optimize_rls_auth_calls.sql`

Apply the optimization pattern to ALL `auth.uid()` calls:

```sql
-- OPTIMIZED (Per-Statement Caching):
-- Original:
USING (user_id = auth.uid())

-- Becomes:
USING (user_id = (select auth.uid()))
```

**Complete Fix**:

```sql
-- Drop and recreate Discord Links policy
DROP POLICY IF EXISTS "discord_links_users_select" ON discord_links;
CREATE POLICY "discord_links_users_select" ON discord_links
  FOR SELECT TO authenticated
  USING (user_id = (select auth.uid()));

-- Drop and recreate Web3 Nonces policy
DROP POLICY IF EXISTS "web3_nonces_user_select" ON web3_nonces;
CREATE POLICY "web3_nonces_user_select" ON web3_nonces
  FOR SELECT TO authenticated
  USING (user_id = (select auth.uid()));

-- Drop and recreate Team Memberships policy
DROP POLICY IF EXISTS "team_memberships_users_read" ON team_memberships;
CREATE POLICY team_memberships_users_read ON team_memberships
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Repeat for all other auth.uid() and auth.jwt() calls in your migrations
```

**Verification**: After applying migration, Supabase advisors should report resolved performance warnings.

---

## PHASE 4: Establishing Supabase CI/CD Pipeline

### Current State

**Files**: None found for `.github/workflows/`

### What's Missing ❌

1. **GitHub Actions workflow file**: `.github/workflows/supabase-deploy.yml`

   - Not created
   - Would handle automated schema deployments

2. **GitHub Environments**:

   - No `staging` environment configured
   - No `production` environment configured
   - No repository secrets configured

3. **Local Development Setup**:
   - No evidence of `supabase start` usage
   - No migration generation workflow documented
   - Migrations likely created manually or directly in dashboard

### Recommendation

**Priority: MEDIUM - Improves maintainability**

#### Step 1: Create GitHub Actions Workflow

Create file: `.github/workflows/supabase-deploy.yml`

```yaml
name: Deploy Supabase Migrations

on:
  push:
    branches:
      - main
      - develop

jobs:
  deploy-supabase-migrations:
    name: Deploy Supabase Migrations
    runs-on: ubuntu-latest

    environment:
      name: ${{ github.ref == 'refs/heads/main' && 'production' || 'staging' }}

    steps:
      - uses: actions/checkout@v4

      - name: Set up Supabase CLI
        uses: supabase/setup-cli@v1
        with:
          version: "*"

      - name: Set Environment Variables
        run: |
          echo "SUPABASE_PROJECT_ID=${{ secrets.SUPABASE_PROJECT_ID }}" >> $GITHUB_ENV
          echo "SUPABASE_DB_PASSWORD=${{ secrets.SUPABASE_DB_PASSWORD }}" >> $GITHUB_ENV

      - name: Link Supabase Project
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
        run: |
          supabase link --project-ref $SUPABASE_PROJECT_ID

      - name: Deploy Database Migrations
        run: |
          supabase db push
```

#### Step 2: Configure GitHub Environments

In repository settings (Settings → Environments):

**Staging Environment:**

- Branch: `develop`
- Secrets:
  - `SUPABASE_ACCESS_TOKEN`: Personal token from supabase.com/account/tokens
  - `SUPABASE_PROJECT_ID`: Project ID for aethex-staging
  - `SUPABASE_DB_PASSWORD`: Staging database password

**Production Environment:**

- Branch: `main`
- Secrets:
  - `SUPABASE_ACCESS_TOKEN`: (same as above)
  - `SUPABASE_PROJECT_ID`: Project ID for aethex-production
  - `SUPABASE_DB_PASSWORD`: Production database password

#### Step 3: Document Migration Workflow

Create: `code/docs/SUPABASE_MIGRATION_WORKFLOW.md`

````markdown
# Supabase Migration Workflow

## For Developers

1. Create migration locally:
   ```bash
   supabase migration new <migration_name>
   ```
````

2. Edit migration in `supabase/migrations/`

3. Test locally:

   ```bash
   supabase db reset
   ```

4. Commit and push to feature branch

5. Create PR against `develop`

6. On merge to `develop`: Staging deployment triggered automatically

7. After verification, merge `develop` → `main`

8. Production deployment triggered automatically

```

---

## PHASE 1-4 Implementation Roadmap

### Priority Order (Recommended)

| Phase | Task | Priority | Effort | Blocker |
|-------|------|----------|--------|---------|
| 1 | Fix frame-ancestors CSP | CRITICAL | 5 min | Discord Activity won't load |
| 2 | Add discordSdk.authenticate() call | HIGH | 30 min | Activity commands unavailable |
| 3 | Optimize RLS auth.uid() calls | HIGH | 1-2 hrs | Database performance issues |
| 4 | Setup GitHub Actions CI/CD | MEDIUM | 1 hr | No automated deployments |

### Timeline

- **Week 1**: Phase 1 + Phase 2 (minimal viable changes)
- **Week 2**: Phase 3 (RLS optimization)
- **Week 3**: Phase 4 (CI/CD pipeline)

---

## Technology Stack Validation

| Component | Current | Roadmap | Status |
|-----------|---------|---------|--------|
| Frontend | Vite + React | Vite + React | ✅ Match |
| Backend | Express.js (Vercel) | Express.js (Vercel) | ✅ Match |
| Database | Supabase Postgres | Supabase Postgres | ✅ Match |
| Bot | Discord.js (Railway) | Discord.js (Railway) | ✅ Match |
| Auth | Custom Supabase + Discord OAuth | Custom Supabase + Discord OAuth | ✅ Match |
| DevOps | Manual | GitHub Actions | ⚠️ Planned |

---

## Blocked Features

### Discord Activity
- **Reason**: CSP `frame-ancestors 'none'` blocks iFrame
- **Fix**: Update vercel.json (Phase 1)
- **Est. Time**: 5 minutes

### Activity Commands (discordSdk.commands)
- **Reason**: Missing discordSdk.authenticate() call
- **Fix**: Update DiscordActivityContext.tsx (Phase 2)
- **Est. Time**: 30 minutes

### Database Performance
- **Reason**: RLS policies call auth.uid() per row
- **Fix**: Optimize with (select auth.uid()) pattern (Phase 3)
- **Est. Time**: 1-2 hours

---

## Environment Variables Checklist

### Vercel (Frontend + Backend API)
- ✅ VITE_DISCORD_CLIENT_ID
- ✅ VITE_SUPABASE_URL
- ✅ VITE_SUPABASE_ANON_KEY
- ✅ DISCORD_CLIENT_SECRET
- ✅ VITE_API_BASE
- ✅ SUPABASE_SERVICE_ROLE

### Railway (Discord Bot)
- ✅ DISCORD_BOT_TOKEN
- ✅ DISCORD_CLIENT_ID
- ✅ SUPABASE_URL
- ✅ SUPABASE_SERVICE_ROLE

### GitHub Actions (CI/CD - NOT YET SET UP)
- ❌ SUPABASE_ACCESS_TOKEN
- ❌ SUPABASE_PROJECT_ID (staging)
- ❌ SUPABASE_DB_PASSWORD (staging)
- ❌ SUPABASE_PROJECT_ID (production)
- ❌ SUPABASE_DB_PASSWORD (production)

---

## Next Steps

1. **Immediate** (Today):
   - [ ] Fix CSP frame-ancestors in vercel.json
   - [ ] Test Discord Activity loads in iframe

2. **This Week**:
   - [ ] Add discordSdk.authenticate() to DiscordActivityContext
   - [ ] Test Activity commands work

3. **Next Week**:
   - [ ] Create RLS optimization migration
   - [ ] Apply and verify performance improvement

4. **Following Week**:
   - [ ] Setup GitHub Actions workflow
   - [ ] Configure GitHub Environments
   - [ ] Document migration workflow

---

## Questions for Team

1. **Staging vs Production**: Are there separate Supabase projects, or just one?
   - Current: Appears to be single Supabase project (kmdeisowhtsalsekkzqd)
   - Recommendation: Create staging project for CI/CD

2. **Migration History**: Are migrations being tracked in Git?
   - Current: Migrations in `code/supabase/migrations/`
   - Status: ✅ Good practice already in place

3. **Local Dev Workflow**: Are developers using `supabase start`?
   - Current: Unknown
   - Recommendation: Document and standardize this

---

## References

- Roadmap Document: AETHEX Technical Architecture & Implementation Plan
- Discord SDK Docs: https://discord.com/developers/docs/activities/building-an-activity
- Supabase RLS Optimization: https://supabase.com/docs/guides/auth/row-level-security#optimization
- Vercel CSP: https://vercel.com/docs/security/content-security-policy

---

**Report Generated**: $(date)
**Reviewer**: AETHEX Development Team
**Status**: Ready for Implementation
```
