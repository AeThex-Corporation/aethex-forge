# Foundation OAuth Deployment Checklist

This checklist guides you through deploying Phase 3: Foundation OAuth integration on aethex.dev.

---

## Pre-Deployment Setup

### 1. Environment Variables

Add these to your deployment platform (Vercel, Railway, etc.):

```bash
# Foundation Identity Provider
VITE_FOUNDATION_URL=https://aethex.foundation

# OAuth Credentials (from Foundation Phase 1 setup)
FOUNDATION_OAUTH_CLIENT_ID=aethex_corp
FOUNDATION_OAUTH_CLIENT_SECRET=bcoEtyQVGr6Z4557658eUXpDF5FDni2TGNahH3HT-FtylNrLCYwydwLO0sbKVHtfYUnZc4flAODa4BXkzxD_qg
```

**Important:**

- ✅ Keep `FOUNDATION_OAUTH_CLIENT_SECRET` **secure** (never commit to git)
- ✅ Use deployment platform's secret management (Vercel > Settings > Environment Variables)
- ✅ Mark secret variables as "Encrypted"

### 2. Verify Foundation is Ready

Before deploying, confirm:

- [ ] aethex.foundation is running and accessible
- [ ] `/api/oauth/authorize` endpoint responding
- [ ] `/api/oauth/token` endpoint responding
- [ ] `/api/oauth/userinfo` endpoint responding
- [ ] OAuth credentials valid (client_id, client_secret)

**Quick Test:**

```bash
# Test token endpoint
curl -X POST https://aethex.foundation/api/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=refresh_token&refresh_token=test"
# Should return error about invalid refresh token (shows endpoint is up)
```

### 3. Verify Redirect URI

Foundation must have this redirect URI registered:

```
Production: https://aethex.dev/auth/callback
Staging: https://staging.aethex.dev/auth/callback
Development: http://localhost:5173/auth/callback
```

Ask Foundation admin to verify these are registered.

---

## Deployment Steps

### Step 1: Set Environment Variables

**Vercel:**

1. Go to Project Settings > Environment Variables
2. Add three variables:
   - `VITE_FOUNDATION_URL` = `https://aethex.foundation`
   - `FOUNDATION_OAUTH_CLIENT_ID` = `aethex_corp`
   - `FOUNDATION_OAUTH_CLIENT_SECRET` = (paste secret, mark as encrypted)
3. Select environments: Production, Preview, Development
4. Save

**Railway/Other:**

- Add to `.env` file in deployment
- Or configure in platform's settings
- Restart deployment for changes to take effect

### Step 2: Deploy Code

Files included in deployment:

```
✅ Already Implemented:
code/
├── client/
│   ├── lib/
│   │   ├── foundation-oauth.ts       (PKCE + OAuth flow)
│   │   └── foundation-auth.ts        (Token/cookie management)
│   ├── hooks/
│   │   └── use-foundation-auth.ts    (Callback handling)
│   └── pages/
│       └── Login.tsx                 (Updated with Foundation button)
├── api/
│   └── auth/callback.ts              (OAuth callback + token exchange)
├── .env.foundation-oauth.example     (Configuration reference)
└── docs/
    └── FOUNDATION-OAUTH-IMPLEMENTATION.md
```

**Deploy command:**

```bash
# For Vercel
vercel deploy --prod

# For Railway
railway deploy

# For Docker
docker build -t aethex-dev .
docker push <registry>/aethex-dev
# Then deploy image
```

### Step 3: Verify Deployment

1. **Check environment variables:**

   ```bash
   # On deployed app, check logs for env var loading
   # Should see Foundation URL in console (not secret though!)
   ```

2. **Visit login page:**

   - Go to https://aethex.dev/login
   - Should see "Login with Foundation" button
   - No console errors

3. **Test OAuth flow:**

   - Click "Login with Foundation"
   - Should redirect to https://aethex.foundation/api/oauth/authorize
   - Page should show Foundation login (or auth screen)

4. **Check callback endpoint:**

   - Network tab should show POST to `/auth/callback/exchange`
   - Should return 200 with access_token

5. **Verify cookies:**
   - After successful login, check Application > Cookies
   - Should have: `foundation_access_token`, `auth_user_id`
   - Both should be HttpOnly, Secure, SameSite=Strict

### Step 4: Monitor Logs

Watch for errors during first deployment:

