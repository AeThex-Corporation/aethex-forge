# Phase 3 Testing Plan

## Pre-Testing Requirements

Before running tests, ensure:

1. **Environment variables are set:**

   ```bash
   VITE_FOUNDATION_URL=https://aethex.foundation  # or staging/localhost
   FOUNDATION_OAUTH_CLIENT_SECRET=<received-from-foundation>
   VITE_API_BASE=https://aethex.dev  # or http://localhost:5173
   ```

2. **Foundation is operational:**

   - aethex.foundation is running
   - OAuth endpoints are accessible
   - Test user accounts exist

3. **App is running:**
   ```bash
   npm run dev  # or equivalent for your setup
   ```

---

## Test Scenarios

### Test 1: Login Page Loads Correctly

**Objective:** Verify the login page displays Foundation OAuth button

**Steps:**

1. Navigate to `http://localhost:5173/login` (or prod URL)
2. Look for "Login with Foundation" button
3. Verify button is visible and clickable

**Expected Result:**

```
✓ Login page displays
✓ "Login with Foundation" button visible
✓ Other options (Roblox, Ethereum) still available
✓ Email/password form visible
```

**Success Criteria:** ✅ Button visible and no console errors

---

### Test 2: Foundation Redirect

**Objective:** Verify clicking the button redirects to Foundation

**Steps:**

1. On login page, click "Login with Foundation" button
2. Observe browser URL change
3. Check redirect parameters

**Expected Result:**

```
Redirected to:
https://aethex.foundation/api/oauth/authorize
  ?client_id=aethex-corp
  &redirect_uri=https://aethex.dev/api/auth/foundation-callback
  &response_type=code
  &scope=openid%20profile%20email
  &state=...
```

**Success Criteria:** ✅ Redirected to Foundation OAuth authorize endpoint

---

### Test 3: Foundation Authentication (Manual)

**Objective:** User authenticates on Foundation

**Steps:**

1. You're now on Foundation login page
2. Enter test credentials
3. If prompted, grant aethex.dev permissions
4. Click "Authorize" or similar

**Expected Result:**

```
✓ Foundation accepts credentials
✓ Permission screen appears (if configured)
✓ Successful authentication
```

**Success Criteria:** ✅ Authentication succeeds, no Foundation-side errors

---

### Test 4: Callback Reception

**Objective:** Verify Foundation redirects back with authorization code

**Steps:**

1. After Foundation authentication completes
2. Observe browser URL change
3. Look for authorization code in URL

**Expected Result:**

```
Browser redirects to:
https://aethex.dev/api/auth/foundation-callback
  ?code=AUTH_CODE_VALUE
  &state=...

Check browser console:
✓ No errors about code
✓ Processing message may appear
```

**Success Criteria:** ✅ Callback endpoint receives authorization code

---

### Test 5: Token Exchange

**Objective:** Backend exchanges code for access token

**Steps:**

1. Monitor network requests in browser Dev Tools
2. Look for POST to `/api/auth/exchange-token`
3. Check response status

**Expected Result:**

```
Network:
POST /api/auth/exchange-token
Status: 200 OK
Response: {
  "accessToken": "eyJ...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "testuser",
    "profile_complete": false
  }
}

Cookies set:
✓ foundation_access_token=<token>
✓ auth_user_id=<uuid>
```

**Success Criteria:** ✅ Token received, cookies set, no 401/403 errors

---

### Test 6: User Profile Sync

**Objective:** Verify user profile created/updated in local database

**Steps:**

1. After successful login, check database
2. Query user_profiles table
3. Verify user exists with correct data

**Database Query:**

```sql
-- Check user was created/updated
SELECT id, email, username, profile_completed, updated_at
FROM user_profiles
WHERE email = 'test@example.com'
ORDER BY updated_at DESC
LIMIT 1;

-- Expected result:
/*
| id           | email            | username  | profile_completed | updated_at          |
|--------------|------------------|-----------|-------------------|---------------------|
| <uuid>       | test@example.com | testuser  | false             | 2024-01-XX HH:MM:SS |
*/
```

