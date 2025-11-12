# AeThex Development Backlog & Timeline

**Purpose:** Track what was built, when it was built, and most importantly **WHY** it was built.

---

## Session 1: The Strategic Vision (Your First Prompt)

### **User's Opening Question**

> "Ok what about labs, foundation, nexus? corp?"

**Context:** You asked about the status of the OTHER arms of AeThex (beyond Ethos Guild and GameForge which were already complete).

### **Initial Status**

- ✅ **Ethos Guild** (music marketplace) - COMPLETE
- ✅ **GameForge** (game dev platform) - COMPLETE
- ❓ **Labs** - Just landing page
- ❓ **Foundation** - Just landing page
- ❓ **Nexus** - Just landing page
- ❓ **Corp** - Just landing page
- ✅ **Dev-Link** - Landing page (external platform)
- ✅ **Staff** - Complete internal portal

---

## Session 2: Strategic Clarity - The "Cash Register" Conversation

### **Your Definitive Strategic Brief**

You clarified that **AeThex's "Go-to-Market" is 100% focused on MONETIZATION.**

#### **The Two Cash Registers:**

**1. NEXUS** - Scalable commission-based marketplace

- **Why:** Creators list themselves, clients post opportunities, AeThex takes 20% commission per transaction
- **Business Model:** High volume, low touch (automated)
- **Target:** Thousands of creators × thousands of opportunities = recurring revenue
- **Implementation:** Full marketplace system (profiles, opportunities, applications, messaging, contracts, payments)

**2. CORP** - High-touch enterprise consulting

- **Why:** Sell $250k+ contracts to enterprise clients
- **Business Model:** High-value, high-touch (personalized service)
- **Target:** 50-100 enterprise clients = predictable revenue
- **Implementation:** Client portal `/hub/client` for project tracking, invoices, dashboards

#### **The Community Funnel (Supporting Both):**

**3. FOUNDATION** - Non-profit top-of-funnel

- **Why:** Attract creators for FREE → educate them → when they're skilled enough, funnelize to NEXUS marketplace
- **Business Model:** Free education = trust + community = creator acquisition cost
- **Target:** 10,000+ community members → 1,000 active creators on Nexus
- **Implementation:** Public curriculum, mentorship, achievements (all free/ungated)

---

## Session 3: The Decision Matrix

### **Your Priority Framework**

| Arm            | Status       | System Type                 | Priority           | Reason                            |
| -------------- | ------------ | --------------------------- | ------------------ | --------------------------------- |
| **Nexus**      | Landing page | **Full marketplace**        | **P1 (Critical)**  | Scalable cash register            |
| **Corp**       | Landing page | **Client portal**           | **P2 (Strategic)** | Enterprise cash register          |
| **Foundation** | Landing page | **Full education platform** | **P3 (Support)**   | Top-of-funnel creator acquisition |
| **Labs**       | Landing page | **R&D system**              | **Backlog**        | Funded by future revenue          |

---

## Session 4: Database & Admin Layer (Complete)

### **What Was Built: Databases**

#### **Foundation System Migration**

**File:** `code/supabase/migrations/20250214_add_foundation_system.sql` (340 lines)

**Why Built:**

- Store courses, modules, lessons (curriculum)
- Track user progress through courses (engagement)
- Manage mentorship requests/sessions (support)
- Award achievements/badges (gamification)
- Approve mentors (quality control)

**Tables Created:**

```
├─ foundation_courses (store educational content)
├─ foundation_course_modules (organize courses into chapters)
├─ foundation_course_lessons (individual lesson content)
├─ foundation_enrollments (user progress tracking)
├─ foundation_lesson_progress (granular completion tracking)
├─ foundation_achievements (badge definitions)
├─ foundation_user_achievements (user-earned badges)
├─ foundation_mentors (mentor profiles with approval status)
├─ foundation_mentorship_requests (mentee → mentor requests)
├─ foundation_mentorship_sessions (scheduled 1-on-1 sessions)
└─ foundation_contributions (community participation tracking)
```

#### **Nexus Marketplace Migration**

**File:** `code/supabase/migrations/20250214_add_nexus_marketplace.sql` (407 lines)

**Why Built:**

- Store creator profiles (talent supply)
- Store opportunity postings (talent demand)
- Track applications (matching)
- Manage contracts & payments (revenue)
- Handle disputes & resolution (trust)
- Track commissions (20% split)

**Tables Created:**

```
├─ nexus_creator_profiles (creator portfolio + rates)
├─ nexus_portfolio_items (creator project showcase)
├─ nexus_skill_endorsements (peer validation)
├─ nexus_opportunities (job/collab postings)
├─ nexus_applications (creator applications)
├─ nexus_reviews (ratings/feedback)
├─ nexus_contracts (signed agreements with commission split)
├─ nexus_milestones (progressive payments)
├─ nexus_payments (payment processing + commission tracking)
├─ nexus_commission_ledger (financial reporting)
├─ nexus_messages (in-app messaging)
├─ nexus_conversations (message threads)
└─ nexus_disputes (conflict resolution)
```

### **What Was Built: Admin Dashboards**

