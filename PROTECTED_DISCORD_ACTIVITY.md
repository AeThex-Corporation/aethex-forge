# 🔒 PROTECTED DISCORD ACTIVITY CODE INVENTORY

**⚠️ CRITICAL CONSTRAINT: The following files, routes, and systems are LOCKED and MUST NOT be modified during the aethex.dev developer platform refactoring.**

---

## 🔒 Protected API Endpoints

### Discord OAuth & Linking System
- 🔒 `/api/discord/oauth/start.ts` - Discord OAuth initiation
- 🔒 `/api/discord/oauth/callback.ts` - Discord OAuth callback handler
- 🔒 `/api/discord/link.ts` - Discord account linking
- 🔒 `/api/discord/create-linking-session.ts` - Linking session management
- 🔒 `/api/discord/verify-code.ts` - Discord verification code handler
- 🔒 `/api/discord/token.ts` - Discord token management
- 🔒 `/api/discord/activity-auth.ts` - Discord Activity authentication

**Why Protected:** These endpoints handle the complete Discord integration flow for user authentication, account linking, and Activity-based authentication. Any changes could break Discord bot commands (`/verify`) and OAuth flows.

---

## 🔒 Protected Client Routes (App.tsx)

### Discord Activity Routes
- 🔒 `/discord` → `<DiscordActivity />` component (Line 310)
- 🔒 `/discord/callback` → `<DiscordOAuthCallback />` component (Line 311-314)
- 🔒 `/discord-verify` → `<DiscordVerify />` component (Line 291-293)
- 🔒 `/profile/link-discord` → `<DiscordVerify />` component (Line 260-262)
- 🔒 `/activity` → `<Activity />` component (Line 308)

**Why Protected:** These routes are critical for Discord Activity functionality, OAuth callbacks, and account linking. The `/discord` route is specifically designed for Discord Activity embedded experiences.

---

## 🔒 Protected React Components

### Context Providers
- 🔒 `/client/contexts/DiscordContext.tsx` - Discord state management
- 🔒 `/client/contexts/DiscordActivityContext.tsx` - Discord Activity detection & state

### Page Components
- 🔒 `/client/pages/DiscordActivity.tsx` - Main Discord Activity experience
- 🔒 `/client/pages/DiscordOAuthCallback.tsx` - OAuth callback handler page
- 🔒 `/client/pages/DiscordVerify.tsx` - Discord account verification/linking page

**Why Protected:** These components implement the Discord Activity SDK integration and manage the specialized Discord-embedded experience. They include critical logic for detecting if the app is running inside Discord and adjusting the UI accordingly.

---

## 🔒 Protected Configuration Files

### Discord Manifest
- 🔒 `/public/discord-manifest.json` - Discord Activity configuration

**Contents:**
```json
{
  "id": "578971245454950421",
  "version": "1",
  "name": "AeThex Activity",
  "description": "AeThex Creator Network & Talent Platform - Discord Activity",
  "rpc_origins": [
    "https://aethex.dev",
    "https://aethex.dev/activity",
    "https://aethex.dev/discord",
    "http://localhost:5173"
  ]
}
```

**Why Protected:** This manifest is required for Discord to recognize and embed the Activity. The application ID and RPC origins are critical for Activity functionality.

### Environment Variables
- 🔒 `VITE_DISCORD_CLIENT_ID` - Discord application client ID
- 🔒 `DISCORD_CLIENT_SECRET` - Discord OAuth secret (server-side)
- 🔒 `DISCORD_REDIRECT_URI` - OAuth callback URL

**Reference:** `.env.discord.example`

**Why Protected:** These credentials are specific to the Discord Activity application and must remain consistent.

---

## 🔒 Protected App.tsx Integration Points

### Provider Wrapper Structure (Lines 178-185)
```tsx
<DiscordActivityProvider>
  <SessionProvider>
    <DiscordProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}>
          <DiscordActivityWrapper>
            {/* App content */}
          </DiscordActivityWrapper>
```

**Why Protected:** The nesting order of these providers is critical. `DiscordActivityProvider` must wrap everything to detect Activity mode, and `DiscordProvider` manages Discord SDK initialization.

### DiscordActivityWrapper Component (Lines 165-177)
```tsx
const DiscordActivityWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isActivity } = useDiscordActivity();
  
  if (isActivity) {
    return <DiscordActivityLayout>{children}</DiscordActivityLayout>;
  }
  
  return <>{children}</>;
};
```

**Why Protected:** This wrapper conditionally applies Activity-specific layouts when running inside Discord, ensuring proper display in the embedded environment.

---

## 🔒 Protected Documentation Files

The following 14+ Discord-related documentation files exist and should be **CONSOLIDATED** (not deleted) as part of the developer platform refactoring:

### Critical Setup & Configuration Docs
- `DISCORD-ACTIVITY-SETUP.md` - Initial setup guide
- `DISCORD-ACTIVITY-DEPLOYMENT.md` - Deployment instructions
- `DISCORD-PORTAL-SETUP.md` - Discord Developer Portal configuration
- `DISCORD-OAUTH-SETUP-VERIFICATION.md` - OAuth verification checklist

