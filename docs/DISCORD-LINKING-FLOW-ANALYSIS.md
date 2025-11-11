<!-- INTERNAL: Operational doc - DO NOT PUBLISH TO PUBLIC DOCS -->

# Discord Linking Flow - Complete Issue Analysis & Fix

## Current Broken Flows

### Flow 1: Discord `/verify` Command → Account Link (PARTIALLY BROKEN)

```
User in Discord
  ↓
/verify command
  ↓
Bot generates code & verification URL: https://aethex.dev/discord-verify?code=ABCDEF
  ↓
User clicks link, browser opens page
  ↓
DiscordVerify.tsx auto-submits code
  ↓
POST /api/discord/verify-code with code + user_id
  ↓
Server links discord_id to user_id ✅
  ↓
Returns success response with discord username ✅
  ↓
**ISSUE: Frontend redirects to /profile/settings (WRONG PAGE)**
  ↓
Should redirect to: /dashboard?tab=connections
```

**Why it's broken:**

- Line 92 of `DiscordVerify.tsx` hardcoded to navigate to `/profile/settings`
- User needs to see **Connections** tab to verify Discord was linked
- Shows wrong page, feels like "demo BS" or missing content

**Fix:** Change redirect to `/dashboard?tab=connections`

---

### Flow 2: Dashboard "Link Discord" Button (COMPLETELY BROKEN)

```
User on /dashboard?tab=connections
  ↓
Clicks "Link Discord" button
  ↓
AuthContext.linkProvider("discord") called
  ↓
Sets state: {action: "link", redirectTo: "https://aethex.dev/dashboard?tab=connections"}
  ↓
Redirects to: /api/discord/oauth/start?state=...
  ↓
Backend parses state ✅
  ↓
Redirects to Discord OAuth authorize endpoint ✅
  ↓
User authorizes on Discord ✅
  ↓
Discord redirects back to: /api/discord/oauth/callback?code=...&state=...
  ↓
**ISSUE: User session is LOST at this point**
  ↓
Server tries to extract user_id from cookies but finds none
  ↓
Redirects to: /login?error=not_authenticated
```

**Why it's broken:**

1. Session cookies not being sent with OAuth callback request
2. OR session was cleared/expired during OAuth roundtrip
3. OR redirectUri mismatch causing issues

**Root cause:**

- Browser cookies might not be sent cross-domain
- SameSite=Lax might be blocking cookies
- The redirectUri registered in Discord Dev Portal might not match

---

### Flow 3: After Session Lost, User Tries Manual Link (FAILS)

```
User on /dashboard logged in
  ↓
Clicks "Link Discord"
  ↓
Gets redirected to /login (session lost)
  ↓
Never completes the linking
```

---

## Required Fixes

### Fix 1: DiscordVerify.tsx Redirect (Line 92)

**Current (WRONG):**

```typescript
setTimeout(() => {
  navigate("/profile/settings");
}, 3000);
```

**Should be (CORRECT):**

```typescript
setTimeout(() => {
  navigate("/dashboard?tab=connections");
}, 3000);
```

**Location:** `code/client/pages/DiscordVerify.tsx` line 92

---

### Fix 2: Session Persistence During OAuth Callback

The `/api/discord/oauth/callback.ts` needs to ensure:

1. **SameSite Cookie Policy** - Cookies must be sent with cross-site requests

   ```typescript
   // In oauth callback response headers
   res.setHeader("Set-Cookie", [
     `sb-access-token=...; SameSite=None; Secure; Path=/`,
     `sb-refresh-token=...; SameSite=None; Secure; Path=/`,
   ]);
   ```

2. **Check Session Extraction Logic**
   - Current code tries to extract from cookies: ✅
   - But might fail if cookies not sent from Discord redirect

---

### Fix 3: Verify Discord OAuth Redirect URI

**In Discord Developer Portal:**

1. Go to Applications > Your App
2. OAuth2 > Redirects
3. Make sure this is listed:
   ```
   https://aethex.dev/api/discord/oauth/callback
   ```
   (Or whatever domain is in production)

**In Code:**

- `code/api/discord/oauth/start.ts` - Uses dynamic domain ✅
- `code/api/discord/oauth/callback.ts` - Uses dynamic domain ✅

---

### Fix 4: Add Explicit Cookie Setting in OAuth Callback

Current code relies on cookies being sent WITH the request. But we need to ENSURE they're set on the response.

After successful linking, before redirecting:

```typescript
// After successful link at line 225
if (isLinkingFlow && authenticatedUserId) {
  // ... linking logic ...

  // IMPORTANT: Set cookies explicitly for browser
  // (Supabase session cookies should already be set, but ensure)

  console.log(
    "[Discord OAuth] Successfully linked, redirecting to:",
    redirectTo,
  );
  return res.redirect(302, redirectTo); // Use 302 instead of default
}
```

