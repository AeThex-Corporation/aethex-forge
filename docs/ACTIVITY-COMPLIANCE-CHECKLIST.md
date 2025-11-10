# Discord Activity SPA Compliance Checklist

This checklist ensures your Discord Activity meets Discord's Single-Page Application (SPA) requirements.

## ✅ Code Compliance

### Activity Component (code/client/pages/Activity.tsx)

- [ ] **No React Router Navigation**

  - [ ] No `useNavigate()` hook
  - [ ] No `navigate()` calls
  - [ ] No `<Link to="...">` components

- [ ] **No Internal Page Navigation**

  - [ ] All internal navigation removed
  - [ ] Routes like `/creators`, `/opportunities`, `/settings` don't exist in Activity
  - [ ] If accessing main app features, use `window.open(url, "_blank")`

- [ ] **Proper Error Handling**

  - [ ] Graceful error state display
  - [ ] Loading state handled properly
  - [ ] "Not in Discord" state shows helpful message instead of crashing

- [ ] **PostMessage Communication**
  - [ ] Activity uses Discord SDK (DiscordActivityContext)
  - [ ] SDK handles all Discord communication
  - [ ] No direct iframe communication attempted

### Manifest Configuration (code/public/discord-manifest.json)

- [ ] **Discord Proxy Domain Only**

  - [ ] `rpc_origins` contains ONLY: `"https://578971245454950421.discordsays.com"`
  - [ ] No external domains listed
  - [ ] No `aethex.dev` in rpc_origins

- [ ] **Valid JSON Structure**

  - [ ] `id` matches Discord app ID: `"578971245454950421"`
  - [ ] `version` is set: `"1"`
  - [ ] `name` describes the Activity
  - [ ] `description` explains Activity purpose

- [ ] **No External Interactions Configured**
  - [ ] If `interactions` present, URL points to Discord proxy domain
  - [ ] No external API endpoints in manifest

### Context/SDK Setup (code/client/contexts/DiscordActivityContext.tsx)

- [ ] **Proper SDK Initialization**

  - [ ] SDK imported: `@discord/embedded-app-sdk`
  - [ ] `DiscordSDK` instantiated with client ID
  - [ ] `sdk.ready()` awaited before using SDK
  - [ ] `sdk.authenticate()` called after ready

- [ ] **Correct OAuth Flow**

  - [ ] Uses `sdk.commands.authorize()` for OAuth
  - [ ] Exchanges code for token via `/api/discord/activity-auth`
  - [ ] Token used to authenticate with SDK
  - [ ] User data fetched after authentication

- [ ] **Proper Error Handling**
  - [ ] Errors logged with `[Discord Activity]` prefix
  - [ ] User-friendly error messages displayed
  - [ ] No silent failures
  - [ ] Console logs helpful for debugging

## ✅ Navigation Compliance

### Link Handling

- [ ] **All External Links Use window.open()**

  ```typescript
  // ✅ CORRECT
  <button onClick={() => window.open(url, "_blank")}>

  // ❌ WRONG
  <a href={url}>
  <Link to={url}>
  navigate(url)
  ```

- [ ] **All Buttons Have Clear Intent**

  - [ ] "View Profile" → Opens profile in new window
  - [ ] "Browse Creators" → Opens main app in new window
  - [ ] "Settings" → Opens settings in new window

- [ ] **No Hidden Navigation**
  - [ ] No `useEffect` that navigates
  - [ ] No programmatic routing
  - [ ] No redirects outside Activity

## ✅ Data Handling

### User Data

- [ ] **Data Fetched from Backend**

  - [ ] Uses `/api/discord/activity-auth` endpoint
  - [ ] Passes access token from SDK
  - [ ] Displays cached/static data, not real-time
  - [ ] Handles missing data gracefully

- [ ] **No Data Mutations in Activity**
  - [ ] Profile updates happen in main app
  - [ ] Settings changes happen in main app
  - [ ] Activity is read-only display layer

## ✅ Deployment & Testing

### Pre-Deployment

