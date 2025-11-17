# Phase 3: The Switchover - Quick Start

## Status: ✅ IMPLEMENTATION COMPLETE

The Phase 3 implementation is **complete and ready for deployment**. aethex.dev is now configured to act as an OAuth **client** of aethex.foundation, making Foundation the single source of truth for user identity.

---

## What You Need To Know

### Before Foundation Migrate
- **aethex.dev** handled all authentication (Discord OAuth, email/password)
- User identity was distributed across multiple systems
- Each application had its own auth logic

### After Phase 3 Deployed
- **aethex.foundation** is the authoritative identity provider
- **aethex.dev** redirects users to Foundation for authentication
- All Discord connections handled by Foundation
- User profiles synchronized from Foundation to aethex.dev

---

## Quick Setup

### Step 1: Set Environment Variables

Add to your `.env` or deployment configuration:

```bash
# Foundation identity provider URL
VITE_FOUNDATION_URL=https://aethex.foundation

# OAuth client secret (request from Foundation admin)
FOUNDATION_OAUTH_CLIENT_SECRET=<secret-provided-by-foundation>
```

**Note:** The `FOUNDATION_OAUTH_CLIENT_SECRET` will be provided after Foundation's Phase 1 setup is complete.

### Step 2: Deploy Phase 3 Code

The following files are new and handle Foundation OAuth:

**Client-side:**
- `code/client/lib/foundation-oauth.ts` - OAuth flow
- `code/client/lib/foundation-auth.ts` - Token management
- `code/client/hooks/use-foundation-auth.ts` - React hooks
- `code/client/pages/Login.tsx` - UPDATED with Foundation button

**Server-side:**
- `code/api/auth/foundation-callback.ts` - OAuth callback handler
- `code/api/auth/exchange-token.ts` - Token exchange endpoint

### Step 3: Test the Flow

1. Navigate to `https://aethex.dev/login`
2. Click **"Login with Foundation"** button
3. You should be redirected to `aethex.foundation/api/oauth/authorize`
4. After authentication, redirected back to aethex.dev dashboard
5. ✅ You're authenticated!

---

## Key Changes in This Phase

### Login Page
- **Old:** Discord button redirected to local `/api/discord/oauth/start`
- **New:** "Login with Foundation" button redirects to `aethex.foundation`

### Authentication Flow
- **Old:** Local Supabase auth → Discord OAuth locally → Session on aethex.dev
- **New:** Redirect to Foundation → User auth on Foundation → Session on aethex.dev with Foundation token

### User Profile
- **Old:** Stored directly in aethex.dev's Supabase
- **New:** Synced from Foundation's Supabase to aethex.dev's local copy

### Discord Management
- **Old:** aethex.dev handled all Discord connections
- **New:** Foundation handles all Discord connections; aethex.dev consumes the result

---

## Important Files

### New Components (Phase 3 Specific)
```
code/
├── client/
│   ├── lib/
│   │   ├── foundation-oauth.ts      ← OAuth flow initialization
│   │   └── foundation-auth.ts       ← Token & profile management
│   ├── hooks/
│   │   └── use-foundation-auth.ts   ← React hooks for auth
│   └── pages/
│       └── Login.tsx                ← UPDATED with Foundation button
├── api/
│   └── auth/
│       ├── foundation-callback.ts   ← Callback endpoint
│       └── exchange-token.ts        ← Token exchange endpoint
└── docs/
    ├── PHASE3-SWITCHOVER-GUIDE.md      ← Full implementation guide
    ├── PHASE3-IMPLEMENTATION-SUMMARY.md ← What was done
    ├── PHASE3-TESTING-PLAN.md          ← How to test
    └── PHASE3-README.md                ← THIS FILE
```

### Configuration Files
```
code/
└── .env.foundation-oauth.example  ← Example env vars
```

---

## Testing Checklist

Before going live:

- [ ] Environment variables set (VITE_FOUNDATION_URL, FOUNDATION_OAUTH_CLIENT_SECRET)
- [ ] Foundation OAuth credentials obtained from Foundation admin
- [ ] Login page displays "Login with Foundation" button
- [ ] Clicking button redirects to Foundation
- [ ] Foundation authentication works (manual test)
- [ ] Callback returns to aethex.dev with authorization code
- [ ] Code is exchanged for access token
- [ ] User profile appears in local database
- [ ] Dashboard loads and shows correct user
- [ ] Logout works and clears session
- [ ] Re-login works smoothly
- [ ] Error handling works (test with invalid code, expired code, etc.)
- [ ] Tested on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Staging environment test passed
- [ ] Team sign-off obtained

**See `PHASE3-TESTING-PLAN.md` for detailed testing procedures.**

---

## What Happens to Discord OAuth?

Discord OAuth is now **managed entirely by aethex.foundation**.

- Users no longer click Discord button on aethex.dev
- They click "Login with Foundation" on aethex.dev
- Foundation handles Discord OAuth if user chooses it
- Foundation issues a token to aethex.dev
- aethex.dev accepts the token

**Result:** Simplified Corp-side code, centralized identity management

---

## User Experience After Phase 3

### For New Users
1. Visit aethex.dev/login
2. See "Login with Foundation" button (primary option)
3. Click it
4. Redirected to aethex.foundation to create account or login
5. After auth, returned to aethex.dev dashboard
6. Complete onboarding with pre-filled Foundation data

