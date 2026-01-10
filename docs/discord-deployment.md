# Discord Deployment Guide - Production Checklist

**Complete guide for deploying Discord Activity to production**

---

## Pre-Deployment Checklist

Before deploying your Discord Activity, ensure:

- ✅ **Discord Application** properly configured in Developer Portal
- ✅ **HTTPS domain** with valid SSL certificate
- ✅ **Environment variables** configured correctly
- ✅ **Database migrations** applied
- ✅ **Bot commands** registered (if using Discord bot)
- ✅ **Local testing** completed successfully

---

## Part 1: Discord Developer Portal Configuration

### Step 1: Enable Activities Feature

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application
3. Navigate to **General Information** tab
4. Scroll to **Activity Settings**
5. Click **Enable Activities** (if not already enabled)

### Step 2: Configure Activity URLs

In the **Activity Settings** section:

**Activity URL:**
```
https://yourdomain.com/discord
```

**Interactions Endpoint URL:**
```
https://yourdomain.com/api/discord/interactions
```

**Important Notes:**
- Must use HTTPS (not HTTP)
- No trailing slashes
- Must match your actual domain exactly
- Wait 1-2 minutes after saving for changes to propagate

### Step 3: Set Up OAuth2

1. Go to **OAuth2** → **General**
2. Note your **Client ID** and **Client Secret**
3. Go to **OAuth2** → **URL Generator**
4. Under **Redirects**, add:

```
https://yourdomain.com/api/discord/oauth/callback
https://yourdomain.com/discord/callback
```

5. Under **OAuth2 Scopes**, select:
   - ✅ `identify`
   - ✅ `email`
   - ✅ `guilds`

6. Click **Save Changes**

### Step 4: Get Your Public Key

1. In **General Information** tab
2. Copy **Public Key** (64-character hex string)
3. Save for environment variables

### Step 5: Verify Interactions Endpoint

Discord will automatically test your Interactions Endpoint:

1. After setting the URL, Discord sends a PING request
2. You should see a green checkmark appear
3. If it fails:
   - Verify your API is deployed and accessible
   - Check that `DISCORD_PUBLIC_KEY` is set correctly
   - Ensure endpoint responds with `{ "type": 1 }` for PING requests

---

## Part 2: Environment Variables Configuration

### Production Environment Variables

Create these environment variables in your hosting platform (Vercel, Netlify, Railway, etc.):

#### Frontend Variables

```env
# Discord Application
VITE_DISCORD_CLIENT_ID=your_discord_client_id

# API Configuration
VITE_API_BASE=https://yourdomain.com

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

#### Backend Variables

```env
# Discord Application (Server-side)
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_PUBLIC_KEY=your_discord_public_key

# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE=your_service_role_key

# Security
DISCORD_ADMIN_REGISTER_TOKEN=create_a_random_secure_token
SESSION_SECRET=create_a_random_secure_token

# Optional: Discord Bot (if using /verify command)
DISCORD_BOT_TOKEN=your_bot_token
```

### Generating Secure Tokens

```bash
# Generate random tokens (Linux/Mac)
openssl rand -hex 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Part 3: Database Setup

### Run Migrations

Ensure these tables exist in your database:

```sql
-- Discord account links
CREATE TABLE IF NOT EXISTS discord_links (
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

CREATE INDEX IF NOT EXISTS idx_discord_links_user_id 
  ON discord_links(user_id);

-- Temporary linking sessions
CREATE TABLE IF NOT EXISTS discord_linking_sessions (
  session_token TEXT PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_linking_sessions_expires 
  ON discord_linking_sessions(expires_at);

-- Verification codes (for /verify command)
CREATE TABLE IF NOT EXISTS verification_codes (
  code TEXT PRIMARY KEY,
  discord_id TEXT NOT NULL,
  discord_username TEXT NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_verification_codes_discord_id 
  ON verification_codes(discord_id);
CREATE INDEX IF NOT EXISTS idx_verification_codes_expires 
  ON verification_codes(expires_at);
```

### Set Up Cleanup Job

Old sessions and codes should be cleaned up automatically:

```sql
-- Create cleanup function
CREATE OR REPLACE FUNCTION cleanup_expired_discord_data()
RETURNS void AS $$
BEGIN
  -- Delete expired linking sessions
  DELETE FROM discord_linking_sessions
  WHERE expires_at < NOW();
  
  -- Delete expired verification codes
  DELETE FROM verification_codes
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Schedule to run hourly (PostgreSQL + pg_cron)
SELECT cron.schedule('cleanup-discord-data', '0 * * * *', 
  'SELECT cleanup_expired_discord_data()');
```