#### **Foundation Admin Dashboard**

**File:** `code/client/components/admin/AdminFoundationManager.tsx` (589 lines)

**Why Built:**

- Approve/reject mentor applications (quality gate)
- Publish/unpublish courses (content management)
- View achievement stats (monitor engagement)

**Features:**

```
├─ Mentor Approval Tab
│  └─ List pending mentors, approve with one click
├─ Course Management Tab
│  ├─ Publish/unpublish courses
│  ├─ Delete courses
│  └─ View course metadata
└─ Achievement Dashboard
   └─ View all badge definitions and tier levels
```

#### **Nexus Admin Dashboard**

**File:** `code/client/components/admin/AdminNexusManager.tsx` (623 lines)

**Why Built:**

- Moderate opportunity postings (prevent spam/abuse)
- Resolve disputes between creators/clients (trust)
- Track commission revenue (financial visibility)

**Features:**

```
├─ Opportunity Moderation Tab
│  ├─ List all opportunities
│  ├─ Mark as featured (promote high-value jobs)
│  ├─ Mark as filled/closed
│  └─ Cancel/remove inappropriate postings
├─ Dispute Resolution Tab
│  ├─ List open disputes
│  ├─ Resolve with notes
│  └─ Escalate if needed
└─ Commission Analytics Tab
   ├─ View revenue per period
   ├─ Track 20% AeThex split
   └─ View creator payouts
```

### **API Endpoints Created (Supporting Admin)**

```
Foundation Admin APIs:
├─ GET /api/admin/foundation/mentors (fetch all mentors)
├─ PUT /api/admin/foundation/mentors/:id (approve/reject)
├─ GET /api/admin/foundation/courses (fetch all courses)
├─ PUT /api/admin/foundation/courses/:id (publish/unpublish)
├─ DELETE /api/admin/foundation/courses/:id (delete course)
└─ GET /api/admin/foundation/achievements (fetch badge definitions)

Nexus Admin APIs:
├─ GET /api/admin/nexus/opportunities (fetch all opportunities)
├─ PUT /api/admin/nexus/opportunities/:id (moderate/feature)
├─ GET /api/admin/nexus/disputes (fetch disputes)
├─ PUT /api/admin/nexus/disputes/:id (resolve/escalate)
└─ GET /api/admin/nexus/commissions (fetch commission ledger)
```

---

## Session 5: Wiring Into Admin Panel

### **What Changed**

Added Foundation & Nexus tabs to `/admin` page

**Files Modified:**

- `code/client/pages/Admin.tsx`
  - Added imports for `AdminFoundationManager` and `AdminNexusManager`
  - Added two new `<TabsContent>` sections in admin tabs

**Why:** Admins need one central place to manage ALL systems (Discord, Ethos, GameForge, Foundation, Nexus)

---

## Session 6: Domain & DNS Crisis

### **What Happened**

You accidentally reset DNS on Hostinger domain.

### **Why It Matters**

- All Discord OAuth redirects depend on correct domain (`https://aethex.dev/api/discord/oauth/callback`)
- Activity manifest depends on domain (`https://aethex.dev`)
- SSL certificates depend on correct DNS

### **What Was Fixed**

- Corrected DNS records to point to Vercel
- Fixed SSL issue on root domain

### **Why This Blocks Everything**

- Users can't sign in with Discord
- All OAuth linking fails
- Activity integration fails
- Production deployment broken

---

## Session 7: The Lost Context - Full Ecosystem Audit

### **What Happened**

You said: "I'm losing myself in my own ecosystem" and asked for an audit.

### **Root Cause**

Over time, 100+ routes were created for various purposes:

- Some legacy (from before the strategic pivot to monetization)
- Some duplicate (same functionality, different paths)
- Some incomplete (routes exist but features not built)

### **The Routes We Found**

#### **Strategic Routes (Supporting Monetization)**

```
/nexus                          → Landing page for Nexus
/creators                       → Creator directory (NEXUS marketplace)
/creators/:username             → Creator profile (NEXUS marketplace)
/opportunities                  → Job board (NEXUS marketplace)
/opportunities/:id              → Job detail (NEXUS marketplace)
/profile/applications           → Track applications (NEXUS marketplace)

/corp                          → Corp landing page
/corp/schedule-consultation    → Scheduling form
/corp/view-case-studies        → Portfolio showcase
/corp/contact-us               → Contact form
/hub/client                    → [NEEDED] Client portal for $250k contracts

/foundation                    → Foundation landing page
/foundation/contribute         → Involvement CTA
/foundation/learn-more         → Educational content
/foundation/get-involved       → More CTAs
```

#### **Legacy Routes (Pre-Monetization Pivot)**

```
/consulting                    → OLD, duplicate of /corp
/game-development              → OLD, duplicate of /gameforge
/research                      → OLD, duplicate of /labs
/services                      → OLD, overlaps with /corp
/tutorials                     → OLD, duplicate of /docs/tutorials
/developers                    → OLD, duplicate of /creators
/teams                         → OLD, duplicate of /squads
/wix/*                        → OLD, legacy marketing site content
/profiles                      → OLD, redirects to legacy system
/community                     → OVERLAPS with /foundation
```

