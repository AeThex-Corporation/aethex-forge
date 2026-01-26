# Discord Integration Guide - Getting Started

**Build games and experiences that run inside Discord**

---

## Overview

AeThex can be embedded as a Discord Activity, allowing users to access your games directly within Discord servers. This guide will help you integrate Discord Activity into your AeThex game in 5 minutes.

### What is a Discord Activity?

A Discord Activity is an embedded application that runs within Discord. With AeThex Discord integration, you can:

- ✅ Launch your game directly inside Discord servers
- ✅ Share real-time experiences with server members  
- ✅ Authenticate users seamlessly with Discord OAuth
- ✅ Enable voice chat and collaboration without leaving Discord
- ✅ Reach Discord's 150M+ active users

### Architecture Overview

```
User in Discord Server
        ↓
Launches AeThex Activity
        ↓
Your Game loads in Discord iframe
        ↓
AeThex SDK handles authentication & state
        ↓
Your game logic runs normally
```

---

## Prerequisites

Before you begin, ensure you have:

- ✅ **Discord Application** registered at [Discord Developer Portal](https://discord.com/developers/applications)
- ✅ **HTTPS domain** (Discord Activities require SSL/TLS)
- ✅ **AeThex account** with API credentials
- ✅ **Node.js 18+** installed for development

> **Note:** Discord Activities do NOT work with IP addresses or `localhost` (except for local SDK testing). You must use a proper domain.

---

## Quick Start (5 minutes)

### Step 1: Enable Discord Activity in Developer Portal

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application (or create a new one)
3. Navigate to **General Information** tab
4. Scroll to **Activity Settings** section
5. Click **Enable Activities** (if not already enabled)
6. Set **Activity URL** to: `https://yourdomain.com/discord`
7. Set **Interactions Endpoint URL** to: `https://yourdomain.com/api/discord/interactions`
8. Click **Save Changes**

### Step 2: Configure OAuth2 Redirect URIs

1. In Discord Developer Portal, go to **OAuth2** tab
2. Under **Redirects**, add:
   ```
   https://yourdomain.com/api/discord/oauth/callback
   https://yourdomain.com/discord/callback
   ```
3. Under **OAuth2 Scopes**, ensure these are enabled:
   - ✅ `identify` (read user profile)
   - ✅ `email` (read user email)
   - ✅ `guilds` (see servers user is in)
4. Click **Save Changes**

> **Important:** Wait 1-2 minutes for Discord to propagate your changes.

### Step 3: Install AeThex SDK

```bash
npm install @aethex/sdk
# or
yarn add @aethex/sdk
```

### Step 4: Configure Environment Variables

Create a `.env` file in your project root:

```env
# Discord Application
VITE_DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_PUBLIC_KEY=your_discord_public_key

# AeThex API
AETHEX_API_KEY=your_aethex_api_key

# Supabase (for user data)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE=your_service_role_key
```

> **Security Note:** Never commit `CLIENT_SECRET` or `SERVICE_ROLE` keys to version control.

### Step 5: Create Discord Activity Page

Create a new page at `/discord` in your app:

```typescript
// src/pages/DiscordActivity.tsx
import { useEffect } from 'react';
import { DiscordSDK } from '@discord/embedded-app-sdk';

export default function DiscordActivity() {
  useEffect(() => {
    // Initialize Discord SDK
    const discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);
    
    discordSdk.ready().then(() => {
      console.log('Discord SDK is ready!');
      
      // Authenticate user
      discordSdk.commands.authenticate({
        scopes: ['identify', 'email', 'guilds']
      }).then(({ access_token }) => {
        // User is authenticated!
        // Now you can access Discord user data
        console.log('User authenticated:', access_token);
      });
    });
  }, []);

  return (
    <div className="discord-activity">
      <h1>Welcome to AeThex Activity!</h1>
      <p>Your game content goes here...</p>
    </div>
  );
}
```

### Step 6: Add Route

In your router configuration:

```typescript
// src/App.tsx (React Router)
import DiscordActivity from './pages/DiscordActivity';

<Route path="/discord" element={<DiscordActivity />} />
```

### Step 7: Test Your Activity

1. **Add your bot to a test Discord server:**
   - Go to Discord Developer Portal → **OAuth2** → **URL Generator**
   - Select scopes: `bot`, `applications.commands`
   - Copy the generated URL and paste in browser
   - Select a test server and authorize

2. **Launch the Activity:**
   - In Discord, click on your bot
   - Look for "Activities" or right-click → **Apps**
   - Select your Activity
   - It should open in a modal within Discord

3. **Verify it works:**
   - Open browser console (F12)
   - Check for "Discord SDK is ready!" message
   - Verify no errors

---

## Authentication Flow

Discord Activities use OAuth2 for user authentication. Here's how it works:

### 1. User Flow

```
User clicks "Launch Activity" in Discord
        ↓
Discord SDK initializes in your app
        ↓
Your app calls discordSdk.commands.authenticate()
        ↓
Discord prompts user to authorize (first time only)
        ↓
Discord returns access_token
        ↓
Your app exchanges token for user profile
        ↓
User is authenticated and can play!
```

### 2. Implementation Example

```typescript
import { DiscordSDK } from '@discord/embedded-app-sdk';
import { AeThex } from '@aethex/sdk';

// Initialize Discord SDK
const discordSdk = new DiscordSDK(process.env.VITE_DISCORD_CLIENT_ID);

// Initialize AeThex SDK
const aethex = new AeThex({
  apiKey: process.env.AETHEX_API_KEY
});

async function authenticateUser() {
  // Wait for Discord SDK to be ready
  await discordSdk.ready();
  
  // Authenticate with Discord
  const { access_token } = await discordSdk.commands.authenticate({
    scopes: ['identify', 'email', 'guilds']
  });
  
  // Get Discord user profile
  const response = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${access_token}` }
  });
  const discordUser = await response.json();
  
  // Link to AeThex account
  const aethexUser = await aethex.auth.loginWithDiscord({
    discordId: discordUser.id,
    email: discordUser.email,
    username: discordUser.username,
    avatar: discordUser.avatar
  });
  
  return aethexUser;
}
```

---

## Detecting Discord Activity Context

Your app should detect when it's running inside Discord and adjust the UI accordingly:

```typescript
// src/utils/discord.ts
export function isRunningInDiscord(): boolean {
  // Check if Discord SDK is available
  if (typeof window !== 'undefined') {
    return window.location.pathname.startsWith('/discord') ||
           window.location.search.includes('frame_id=');
  }
  return false;
}

