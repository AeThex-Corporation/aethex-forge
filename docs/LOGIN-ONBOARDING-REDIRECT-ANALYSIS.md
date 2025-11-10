# Login/Onboarding Redirect Issues - Root Cause Analysis

## Problem Statement

User reports:

1. After logging in, they get redirected to onboarding
2. When first loading the site, it shows them as "logged in" but with incomplete profile
3. Frustrated because users shouldn't be shown as logged in without a complete profile
4. Confused by unnecessary onboarding redirects

---

## Root Causes Identified

### Issue 1: Session Restoration Before Profile Completion Check

**What happens:**

1. User logs in successfully
2. Session cookies are set by Supabase
3. Page reloads or user navigates
4. AuthContext initializes and restores session from cookies
5. User appears "logged in" immediately
6. **BUT:** Profile is still being fetched from database
7. UI shows user as logged in while profile data loads
8. Once profile loads, if incomplete, they might be redirected

**Why it's confusing:**

- User sees themselves logged in
- But profile might still be loading
- Then get redirected to onboarding
- Feels like a bug rather than normal flow

---

### Issue 2: "Logged In By Default" Appearance

**What's happening:**
The AuthContext loads the session from browser storage immediately:

- Supabase session stored in cookies/IndexedDB
- On page load, `onAuthStateChange` fires with existing session
- User state is set
- UI shows user as authenticated

**But:**

- Profile data takes time to load from database
- UI briefly shows "logged in" before profile is available
- This can feel like users are logged in "by default"

---

### Issue 3: Onboarding Redirect Logic

**Current logic in Dashboard.tsx (line 291):**

```typescript
if (!user && !authLoading) {
  navigate("/onboarding", { replace: true });
}
```

**Issues with this:**

1. Redirects to onboarding if NO user
2. But never checks if profile is INCOMPLETE
3. Should either:
   - Redirect to onboarding if profile NOT complete, OR
   - Not redirect at all if profile is incomplete

---

## Why This Matters

**Current behavior is confusing because:**

1. **Mixed signals:**

   - User sees themselves logged in
   - Then gets redirected to onboarding
   - Feels like auth is broken

2. **No clear intent:**

   - Onboarding is meant to COMPLETE the profile
   - But if you're already logged in, you should be on dashboard
   - Redirect should only happen if profile is incomplete

3. **Session uncertainty:**
   - Page shows user as authenticated
   - But redirects as if they're not
   - Unclear what state the app is in

---

## Solution

### Fix 1: Don't Redirect to Onboarding from Dashboard

**Current:** Line 291-295 in Dashboard.tsx checks `if (!user)` and redirects

**Should be:**

- If no user → stay on dashboard (it handles showing loading state)
- If user but profile incomplete → show a prompt, don't redirect
- If user and profile complete → show full dashboard

**Change:**
Remove the automatic redirect to onboarding. Instead:

- Let Dashboard render
- Show a "Complete Your Profile" banner if profile is incomplete
- Let user click to go to onboarding, don't force redirect

---

### Fix 2: Clear Session Restoration UI

**Current:** Session restored from cookies → UI shows user as logged in immediately

**Should be:**

- Show loading state while profile is being fetched
- Don't show user as "logged in" until profile is loaded
- Once profile loads, show actual dashboard

**Change:**
Ensure `loading` state is true while profile is being fetched, then show LoadingScreen instead of Dashboard

---

### Fix 3: Clarify Onboarding Intent

**Current:** Onboarding shows up unexpectedly after login

**Should be:**

- Onboarding only when INTENTIONALLY started (user clicks "Complete Profile")
- Not automatically triggered by auth state
- Dashboard can show "Profile incomplete" message with link to onboarding

**Change:**

- Remove auto-redirect logic
- Let Dashboard handle incomplete profile display
- User explicitly chooses to complete profile

---

## Specific Code Changes Needed

### In code/client/pages/Dashboard.tsx (Lines 283-311)

**Current (WRONG):**

```typescript
useEffect(() => {
  if (!user && !authLoading) {
    navigate("/onboarding", { replace: true });
    return;
  }

  if (user && profile) {
    loadDashboardData();
  }
}, [user, profile, authLoading, navigate]);
```

**Should be:**

```typescript
useEffect(() => {
  // Don't auto-redirect to onboarding
  // Let Dashboard render and handle missing profile gracefully

  if (user && profile) {
    loadDashboardData();
  }
}, [user, profile, authLoading, navigate]);
```

---

### In code/client/pages/Dashboard.tsx (Top level)

**Add this check:**

```typescript
// If loading, show loading state
if (authLoading) {
  return <LoadingScreen message="Loading..." />;
}

// If no user, show login prompt (not onboarding)
if (!user) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1>Please sign in</h1>
        <p>You need to be logged in to access the dashboard</p>
      </div>
    </div>
  );
}

// If user but no profile, show incomplete profile message
if (!profile) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1>Complete Your Profile</h1>
        <p>Please complete your profile to continue</p>
        <button onClick={() => navigate("/onboarding")}>
          Complete Profile
        </button>
      </div>
    </div>
  );
}

// User and profile exist - render dashboard
```

---

## Expected Behavior After Fix

### Scenario 1: Fresh Login

1. User logs in with email/password
2. Redirected to dashboard
3. Dashboard shows loading state while profile is fetched
4. Once profile loads:
   - If profile complete → show full dashboard
   - If profile incomplete → show "Complete Your Profile" banner with link to onboarding

### Scenario 2: Page Reload While Logged In

1. User is logged in, page reloads
2. Supabase session restored from cookies
3. AuthContext restores user and fetches profile
4. Dashboard shows loading state
5. Once profile loaded → show dashboard (complete or with banner)

### Scenario 3: Not Logged In

1. Unauthenticated user visits `/dashboard`
2. Dashboard detects no user
3. Shows "Please sign in" message
4. User clicks "Sign In" to go to login page

---

## Testing Checklist

After implementing fixes:

- [ ] Log in with email/password
- [ ] Verify you're NOT redirected to onboarding if profile incomplete
- [ ] Instead, see a message offering to complete profile
- [ ] Click "Complete Profile" to intentionally go to onboarding
- [ ] After completing profile, redirect to dashboard
- [ ] Reload page while logged in → stays on dashboard
- [ ] Reload page while not logged in → see "Please sign in" message
- [ ] Profile with all fields → full dashboard shown
- [ ] Profile missing fields → see banner to complete profile
- [ ] No users should see others logged in by default

---

## Files to Update

| File                              | Lines           | Change                        |
| --------------------------------- | --------------- | ----------------------------- |
| `code/client/pages/Dashboard.tsx` | 283-311         | Remove onboarding redirect    |
| `code/client/pages/Dashboard.tsx` | Start of render | Add loading/auth state checks |
| `code/client/pages/Dashboard.tsx` | TBD             | Add "Complete Profile" banner |

---

## Why This Makes More Sense

1. **Clear intention:** Onboarding is optional, not forced
2. **Better UX:** No surprising redirects
3. **Session clarity:** You're logged in OR you're not (not both at same time)
4. **User control:** Users intentionally complete profile, not redirected
5. **Consistency:** Dashboard behavior is predictable

---

## Related Issues

- AuthContext clearing session on page load: ✅ FIXED (preserves sb-\* keys)
- Session persistence: ✅ WORKING (cookies restored correctly)
- Profile loading timing: ⚠️ CAUSES UI CONFUSION (session shown before profile)

The core issue isn't authentication—it's the redirect logic and UI inconsistency.