```bash
# Look for these patterns in logs:
[Foundation OAuth] Received authorization code      ✅ Good
[Foundation OAuth] Token exchange initiated         ✅ Good
[Foundation OAuth] User info fetched                ✅ Good
[Foundation OAuth] User synced successfully         ✅ Good

# Watch for these errors:
[Foundation OAuth] Token exchange failed            ⚠️ Check credentials
[Foundation OAuth] Failed to fetch user info        ⚠️ Check Foundation
ECONNREFUSED                                        ⚠️ Foundation unreachable
```

---

## Testing Plan

### Test 1: Happy Path (Successful Login)

**Steps:**

1. Visit https://aethex.dev/login
2. Click "Login with Foundation"
3. Enter test credentials on Foundation
4. Should redirect back to aethex.dev/auth/callback
5. Should exchange code for token
6. Should appear logged in on dashboard

**Expected Result:** ✅ Logged in, cookies set, profile synced

**Check:**

```bash
# In browser console:
document.cookie  # Should show foundation_access_token

# In database:
SELECT * FROM user_profiles WHERE email = '<test-user-email>';
# Should show user synced with profile_completed status
```

### Test 2: Error: Invalid Code

**Steps:**

1. Manually modify callback URL: `?code=invalid_code_123`
2. Press Enter

**Expected Result:** ⚠️ Error page with message, redirect to login after 2s

### Test 3: Network Error

**Steps:**

1. Stop/pause Foundation service
2. Attempt login
3. Foundation redirects back with code
4. Callback tries to exchange code

**Expected Result:** ⚠️ Error about Foundation connection, graceful redirect to login

### Test 4: Logout and Re-login

**Steps:**

1. Logout from dashboard (if logout button exists)
2. Check cookies are cleared
3. Login again with Foundation
4. Should work seamlessly

**Expected Result:** ✅ Logout clears cookies, re-login establishes new session

### Test 5: Multiple Browsers

Test on:

- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile Safari
- [ ] Mobile Chrome

**Expected Result:** ✅ Works consistently across all browsers

---

## Production Rollout

### Phase 1: Staging (First)

1. Deploy to staging environment first
2. Run full testing suite
3. Verify Foundation integration works
4. Get team sign-off
5. Monitor staging for 24 hours

### Phase 2: Canary (Small Percentage)

If your deployment supports canary deployments:

1. Deploy to 5% of production traffic
2. Monitor auth success rate and errors
3. Check logs for issues
4. Gradually increase to 100%

### Phase 3: Full Production

1. Deploy to 100% of production
2. Have support team on standby
3. Monitor metrics closely for 24 hours
4. Have rollback plan ready

### Phase 4: Cleanup

After 1-2 weeks of successful deployment:

1. Remove old Discord OAuth code (optional)
2. Delete deprecated files:

   - `code/api/discord/oauth/start.ts`
   - `code/api/discord/oauth/callback.ts`
   - `code/api/discord/link.ts`
   - `code/api/discord/create-linking-session.ts`
   - `code/api/discord/verify-code.ts`

3. Update documentation
4. Remove old env variables

---

## Rollback Plan

If critical issues occur:

### Immediate Rollback (< 1 hour)

1. **Revert deployment:**

   ```bash
   # Vercel
   vercel rollback

   # Railway
   railway rollback <previous-deployment>
   ```

2. **Remove environment variables:**

   - Remove VITE_FOUNDATION_URL
   - Remove FOUNDATION_OAUTH_CLIENT_ID
   - Remove FOUNDATION_OAUTH_CLIENT_SECRET

3. **Communicate with users:**
   - "We've temporarily disabled Foundation integration"
   - "Use alternative login methods"

### If Rollback Fails

Contact Foundation admin for assistance with:

- OAuth endpoint status
- User session validation
- Database consistency

---

## Monitoring & Alerts

### Key Metrics to Monitor

1. **Auth Success Rate**

   - Target: >99%
   - Alert threshold: <95%
   - What to check: Logs for "Token exchange" errors

2. **Token Exchange Time**

   - Target: <500ms
   - Alert threshold: >2000ms
   - What to check: Network latency to Foundation

3. **Foundation Connectivity**

   - Monitor: Foundation endpoint availability
   - Alert on: Connection failures to /api/oauth/token
   - Fallback: Maintenance page if Foundation down

