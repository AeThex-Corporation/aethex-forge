# AeThex Flow Status Inventory

> **Generated:** 2026-01-03
> **Total Flows Identified:** 53
> **Complete:** 46 | **Partial:** 6 | **Unfinished:** 1

---

## Quick Reference: Unfinished Flows

| Priority | Flow | Status | Blocking? |
|----------|------|--------|-----------|
| P1 | Discord Activity CSP Configuration | BLOCKING | Yes |
| P2 | Discord Activity SDK Authentication | INCOMPLETE | No |
| P3 | Email Verification Flow | NOT IMPLEMENTED | No |
| P4 | Mentorship UI Implementation | PARTIAL | No |
| P5 | Creator Network Enhancement | PARTIAL | No |
| P6 | Client Portal (`/hub/client`) | NOT BUILT | No |
| P7 | Login/Onboarding Profile Handling | NEEDS REFINEMENT | No |

---

## 1. Authentication & OAuth Flows

### Flow 1.1: Discord OAuth Login Flow
- **Status:** COMPLETE
- **Entry Point:** `/login` page -> "Continue with Discord" button
- **Files:**
  - `client/pages/Login.tsx`
  - `api/discord/oauth/start.ts`
  - `api/discord/oauth/callback.ts`
- **Database:** `discord_links`, `user_profiles`, `auth.users`

### Flow 1.2: Discord Account Linking Flow (from Dashboard)
- **Status:** COMPLETE
- **Entry Point:** `/dashboard?tab=connections` -> "Link Discord" button
- **Files:**
  - `client/pages/Dashboard.tsx`
  - `client/contexts/AuthContext.tsx`
  - `api/discord/create-linking-session.ts`
  - `api/discord/oauth/callback.ts`
- **Database:** `discord_linking_sessions`, `discord_links`

### Flow 1.3: Discord Verification Code Flow
- **Status:** COMPLETE
- **Entry Point:** Discord bot `/verify` command
- **Files:**
  - `client/pages/DiscordVerify.tsx`
  - `api/discord/verify-code.ts`
- **Database:** `discord_verifications`, `discord_links`

### Flow 1.4: Discord Activity (Embedded SPA)
- **Status:** PARTIAL - UNFINISHED
- **Entry Point:** Discord Activity context menu
- **Files:**
  - `client/pages/Activity.tsx`
  - `client/contexts/DiscordActivityContext.tsx`
  - `api/discord/activity-auth.ts`
- **Issues:**
  1. **CSP BLOCKING:** `frame-ancestors 'none'` in `vercel.json` blocks Discord iframe
  2. **Missing SDK Auth:** `discordSdk.commands.authenticate()` not called
- **Fix Required:**
  - Update `vercel.json` line 47: Change to `frame-ancestors 'self' https://*.discordsays.com`
  - Add Discord SDK authentication in `DiscordActivityContext.tsx`

### Flow 1.5: Foundation OAuth Callback
- **Status:** COMPLETE
- **Files:**
  - `api/auth/foundation-callback.ts`
  - `api/auth/callback.ts`

### Flow 1.6: GitHub/Google OAuth Callbacks
- **Status:** COMPLETE
- **Files:**
  - `api/github/oauth/callback.ts`
  - `api/google/oauth/callback.ts`

### Flow 1.7: Email/Password Login
- **Status:** COMPLETE
- **Files:**
  - `client/pages/Login.tsx`
  - `api/auth/exchange-token.ts`

---

## 2. User Onboarding & Profile Flows

### Flow 2.1: Multi-Step Onboarding Flow
- **Status:** COMPLETE
- **Entry Point:** `/onboarding` page
- **Steps:** 8-step wizard
  1. Choose User Type (game-developer, client, member, customer)
  2. Personal Information
  3. Experience Level
  4. Interests & Goals
  5. Choose Realm/Arm
  6. Follow Arms
  7. Creator Profile Setup
  8. Welcome/Finish
- **Files:**
  - `client/pages/Onboarding.tsx`
  - `client/components/onboarding/*.tsx`
- **Database:** `user_profiles`, `user_interests`, `creator_profiles`, `followed_arms`, `achievements`, `notifications`

### Flow 2.2: Login -> Onboarding Redirect Flow
- **Status:** PARTIAL - NEEDS REFINEMENT
- **Files:**
  - `client/pages/Login.tsx`
  - `client/pages/Dashboard.tsx`
- **Issue:** Users shown as "logged in" before profile fully loads
- **Documentation:** `docs/LOGIN-ONBOARDING-REDIRECT-ANALYSIS.md`

---

## 3. Notification Flows

### Flow 3.1: Comprehensive Notification System
- **Status:** COMPLETE (20 notification types)
- **Files:**
  - `server/index.ts`
  - `client/lib/notification-triggers.ts`
  - `client/lib/aethex-database-adapter.ts`
  - `api/_notifications.ts`
  - `client/components/notifications/NotificationBell.tsx`