**Success Criteria:** ✅ User profile exists in local database with correct data

---

### Test 7: Dashboard Redirect

**Objective:** User redirected to dashboard after authentication

**Steps:**

1. After token exchange and profile sync
2. Browser should automatically redirect
3. Check final URL

**Expected Result:**

```
Browser URL: https://aethex.dev/dashboard
✓ Dashboard loads successfully
✓ User info displays correctly
✓ Profile data matches Foundation user
```

**Success Criteria:** ✅ Dashboard loads, user is authenticated

---

### Test 8: Authenticated API Requests

**Objective:** User can make authenticated API calls

**Steps:**

1. On authenticated dashboard
2. Use browser console to test:

   ```javascript
   const token = document.cookie
     .split(";")
     .find((c) => c.trim().startsWith("foundation_access_token="))
     ?.split("=")[1];

   fetch("/api/user/profile", {
     headers: { Authorization: `Bearer ${token}` },
     credentials: "include",
   })
     .then((r) => r.json())
     .then(console.log);
   ```

**Expected Result:**

```javascript
// Console output:
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "testuser",
  // ... other profile data
}
```

**Success Criteria:** ✅ API returns 200, user data correct

---

### Test 9: Logout

**Objective:** Verify logout clears Foundation auth

**Steps:**

1. On authenticated dashboard
2. Click logout/settings
3. Trigger logout action
4. Verify redirect to login

**Expected Result:**

```
✓ Logout triggered
✓ Cookies cleared:
  - foundation_access_token removed
  - auth_user_id removed
✓ Redirected to /login
✓ Previous authenticated state lost
```

\*\*Test command (if logout has UI):

```javascript
// Clear cookies manually in console
document.cookie =
  "foundation_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
document.cookie = "auth_user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
```

**Success Criteria:** ✅ Cookies cleared, session terminated

---

### Test 10: Redirect Destination (Optional)

**Objective:** Verify redirect works when accessing protected page first

**Steps:**

1. Logout (or clear cookies)
2. Visit protected page: `http://localhost:5173/dashboard?next=/admin`
3. Get redirected to login
4. Click "Login with Foundation"
5. After auth, should redirect to `/admin` instead of `/dashboard`

**Expected Result:**

```
✓ Initial redirect to /login with ?next=/admin
✓ After Foundation auth, redirected to /admin
```

**Success Criteria:** ✅ Redirect destination preserved through auth flow

---

## Error Testing

### Error 1: Invalid Authorization Code

**How to trigger:**

1. Manually modify URL code parameter: `?code=invalid_code`
2. Let callback process

**Expected Result:**

```
Error: token_exchange
Message: Failed to exchange authorization code
Redirect to: /login?error=token_exchange
```

**Success Criteria:** ✅ Graceful error handling, user redirected to login

---

### Error 2: Missing Client Secret

**How to trigger:**

1. Unset `FOUNDATION_OAUTH_CLIENT_SECRET` env var
2. Attempt login

**Expected Result:**

```
Error: 500 or token_exchange error
Message: Missing environment variables
Redirect to: /login with error
```

**Success Criteria:** ✅ Clear error, server doesn't crash

---

### Error 3: Foundation Unavailable

**How to trigger:**

1. Stop Foundation service
2. Attempt login
3. Foundation authorize redirects back

**Expected Result:**

```
Error: Token exchange fails
Message: Failed to connect to Foundation
Redirect to: /login with error message
```

**Success Criteria:** ✅ Handles offline Foundation gracefully

---

### Error 4: Expired Authorization Code

**How to trigger:**

1. Wait >10 minutes after Foundation redirect
2. Complete the callback

**Expected Result:**

```
Error: invalid_grant or code_expired
Message: Authorization code has expired
Redirect to: /login?error=token_exchange
```

**Success Criteria:** ✅ Clear error, user redirected to login

---

## Browser Compatibility Testing

Test on multiple browsers:

- [ ] Chrome/Chromium (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

**Checklist for each browser:**

- [ ] Login page renders correctly
- [ ] Redirect to Foundation works
- [ ] Cookies are set (check Dev Tools)
- [ ] Dashboard loads after auth
- [ ] Logout works

---

## Performance Testing

### Page Load Time

```bash
# Test login page load
curl -w "@curl-format.txt" -o /dev/null -s https://aethex.dev/login
# Expected: < 2 seconds

# Test dashboard load after auth
curl -H "Authorization: Bearer <token>" -w "@curl-format.txt" -o /dev/null -s https://aethex.dev/api/user/profile
# Expected: < 500ms
```

### Token Exchange Time

Time from receiving auth code to dashboard redirect:

**Target:** < 2 seconds
**Acceptable:** 2-5 seconds
**Problematic:** > 5 seconds

---

## User Flow Testing

### Real User Journey

**Step-by-step test with actual user:**

1. **Visit login page** - Fresh browser tab
2. **Click "Login with Foundation"** - No pre-existing auth
3. **Enter test credentials** - On Foundation
4. **Authorize app** - If permission prompt appears
5. **Check redirect** - Should arrive at dashboard
6. **Verify profile** - Data should display
7. **Test API** - Make authenticated request
8. **Logout** - Clear session
9. **Re-login** - Ensure can login again

**Success:** All steps complete without errors

---

## Deployment Testing

### Staging Environment

Before deploying to production:

1. [ ] Deploy Phase 3 code to staging
2. [ ] Set Foundation OAuth credentials
3. [ ] Test complete flow on staging
4. [ ] Verify Foundation integration stable
5. [ ] Check error handling
6. [ ] Review logs for issues
7. [ ] Get team sign-off

### Production Deployment

1. [ ] Backup current auth system
2. [ ] Deploy Phase 3 code
3. [ ] Monitor logs closely
4. [ ] Have rollback plan ready
5. [ ] Communicate with users
6. [ ] Watch for auth issues

---

## Test Report Template

```markdown
# Phase 3 Testing Report

Date: YYYY-MM-DD
Tester: [Name]
Environment: [Staging/Production]

## Test Results

| Test                    | Status | Notes |
| ----------------------- | ------ | ----- |
| Test 1: Login Page      | ✅/❌  |       |
| Test 2: Redirect        | ✅/❌  |       |
| Test 3: Foundation Auth | ✅/❌  |       |
| Test 4: Callback        | ✅/❌  |       |
| Test 5: Token Exchange  | ✅/❌  |       |
| Test 6: Profile Sync    | ✅/❌  |       |
| Test 7: Dashboard       | ✅/❌  |       |
| Test 8: API Requests    | ✅/❌  |       |
| Test 9: Logout          | ✅/❌  |       |
| Test 10: Redirects      | ✅/❌  |       |

## Errors Encountered

[List any errors found]

## Performance Metrics

- Login page load: XXX ms
- Token exchange: XXX ms
- Dashboard load: XXX ms

## Browser Compatibility

- Chrome: ✅/❌
- Firefox: ✅/❌
- Safari: ✅/❌
- Edge: ✅/❌

## Recommendation

🟢 Ready for production / 🟡 Needs fixes / 🔴 Do not deploy

[Explain any blockers]
```

---

## Monitoring After Deployment

### Key Metrics to Monitor

1. **Authentication Success Rate**

   - Should be >99%
   - Track failed logins

2. **Error Categories**

   - Code exchange failures
   - Token validation failures
   - Profile sync failures

3. **Performance**

   - Token exchange time (target <2s)
   - Dashboard load time after auth
   - API request latency

4. **User Feedback**
   - Support tickets about login
   - Issues reported by users
   - Accessibility issues

### Alert Thresholds

Set alerts for:

- Auth failure rate > 5%
- Token exchange time > 5 seconds
- Foundation connectivity issues
- Database sync failures

---

## Rollback Triggers

Immediately rollback if:

- Auth failure rate > 25%
- Unable to authenticate any new users
- Data corruption in user_profiles
- Foundation connection completely down
- Security vulnerability discovered

---

**Testing Status:** ⏳ Ready to Test

Once Foundation OAuth credentials are obtained and staging environment is ready, proceed with testing according to this plan.
