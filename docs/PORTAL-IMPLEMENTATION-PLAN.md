# Portal Implementation Plan

> **Scope:** Fix Client Portal, Build Staff Onboarding, Build Candidate Portal
> **Foundation:** Informational only (redirects to aethex.foundation)

---

## 1. CLIENT PORTAL FIX (4 Pages)

### Current State
- `ClientHub.tsx` - ✅ Working (745 lines)
- `ClientDashboard.tsx` - ✅ Working (709 lines)
- `ClientProjects.tsx` - ✅ Working (317 lines)
- `ClientContracts.tsx` - ❌ 56-line stub
- `ClientInvoices.tsx` - ❌ 56-line stub
- `ClientReports.tsx` - ❌ 56-line stub
- `ClientSettings.tsx` - ❌ 56-line stub

### Build Out

#### ClientContracts.tsx
```
Features:
- Contract list with status (Draft, Active, Completed, Expired)
- Contract details view (scope, terms, milestones)
- Document preview/download (PDF)
- E-signature integration placeholder
- Amendment history
- Filter by status/date

API: /api/corp/contracts (already exists)
```

#### ClientInvoices.tsx
```
Features:
- Invoice list with status (Pending, Paid, Overdue)
- Invoice detail view (line items, tax, total)
- Payment history
- Download invoice PDF
- Pay now button (Stripe integration)
- Filter by status/date range

API: /api/corp/invoices (already exists)
```

#### ClientReports.tsx
```
Features:
- Project progress reports
- Time tracking summaries
- Budget vs actual spending
- Milestone completion rates
- Export to PDF/CSV
- Date range selector

API: /api/corp/analytics/summary (stub - needs build)
```

#### ClientSettings.tsx
```
Features:
- Company profile (name, logo, address)
- Team member access management
- Notification preferences
- Billing information
- API keys (if applicable)
- Account deletion

API: /api/user/profile-update (exists)
```

---

## 2. STAFF ONBOARDING PORTAL (New)

### New Pages
```
client/pages/staff/
├── StaffOnboarding.tsx        # Main onboarding hub
├── StaffOnboardingChecklist.tsx  # Interactive checklist
├── StaffOnboardingProgress.tsx   # Progress tracker
└── StaffOnboardingResources.tsx  # Quick links & docs
```

### StaffOnboarding.tsx - Main Hub
```
Sections:
1. Welcome Banner (personalized with name, start date, manager)
2. Progress Ring (% complete)
3. Current Phase (Day 1 / Week 1 / Month 1)
4. Quick Actions:
   - Complete checklist items
   - Meet your team
   - Access resources
   - Schedule 1-on-1
```

### StaffOnboardingChecklist.tsx - Interactive Checklist
```
Day 1:
☐ Complete HR paperwork
☐ Set up workstation
☐ Join Discord server
☐ Meet your manager
☐ Review company handbook

Week 1:
☐ Complete security training
☐ Set up development environment
☐ Review codebase architecture
☐ Attend team standup
☐ Complete first small task

Month 1:
☐ Complete onboarding course
☐ Contribute to first sprint
☐ 30-day check-in with manager
☐ Set Q1 OKRs
☐ Shadow a senior dev

Features:
- Check items to mark complete
- Progress saves to database
- Manager can view progress
- Automatic reminders
- Achievement unlocks
```

### Database Schema (New)
```sql
CREATE TABLE staff_onboarding_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  checklist_item TEXT NOT NULL,
  phase TEXT NOT NULL, -- 'day1', 'week1', 'month1'
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### API Endpoints (New)
```
GET  /api/staff/onboarding          # Get user's progress
POST /api/staff/onboarding/complete # Mark item complete
GET  /api/staff/onboarding/admin    # Manager view of team progress
```

---

## 3. CANDIDATE PORTAL (New)

### New Pages
```
client/pages/candidate/
├── CandidatePortal.tsx       # Main dashboard
├── CandidateProfile.tsx      # Profile builder
├── CandidateApplications.tsx # Enhanced MyApplications
├── CandidateInterviews.tsx   # Interview scheduler
└── CandidateOffers.tsx       # Offer tracking
```

### CandidatePortal.tsx - Dashboard
```
Sections:
1. Application Stats
   - Total applications
   - In review
   - Interviews scheduled
   - Offers received

2. Quick Actions
   - Browse opportunities
   - Update profile
   - View applications
   - Check messages

3. Recent Activity
   - Application status changes
   - Interview invites
   - New opportunities matching skills

4. Recommended Jobs
   - Based on skills/interests
```

### CandidateProfile.tsx - Profile Builder
```
Sections:
1. Basic Info (from user profile)
2. Resume/CV Upload
3. Portfolio Links (GitHub, Behance, etc.)
4. Skills & Expertise (tags)
5. Work History
6. Education
7. Availability & Rate (if freelancer)
8. Profile completeness meter

