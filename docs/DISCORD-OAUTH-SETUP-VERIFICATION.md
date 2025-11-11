<!-- INTERNAL: Operational doc - DO NOT PUBLISH TO PUBLIC DOCS -->

# Discord OAuth Setup Verification Checklist

## 🔴 CRITICAL: OAuth Redirect URI Registration

This is the most common cause of session loss during Discord linking.

### Step 1: Open Discord Developer Portal

1. Go to: https://discord.com/developers/applications
2. Find and click: **AeThex** application
3. Left sidebar, click: **OAuth2**
4. Find the section: **REDIRECT URLS** or **REDIRECTS**

### Step 2: Verify Redirect URI is Registered

You must have this exact URL registered:

```
https://aethex.dev/api/discord/oauth/callback
```

**If you're using a different domain** (like localhost for testing):

```
http://localhost:5173/api/discord/oauth/callback
```

### Step 3: Add Missing Redirect URI (If Needed)

If the URL is NOT listed:

1. Click: **Add Redirect** button
2. Paste the correct URL:
   ```
   https://aethex.dev/api/discord/oauth/callback
   ```
3. Click: **Save Changes**
4. **Wait** - changes may take 1-2 minutes to propagate

⚠️ **IMPORTANT:** The redirect URI must match EXACTLY:

- Correct: `https://aethex.dev/api/discord/oauth/callback`
- Wrong: `https://aethex.dev/api/discord/callback` (missing `/oauth`)
- Wrong: `aethex.dev/api/discord/oauth/callback` (missing `https://`)
- Wrong: `https://aethex.dev/api/discord/oauth/callback/` (trailing slash)

---

## 🟢 TESTING THE DISCORD LINKING FLOWS

After verifying the redirect URI, test both flows:

### Test Flow 1: Discord `/verify` Command

1. In Discord, type: `/verify`
2. Click the link button or copy the code
3. Browser opens: `https://aethex.dev/discord-verify?code=XXXXXX`
4. Page auto-submits and links your account
5. You should see: ✅ Success message
6. **Redirects to:** `/dashboard?tab=connections` (FIXED)
7. You should see Discord in your connections list

**If it redirects to `/profile/settings` instead:**

- This has been FIXED in the code update

**If it shows an error:**

- Check the error message in the browser console
- Note: Session may be lost if redirect URI not registered

---

### Test Flow 2: Dashboard "Link Discord" Button

This is the flow that had session loss issues.

1. Go to: `/dashboard?tab=connections`
2. Click: **Link Discord** button
3. You'll be redirected to Discord OAuth
4. Click: **Authorize** on Discord
5. Discord redirects back to your app
6. **EXPECTED:** You should be redirected to `/dashboard?tab=connections`
7. **EXPECTED:** You should still be logged in
8. **EXPECTED:** Discord should appear in your connections

**If you're redirected to `/login` instead:**

- Session was lost during OAuth callback
- **Cause:** Redirect URI not registered in Discord Dev Portal
- **Solution:** Follow Step 1-3 above to add the redirect URI
- **Then:** Try the flow again

**If you see an error about session being lost:**

- This means the backend detected missing session cookies
- Check the browser console for error details
- The error message now tells you to verify Discord Dev Portal settings

---

## 🔵 ENVIRONMENT VARIABLES CHECKLIST

Verify these are set correctly:

### Frontend (code/.env or deployment platform)

- [ ] `VITE_API_BASE` is set to your API domain

  ```
  VITE_API_BASE=https://aethex.dev
  ```

  (Or your actual deployment domain)

- [ ] `VITE_SUPABASE_URL` is correct

  ```
  VITE_SUPABASE_URL=https://kmdeisowhtsalsekkzqd.supabase.co
  ```

- [ ] `VITE_SUPABASE_ANON_KEY` is set

### Backend/Server (environment variables)

- [ ] `DISCORD_CLIENT_ID` is set

  ```
  DISCORD_CLIENT_ID=578971245454950421
  ```

- [ ] `DISCORD_CLIENT_SECRET` is set (production)

  ```
  DISCORD_CLIENT_SECRET=JKlilGzcTWgfmt2wEqiHO8wpCel5VEji
  ```

  ⚠️ **NOTE:** This is sensitive - only set in production, not in code

- [ ] `VITE_SUPABASE_URL` is set on backend

  ```
  VITE_SUPABASE_URL=https://kmdeisowhtsalsekkzqd.supabase.co
  ```

- [ ] `SUPABASE_SERVICE_ROLE` is set
  ```
  SUPABASE_SERVICE_ROLE=eyJhbGciOiJIUzI1NiIs...
  ```
  ⚠️ **CRITICAL:** Never commit this to git

