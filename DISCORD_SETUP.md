# Discord Activity Setup Guide

This guide explains how to set up and deploy the AeThex platform as a Discord Activity.

## Overview

AeThex can now be embedded as a Discord Activity, allowing users to access the full platform directly within Discord. The integration uses:

- **Discord SDK** for Activity context detection and user authentication
- **Discord OAuth 2.0** for secure user verification
- **React Context** for managing Discord user state

## Prerequisites

- **Discord Application ID**: `578971245454950421`
- **Discord Client Secret** (from Discord Developer Portal)
- **Discord Public Key** (from Discord Developer Portal)
- **Deployed Application URL**: `https://aethex.dev`

## Configuration Steps

### 1. Discord Developer Portal Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Open your application (ID: `578971245454950421`)
3. Navigate to **General Information**
4. Copy your **Public Key** and **Client Secret** and save them securely
5. Go to **OAuth2 > General** and add Redirect URI:
   - `https://aethex.dev/discord/callback`

### 2. Environment Variables

Set these environment variables in your deployment:

**For Netlify/Vercel:**
```bash
VITE_DISCORD_CLIENT_ID=578971245454950421
DISCORD_CLIENT_SECRET=your-client-secret-here
DISCORD_PUBLIC_KEY=your-public-key-here
DISCORD_REDIRECT_URI=https://aethex.dev/discord/callback
```

**For Local Development:**
```bash
# .env or via DevServerControl
VITE_DISCORD_CLIENT_ID=578971245454950421
DISCORD_CLIENT_SECRET=your-client-secret-here
DISCORD_PUBLIC_KEY=your-public-key-here
PUBLIC_BASE_URL=http://localhost:5173
```

### 3. Get Your Public Key

1. In Discord Developer Portal, go to **General Information**
2. Copy your **Public Key** (located in the Application ID section)
3. Add it to your environment variables:
   ```bash
   DISCORD_PUBLIC_KEY=your-public-key-here
   ```

### 4. Activity Configuration in Discord

In the Discord Developer Portal for your application:

1. Go to **App Details** or **General Information**
2. Find the **Interactions Endpoint URL** field
3. Set it to: `https://aethex.dev/api/discord/interactions`
4. Discord will verify this endpoint automatically
5. Once verified, find "Activities" section and set the **Activity URL** to:
   - `https://aethex.dev/discord`
6. Enable "Requires OAuth2 Code Grant"

### 4. Deploy the Application

The application is now ready to be deployed. All changes include:

- **Discord Context Provider** (`code/client/contexts/DiscordContext.tsx`)
- **Discord Activity Page** (`code/client/pages/DiscordActivity.tsx`)
- **OAuth Callback Handler** (`code/client/pages/DiscordOAuthCallback.tsx`)
- **API Endpoint** (`/api/discord/oauth/callback`)
- **Discord SDK Integration** (in `index.html`)

## How It Works

### Activity Flow

1. **User launches Activity**: User opens the Discord Activity in a Discord server
2. **SDK Initialization**: `DiscordContext` attempts to load and initialize Discord SDK
3. **User Detection**: If in Discord Activity context, user info is retrieved from Discord
4. **Authentication**: 
   - If in Discord Activity: User is automatically identified via Discord
   - If standard OAuth: User is redirected to Discord OAuth flow
5. **App Access**: User gains full access to AeThex platform with Discord credentials

### Routes

- **`/discord`** - Main Discord Activity page
- **`/discord/callback`** - OAuth callback handler (redirects to dashboard)
- **`/api/discord/oauth/callback`** - Backend OAuth token exchange

## Usage

### For Users

Users can access AeThex as a Discord Activity by:

1. Going to their Discord server
2. Clicking on "Activities" (rocket icon)
3. Searching for or selecting "AeThex"
4. Activity launches in the Discord client

### For Developers

To integrate Discord authentication in components:

```typescript
import { useDiscord } from '@/contexts/DiscordContext';

export function MyComponent() {
  const { isDiscordActivity, discordUser, initiateDiscordOAuth } = useDiscord();

  return (
    <div>
      {isDiscordActivity ? (
        <p>Running as Discord Activity for {discordUser?.username}</p>
      ) : (
        <button onClick={initiateDiscordOAuth}>
          Connect with Discord
        </button>
      )}
    </div>
  );
}
```

## Troubleshooting

### SDK Not Loading

If Discord SDK doesn't load:
- Check that you're running the Activity in Discord (not a web browser)
- Verify the Activity URL is correctly configured in Discord Developer Portal
- Check browser console for SDK loading errors

### OAuth Failures

If OAuth fails:
- Verify `DISCORD_CLIENT_SECRET` is set correctly
- Confirm redirect URI matches Discord Developer Portal settings
- Check server logs for token exchange errors

### User Not Detected

If Discord user info isn't available:
- The Activity might not have proper permissions
- User might not be authenticated with Discord
- Check Discord SDK `ready()` promise resolved successfully

## Security Considerations

1. **Client Secret**: Keep `DISCORD_CLIENT_SECRET` secure (never expose in frontend)
2. **OAuth State**: Discord SDK handles state validation automatically
3. **Redirect URI**: Only whitelist your official domain
4. **Token Storage**: OAuth tokens are stored securely in `localStorage`
5. **CORS**: Discord Activities run in isolated context; standard CORS doesn't apply

## API Documentation

### `POST /api/discord/oauth/callback`

Exchanges Discord authorization code for access token.

**Request:**
```json
{
  "code": "authorization_code",
  "state": "optional_state_value"
}
```

**Response:**
```json
{
  "ok": true,
  "access_token": "token",
  "discord_user": {
    "id": "user_id",
    "username": "username",
    "avatar": "avatar_url",
    "email": "user@example.com"
  }
}
```

## Final Setup in Discord Developer Portal

1. In Discord Developer Portal, go to your application's **General Information** page
2. Find the **Interactions Endpoint URL** field
3. Enter: `https://aethex.dev/api/discord/interactions`
4. Discord will automatically verify this endpoint by sending a PING request
5. Once verified, save the changes
6. Navigate to the **Activities** section (or embedded app settings)
7. Set the **Activity URL** to: `https://aethex.dev/discord`
8. Enable "Requires OAuth2 Code Grant" if available

## Next Steps

1. Set environment variables in your deployment:
   - `DISCORD_CLIENT_SECRET`
   - `DISCORD_PUBLIC_KEY`
2. Deploy the application
3. Configure the Interactions Endpoint URL in Discord Developer Portal
4. Test the Activity in a Discord server
5. Monitor logs for any issues

## Support

For issues or questions:
- Check Discord Developer Portal documentation: https://discord.dev
- Review error logs in server console
- Contact support@aethex.tech