Features:
- Import from LinkedIn (future)
- Public profile URL
- Privacy settings
```

### CandidateApplications.tsx - Enhanced
```
Improvements over MyApplications:
- Timeline view of application journey
- Communication thread with employer
- Document attachments
- Interview scheduling integration
- Offer acceptance workflow
```

### CandidateInterviews.tsx
```
Features:
- Upcoming interviews list
- Calendar integration
- Video call links
- Interview prep resources
- Feedback after interview
- Reschedule option
```

### Database Schema (New)
```sql
CREATE TABLE candidate_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  resume_url TEXT,
  portfolio_urls JSONB DEFAULT '[]',
  work_history JSONB DEFAULT '[]',
  education JSONB DEFAULT '[]',
  skills TEXT[] DEFAULT '{}',
  availability TEXT, -- 'immediate', '2_weeks', '1_month'
  desired_rate DECIMAL(10,2),
  profile_completeness INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE candidate_interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES aethex_applications(id),
  candidate_id UUID REFERENCES auth.users(id),
  employer_id UUID REFERENCES auth.users(id),
  scheduled_at TIMESTAMPTZ,
  duration_minutes INTEGER DEFAULT 30,
  meeting_link TEXT,
  status TEXT DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled', 'rescheduled'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### API Endpoints (New)
```
GET  /api/candidate/profile         # Get candidate profile
POST /api/candidate/profile         # Create/update profile
POST /api/candidate/resume          # Upload resume
GET  /api/candidate/interviews      # Get scheduled interviews
POST /api/candidate/interviews      # Schedule interview
GET  /api/candidate/recommendations # Job recommendations
```

---

## 4. FOUNDATION - INFORMATIONAL ONLY

### Current State
- `Foundation.tsx` - Landing page
- `FoundationDashboard.tsx` - Placeholder dashboard

### Changes
```
FoundationDashboard.tsx:
- Remove dashboard functionality
- Show informational content about Foundation programs
- Add prominent CTA: "Visit aethex.foundation for full experience"
- Redirect links to aethex.foundation

Or simply redirect /foundation/dashboard → aethex.foundation
```

---

## IMPLEMENTATION ORDER

### Phase 1: Client Portal (Quick Wins)
1. `ClientContracts.tsx` - Build full contract management
2. `ClientInvoices.tsx` - Build full invoice management
3. `ClientReports.tsx` - Build reporting dashboard
4. `ClientSettings.tsx` - Build settings page

### Phase 2: Candidate Portal
1. Database migration for candidate_profiles, candidate_interviews
2. `CandidatePortal.tsx` - Main dashboard
3. `CandidateProfile.tsx` - Profile builder
4. `CandidateApplications.tsx` - Enhanced applications
5. `CandidateInterviews.tsx` - Interview management
6. API endpoints

### Phase 3: Staff Onboarding
1. Database migration for staff_onboarding_progress
2. `StaffOnboarding.tsx` - Main hub
3. `StaffOnboardingChecklist.tsx` - Interactive checklist
4. API endpoints
5. Manager admin view

### Phase 4: Foundation Cleanup
1. Update FoundationDashboard to informational
2. Add redirects to aethex.foundation

---

## FILE CHANGES SUMMARY

### New Files (12)
```
client/pages/candidate/CandidatePortal.tsx
client/pages/candidate/CandidateProfile.tsx
client/pages/candidate/CandidateApplications.tsx
client/pages/candidate/CandidateInterviews.tsx
client/pages/candidate/CandidateOffers.tsx
client/pages/staff/StaffOnboarding.tsx
client/pages/staff/StaffOnboardingChecklist.tsx
api/candidate/profile.ts
api/candidate/interviews.ts
api/staff/onboarding.ts
supabase/migrations/YYYYMMDD_add_candidate_portal.sql
supabase/migrations/YYYYMMDD_add_staff_onboarding.sql
```

### Modified Files (5)
```
client/pages/hub/ClientContracts.tsx (rebuild)
client/pages/hub/ClientInvoices.tsx (rebuild)
client/pages/hub/ClientReports.tsx (rebuild)
client/pages/hub/ClientSettings.tsx (rebuild)
client/pages/dashboards/FoundationDashboard.tsx (simplify)
```

---

## ESTIMATED EFFORT

| Component | Files | Complexity |
|-----------|-------|------------|
| Client Portal Fix | 4 | Medium |
| Candidate Portal | 6 | High |
| Staff Onboarding | 4 | Medium |
| Foundation Cleanup | 1 | Low |
| **Total** | **15** | |

Ready to implement?