---

## 🟡 COMMON ISSUES & SOLUTIONS

### Issue 1: "Session Lost" Error After Discord OAuth

**Cause:** Redirect URI not registered in Discord Dev Portal

**Solution:**

1. Open Discord Developer Portal
2. Go to OAuth2 → Redirects
3. Verify `https://aethex.dev/api/discord/oauth/callback` is listed
4. If not listed, add it and save
5. Try the linking flow again (may need to clear browser cache first)

---

### Issue 2: Discord Link Disappears After Page Reload

**Cause:** Linking succeeded but auth state not refreshed

**Solution:**

1. Verify the `discord_links` table in Supabase has the record
   - Go to: https://app.supabase.com/project/kmdeisowhtsalsekkzqd
   - Find table: `discord_links`
   - Check if your discord_id and user_id are recorded
2. If record exists but not showing in UI:
   - Reload the page or go to `/dashboard`
   - The UI should refresh and show Discord connection
3. If record doesn't exist:
   - The linking failed silently
   - Check browser console for errors
   - Try the `/verify` flow instead

---

### Issue 3: Wrong Redirect Page After `/verify` Command

**Old Problem:** Redirected to `/profile/settings`

**Solution:** ✅ FIXED in code

- The code now redirects to `/dashboard?tab=connections`
- If you're still seeing `/profile/settings`:
  - Clear browser cache (Ctrl+Shift+Delete)
  - Deploy the latest code changes

---

### Issue 4: "Already Linked" Error in `/verify` Command

**Cause:** Discord account already linked to an AeThex account

**Solutions:**

- Option A: Use a different Discord account
- Option B: Contact admin to unlink the Discord account from the other AeThex account
- Option C: If it's your old account, use `\unlink` command to disconnect it, then `/verify` again

---

## 🟣 DEBUGGING STEPS

If something isn't working, follow these steps:

### Step 1: Check Browser Console

1. Open Discord or your app
2. Press F12 (DevTools)
3. Go to Console tab
4. Look for messages starting with `[Discord OAuth]` or `[Discord Activity]`
5. Take a screenshot of any error messages

### Step 2: Check Network Tab

1. In DevTools, go to Network tab
2. Perform the Discord linking flow
3. Look for a request to `/api/discord/oauth/callback?code=...`
4. Click on it and check:
   - **Request Headers** → `Cookie` (should have `sb-access-token`)
   - **Response Headers** → `Set-Cookie` (should have new tokens)
   - **Status** → Should be `302` (redirect)

### Step 3: Check Supabase

1. Go to: https://app.supabase.com/project/kmdeisowhtsalsekkzqd
2. Find table: `discord_links`
3. Look for your discord_id (check if record exists)
4. If record exists but UI doesn't show it:
   - Reload the page
   - Or manually call `refreshAuthState()`
5. If record doesn't exist:
   - Linking never succeeded
   - Check the Network tab request/response above

### Step 4: Check Discord Dev Portal

1. Go to: https://discord.com/developers/applications/578971245454950421
2. Click: OAuth2
3. Scroll to: REDIRECT URLS
4. Verify: `https://aethex.dev/api/discord/oauth/callback` is listed
5. If missing:
   - Add it
   - Save
   - Wait 1-2 minutes
   - Try linking again

---

## ✅ Verification Checklist

When everything is working correctly, you should see:

- [ ] Discord `/verify` command generates a code
- [ ] Clicking the link shows verification page
- [ ] Code auto-submits and succeeds
- [ ] Redirects to `/dashboard?tab=connections` (not `/profile/settings`)
- [ ] Discord appears in connections list
- [ ] Clicking "Link Discord" button on dashboard works
- [ ] User redirected to `/dashboard?tab=connections` after Discord OAuth
- [ ] User remains logged in after Discord OAuth
- [ ] Discord appears in connections list immediately
- [ ] Page reload doesn't lose Discord connection
- [ ] Running `/verify` again shows "Already Linked" message

When all items are checked, your Discord linking is fully functional! 🎉

---

## Related Documentation

- [DISCORD-LINKING-FLOW-ANALYSIS.md](./DISCORD-LINKING-FLOW-ANALYSIS.md) - Flow diagrams and architecture
- [DISCORD-ACTIVITY-SETUP.md](./DISCORD-ACTIVITY-SETUP.md) - Discord Activity/slash commands setup
- [DISCORD-ADMIN-COMMANDS-REGISTRATION.md](./DISCORD-ADMIN-COMMANDS-REGISTRATION.md) - Bot command registration
