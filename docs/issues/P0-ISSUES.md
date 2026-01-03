# P0 Priority Issues (Fix ASAP)

These are critical issues that should be addressed immediately.

---

## Issue 1: [P0] Fix onboarding progress loss on page refresh

**Labels:** `bug`, `P0`, `onboarding`, `user-experience`

### Problem
Users lose all onboarding progress when they refresh the page during the multi-step onboarding flow. This leads to high dropout rates and poor user experience.

### Current Behavior
- User starts onboarding at `/onboarding`
- User completes steps 1-4 of 8-step wizard
- User refreshes page (accidentally or intentionally)
- All progress is lost, user starts from step 1 again

### Root Cause
Session storage persistence was removed from `client/pages/Onboarding.tsx:238-243`. Progress is now only stored in memory (React state), which is lost on page refresh.

### Expected Behavior
- Progress should be saved to sessionStorage after each step
- On page load, check sessionStorage for existing progress
- If found, restore user to their last completed step
- Clear sessionStorage only after successful onboarding completion

### Technical Details
- **File:** `client/pages/Onboarding.tsx`
- **Lines:** 238-243 (where persistence was removed)
- **State to persist:** `currentStep`, `formData`, `userType`

### Implementation Approach
1. Re-enable sessionStorage persistence with key like `aethex_onboarding_progress`
2. Save state after each step completion
3. On component mount, check for existing progress
4. Restore state if found
5. Add recovery UI: "Continue where you left off?" prompt
6. Clear storage on successful completion

### Acceptance Criteria
- [ ] Progress persists across page refreshes
- [ ] User can resume from last completed step
- [ ] Storage is cleared after onboarding completes
- [ ] Works across browser tabs (same session)
- [ ] Handles edge cases (corrupted data, version changes)

### Impact
- **High onboarding dropout rate**
- **Poor first-time user experience**
- **Lost user data and effort**

---

## Issue 2: [P0] Complete Stripe payment integration

**Labels:** `bug`, `P0`, `payments`, `backend`, `stripe`

### Problem
The payment flow UI exists but Stripe integration may not be fully implemented. Users cannot upgrade to Pro/Council tiers, preventing monetization.

### Current Behavior
- Pricing page at `/pricing` shows subscription tiers
- "Upgrade" buttons exist for Pro ($9/mo) and Council ($29/mo)
- Clicking upgrade attempts to call `/api/subscriptions/create-checkout`
- Integration status unknown - needs verification

### Missing/Incomplete Features
1. **Stripe Checkout Session Creation**
   - Verify `/api/subscriptions/create-checkout` endpoint works
   - Ensure proper price IDs are configured
   - Test redirect flow

2. **Webhook Handlers**
   - `checkout.session.completed` - Create subscription in DB
   - `customer.subscription.updated` - Update tier changes
   - `customer.subscription.deleted` - Handle cancellations
   - `invoice.payment_failed` - Handle failed payments

3. **Billing Portal**
   - "Manage Subscription" button should open Stripe portal
   - Verify `/api/subscriptions/manage` endpoint
   - Test cancellation and plan changes

4. **Database Sync**
   - Update `profiles.tier` on successful payment
   - Track subscription status in DB
   - Store Stripe customer ID and subscription ID

### Technical Details
- **Files:**
  - `client/pages/Pricing.tsx` (UI)
  - `server/index.ts` or `api/subscriptions/*` (backend)
  - Stripe webhooks configuration