4. **Error Rate by Type**
   - `invalid_code` - Usually code expired, user retries
   - `state_mismatch` - CSRF validation failed, investigate
   - `token_exchange_failed` - Foundation issue, escalate
   - `user_sync_failed` - Database issue, check Supabase

### Sample Metrics Query

```javascript
// In application logs/dashboard:
const metrics = {
  total_login_attempts: 1000,
  successful_logins: 990, // 99%
  failed_token_exchange: 5,
  failed_user_sync: 2,
  failed_state_validation: 3,
  avg_token_exchange_time_ms: 234,
};
```

---

## Support & Troubleshooting

### Common Issues During Deployment

| Issue                       | Cause                            | Solution                           |
| --------------------------- | -------------------------------- | ---------------------------------- |
| "Client secret not found"   | Missing env var                  | Add FOUNDATION_OAUTH_CLIENT_SECRET |
| "Redirect URI mismatch"     | URI not registered on Foundation | Ask Foundation admin to register   |
| "Token exchange failed 401" | Invalid credentials              | Verify client_id and client_secret |
| "User sync failed"          | Supabase error                   | Check user_profiles table schema   |
| "Cookies not set"           | SameSite policy blocking         | Check cookie headers on response   |

### Debug Commands

```bash
# Check environment variables (safely)
curl https://aethex.dev/api/health
# Should show that Foundation URL is configured (not the secret)

# Test Foundation connectivity
curl https://aethex.foundation/api/oauth/authorize?client_id=aethex_corp
# Should show authorization page (or redirect)

# Check database
psql -c "SELECT COUNT(*) FROM user_profiles;"
# Should show number of synced users
```

### Getting Help

1. **Check logs:**

   - Deployment platform logs (Vercel Dashboard, Railway Dashboard)
   - Application logs (if available)
   - Browser console (F12)
   - Network tab (check requests/responses)

2. **Verify configuration:**

   - Environment variables set correctly
   - Foundation endpoints accessible
   - Redirect URI registered

3. **Escalate if needed:**
   - Contact Foundation admin for OAuth endpoint issues
   - Contact Supabase for database sync issues
   - Contact platform support for deployment issues

---

## Post-Deployment

### 1. Verify Everything Works (Week 1)

- [ ] Users can login via Foundation
- [ ] User profiles sync correctly
- [ ] No errors in logs
- [ ] Auth success rate >99%
- [ ] Response times acceptable
- [ ] No support tickets about login

### 2. Communicate with Users (Week 1)

- [ ] Send announcement: "Foundation is now your identity provider"
- [ ] Explain: Existing sessions will be cleared
- [ ] Remind: They'll need to login again via Foundation
- [ ] Link: Documentation if they need help

### 3. Monitor Metrics (Week 2-3)

- [ ] Track daily auth success rate
- [ ] Monitor error rates
- [ ] Check Foundation connectivity
- [ ] Review support tickets

### 4. Final Cleanup (Week 3-4)

- [ ] Remove old Discord OAuth code (if stable)
- [ ] Archive deprecated files
- [ ] Update documentation
- [ ] Plan next features

---

## Success Criteria

✅ **Deployment is successful when:**

1. Login page shows "Login with Foundation" button
2. Users can login and are redirected to Foundation
3. After Foundation auth, users redirected back to dashboard
4. User profiles sync to local database
5. Cookies are set correctly (HttpOnly, Secure)
6. Auth success rate >99% for 24+ hours
7. No critical errors in logs
8. Support team has no blocking issues
9. Users report smooth login experience
10. All team members approve

---

## Deployment Checklist

- [ ] Environment variables configured in deployment platform
- [ ] Foundation OAuth credentials verified
- [ ] Redirect URI registered on Foundation
- [ ] Code deployed to staging
- [ ] Staging tests pass
- [ ] Production env vars set
- [ ] Code deployed to production
- [ ] Verify login page works
- [ ] Test complete OAuth flow
- [ ] Check database for user syncs
- [ ] Verify cookies are set correctly
- [ ] Monitor logs for errors
- [ ] Monitor metrics for 24 hours
- [ ] Team sign-off obtained
- [ ] User communication sent
- [ ] Support team briefed
- [ ] Rollback plan documented
- [ ] Post-deployment review scheduled

---

**Ready to deploy?** Follow this checklist step-by-step for a smooth Foundation OAuth integration!

---

**Status:** ✅ Deployment checklist complete and ready for use