### Implementation & Technical Docs
- `DISCORD-ACTIVITY-SPA-IMPLEMENTATION.md` - SPA mode implementation details
- `DISCORD-ACTIVITY-DIAGNOSTIC.md` - Diagnostic tools and debugging
- `DISCORD-ACTIVITY-TROUBLESHOOTING.md` - Common issues and solutions
- `DISCORD-COMPLETE-FLOWS.md` - Complete user flow documentation

### OAuth & Linking System Docs
- `DISCORD-LINKING-FIXES-APPLIED.md` - Historical fixes for linking flow
- `DISCORD-LINKING-FLOW-ANALYSIS.md` - Technical analysis of linking system
- `DISCORD-OAUTH-NO-AUTO-CREATE.md` - OAuth behavior documentation
- `DISCORD-OAUTH-VERIFICATION.md` - OAuth verification guide

### Bot & Admin Docs
- `DISCORD-ADMIN-COMMANDS-REGISTRATION.md` - Bot command registration
- `DISCORD-BOT-TOKEN-FIX.md` - Bot token configuration fixes

**⚠️ CONSOLIDATION PLAN:**
These 14 documents should be consolidated into 3 comprehensive guides:
1. **discord-integration-guide.md** (Getting Started)
2. **discord-activity-reference.md** (Technical Reference)
3. **discord-deployment.md** (Production Guide)

**Rule:** Archive originals in `/docs/archive/discord/`, don't delete.

---

## ✅ Safe to Modify (Boundaries)

While Discord Activity code is protected, you **CAN** modify:

### Navigation & Layout
- ✅ Add Discord routes to new developer platform navigation
- ✅ Update global navigation styling (as long as Discord pages remain accessible)
- ✅ Add breadcrumbs that include Discord routes

### Documentation Reference
- ✅ Create API reference documentation that **documents** (but doesn't modify) Discord endpoints
- ✅ Link to Discord integration guides from new developer docs
- ✅ Create tutorials that use Discord Activity as an example

### Design System
- ✅ Apply new design system components to non-Discord pages
- ✅ Update Tailwind config (Discord components will inherit global styles)
- ✅ Update theme colors (Discord Activity will adapt via CSS variables)

### Authentication
- ✅ Integrate Discord OAuth with new developer dashboard (read-only, display linked status)
- ✅ Show Discord connection status in new profile settings

---

## 🚫 NEVER DO

- ❌ Rename Discord routes (`/discord`, `/discord-verify`, `/discord/callback`)
- ❌ Modify Discord API endpoint logic (`/api/discord/*`)
- ❌ Change Discord context provider structure
- ❌ Remove or reorder `DiscordActivityProvider` or `DiscordProvider`
- ❌ Modify Discord manifest file
- ❌ Change Discord environment variable names
- ❌ Delete Discord documentation (archive instead)
- ❌ Refactor Discord Activity components
- ❌ Remove Discord Activity detection logic

---

## 🔒 Protected Dependencies

The following NPM packages are critical for Discord Activity and must remain:

- `@discord/embedded-app-sdk` (if used) - Discord Activity SDK
- Discord OAuth libraries (check package.json)

**Action Required:** Verify exact Discord dependencies in `package.json`

---

## ✅ Refactoring Strategy

**Safe Approach:**
1. ✅ Build new developer platform **AROUND** Discord Activity
2. ✅ Create new routes (`/dashboard`, `/docs`, `/api-reference`) that don't conflict
3. ✅ Add Discord Activity as a **featured integration** in new docs
4. ✅ Link from developer dashboard to existing Discord pages
5. ✅ Consolidate documentation into 3 guides, archive originals

**Example Safe Structure:**
```
/                           ← New developer platform landing
/docs                       ← New docs system
  /docs/integrations/discord ← Links to protected Discord docs
/api-reference              ← New API reference
  /api-reference/discord    ← Documents (read-only) Discord APIs
/dashboard                  ← New developer dashboard
/sdk                        ← New SDK distribution pages

🔒 /discord                 ← PROTECTED - Discord Activity page
🔒 /discord-verify          ← PROTECTED - Discord verification
🔒 /activity                ← PROTECTED - Activity alias
🔒 /api/discord/*           ← PROTECTED - All Discord API endpoints
```

---

## 📋 Pre-Refactor Verification Checklist

Before making ANY changes, verify these items work:

- [ ] Discord Activity loads at `/discord`
- [ ] Discord OAuth flow works (try logging in via Discord)
- [ ] `/verify` command in Discord bot creates working links
- [ ] Dashboard "Link Discord" button works
- [ ] Discord connection shows in profile settings
- [ ] Discord manifest serves at `/discord-manifest.json`

**If any of these fail, DO NOT PROCEED with refactoring until fixed.**

---

## 🎯 Summary

**Protected Files Count:**
- 7 API endpoints
- 5 client routes
- 3 React page components
- 2 context providers
- 1 manifest file
- 3 environment variables
- 14+ documentation files

**Golden Rule:**
> "Refactoring can happen AROUND Discord Activity, but never TO it."

**Emergency Contact:**
If Discord Activity breaks during refactoring, immediately:
1. Git revert to last working commit
2. Check this document for what was changed
3. Verify all protected files are intact
4. Test the pre-refactor verification checklist

---

**Document Version:** 1.0  
**Created:** January 7, 2026  
**Last Updated:** January 7, 2026  
**Status:** ACTIVE PROTECTION