- **Environment Variables Needed:**
  - `STRIPE_SECRET_KEY`
  - `STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - Price IDs for Pro and Council tiers

### Implementation Checklist
- [ ] Verify Stripe API keys are configured
- [ ] Create/verify product and price IDs in Stripe
- [ ] Implement create-checkout endpoint
- [ ] Implement manage-subscription endpoint
- [ ] Set up webhook endpoint
- [ ] Add webhook handlers for all events
- [ ] Test full checkout flow
- [ ] Test subscription management flow
- [ ] Test cancellation flow
- [ ] Add error handling and retry logic

### Testing Scenarios
1. New user upgrades from Free → Pro
2. Pro user upgrades to Council
3. Council user cancels subscription
4. Payment fails, retry logic
5. User changes payment method
6. User views billing history

### Acceptance Criteria
- [ ] Users can successfully upgrade to Pro tier
- [ ] Users can successfully upgrade to Council tier
- [ ] Subscription status syncs to database
- [ ] Billing portal opens and works correctly
- [ ] Webhooks properly handle all events
- [ ] Failed payments are handled gracefully
- [ ] Users can cancel subscriptions

### Impact
- **Cannot monetize the platform**
- **No paid tier access for users**
- **Revenue loss**

---

## Issue 3: [P0] Refactor large components (Feed, ProfilePassport, AuthContext)

**Labels:** `tech-debt`, `P0`, `refactoring`, `performance`

### Problem
Several components exceed 900+ lines, making them difficult to maintain, test, and debug. This increases bug risk and slows development velocity.

### Affected Components

#### 1. AuthContext.tsx (1,246 lines)
**Location:** `client/contexts/AuthContext.tsx`

**Current Responsibilities:** (Too many)
- Session management
- OAuth flow handling
- Email resolution logic
- Profile fetching
- Multiple provider linking
- Error handling
- Loading states
- Storage clearing

**Refactoring Approach:**
- Split into multiple contexts:
  - `AuthContext` - Core auth state only
  - `SessionContext` - Session management
  - `OAuthContext` - OAuth providers
  - `ProfileContext` - User profile data
- Extract services:
  - `authService.ts` - Auth API calls
  - `sessionService.ts` - Session operations
  - `oauthService.ts` - OAuth flows

#### 2. Feed.tsx (958 lines)
**Location:** `client/pages/Feed.tsx`

**Current Responsibilities:**
- Feed filtering logic
- Post rendering
- Comment handling
- Like/unlike logic
- Follow/unfollow logic
- Trending topics
- Sidebar widgets
- Infinite scroll

**Refactoring Approach:**
- Extract components:
  - `FeedFilters.tsx` - Filter bar
  - `FeedList.tsx` - Post list with infinite scroll
  - `FeedSidebar.tsx` - Sidebar widgets
  - `TrendingTopics.tsx` - Trending widget
  - `SuggestedCreators.tsx` - Suggested follows
- Extract hooks:
  - `useFeedPosts.ts` - Post fetching logic
  - `useFeedFilters.ts` - Filter state
  - `usePostInteractions.ts` - Like/comment logic

#### 3. ProfilePassport.tsx (916 lines)
**Location:** `client/pages/ProfilePassport.tsx`

**Current Responsibilities:**
- Profile data fetching
- Achievements display
- Projects showcase
- Social connections
- Following/followers
- Ethos Guild integration
- Arm affiliations
- Degree of connection calculation

**Refactoring Approach:**
- Extract components:
  - `PassportHeader.tsx` - Avatar, name, bio
  - `PassportStats.tsx` - XP, level, streak
  - `PassportAchievements.tsx` - Badges/achievements
  - `PassportProjects.tsx` - Project showcase
  - `PassportSocial.tsx` - Followers/following
  - `PassportConnections.tsx` - Connection graph
- Extract hooks:
  - `usePassportData.ts` - Profile fetching
  - `useConnectionDegree.ts` - Connection calculation

### Benefits of Refactoring
- **Easier maintenance** - Smaller files easier to understand
- **Better testability** - Can test components in isolation
- **Improved performance** - Better code splitting opportunities
- **Faster development** - Changes are localized
- **Reduced bugs** - Less complexity = fewer edge cases

### Implementation Strategy
1. Start with AuthContext (highest impact)
2. Create new smaller contexts/services
3. Migrate logic incrementally
4. Maintain backward compatibility during migration
5. Add tests for each new component
6. Remove old code once fully migrated

### Acceptance Criteria
- [ ] AuthContext split into 4 smaller contexts
- [ ] Feed.tsx split into 6+ components
- [ ] ProfilePassport.tsx split into 7+ components
- [ ] All functionality still works
- [ ] No regressions in user experience
- [ ] Code coverage maintained or improved

### Impact
- **Slower development velocity**
- **Higher bug risk**
- **Difficult onboarding for new developers**
- **Poor code maintainability**

---

## Issue 4: [P0] Add comprehensive error tracking (Sentry integration)

**Labels:** `infrastructure`, `P0`, `monitoring`, `error-tracking`

### Problem
Errors are currently logged to console but not tracked or monitored. This means:
- Production errors go unnoticed
- No visibility into user-impacting issues
- Difficult to debug production problems
- No error analytics or trends

### Current Error Handling
- `console.error()` scattered throughout codebase
- Toast notifications for some errors
- No centralized error tracking
- No error grouping or deduplication
- No user context attached to errors

### Proposed Solution
Integrate Sentry for comprehensive error tracking and monitoring.

### Implementation Checklist

#### 1. Install Dependencies
```bash
npm install @sentry/react @sentry/tracing
```

#### 2. Initialize Sentry
**File:** `client/main.tsx`
```typescript
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
  beforeSend(event, hint) {
    // Filter out dev environment if needed
    if (import.meta.env.MODE === 'development') {
      return null;
    }
    return event;
  },
});
```

#### 3. Add Error Boundary
Wrap app with Sentry ErrorBoundary:
```typescript
<Sentry.ErrorBoundary fallback={<ErrorFallback />}>
  <App />