### For Existing Users
1. Existing sessions will be cleared (they had aethex.dev Supabase tokens)
2. They'll be redirected to login page
3. They click "Login with Foundation"
4. Foundation verifies them (Foundation has their data from Phase 2)
5. They're logged in on aethex.dev with Foundation's token
6. Experience continues seamlessly

---

## Architecture After Phase 3

```
┌─────────────────────────────────────────────────────────────┐
│                     Users Visiting aethex.dev               │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ↓ Click "Login with Foundation"
                             │
        ┌────────────────────┴──────────────────┐
        │                                       │
        ↓                                       ↓
   ┌─────────────────┐              ┌──────────────────────────┐
   │  aethex.dev     │              │ aethex.foundation        │
   │  (OAuth Client) │◄────OAuth────►│ (Identity Provider)     │
   │                 │    Flow       │                          │
   │ • Login page    │               │ • Handles auth           │
   │ • Dashboard     │               │ • Issues tokens          │
   │ • Settings      │               │ • Manages Discord        │
   │                 │               │ • Issues Passport        │
   └─────────────────┘               └──────────────────────────┘
        │                                    │
        ↓                                    ↓
   ┌─────────────────┐              ┌──────────────────────────┐
   │ Local Supabase  │              │ Supabase (Source of      │
   │ (Synced Profiles│◄─Sync────────│ Truth for Identity)      │
   │ + Settings)     │              │                          │
   └─────────────────┘              └──────────────────────────┘
```

---

## Reverting Phase 3 (If Needed)

If critical issues arise:

1. **Revert code:**
   ```bash
   git revert <Phase3-commit-hash>
   ```

2. **Restore environment:**
   - Remove VITE_FOUNDATION_URL
   - Remove FOUNDATION_OAUTH_CLIENT_SECRET

3. **Tell users:**
   - "We've temporarily disabled Foundation integration"
   - "Please use local login or Discord OAuth"

4. **Keep old endpoints:**
   - Don't delete `/api/discord/oauth/*` endpoints yet
   - They'll still work if code is reverted

---

## Deployment Recommendations

### Staging Deployment (First)
1. Deploy Phase 3 code to staging
2. Set Foundation OAuth credentials on staging
3. Test according to `PHASE3-TESTING-PLAN.md`
4. Get team approval
5. Monitor staging for 24 hours

### Production Deployment
1. Create backup of current auth system
2. Deploy Phase 3 code gradually (canary deployment if possible)
3. Set Foundation OAuth credentials in production
4. Monitor authentication metrics closely
5. Have rollback plan ready
6. Communicate with users

### Monitoring
- Auth success rate (target >99%)
- Token exchange time (target <2s)
- Error messages in logs
- User support tickets
- Foundation connectivity

---

## FAQ

**Q: Do existing users need to do anything?**
A: No, but their old sessions will be cleared. They'll be redirected to Foundation login.

**Q: What if Foundation is down?**
A: Users can't login. Have a communication plan ready.

**Q: Can I test without Foundation setup?**
A: Yes, set `VITE_FOUNDATION_URL` to a test instance with test credentials.

**Q: What about API keys and integrations?**
A: They remain on aethex.dev. Use Foundation tokens for user identification.

**Q: How do I get the Foundation OAuth client secret?**
A: After Foundation's Phase 1 setup, request it from the Foundation admin.

**Q: Can users still use email/password to login?**
A: Only if Foundation supports it. aethex.dev redirects to Foundation for all auth.

**Q: What about Discord linking from aethex.dev?**
A: Users link Discord on Foundation instead. No linking needed on aethex.dev.

---

## Next Steps

### Week 1: Setup
1. ✅ Code implemented (DONE)
2. ⏳ Get Foundation OAuth credentials
3. ⏳ Set environment variables
4. ⏳ Deploy to staging

### Week 2: Testing
5. ⏳ Test complete auth flow
6. ⏳ Test error scenarios
7. ⏳ Test on multiple browsers
8. ⏳ Load testing if needed
9. ⏳ Get team approval

### Week 3: Deployment
10. ⏳ Deploy to production
11. ⏳ Monitor closely for issues
12. ⏳ Document any bugs found
13. ⏳ Communicate with users

### Week 4+: Optimization
14. ⏳ Remove old Discord OAuth endpoints
15. ⏳ Optimize token handling
16. ⏳ Update documentation
17. ⏳ Plan Phase 4 features

---

## Documentation

Detailed documentation available:

- **`PHASE3-SWITCHOVER-GUIDE.md`** - Complete implementation guide with architecture diagrams
- **`PHASE3-IMPLEMENTATION-SUMMARY.md`** - What was changed and why
- **`PHASE3-TESTING-PLAN.md`** - How to test each scenario
- **`PHASE3-README.md`** - THIS FILE

---

## Support

If you encounter issues:

1. **Check logs:**
   - Foundation callback logs (Vercel deployment)
   - Token exchange errors
   - Profile sync failures

2. **Verify environment:**
   - VITE_FOUNDATION_URL is correct
   - FOUNDATION_OAUTH_CLIENT_SECRET is correct
   - Foundation service is running

3. **Test manually:**
   - Use curl to test token endpoint
   - Check database for user profiles
   - Inspect cookies in browser

4. **Escalate if needed:**
   - Contact Foundation admin for OAuth issues
   - Check infrastructure logs
   - Review network connectivity

---

**Status: ✅ Phase 3 Implementation Complete & Ready for Testing**

Once you obtain Foundation OAuth credentials and complete testing, you'll be ready to make aethex.foundation the official identity provider for your Aethex ecosystem.

---

**Questions?** See detailed guides in `code/docs/PHASE3-*` files.
