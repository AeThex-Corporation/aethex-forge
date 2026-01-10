# Discord Activity SPA Implementation Guide

## Overview

This document describes the isolated Discord Activity implementation for AeThex. The Activity is now a true Single-Page Application (SPA) that runs entirely within Discord's iframe and complies with Discord's Activity requirements.

## Architecture

### Isolated SPA Pattern (Option A)

The Activity is completely isolated from the main AeThex app:

```
Discord Client
    ↓
    └─→ Activity Iframe (SPA)
        ├─ Discord SDK initialization
        ├─ OAuth flow via postMessage
        ├─ User profile display
        ├─ Realm/Arm information
        └─ Quick action buttons (open in new window)
            ↓
            └─→ Main App (https://aethex.dev) opens in new tab
```

## Key Changes from Previous Implementation

### 1. **Removed Router Navigation**

- **Before:** Activity used `useNavigate()` to redirect within React Router
- **After:** Activity is completely self-contained, no internal navigation

### 2. **Links Now Open in New Windows**

- **Before:** `<a href="/creators">` navigated within the iframe
- **After:** `<button onClick={() => window.open(url, "_blank")}>` opens the main app in a new tab
- This allows users to see full features without breaking Activity isolation

### 3. **Simplified Manifest**

- **Before:** Manifest referenced multiple domains including aethex.dev
- **After:** Manifest ONLY references Discord proxy domain (`578971245454950421.discordsays.com`)
- This ensures Activity is properly sandboxed through Discord's proxy

## File Changes

### code/client/pages/Activity.tsx

**Removed:**

```typescript
import { useNavigate } from "react-router-dom";
const navigate = useNavigate();
useEffect(() => {
  if (!isActivity && !isLoading) {
    navigate("/", { replace: true });
  }
}, [isActivity, isLoading, navigate]);
```

**Added:**

```typescript
import { useState } from "react";
const [showContent, setShowContent] = useState(false);

useEffect(() => {
  if (isActivity && !isLoading) {
    setShowContent(true);
  }
}, [isActivity, isLoading]);
```

**Link Changes:**

```typescript
// Before:
<a href="/creators" className="...">🎨 Browse Creators</a>

// After:
<button
  onClick={() => window.open(`${appBaseUrl}/creators`, "_blank")}
  className="..."
>
  🎨 Browse Creators
</button>
```

### code/public/discord-manifest.json

**Before:**

```json
{
  "rpc_origins": [
    "https://aethex.dev",
    "https://discord.com",
    "https://*.discordsays.com",
    "https://578971245454950421.discordsays.com"
  ],
  "interactions": {
    "request_url": "https://aethex.dev/api/discord/interactions"
  }
}
```

**After:**

```json
{
  "rpc_origins": ["https://578971245454950421.discordsays.com"]
}
```

## Discord Compliance

### ✅ What This Implementation Does Right

1. **True SPA** - Activity never navigates away from itself
2. **Proper Iframe Isolation** - No breaking out of Discord's sandbox
3. **PostMessage Protocol** - Uses Discord SDK which handles postMessage communication
4. **Proxy Domain Only** - Manifest restricted to Discord proxy domain
5. **No External Navigation** - Links open in new windows, don't break the Activity

### ⚠️ Important Limitations

1. **Activity is Read-Only for Display** - Can't directly modify the main app from Activity
2. **No Shared Navigation** - Activity can't control main app routing
3. **Data Sync Limitation** - Activity shows cached/API data, not real-time main app state
4. **URL Mappings Required** - Any external resources accessed by Activity need URL mappings in manifest

## Testing the Activity

### Prerequisites

1. Have a Discord server where you're an admin
2. Have registered the AeThex application on Discord Developer Portal
3. Have installed the AeThex bot in your test server

### Local Testing

1. Start the dev server:

   ```bash
   npm run dev
   ```

2. Open Discord and find an Activity that can be launched

   - Right-click on a voice channel
   - Select "Launch Activity"
   - Look for "AeThex Activity"

3. Expected behavior:
   - Activity loads without errors
   - User profile displays correctly
   - Buttons open links in new tabs (not navigate within Activity)
   - Discord commands still work (`/profile`, `/set-realm`, etc.)

### Deployment Testing

1. After deploying to production:

   ```bash
   npm run build
   npm start
   ```

2. Update Discord Developer Portal with production URL
3. Test in Discord with production URL

## Future Enhancements

### Expanding Activity Features Without Breaking SPA

If you want to add more features to the Activity without breaking isolation, use the **Nested Messages Pattern**:

```typescript
// Activity sends message to parent window (if applicable)
if (window.opener) {
  window.opener.postMessage(
    {
      type: "navigate",
      path: "/opportunities",
    },
    "https://aethex.dev",
  );
}
```

### URL Mappings for External Resources

If Activity needs to access external APIs, update the manifest:

```json
{
  "interactions": {
    "request_url": "https://aethex.dev/api/discord/interactions"
  },
  "rpc_origins": ["https://578971245454950421.discordsays.com"],
  "url_mapping": {
    "/api/external": "https://api.external-service.com",
    "/uploads": "https://cdn.aethex.dev/uploads"
  }
}
```

Then in code, use relative paths:

```typescript
fetch("/api/external/data"); // Discord proxy transforms to https://api.external-service.com/data
```

## Troubleshooting

### Activity Won't Load

1. **Check browser console** for `[Discord Activity]` logs
2. **Verify frame_id** in URL - should be present in Discord iframe
3. **Check CORS settings** - Activity may be blocked by CORS policies
4. **Verify manifest** - Make sure manifest.json is served correctly

### Links Not Working

1. **Ensure target="\_blank" or window.open()** - Regular navigation breaks Activity
2. **Check URL construction** - Verify full URL is correct
3. **Test in separate browser tab** - Verify links work outside Activity

### User Profile Not Loading

1. **Check /api/discord/activity-auth** endpoint
2. **Verify Supabase integration** - User data must exist in database
3. **Check token expiry** - OAuth token may have expired

## Configuration Checklist

- [ ] Activity route exists in code/client/App.tsx
- [ ] Discord manifest present at code/public/discord-manifest.json
- [ ] DiscordActivityContext properly initialized in App.tsx
- [ ] Backend OAuth endpoints configured (/api/discord/activity-auth)
- [ ] Discord Developer Portal has manifest URL configured
- [ ] Test server has AeThex bot installed
- [ ] All links use window.open() with "\_blank" target
- [ ] No React Router navigation in Activity component

## Related Documentation

- [Discord Activities Official Docs](https://discord.com/developers/docs/activities/overview)
- [Discord Embedded App SDK Reference](https://discord.com/developers/docs/activities/sdk-reference)
- [DISCORD-ACTIVITY-SETUP.md](./DISCORD-ACTIVITY-SETUP.md) - Initial setup guide
- [DISCORD-ADMIN-COMMANDS-REGISTRATION.md](./DISCORD-ADMIN-COMMANDS-REGISTRATION.md) - Bot commands