</Sentry.ErrorBoundary>
```

#### 4. Set User Context
In AuthContext, add:
```typescript
Sentry.setUser({
  id: user.id,
  email: user.email,
  username: user.username,
});
```

#### 5. Add Breadcrumbs
Track important user actions:
```typescript
Sentry.addBreadcrumb({
  category: 'navigation',
  message: 'Navigated to profile',
  level: 'info',
});
```

#### 6. Capture Exceptions
Replace console.error with:
```typescript
try {
  // risky operation
} catch (error) {
  Sentry.captureException(error, {
    tags: { component: 'Onboarding' },
    extra: { step: currentStep },
  });
  toast.error('Something went wrong');
}
```

### Features to Enable
- [x] Error tracking
- [x] Performance monitoring
- [x] User feedback widget
- [x] Release tracking
- [x] Source maps upload
- [x] Session replay (optional)

### Configuration Required
- **Environment Variable:** `VITE_SENTRY_DSN`
- **Sentry Project:** Create project at sentry.io
- **Source Maps:** Configure upload in build process

### Acceptance Criteria
- [ ] Sentry SDK installed and initialized
- [ ] All uncaught errors tracked
- [ ] User context attached to errors
- [ ] Important actions logged as breadcrumbs
- [ ] Source maps uploaded for readable stack traces
- [ ] Error alerts configured
- [ ] Team can view errors in Sentry dashboard

### Impact
- **Unknown production error rate**
- **Difficult debugging**
- **Poor user experience** (users encounter bugs we don't know about)
- **No data-driven prioritization** of bugs

---

## Issue 5: [P0] Add input validation to all forms

**Labels:** `bug`, `P0`, `forms`, `validation`, `user-experience`

### Problem
Forms lack comprehensive client-side validation, leading to:
- Poor user experience (errors only shown after submission)
- Invalid data sent to API
- Confusing error messages
- Higher API error rates

### Affected Forms

#### 1. Onboarding Forms
**Files:** `client/components/onboarding/*.tsx`

**Missing Validation:**
- **PersonalInfo:**
  - Name: Required, min 2 chars
  - Email: Valid email format, required
  - Company: Optional, max 100 chars
- **Experience:**
  - Skills: Required, at least 1 skill
  - Experience level: Required
- **Interests:**
  - Primary goals: Required, at least 1
- **RealmSelection:**
  - Realm: Required selection

#### 2. Profile Editing
**File:** `client/pages/Dashboard.tsx` (Profile tab)

**Missing Validation:**
- Display name: Required, 2-50 chars
- Bio: Optional, max 500 chars
- Website URL: Valid URL format
- Social links: Valid URL formats
- GitHub: Valid GitHub username format

#### 3. Authentication Forms
**File:** `client/pages/Login.tsx`

**Missing Validation:**
- Email: Required, valid format
- Password: Required, min 6 chars (current), should be min 8 chars
- Password confirmation: Must match password

#### 4. Post Composer
**File:** `client/components/feed/PostComposer.tsx`

**Missing Validation:**
- Content: Required, min 1 char, max 5000 chars
- Image URL: Valid URL if provided
- Links: Valid URL format

### Recommended Validation Library
Use **React Hook Form** + **Zod** for type-safe validation:

```bash
npm install react-hook-form zod @hookform/resolvers
```

### Implementation Example

#### Define Schema (Zod)
```typescript
// schemas/onboarding.ts
import { z } from 'zod';

export const personalInfoSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  company: z.string().max(100).optional(),
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
```

#### Use in Component
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personalInfoSchema } from '@/schemas/onboarding';

function PersonalInfo() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(personalInfoSchema),
  });

  const onSubmit = (data) => {
    // Data is validated
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}
    </form>
  );
}
```

### Validation Rules by Field Type

#### Email
- Required
- Valid email format (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- Max 255 chars

#### Password
- Required
- Min 8 chars (update from current 6)
- Must contain: uppercase, lowercase, number
- Max 128 chars

#### URLs
- Valid URL format
- Must start with http:// or https://
- Optional fields can be empty

#### Text Fields
- Trim whitespace
- Min/max length based on field
- No HTML injection (sanitize)

#### Usernames
- Alphanumeric + underscores/hyphens
- 3-20 characters
- Not reserved words

### Implementation Checklist
- [ ] Install react-hook-form and zod
- [ ] Create validation schemas in `/client/schemas/`
- [ ] Update PersonalInfo component
- [ ] Update Experience component
- [ ] Update Interests component
- [ ] Update RealmSelection component
- [ ] Update Profile editing form
- [ ] Update Login/Signup forms
- [ ] Update Post composer
- [ ] Add real-time validation feedback
- [ ] Add field-level error messages
- [ ] Add form-level error summary

### Acceptance Criteria
- [ ] All forms have client-side validation
- [ ] Errors shown in real-time (on blur)
- [ ] Clear, actionable error messages
- [ ] Form submission disabled until valid
- [ ] Visual indicators for invalid fields
- [ ] Success indicators for valid fields
- [ ] Validation schemas are reusable
- [ ] Type-safe form data

### Impact
- **Poor user experience**
- **Higher API error rates**
- **Confusing error messages**
- **Wasted server resources** (invalid requests)

---

## Summary

These P0 issues should be addressed in this order:
1. **Onboarding progress persistence** (30 min fix, high user impact)
2. **Error tracking** (1 hour setup, critical for monitoring)
3. **Form validation** (1-2 days, improves UX across app)
4. **Stripe integration** (2-3 days, enables monetization)
5. **Component refactoring** (1-2 weeks, ongoing improvement)

Total estimated effort: **2-3 weeks** for all P0 items.