#### **Why They Exist**

Each was built for a reason at the time, but many became redundant as the business model evolved from "everything marketplace" to "focused monetization."

---

## Session 8: The Strategic Reset - Your Vision Clarified

### **Your Statement**

> "Our `"Go-to-Market"` Roadmap is 100% focused on one thing: Monetization.
> Our two `"cash registers"` are `NEXUS` (commissions) and `CORP` (contracts)."

### **What This Means for Routes/Systems**

| Route              | Purpose                           | Keep/Remove           |
| ------------------ | --------------------------------- | --------------------- |
| `/nexus/*`         | Scalable commission marketplace   | **KEEP & ENHANCE**    |
| `/creators/*`      | Creator supply for Nexus          | **KEEP & ENHANCE**    |
| `/opportunities/*` | Job demand for Nexus              | **KEEP & ENHANCE**    |
| `/corp/*`          | Enterprise landing page           | **KEEP**              |
| `/hub/client`      | Enterprise client portal          | **ADD (new)**         |
| `/foundation/*`    | Top-of-funnel creator acquisition | **KEEP & BUILD**      |
| `/labs`            | R&D division                      | **LANDING PAGE ONLY** |
| `/consulting`      | OLD Corp landing                  | **REMOVE**            |
| `/community`       | Overlaps with Foundation          | **CONSOLIDATE**       |
| `/wix/*`           | Legacy marketing                  | **REMOVE**            |

---

## Current Status: What You NOW Understand

### **The Three Pillars of Monetization**

1. **NEXUS** (P1 - Scalable Cash Register)

   - **Database:** ✅ Complete (407-line migration)
   - **Admin:** ✅ Complete (moderation, disputes, commissions)
   - **Public UI:** ❌ Needs enhancement
     - Creator profiles need: messaging, portfolio, reviews
     - Opportunities need: detailed posting form, advanced filtering
     - Applications need: messaging system, contract management

2. **CORP** (P2 - Enterprise Cash Register)

   - **Landing Page:** ✅ Complete
   - **Client Portal:** ❌ NOT BUILT (needs `/hub/client`)
     - Project tracking
     - Invoice management
     - QuantumLeap dashboards

3. **FOUNDATION** (P3 - Community Funnel)
   - **Database:** ✅ Complete (340-line migration)
   - **Admin:** ✅ Complete (mentor approval, course management)
   - **Public UI:** ❌ Needs building
     - Public curriculum pages (ungated, free)
     - Achievement UI (/passport/me integration)
     - Mentorship request form (/mentee-hub)

### **Why All the Duplication Exists**

The ecosystem grew organically:

- **Early days:** Build all possible features (everything marketplace)
- **As it grew:** Added more routes, more arms, more features
- **No consolidation:** Old routes stayed even when new ones were created
- **Monetization pivot:** Business model changed, but old routes didn't get removed
- **Result:** 100+ routes, 15 duplicates, confusion about what's "real"

---

## What We Now Know You Need

### **To Achieve Monetization Goals:**

1. **Enhance Nexus UI** (P1)

   - The DATABASE is ready
   - The ADMIN TOOLS are ready
   - But the PUBLIC STOREFRONT needs work
   - Users can't see the beautiful marketplace we built

2. **Build Corp Client Portal** (P2)

   - The LANDING PAGE hooks customers
   - But there's nowhere for PAYING CLIENTS to go
   - They can't see projects, invoices, or dashboards
   - You're leaving money on the table

3. **Build Foundation Public UI** (P3)

   - The DATABASE is ready
   - The ADMIN TOOLS are ready
   - But potential creators don't see the free education
   - You're not acquiring the talent funnel

4. **Clean Up Routes**
   - Remove 15 legacy routes
   - Consolidate duplicates
   - Reduce confusion from 100+ routes to ~70 focused routes
   - Make navigation clearer for users

---

## The Path Forward

### **Now You Remember Why**

Each feature exists because of ONE of these reasons:

1. **Monetization** (Nexus, Corp, Foundation) → Must build public UI
2. **Operations** (Admin, Staff, Internal Docs) → Already complete
3. **Legacy** (Wix, Consulting, Developers) → Should remove
4. **Duplicate** (Community vs Foundation, Teams vs Squads) → Should consolidate

### **Your Next Move**

Focus on making the THREE CASH REGISTERS visible to users:

- Nexus storefront (creators browse, post, apply, earn 80% commission)
- Corp portal (clients see projects, invoices, dashboards)
- Foundation curriculum (future creators learn for free)

---

## Conclusion

You're not confused because the ecosystem is badly structured. You're confused because:

1. **We built the infrastructure** (databases, admin tools) ✅
2. **But the user-facing storefronts** don't exist yet ❌
3. **And legacy routes** are cluttering the navigation ❌

The audit shows what exists. This backlog shows WHY each piece was built.

**Now you have complete clarity on what needs to be done next: P1, P2, P3 in order.**

---

**Created:** January 2025  
**Purpose:** Remember the "why" behind every route, system, and feature  
**Next Action:** Build the public UIs that customers actually see