Or use a scheduled serverless function (Vercel Cron, etc.):

```typescript
// api/cron/cleanup-discord.ts
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: Request) {
  // Verify cron secret
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE!
  );
  
  // Clean up expired sessions
  await supabase
    .from('discord_linking_sessions')
    .delete()
    .lt('expires_at', new Date().toISOString());
  
  // Clean up expired codes
  await supabase
    .from('verification_codes')
    .delete()
    .lt('expires_at', new Date().toISOString());
  
  return new Response('OK', { status: 200 });
}
```

---

## Part 4: Deploy Your Application

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Set environment variables
vercel env add DISCORD_CLIENT_SECRET
vercel env add SUPABASE_SERVICE_ROLE
# ... add all other secrets
```

### Netlify Deployment

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod

# Set environment variables via Netlify UI:
# Site Settings → Environment Variables
```

### Railway Deployment

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up

# Set environment variables
railway variables set DISCORD_CLIENT_SECRET=your_secret
# ... add all other secrets
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy app files
COPY . .

# Build
RUN npm run build

# Expose port
EXPOSE 8080

# Start
CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t aethex-app .
docker run -p 8080:8080 \
  -e DISCORD_CLIENT_SECRET=your_secret \
  -e SUPABASE_SERVICE_ROLE=your_key \
  aethex-app
```

---

## Part 5: Register Discord Bot Commands

If you're using a Discord bot for `/verify` command:

### Option A: Via API Endpoint

```bash
curl -X POST https://yourdomain.com/api/discord/admin-register-commands \
  -H "Authorization: Bearer YOUR_DISCORD_ADMIN_REGISTER_TOKEN" \
  -H "Content-Type: application/json"
```

### Option B: Via Script

```bash
npm run register-commands
```

### Option C: Manual Registration

```typescript
// scripts/register-commands.ts
import { REST, Routes } from 'discord.js';

const commands = [
  {
    name: 'verify',
    description: 'Link your Discord account to AeThex'
  }
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN!);

async function registerCommands() {
  try {
    console.log('Registering slash commands...');
    
    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!),
      { body: commands }
    );
    
    console.log('Successfully registered commands!');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
}

registerCommands();
```

---

## Part 6: Testing in Production

### Test Checklist

#### 1. Test Activity Launch

- [ ] Add your bot to a test Discord server
- [ ] Right-click bot → Apps → Your Activity
- [ ] Activity opens in modal
- [ ] No console errors

#### 2. Test Authentication

- [ ] Click "Login with Discord" in Activity
- [ ] Discord authorization prompt appears
- [ ] After authorizing, user is logged in
- [ ] User profile data is correct

#### 3. Test Account Linking

- [ ] Log in to web app (not Activity)
- [ ] Go to Dashboard → Connections
- [ ] Click "Link Discord"
- [ ] After authorizing, Discord appears in connections
- [ ] No session loss

#### 4. Test Bot /verify Command

- [ ] Type `/verify` in Discord
- [ ] Bot responds with link and code
- [ ] Click link, redirects to verification page
- [ ] Account links successfully
- [ ] Discord appears in Dashboard connections

#### 5. Test Error Handling

- [ ] Try linking already-linked Discord to different account (should fail)
- [ ] Try using expired verification code (should fail)
- [ ] Try accessing Activity without authorization (should prompt)

### Monitoring

Set up monitoring for:

```typescript
// Monitor OAuth callback failures
app.post('/api/discord/oauth/callback', async (req, res) => {
  try {
    // ... callback logic
  } catch (error) {
    // Log to monitoring service (Sentry, LogRocket, etc.)
    console.error('Discord OAuth callback failed:', error);
    
    // Track metrics
    metrics.increment('discord.oauth.callback.error');
  }
});

// Monitor Activity authentication
app.post('/api/discord/activity-auth', async (req, res) => {
  try {
    // ... auth logic
    metrics.increment('discord.activity.auth.success');
  } catch (error) {
    console.error('Discord Activity auth failed:', error);
    metrics.increment('discord.activity.auth.error');
  }
});
```

---

## Part 7: Troubleshooting

### Issue: "Could not fetch application data"

**Symptoms:**
- Activity doesn't load in Discord
- Console error: `403 Forbidden` on Discord API

**Causes & Solutions:**

1. **Activities not enabled:**
   - Go to Discord Portal → General Information
   - Enable Activities feature
   - Set Activity URL
   - Wait 2 minutes

2. **Wrong Activity URL:**
   - Verify URL matches your deployed domain exactly
   - Must use HTTPS
   - No trailing slash

3. **Domain not accessible:**
   - Test: `curl https://yourdomain.com/discord`
   - Should return HTML, not error