---

## Complete Fix Implementation

### Step 1: Fix DiscordVerify.tsx Redirect

File: `code/client/pages/DiscordVerify.tsx`

Change line 92 from:

```typescript
navigate("/profile/settings");
```

To:

```typescript
navigate("/dashboard?tab=connections");
```

Also change the button on line 160 from:

```typescript
onClick={() => navigate("/profile/settings")}
```

To:

```typescript
onClick={() => navigate("/dashboard?tab=connections")}
```

---

### Step 2: Verify Discord OAuth Redirect URI

Check Discord Developer Portal:

- Application: AeThex
- OAuth2 → Redirects
- Confirm this is registered: `https://aethex.dev/api/discord/oauth/callback`

If not, add it and save.

---

### Step 3: Improve OAuth Callback Error Handling

File: `code/api/discord/oauth/callback.ts`

Add explicit redirect code before redirecting:

```typescript
// Around line 225, change from:
return res.redirect(redirectTo);

// To:
console.log("[Discord OAuth] Linking complete, redirecting to:", redirectTo);
return res.redirect(302, redirectTo);
```

---

### Step 4: Add Cookie Debugging

To help debug session issues, add logging in AuthContext:

File: `code/client/contexts/AuthContext.tsx`

In the useEffect that checks cookies, add:

```typescript
useEffect(() => {
  // Debug: Log current session state
  const cookies = document.cookie.split("; ").map((c) => {
    const [key] = c.split("=");
    return key;
  });
  console.log("[AuthContext] Available cookies:", cookies);
}, []);
```

---

## Testing the Fixed Flow

### Test 1: Discord `/verify` Command

1. Type `/verify` in Discord
2. Click the link
3. Should show success message
4. Should redirect to `/dashboard?tab=connections`
5. Should see "Discord" in the connections list

### Test 2: Dashboard Link Button

1. Go to `/dashboard?tab=connections`
2. Click "Link Discord" button
3. Authorize in Discord
4. Should be redirected back to `/dashboard?tab=connections`
5. Should still be logged in
6. Should see "Discord" in connections list

### Test 3: Already Linked

1. Try `/verify` command again
2. Should show "Already Linked" message

### Test 4: Session Persistence

1. Link Discord successfully
2. Reload page
3. Should still be logged in
4. Should still see Discord in connections

---

## Common Issues & Debugging

### Issue: Still Redirected to Login After Linking

**Possible causes:**

1. Session cookies not being sent

   - Check: DevTools → Network → Find the OAuth callback request
   - Look for "Cookie" header in request
   - If missing, cookies might be blocked

2. OAuth Redirect URI mismatch

   - Check: Discord Developer Portal OAuth2 redirects
   - Should exactly match what backend is using

3. SameSite cookie policy
   - Browser might block cookies set from different domain
   - Might need SameSite=None; Secure

**Debug steps:**

1. Open browser DevTools (F12)
2. Go to Network tab
3. Do the Discord link flow
4. Find the `/api/discord/oauth/callback?code=...` request
5. Check:
   - Request headers → Cookie (should have sb-access-token)
   - Response headers → Set-Cookie (should set new tokens)
   - Response status (should be 302 redirect)

### Issue: DiscordVerify Shows Wrong Page

**Should be fixed by:** Changing line 92 to redirect to `/dashboard?tab=connections`

### Issue: Discord Doesn't Show in Connections List

**Possible causes:**

1. Linking succeeded but user not refreshed

   - Fix: Page reload or refreshAuthState() call

2. Discord link created but user lookup fails

   - Check: Supabase discord_links table has the record
   - Check: User ID matches in both tables

3. Connections tab not showing Discord provider
   - Check: OAuthConnections component includes "discord"
   - Check: AuthContext includes "discord" in supported providers

---

## File Changes Summary

| File                                  | Change                             | Line(s) |
| ------------------------------------- | ---------------------------------- | ------- |
| `code/client/pages/DiscordVerify.tsx` | Change redirect to connections tab | 92, 160 |
| `code/api/discord/oauth/callback.ts`  | Add explicit status code           | 225     |
| Discord Dev Portal                    | Verify redirect URI                | N/A     |

---

## Environment Variables Checklist

- [ ] DISCORD_CLIENT_ID = "578971245454950421"
- [ ] DISCORD_CLIENT_SECRET = (set in production)
- [ ] VITE_API_BASE = (correct domain for your deployment)
- [ ] VITE_SUPABASE_URL = "https://kmdeisowhtsalsekkzqd.supabase.co"
- [ ] SUPABASE_SERVICE_ROLE = (set in production)

---

## After Implementing Fixes

1. **Test both flows thoroughly**
2. **Check browser console for errors**
3. **Verify Discord linking shows in connections**
4. **Test session persistence** (reload after linking)
5. **Monitor logs** for any "[Discord OAuth]" errors
