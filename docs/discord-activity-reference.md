# Discord Activity Reference - Technical Documentation

**Complete API reference and technical details for Discord Activity integration**

---

## Table of Contents

1. [Discord SDK API](#discord-sdk-api)
2. [AeThex Discord Endpoints](#aethex-discord-endpoints)
3. [Authentication Methods](#authentication-methods)
4. [Event Handling](#event-handling)
5. [Discord Bot Commands](#discord-bot-commands)
6. [Error Codes](#error-codes)
7. [Rate Limits](#rate-limits)
8. [TypeScript Types](#typescript-types)

---

## Discord SDK API

### Initialization

```typescript
import { DiscordSDK } from '@discord/embedded-app-sdk';

const discordSdk = new DiscordSDK(clientId: string, options?: {
  disableConsoleLogOverride?: boolean;
});

// Wait for SDK to be ready
await discordSdk.ready();
```

### Authentication

#### `authenticate()`

Requests user authorization and returns an access token.

```typescript
const auth = await discordSdk.commands.authenticate({
  scopes: string[];  // OAuth2 scopes to request
  access_token?: string;  // Optional: re-use existing token
});

// Returns
interface AuthResponse {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;  // Seconds until expiration
  scopes: string[];
  user: {
    id: string;
    username: string;
    discriminator: string;
    avatar: string | null;
    public_flags: number;
  };
}
```

**Available Scopes:**
- `identify` - Read user profile (id, username, avatar)
- `email` - Read user email address
- `guilds` - See servers user is in
- `guilds.members.read` - Read user's guild member data

#### `authorize()`

Similar to `authenticate()` but doesn't return user data.

```typescript
const { code } = await discordSdk.commands.authorize({
  client_id: string;
  response_type: 'code';
  scope: string;  // Space-separated scopes
  state?: string;
});
```

### User Methods

#### Get Current User

```typescript
// Using Discord SDK
const user = await discordSdk.commands.getUser();

// Or via REST API
const response = await fetch('https://discord.com/api/v10/users/@me', {
  headers: {
    'Authorization': `Bearer ${access_token}`
  }
});
const user = await response.json();
```

**User Object:**
```typescript
interface DiscordUser {
  id: string;  // Snowflake ID
  username: string;
  discriminator: string;  // "0" for new usernames
  global_name: string | null;  // Display name
  avatar: string | null;  // Avatar hash
  bot?: boolean;
  system?: boolean;
  mfa_enabled?: boolean;
  banner?: string | null;
  accent_color?: number | null;
  locale?: string;
  verified?: boolean;
  email?: string | null;  // Requires 'email' scope
  flags?: number;
  premium_type?: number;
  public_flags?: number;
}
```

### Guild (Server) Methods

#### Get User Guilds

```typescript
const response = await fetch('https://discord.com/api/v10/users/@me/guilds', {
  headers: {
    'Authorization': `Bearer ${access_token}`
  }
});
const guilds = await response.json();
```

**Guild Object:**
```typescript
interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
  features: string[];
}
```

### Activity Context

#### Get Instance Info

Information about the current Discord Activity session.

```typescript
const instanceId = discordSdk.instanceId;  // Unique instance identifier
const channelId = discordSdk.channelId;    // Current channel ID
const guildId = discordSdk.guildId;        // Current guild ID
```

#### Get Participants

Get list of users currently in the Activity.

```typescript
const participants = await discordSdk.commands.getInstanceConnectedParticipants();

interface Participant {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  flags: number;
}
```

---

## AeThex Discord Endpoints

These are the backend API endpoints provided by AeThex for Discord integration.

### Authentication Endpoints

#### `POST /api/discord/oauth/start`

Initiates Discord OAuth flow.

**Query Parameters:**
- `action` (optional): `"login"` or `"link"`
- `redirectTo` (optional): URL to redirect after completion

**Response:**
```json
{
  "redirect": "https://discord.com/api/oauth2/authorize?..."
}
```

#### `GET /api/discord/oauth/callback`

Handles OAuth callback from Discord.

**Query Parameters:**
- `code`: Authorization code from Discord
- `state`: State parameter (contains action and session info)

**Behavior:**
- If `action=login`: Creates/logs in user, redirects to dashboard
- If `action=link`: Links Discord to existing user, redirects to connections tab

**Success Response:**
- Redirects to: `/dashboard?tab=connections` (link) or `/dashboard` (login)

**Error Response:**
- Redirects to: `/login?error=<code>&message=<details>`

### Account Linking Endpoints

#### `POST /api/discord/create-linking-session`

Creates a temporary session for Discord account linking.

**Headers:**
- `Authorization: Bearer <aethex_token>`

**Response:**
```json
{
  "sessionToken": "hex_string",
  "expiresAt": "2026-01-07T12:35:00Z"
}
```

**Session Duration:** 5 minutes

#### `POST /api/discord/link`

Links Discord account to authenticated user.

**Headers:**
- `Authorization: Bearer <aethex_token>`

**Body:**
```json
{
  "discordId": "123456789012345678",
  "username": "user#1234",
  "email": "user@example.com",
  "avatar": "avatar_hash"
}
```

**Response:**
```json
{
  "success": true,
  "discordLink": {
    "discord_id": "123456789012345678",
    "user_id": "uuid",
    "linked_at": "2026-01-07T12:00:00Z"
  }
}
```

#### `POST /api/discord/verify-code`

Verifies a 6-digit linking code from Discord bot `/verify` command.

**Body:**
```json
{
  "code": "123456",
  "discordId": "123456789012345678",
  "username": "user#1234"
}
```

**Response:**
```json
{
  "success": true,
  "userId": "uuid",
  "message": "Account linked successfully"
}
```

### Activity Endpoints

#### `POST /api/discord/activity-auth`

Exchanges Discord access token for AeThex session.

**Body:**
```json
{
  "accessToken": "discord_access_token"
}
```

**Response:**
```json
{
  "aethexToken": "jwt_token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "Username"
  }
}
```

#### `GET /api/discord/token`

Retrieves stored Discord tokens for a user.

**Headers:**
- `Authorization: Bearer <aethex_token>`

**Response:**
```json
{
  "accessToken": "discord_access_token",
  "refreshToken": "discord_refresh_token",
  "expiresAt": "2026-01-07T13:00:00Z"
}
```

### Admin Endpoints

#### `POST /api/discord/admin-register-commands`

Registers Discord bot slash commands.

**Headers:**
- `Authorization: Bearer <admin_token>`

**Response:**
```json
{
  "success": true,
  "commands": [
    { "name": "verify", "id": "cmd_id" }
  ]
}
```

---

## Authentication Methods

### Method 1: Discord Activity OAuth

For apps running inside Discord Activity.

```typescript
import { DiscordSDK } from '@discord/embedded-app-sdk';

const discordSdk = new DiscordSDK(clientId);
await discordSdk.ready();

// Authenticate with Discord
const { access_token } = await discordSdk.commands.authenticate({
  scopes: ['identify', 'email', 'guilds']
});

// Exchange for AeThex token
const response = await fetch('/api/discord/activity-auth', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ accessToken: access_token })
});

const { aethexToken, user } = await response.json();

// Use AeThex token for subsequent requests
fetch('/api/games', {
  headers: { 'Authorization': `Bearer ${aethexToken}` }
});
```

### Method 2: OAuth Redirect Flow

For standard web applications.

```typescript
// Step 1: Redirect to OAuth start endpoint
window.location.href = '/api/discord/oauth/start?action=login';

// Step 2: User authorizes on Discord

// Step 3: Discord redirects to /api/discord/oauth/callback
// Step 4: Backend processes callback and redirects to dashboard
// Step 5: User is logged in with session cookies
```

### Method 3: Account Linking

For linking Discord to existing AeThex account.

```typescript
// In your frontend (user must be logged in)
async function linkDiscordAccount() {
  // Create linking session
  const response = await fetch('/api/discord/create-linking-session', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${aethexToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  const { sessionToken } = await response.json();
  
  // Redirect to Discord OAuth with session token
  const state = btoa(JSON.stringify({
    action: 'link',
    sessionToken,
    redirectTo: '/dashboard?tab=connections'
  }));
  
  const oauthUrl = `https://discord.com/api/oauth2/authorize?` +
    `client_id=${discordClientId}&` +
    `redirect_uri=${encodeURIComponent(callbackUrl)}&` +
    `response_type=code&` +
    `scope=identify%20email%20guilds&` +
    `state=${state}`;
  
  window.location.href = oauthUrl;
}
```

### Method 4: Bot Verify Command

For Discord bot users to link accounts.

```typescript
// Discord bot generates code (server-side)
import { generateVerificationCode } from '@aethex/bot-utils';

const code = generateVerificationCode(discordUserId);
// Stores: { code: '123456', discord_id: '...', expires_at: ... }

// User visits verification page
// GET /discord-verify?code=123456

// Frontend auto-submits code
const response = await fetch('/api/discord/verify-code', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code: '123456',
    discordId: discordUserId,
    username: 'user#1234'
  })
});

if (response.ok) {
  // Account linked! Redirect to dashboard
  window.location.href = '/dashboard?tab=connections';
}
```

---

## Event Handling

### Activity Events

```typescript
discordSdk.subscribe('READY', () => {
  console.log('Activity is ready');
});

discordSdk.subscribe('VOICE_STATE_UPDATE', (voiceState) => {
  console.log('Voice state changed:', voiceState);
});

discordSdk.subscribe('SPEAKING_START', ({ userId }) => {
  console.log(`${userId} started speaking`);
});

discordSdk.subscribe('SPEAKING_STOP', ({ userId }) => {
  console.log(`${userId} stopped speaking`);
});

// Activity participants joined/left
discordSdk.subscribe('ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE', (participants) => {
  console.log('Participants updated:', participants);
});
```

---

## Discord Bot Commands

If you have a Discord bot, register these commands for better user experience.

### `/verify` Command

Links Discord account to AeThex.

**Registration:**
```typescript
{
  name: 'verify',
  description: 'Link your Discord account to AeThex',
  options: []
}
```

**Handler (bot code):**
```typescript
async function handleVerifyCommand(interaction) {
  const discordUserId = interaction.user.id;
  const discordUsername = `${interaction.user.username}#${interaction.user.discriminator}`;
  
  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store in database with 5min expiry
  await db.verification_codes.insert({
    code,
    discord_id: discordUserId,
    discord_username: discordUsername,
    expires_at: new Date(Date.now() + 5 * 60 * 1000)
  });
  
  // Send ephemeral message with link
  await interaction.reply({
    content: `🔗 Link your account:\n\n` +
             `Click: https://aethex.dev/discord-verify?code=${code}\n\n` +
             `Or enter code manually: **${code}**\n\n` +
             `⏱️ Code expires in 5 minutes.`,
    ephemeral: true
  });
}
```

---

## Error Codes

### OAuth Errors

| Code | Description | Solution |
|------|-------------|----------|
| `invalid_request` | Missing required parameter | Check OAuth URL parameters |
| `unauthorized_client` | Client not authorized | Verify client_id in Discord portal |
| `access_denied` | User denied authorization | User must authorize to continue |
| `unsupported_response_type` | Invalid response_type | Use `response_type=code` |
| `invalid_scope` | Invalid or unsupported scope | Check available scopes |
| `redirect_uri_mismatch` | Redirect URI not registered | Add URI to Discord OAuth2 settings |

### AeThex API Errors

| Status | Error Code | Description |
|--------|----------|-------------|
| 401 | `not_authenticated` | User not logged in or session expired |
| 403 | `discord_already_linked` | Discord account linked to different user |
| 404 | `user_not_found` | User doesn't exist |
| 409 | `email_exists` | Email already registered (use link instead) |
| 422 | `invalid_code` | Verification code invalid or expired |
| 500 | `server_error` | Internal server error |

---

## Rate Limits

### Discord API Rate Limits

- **Global:** 50 requests per second
- **Per Route:** Varies by endpoint (check headers)
- **OAuth Token:** 1 request per 10 seconds per user

**Response Headers:**
```
X-RateLimit-Limit: 50
X-RateLimit-Remaining: 49
X-RateLimit-Reset: 1641040800
X-RateLimit-Reset-After: 2.5
```

### AeThex API Rate Limits

- **Authentication endpoints:** 10 requests per minute per IP
- **Account linking:** 5 requests per minute per user
- **Activity auth:** 30 requests per minute per user

**Handling Rate Limits:**
```typescript
async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(url, options);
    
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      continue;
    }
    
    return response;
  }
  
  throw new Error('Max retries exceeded');
}
```

---

## TypeScript Types

### Discord Types

```typescript
interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  global_name: string | null;
  avatar: string | null;
  email?: string;
  verified?: boolean;
  mfa_enabled?: boolean;
  locale?: string;
  premium_type?: number;
  public_flags?: number;
}

interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
  features: string[];
}

interface OAuth2TokenResponse {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  refresh_token: string;
  scope: string;
}
```

### AeThex Types

```typescript
interface DiscordLinkResponse {
  success: boolean;
  discordLink: {
    discord_id: string;
    user_id: string;
    linked_at: string;
  };
}

interface ActivityAuthResponse {
  aethexToken: string;
  user: {
    id: string;
    email: string;
    full_name: string;
    avatar_url?: string;
  };
}

interface VerificationCodeResponse {
  success: boolean;
  userId: string;
  message: string;
}

interface LinkingSession {
  sessionToken: string;
  expiresAt: string;
}
```

---

## Database Schema

### `discord_links` Table

Stores Discord account linkages.

```sql
CREATE TABLE discord_links (
  discord_id TEXT PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  discord_username TEXT,
  discord_email TEXT,
  discord_avatar TEXT,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  linked_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_discord_links_user_id ON discord_links(user_id);
```

### `discord_linking_sessions` Table

Temporary sessions for OAuth linking flow.

```sql
CREATE TABLE discord_linking_sessions (
  session_token TEXT PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_linking_sessions_expires ON discord_linking_sessions(expires_at);
```

### `verification_codes` Table

6-digit codes for Discord bot `/verify` command.

```sql
CREATE TABLE verification_codes (
  code TEXT PRIMARY KEY,
  discord_id TEXT NOT NULL,
  discord_username TEXT NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_verification_codes_discord_id ON verification_codes(discord_id);
CREATE INDEX idx_verification_codes_expires ON verification_codes(expires_at);
```

---

## Related Documentation

- [Discord Integration Guide](./discord-integration-guide.md) - Getting started guide
- [Discord Deployment Guide](./discord-deployment.md) - Production deployment
- [AeThex API Reference](https://aethex.dev/api-reference) - Complete API docs
- [Discord Developer Portal](https://discord.com/developers/docs) - Official Discord docs

---

**Last Updated:** January 7, 2026  
**Discord API Version:** v10  
**AeThex SDK Version:** 2.0+
