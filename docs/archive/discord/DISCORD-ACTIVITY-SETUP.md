# Discord Activity Setup & Deployment Guide

## Overview

AeThex can be embedded as a Discord Activity, allowing users to access the platform directly within Discord servers. This guide covers the setup, configuration, and deployment process.

## What is a Discord Activity?

A Discord Activity is an embedded application that runs within Discord. It allows users to:

- Access AeThex features directly in Discord
- Share their experience with server members
- Collaborate in real-time without leaving Discord

## Architecture

```
Discord Server
    ↓
Discord Activity (https://aethex.dev/discord)
    ↓
AeThex Frontend + Backend
    ↓
Supabase + DevConnect DBs
```

## Prerequisites

- **Discord Application**: Application ID `578971245454950421`
- **Domain**: `https://aethex.dev` (must be a proper domain, not IP)
- **SSL/HTTPS**: Required for Discord Activities
- **Cloudflare**: Configured to allow traffic to aethex.dev

## Configuration Files

### 1. Discord Manifest (`code/public/discord-manifest.json`)

This file tells Discord how to handle the AeThex Activity:

```json
{
  "id": "578971245454950421",
  "name": "AeThex",
  "url": "https://aethex.dev",
  "instance_url": "https://aethex.dev/discord",
  "oauth2": {
    "client_id": "578971245454950421",
    "scopes": ["identify", "email", "guilds"],
    "redirect_uris": ["https://aethex.dev/discord/callback"]
  }
}
```

**Key Configuration Points:**

- `instance_url`: Where Discord Activity iframe loads (MUST be domain, not IP)
- `redirect_uris`: OAuth callback endpoint (MUST match Discord app settings)
- `scopes`: What Discord permissions the Activity requests

### 2. Code Configuration

**Frontend Pages** (`code/client/pages/`):

- `DiscordActivity.tsx` - Main Activity page mounted at `/discord`
- Discord OAuth callback handler at `/discord/callback`

**Context** (`code/client/contexts/DiscordContext.tsx`):

- Manages Discord user session
- Handles OAuth flow
- Exposes Discord user data to components

**Routes** (`code/client/App.tsx`):

```typescript
<Route path="/discord" element={<DiscordActivity />} />
<Route path="/discord/callback" element={<DiscordOAuthCallback />} />
```

### 3. HTML Configuration (`code/index.html`)

The Discord SDK is loaded in the HTML head:

```html
<script async src="https://cdn.discordapp.com/assets/embed.js"></script>
```

This must be present for Discord Activity to initialize.

## Local Testing

### Prerequisites

- Node.js 18+
- npm or yarn
- Running AeThex dev server

### Steps

1. **Start the dev server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. **Access locally via tunnel** (if testing Discord Activity):

   - Use a tool like `ngrok` to expose localhost to Discord
   - Or use Discord's local testing tools

3. **Test routes:**
   - Activity: `http://localhost:5173/discord` (becomes domain in production)
   - Callback: `http://localhost:5173/discord/callback`

### Local Testing Limitations

⚠️ **Note**: Discord Activities require HTTPS and a proper domain. Local testing with IP addresses will fail with **Cloudflare Error 1003**.

Local testing workarounds:

- Use `ngrok` with a tunnel URL
- Use Discord's local testing documentation
- Test OAuth flow after deploying to staging

## Deployment

### Production URLs (MUST use domain, not IP)

- **Activity URL**: `https://aethex.dev/discord`
- **OAuth Redirect**: `https://aethex.dev/discord/callback`
- **Manifest**: `https://aethex.dev/public/discord-manifest.json`

### Deployment Checklist

- [ ] App deployed to `aethex.dev` domain
- [ ] SSL/HTTPS certificate valid and active
- [ ] Cloudflare configured to allow traffic to aethex.dev
- [ ] Discord manifest file accessible at `/public/discord-manifest.json`
- [ ] Discord SDK script loads successfully in browser console
- [ ] OAuth redirect URIs match Discord app settings
- [ ] Discord Application ID is correct: `578971245454950421`

### Cloudflare Configuration

**Critical**: Cloudflare blocks direct IP access (Error 1003). Ensure:

1. DNS record for `aethex.dev` points to correct server/CDN
2. Cloudflare allows traffic to your origin
3. SSL/TLS encryption is enabled
4. No IP-based redirect rules that block Activity iframe

### Environment Variables

No special environment variables needed for Discord Activity. The configuration is done via:

- `code/public/discord-manifest.json`
- Discord Application settings
- `code/client/contexts/DiscordContext.tsx`

## OAuth Flow

### High-Level Flow

```
1. User opens AeThex Activity in Discord
2. DiscordActivity page loads (/discord)
3. Discord SDK initializes with manifest config
4. User clicks "Login with Discord"
5. Redirects to Discord's OAuth authorization page
6. User grants permissions (identify, email, guilds)
7. Discord redirects back to https://aethex.dev/discord/callback
8. DiscordOAuthCallback processes the authorization code
9. Backend exchanges code for access token
10. User session created, redirected to main Activity UI
```

### Implementation Details

**DiscordActivity.tsx** handles:

- Discord SDK initialization
- OAuth trigger and callback handling
- Activity UI rendering

**DiscordContext.tsx** manages:

- Discord user state
- Token storage
- Session lifecycle

**API calls** use Discord access token for:

- User identification
- Guild information
- Activity-specific operations

## Error Handling

### Cloudflare Error 1003: Direct IP Access Not Allowed

**Cause**: Accessing Activity via IP address instead of domain

**Solution**:

```
❌ http://192.168.1.100:5173/discord
✅ https://aethex.dev/discord
```

**Error Message in UI**:
Users will see a helpful error message explaining:

- The issue (Cloudflare blocking IP access)
- How to fix it (use domain instead)
- Troubleshooting steps

### Discord SDK Error

**Cause**: Discord SDK not loaded or manifest invalid

**Solution**:

- Verify Discord SDK script in `code/index.html`
- Check manifest is accessible at `/public/discord-manifest.json`
- Verify Discord Application ID: `578971245454950421`

## Testing Checklist

### Functional Tests

- [ ] Activity loads without Cloudflare errors
- [ ] Discord SDK initializes successfully
- [ ] OAuth flow completes successfully
- [ ] User is authenticated in AeThex after OAuth
- [ ] Activity can access user Discord profile info
- [ ] Activity can read server/guild information
- [ ] Multiple users can run Activity simultaneously

### Security Tests

- [ ] OAuth tokens are stored securely
- [ ] HTTPS enforced (no HTTP fallback)
- [ ] CORS headers properly configured
- [ ] No sensitive data in localStorage
- [ ] Logout properly clears session

### Browser Tests

- [ ] Works in Discord desktop client
- [ ] Works in Discord web client
- [ ] Works in Discord mobile app
- [ ] Responsive design works in Discord's narrow sidebar

## Troubleshooting

### Activity Won't Load

**Error**: Blank white screen in Discord Activity

**Debug Steps**:

1. Open browser DevTools in Discord
2. Check Console for errors
3. Check Network tab for failed requests
4. Verify domain is accessible (test in regular browser tab)
5. Verify Cloudflare isn't blocking traffic

**Common Causes**:

- IP address used instead of domain (Cloudflare Error 1003)
- Discord SDK script failed to load
- Manifest file not accessible
- CORS policy violation

### OAuth Not Working

**Error**: OAuth flow doesn't complete or redirect fails

**Debug Steps**:

1. Check Discord Application settings - redirect URIs match exactly
2. Verify OAuth callback route exists: `/discord/callback`
3. Check browser console for authorization error codes
4. Verify Discord Application permissions (identify, email, guilds)

**Common Causes**:

- Redirect URI mismatch between manifest and Discord app
- Discord Application doesn't have "Identify" scope enabled
- Activity not installed in Discord server

### User Can't See Guild Information

**Error**: Guild list is empty or shows no servers

**Debug Steps**:

1. Verify "guilds" scope is in OAuth config
2. Check user actually has permission in those guilds
3. Verify Discord OAuth token has guilds scope

## Deployment to Production

### Step 1: Build

```bash
npm run build
# or
yarn build
```

This creates optimized bundles in `dist/` directory.

### Step 2: Verify Configuration

- [ ] Discord manifest is in `dist/public/discord-manifest.json`
- [ ] All routes are correctly wired in App.tsx
- [ ] No hardcoded localhost URLs

### Step 3: Deploy

Using your deployment provider (Netlify, Vercel, custom):

```bash
# Deploy dist/ folder to https://aethex.dev
```

### Step 4: Verify in Production

1. Access `https://aethex.dev/discord` in browser
2. Check DevTools Console for errors
3. Try Discord Activity in actual Discord server
4. Test OAuth flow end-to-end

### Step 5: Add to Discord

In Discord Developer Portal:

1. Go to Application Settings
2. Add Activity URL: `https://aethex.dev/discord`
3. Set OAuth2 Redirect URIs to: `https://aethex.dev/discord/callback`
4. Publish Application
5. Users can now install AeThex Activity in servers

## File Structure

```
code/
├── client/
│   ├── pages/
│   │   └── DiscordActivity.tsx        # Main Activity page
│   ├── contexts/
│   │   └── DiscordContext.tsx         # Discord OAuth/session management
│   └── App.tsx                        # Routes: /discord, /discord/callback
├── index.html                         # Discord SDK script loaded here
├── public/
│   └── discord-manifest.json          # Discord Activity configuration
└── docs/
    └── DISCORD-ACTIVITY-SETUP.md      # This file
```

## Related Documentation

- **IP Governance**: `code/docs/IP-GOVERNANCE-FRAMEWORK.md` - Data ownership and licensing
- **Onboarding**: `code/client/pages/Onboarding.tsx` - User onboarding flow
- **Authentication**: `code/client/contexts/AuthContext.tsx` - Primary auth system

## Support

For issues or questions:

1. **Check this guide** for common troubleshooting
2. **Check Discord Developer Docs**: https://discord.com/developers/docs/activities/building-an-app
3. **Check browser console** for specific error messages
4. **Verify domain/DNS** configuration with Cloudflare

## Version History

- **v1.0.0** (Current)
  - Discord Activity foundation
  - OAuth 2.0 integration
  - Cloudflare Error 1003 handling
  - Multi-user support

---

Last Updated: 2024
Maintained by: AeThex Engineering Team