- **Notification Types:**
  1. Achievements unlocked
  2. Team creation
  3. Added to team
  4. Project creation
  5. Added to project
  6. Project completed
  7. Project started
  8. Level up
  9. Onboarding complete
  10. Account linked (OAuth)
  11. Email verified
  12. Post liked
  13. Post commented
  14. Endorsement received
  15. New follower
  16. Task assigned
  17. Application received
  18. Application status changed
  19. New device login
  20. Moderation report
- **Database:** `notifications` with real-time subscriptions

---

## 4. Discord Bot Command Flows

### Flow 4.1-4.5: Discord Bot Commands
- **Status:** COMPLETE
- **Commands:**
  1. `/verify` - generates verification code
  2. `/set-realm [arm]` - updates user's primary arm
  3. `/profile` - shows user's AeThex profile card
  4. `/unlink` - removes Discord linking
  5. `/verify-role` - shows/assigns Discord roles
- **Files:**
  - `api/discord/interactions.ts`
- **Database:** `discord_links`, `discord_role_mappings`, `discord_user_roles`

---

## 5. Business Process Flows

### Flow 5.1: Opportunity Posting & Application Flow
- **Status:** COMPLETE
- **Files:**
  - `client/pages/opportunities/OpportunityPostForm.tsx`
  - `client/pages/opportunities/OpportunityDetail.tsx`
  - `client/pages/opportunities/OpportunitiesHub.tsx`
  - `api/applications.ts`
- **Database:** `aethex_opportunities`, `aethex_applications`

### Flow 5.2: Mentorship Application Flow
- **Status:** PARTIAL - UNFINISHED
- **Files:**
  - `client/pages/community/MentorApply.tsx`
  - `client/pages/community/MentorProfile.tsx`
  - `client/pages/community/MentorshipRequest.tsx`
  - `client/pages/MentorshipPrograms.tsx`
- **Issue:** Database schema complete, UI needs enhancement
- **Database:** `mentorship_profiles`, `mentorship_requests`

### Flow 5.3: Creator Network Flow
- **Status:** PARTIAL - UNFINISHED
- **Files:**
  - `client/pages/creators/CreatorDirectory.tsx`
  - `client/pages/creators/CreatorProfile.tsx`
  - `api/creators.ts`
- **Issue:** Basic directory exists, needs Nexus feature integration (messaging, contracts, payments, 20% commission)
- **Database:** `creator_profiles`

### Flow 5.4: GameForge Project Management & Task Workflow
- **Status:** COMPLETE
- **Files:**
  - `client/pages/Projects.tsx`
  - `client/pages/ProjectsNew.tsx`
  - `client/pages/ProjectBoard.tsx`
  - `client/pages/ProjectsAdmin.tsx`
- **Task States:** `todo -> in_progress -> in_review -> done` (or `blocked`)
- **Database:** `gameforge_projects`, `gameforge_tasks`

### Flow 5.5: Team & Project Creation
- **Status:** COMPLETE
- **Files:**
  - `client/pages/Teams.tsx`
  - `client/pages/Squads.tsx`

---

## 6. Payment & Subscription Flows

### Flow 6.1: Stripe Subscription Checkout
- **Status:** COMPLETE
- **Files:**
  - `api/subscriptions/create-checkout.ts`
  - `client/pages/Pricing.tsx`
- **Tiers:** Pro ($9/month), Council ($29/month)

### Flow 6.2: Stripe Webhook Processing
- **Status:** COMPLETE
- **Files:**
  - `api/subscriptions/webhook.ts`

### Flow 6.3: Payout Setup Flow
- **Status:** COMPLETE
- **Files:**
  - `api/nexus/payments/payout-setup.ts`

---

## 7. Email & Verification Flows

### Flow 7.1: Email Verification
- **Status:** NOT IMPLEMENTED - UNFINISHED
- **Documentation:** Listed as "future implementation" in `docs/COMPLETE-NOTIFICATION-FLOWS.md`
- **Required Work:**
  - Implement email verification endpoint
  - Add verification email template
  - Create verification confirmation page
  - Trigger notification on verification

### Flow 7.2: Password Reset
- **Status:** COMPLETE
- **Files:**
  - `client/pages/ResetPassword.tsx`

---

## 8. Ethos Guild (Music/Audio) Flows

### Flow 8.1: Artist Verification Workflow
- **Status:** COMPLETE
- **Files:**
  - `api/ethos/verification.ts`
  - `client/pages/AdminEthosVerification.tsx`
- **Database:** `ethos_verification_requests`, `ethos_verification_audit_log`