// Use in components
import { isRunningInDiscord } from '@/utils/discord';

function MyComponent() {
  const inDiscord = isRunningInDiscord();
  
  return (
    <div>
      {inDiscord ? (
        <DiscordActivityLayout>
          {/* Activity-specific UI */}
        </DiscordActivityLayout>
      ) : (
        <StandardLayout>
          {/* Normal web UI */}
        </StandardLayout>
      )}
    </div>
  );
}
```

---

## Account Linking

Allow users to link their existing AeThex account with Discord:

### Option 1: Link from Dashboard

Users can link Discord from their account settings:

```typescript
// In your Dashboard/Settings page
import { useAuth } from '@/contexts/AuthContext';

function ConnectionsTab() {
  const { linkProvider } = useAuth();
  
  const handleLinkDiscord = async () => {
    try {
      await linkProvider('discord');
      alert('Discord account linked successfully!');
    } catch (error) {
      console.error('Failed to link Discord:', error);
    }
  };
  
  return (
    <button onClick={handleLinkDiscord}>
      Link Discord Account
    </button>
  );
}
```

### Option 2: Link via `/verify` Command (Discord Bot)

If you have a Discord bot, users can type `/verify` in Discord to get a linking code:

1. User types `/verify` in Discord
2. Bot generates a 6-digit code
3. User visits `yourdomain.com/discord-verify?code=123456`
4. Account is linked automatically

Implementation example in [Discord Activity Reference](./discord-activity-reference.md#bot-commands).

---

## Best Practices

### ✅ Do's

- ✅ **Always use HTTPS** - Discord requires secure connections
- ✅ **Handle authentication errors gracefully** - Show helpful error messages
- ✅ **Optimize for Discord's iframe size** - Test responsive layouts
- ✅ **Cache Discord user data** - Reduce API calls
- ✅ **Test on multiple devices** - Desktop and mobile Discord apps

### ❌ Don'ts

- ❌ **Don't use IP addresses** - Discord won't load your Activity
- ❌ **Don't store tokens in localStorage** - Use secure HTTP-only cookies
- ❌ **Don't assume all users have Discord** - Support web login too
- ❌ **Don't make excessive API calls** - Respect rate limits
- ❌ **Don't forget error handling** - Network issues happen

---

## Common Issues & Solutions

### Issue: "Could not fetch application data"

**Cause:** Activities feature not enabled or Activity URL not set

**Solution:**
1. Go to Discord Developer Portal
2. Enable Activities in General Information
3. Set Activity URL to your domain
4. Wait 2 minutes for changes to propagate

### Issue: "Failed to authenticate"

**Cause:** OAuth redirect URI not registered

**Solution:**
1. Go to Discord Developer Portal → OAuth2
2. Add your callback URL: `https://yourdomain.com/api/discord/oauth/callback`
3. Save and wait 2 minutes

### Issue: "Session lost during OAuth"

**Cause:** Cookies not being sent with OAuth callback

**Solution:**
1. Ensure your API domain matches your frontend domain
2. Set cookies with `SameSite=Lax` or `SameSite=None; Secure`
3. Verify OAuth callback URL is EXACTLY as registered in Discord portal

For more troubleshooting tips, see [Discord Deployment Guide](./discord-deployment.md#troubleshooting).

---

## Next Steps

Now that you have Discord Activity integrated, explore these advanced features:

- 📚 [Discord Activity Reference](./discord-activity-reference.md) - Complete API documentation
- 🚀 [Discord Deployment Guide](./discord-deployment.md) - Production deployment checklist
- 🎮 [Example Projects](../examples/discord-games) - Sample Discord Activity games
- 💬 [Community Support](https://discord.gg/aethex) - Get help from the community

---

## Need Help?

- 📖 [Full Documentation](https://aethex.dev/docs)
- 💬 [Discord Community](https://discord.gg/aethex)
- 📧 [Support Email](mailto:support@aethex.dev)
- 🐛 [Report Issues](https://github.com/AeThex-Corporation/aethex-forge/issues)

---

**Last Updated:** January 7, 2026  
**AeThex SDK Version:** 2.0+  
**Discord SDK Version:** 1.0+