### Issue: "Session lost during OAuth"

**Symptoms:**
- User redirected to login page after Discord authorization
- Error: "session_lost"

**Causes & Solutions:**

1. **Redirect URI not registered:**
   - Go to Discord Portal → OAuth2 → Redirects
   - Add: `https://yourdomain.com/api/discord/oauth/callback`
   - Wait 2 minutes

2. **Cookie domain mismatch:**
   - Frontend domain: `app.yourdomain.com`
   - API domain: `api.yourdomain.com`
   - Cookies won't be sent cross-domain
   - **Solution:** Use same domain or set up CORS properly

3. **SameSite cookie issue:**
   ```typescript
   res.cookie('session', token, {
     httpOnly: true,
     secure: true,
     sameSite: 'lax',  // or 'none' if cross-domain
     domain: '.yourdomain.com'  // Share across subdomains
   });
   ```

### Issue: "Interactions Endpoint verification failed"

**Symptoms:**
- Red X next to Interactions Endpoint URL
- Discord can't verify endpoint

**Causes & Solutions:**

1. **Endpoint not responding:**
   ```bash
   # Test endpoint
   curl -X POST https://yourdomain.com/api/discord/interactions \
     -H "Content-Type: application/json" \
     -d '{"type": 1}'
   
   # Should return: {"type": 1}
   ```

2. **DISCORD_PUBLIC_KEY not set:**
   - Verify environment variable is set
   - Must be 64-character hex string
   - Restart server after setting

3. **Signature verification failing:**
   ```typescript
   // Ensure you're using the correct public key
   const { verifyKey } = require('discord-interactions');
   
   const signature = req.headers['x-signature-ed25519'];
   const timestamp = req.headers['x-signature-timestamp'];
   const body = JSON.stringify(req.body);
   
   const isValid = verifyKey(body, signature, timestamp, PUBLIC_KEY);
   ```

### Issue: "Rate limited"

**Symptoms:**
- HTTP 429 responses
- Header: `X-RateLimit-Remaining: 0`

**Solution:**
```typescript
async function handleRateLimit(response) {
  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After');
    console.log(`Rate limited. Retry after ${retryAfter}s`);
    
    await new Promise(resolve => 
      setTimeout(resolve, (parseInt(retryAfter) + 1) * 1000)
    );
    
    // Retry request
    return fetch(url, options);
  }
  return response;
}
```

### Issue: "Discord account already linked"

**Symptoms:**
- Error when trying to link Discord
- Message: "This Discord account is already linked to another user"

**Solution:**
1. User must unlink from previous account first
2. Admin can manually unlink in database:
   ```sql
   DELETE FROM discord_links WHERE discord_id = 'discord_id_here';
   ```

### Issue: "Verification code expired"

**Symptoms:**
- `/verify` code doesn't work
- Error: "Code expired or invalid"

**Solution:**
1. Codes expire after 5 minutes by design
2. User should generate new code: `/verify` again
3. Check database cleanup job is running:
   ```sql
   SELECT * FROM verification_codes WHERE expires_at < NOW();
   ```

---

## Part 8: Security Best Practices

### Secrets Management

**Never commit secrets to git:**
```gitignore
# .gitignore
.env
.env.local
.env.production
**/secrets.json
```

**Use environment variables:**
- Vercel: Site Settings → Environment Variables
- Netlify: Site Settings → Build & Deploy → Environment
- Railway: Project → Variables
- GitHub Actions: Repository → Settings → Secrets

### Token Storage

**Frontend (Client-side):**
```typescript
// ❌ DON'T store sensitive tokens in localStorage
localStorage.setItem('discord_token', token);  // Bad!

// ✅ DO use HTTP-only cookies
// (Set by backend)
res.cookie('session', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax'
});
```

**Backend (Server-side):**
```typescript
// ✅ Store access tokens encrypted
import { encrypt, decrypt } from '@/lib/encryption';

// Save to database
const encrypted = encrypt(accessToken, process.env.ENCRYPTION_KEY);
await db.discord_links.update({
  access_token: encrypted
});

// Retrieve from database
const decrypted = decrypt(encrypted, process.env.ENCRYPTION_KEY);
```

### Rate Limiting

Implement rate limiting on sensitive endpoints:

```typescript
import rateLimit from 'express-rate-limit';

// OAuth endpoints
const oauthLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 10,  // 10 requests per minute
  message: 'Too many OAuth requests, please try again later'
});

app.use('/api/discord/oauth', oauthLimiter);

// Account linking
const linkLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,  // 5 requests per minute
  message: 'Too many linking attempts, please try again later'
});

app.use('/api/discord/link', linkLimiter);
```

### Input Validation

Always validate user input:

```typescript
import { z } from 'zod';

const linkDiscordSchema = z.object({
  discordId: z.string().regex(/^\d{17,19}$/),
  username: z.string().min(2).max(32),
  email: z.string().email(),
  avatar: z.string().nullable()
});

app.post('/api/discord/link', async (req, res) => {
  try {
    const data = linkDiscordSchema.parse(req.body);
    // Proceed with linking...
  } catch (error) {
    return res.status(400).json({ error: 'Invalid input' });
  }
});
```

---

## Part 9: Performance Optimization

### Caching Discord Data

Cache Discord user data to reduce API calls:

```typescript
import NodeCache from 'node-cache';

const userCache = new NodeCache({ stdTTL: 3600 });  // 1 hour

async function getDiscordUser(accessToken: string) {
  const cacheKey = `discord_user_${accessToken}`;
  const cached = userCache.get(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  const response = await fetch('https://discord.com/api/v10/users/@me', {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
  
  const user = await response.json();
  userCache.set(cacheKey, user);
  
  return user;
}
```

### Database Connection Pooling

Use connection pooling for better performance:

```typescript
import { createClient } from '@supabase/supabase-js';

// Create client with connection pooling
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!,
  {
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'x-connection-pool-size': '20'
      }
    }
  }
);
```

### CDN for Static Assets

Serve static assets from CDN:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash][extname]'
      }
    }
  },
  // Use CDN for production
  base: process.env.NODE_ENV === 'production'
    ? 'https://cdn.yourdomain.com/'
    : '/'
});
```

---

## Part 10: Monitoring & Logging

### Set Up Error Tracking

```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1
});

// Track Discord OAuth errors
app.post('/api/discord/oauth/callback', async (req, res) => {
  try {
    // ... callback logic
  } catch (error) {
    Sentry.captureException(error, {
      tags: { flow: 'discord_oauth' },
      extra: { state: req.query.state }
    });
    throw error;
  }
});
```

### Log Important Events

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Log Discord account linking
logger.info('Discord account linked', {
  userId: user.id,
  discordId: discord.id,
  timestamp: new Date().toISOString()
});

// Log OAuth callback
logger.info('Discord OAuth callback', {
  action: state.action,
  success: true,
  timestamp: new Date().toISOString()
});
```

### Health Check Endpoint

```typescript
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await supabase.from('user_profiles').select('count').limit(1);
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      discord: {
        clientId: process.env.DISCORD_CLIENT_ID,
        configured: !!process.env.DISCORD_CLIENT_SECRET
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});
```

---

## Part 11: Rollback Plan

If something goes wrong in production:

### Quick Rollback

```bash
# Vercel
vercel rollback

# Netlify
netlify rollback

# Railway
railway rollback

# Git-based rollback
git revert HEAD
git push origin main
```

### Database Rollback

```sql
-- Remove Discord links created after deployment
DELETE FROM discord_links 
WHERE linked_at > '2026-01-07 12:00:00';

-- Remove linking sessions
DELETE FROM discord_linking_sessions 
WHERE created_at > '2026-01-07 12:00:00';
```

### Disable Discord Integration

If you need to temporarily disable:

1. **Discord Portal:**
   - Disable Activities feature
   - This stops Activity from loading

2. **Application:**
   ```typescript
   // Add feature flag
   if (!process.env.DISCORD_ENABLED) {
     return res.status(503).json({ 
       error: 'Discord integration temporarily unavailable' 
     });
   }
   ```

---

## Summary

**Deployment Steps:**
1. ✅ Configure Discord Developer Portal
2. ✅ Set environment variables
3. ✅ Run database migrations
4. ✅ Deploy application
5. ✅ Register bot commands (if applicable)
6. ✅ Test all flows
7. ✅ Set up monitoring
8. ✅ Monitor for issues

**Need Help?**
- 📖 [Discord Integration Guide](./discord-integration-guide.md)
- 📚 [Discord Activity Reference](./discord-activity-reference.md)
- 💬 [Community Support](https://discord.gg/aethex)
- 📧 [Support Email](mailto:support@aethex.dev)

---

**Last Updated:** January 7, 2026  
**Deployment Platform:** Universal (Vercel, Netlify, Railway, Docker)  
**Status:** Production Ready