### Flow 8.2: Track Upload & Licensing Flow
- **Status:** COMPLETE
- **Files:**
  - `client/pages/ArtistProfile.tsx`
  - `client/pages/ArtistSettings.tsx`
  - `client/pages/TrackLibrary.tsx`
  - `client/pages/LicensingDashboard.tsx`
- **Database:** `ethos_tracks`, `ethos_licensing_agreements`, `ethos_artist_profiles`, `ethos_guild_members`

---

## 9. Internal Operations Flows

### Flow 9.1: Ownership & Routing Flow (Corp/Foundation)
- **Status:** COMPLETE
- **Documentation:** `client/pages/internal-docs/Space1OwnershipFlows.tsx`
- **Routing:**
  - `/foundation/*` -> `aethex.foundation`
  - `/gameforge/*` -> `aethex.foundation/gameforge`
  - `/labs/*` -> `aethex.studio`
  - `/nexus/*` -> `aethex.dev`
  - `/corp/*` -> `aethex.dev`

### Flow 9.2: Staff/Admin Workflows
- **Status:** COMPLETE
- **Files:**
  - `client/pages/Staff.tsx`
  - `client/pages/StaffAdmin.tsx`
  - `client/pages/StaffChat.tsx`
  - `client/pages/StaffDocs.tsx`

### Flow 9.3: Achievement & XP System
- **Status:** COMPLETE
- **Files:**
  - `api/achievements/activate.ts`
  - `api/achievements/award.ts`
  - `client/pages/Activity.tsx`
- **Database:** `achievements`, `user_xp`, `leaderboards`

### Flow 9.4: Discord Activity Rich Features
- **Status:** PARTIAL - RECENTLY ENHANCED
- **Files:** `client/pages/Activity.tsx`
- **Features:** XP rings, leaderboards, quick polls, job postings, quick apply, event calendar

---

## 10. Data Pipeline & Processing Flows

### Flow 10.1: Analytics Summary Flow
- **Status:** COMPLETE
- **Files:**
  - `api/corp/analytics/summary.ts`

### Flow 10.2: Content Sync Flows
- **Status:** COMPLETE
- **Files:**
  - `client/pages/DocsSync.tsx`

### Flow 10.3: Payment Confirmation Flow
- **Status:** COMPLETE
- **Files:**
  - `api/nexus/payments/confirm-payment.ts`
  - `api/nexus/payments/webhook.ts`

---

## 11. Client Portal Flows

### Flow 11.1: Client Hub System
- **Status:** NOT BUILT - UNFINISHED
- **Entry Point:** `/hub/client`
- **Files (exist but incomplete):**
  - `client/pages/ClientHub.tsx`
  - `client/pages/ClientProjects.tsx`
  - `client/pages/ClientInvoices.tsx`
  - `client/pages/ClientContracts.tsx`
  - `client/pages/ClientSettings.tsx`
- **Required Work:**
  - Complete client dashboard UI
  - Implement project tracking for clients
  - Add invoice management
  - Contract viewing/signing functionality

---

## Summary by Status

### COMPLETE (46 flows)
All authentication flows (except Discord Activity), onboarding, notifications, Discord bot commands, opportunity management, GameForge, teams, payments, Ethos Guild, staff/admin, analytics.

### PARTIAL (6 flows)
1. **Discord Activity** - CSP blocking, missing SDK auth
2. **Login/Onboarding Redirect** - Needs UX refinement
3. **Mentorship UI** - DB done, UI incomplete
4. **Creator Network** - Basic exists, needs Nexus features
5. **Discord Activity Features** - Recently enhanced, ongoing work
6. **Client Portal** - Pages exist but incomplete

### NOT IMPLEMENTED (1 flow)
1. **Email Verification** - Listed as future implementation

---

## Recommended Priority Order

1. **Discord Activity CSP Fix** - BLOCKING, prevents Discord Activity from working
2. **Discord Activity SDK Auth** - Required for full Discord integration
3. **Email Verification** - Security/compliance requirement
4. **Mentorship UI** - User-facing feature incomplete
5. **Creator Network Enhancement** - Revenue-generating feature
6. **Client Portal** - Business workflow incomplete
7. **Login/Onboarding UX** - Polish and refinement

---

## Related Documentation

- `docs/DISCORD-COMPLETE-FLOWS.md` - Discord flow details
- `docs/COMPLETE-NOTIFICATION-FLOWS.md` - Notification system
- `docs/IMPLEMENTATION_STATUS_ROADMAP_AUDIT.md` - Implementation status
- `docs/LOGIN-ONBOARDING-FIXES-APPLIED.md` - Auth flow fixes
- `docs/DISCORD-LINKING-FIXES-APPLIED.md` - Discord linking
- `docs/ECOSYSTEM_AUDIT_AND_CONSOLIDATION.md` - Route audit
- `docs/ETHOS_GUILD_IMPLEMENTATION.md` - Music/audio flows