- [ ] **Build Succeeds**

  ```bash
  npm run build
  # Should produce no errors about Activity
  ```

- [ ] **Dev Server Works**

  ```bash
  npm run dev
  # Activity loads without console errors
  ```

- [ ] **No External Resource Issues**
  - [ ] All images load correctly
  - [ ] No "blocked by CSP" errors
  - [ ] No CORS errors in console

### Post-Deployment

- [ ] **Manifest Served Correctly**

  - [ ] `https://aethex.dev/discord-manifest.json` returns valid JSON
  - [ ] Content-Type is `application/json`
  - [ ] No 404 errors

- [ ] **Activity Loads in Discord**

  - [ ] Can launch from Discord
  - [ ] No loading stuck state
  - [ ] User profile displays
  - [ ] Buttons work correctly

- [ ] **Console Logs Clear**
  - [ ] No errors prefixed with `[Discord Activity]`
  - [ ] Helpful debug logs present
  - [ ] No React warnings about navigation

## ✅ Advanced Compliance

### URL Mappings (If Needed)

- [ ] **External Resources Have Mappings**
  - [ ] Add to manifest if using external APIs
  - [ ] Format: `"/api/external": "https://api.example.com"`
  - [ ] Test that requests go through Discord proxy

### Cookie Handling (If Needed)

- [ ] **Cookies Use Correct Domain**
  - [ ] Domain: `578971245454950421.discordsays.com`
  - [ ] `SameSite=None` flag set
  - [ ] `Partitioned` flag set (if supporting third-party cookies)

### Security

- [ ] **No Sensitive Data in Activity**
  - [ ] Don't store auth tokens in Activity
  - [ ] Don't expose API keys
  - [ ] Use backend proxy for secure operations

## 🔍 Verification Steps

### Step 1: Code Review

```bash
# Check Activity component
grep -n "navigate\|useNavigate\|<Link\|href=" code/client/pages/Activity.tsx

# Check for router imports
grep -n "react-router" code/client/pages/Activity.tsx

# Result: Should find NO matches (except in comments)
```

### Step 2: Manifest Validation

```bash
# Check manifest domains
cat code/public/discord-manifest.json

# Should only show Discord proxy domain in rpc_origins
```

### Step 3: Runtime Testing

1. Launch Activity in Discord
2. Open DevTools (F12)
3. Check console for `[Discord Activity]` logs
4. Verify no errors about navigation/routing
5. Click buttons and verify they open in new windows
6. Reload Activity - should re-initialize properly

### Step 4: Cross-Origin Testing

1. In Discord DevTools:
   - Go to Console tab
   - Look for CORS errors
   - Should see ZERO CORS errors
2. If errors found:
   - Check manifest rpc_origins
   - Verify API endpoints are accessed through Discord proxy

## Common Issues & Fixes

| Issue                               | Cause                                | Fix                                         |
| ----------------------------------- | ------------------------------------ | ------------------------------------------- |
| Activity won't load                 | Missing frame_id in URL              | Check you're in Discord iframe              |
| "Cannot find module 'react-router'" | Router still imported                | Remove router imports                       |
| Links navigate within Activity      | Using `href` or `navigate()`         | Change to `window.open(..., "_blank")`      |
| User data doesn't load              | `/api/discord/activity-auth` failing | Check SDK authentication success            |
| CORS errors in console              | External domains in rpc_origins      | Remove from manifest, use Discord proxy     |
| Manifest 404 error                  | File not in public directory         | Move to `code/public/discord-manifest.json` |

## Certification Summary

When all items are checked, your Activity is:

✅ **Discord SPA Compliant** - Follows all official Discord Activity requirements
✅ **Properly Isolated** - Runs in sandbox without breaking iframe
✅ **Correctly Configured** - Manifest and SDK setup are proper
✅ **Ready for Production** - Can be deployed safely

## References

- Discord Activities Overview: https://discord.com/developers/docs/activities/overview
- SDK Reference: https://discord.com/developers/docs/activities/sdk-reference
- Best Practices: https://discord.com/developers/docs/activities/security
