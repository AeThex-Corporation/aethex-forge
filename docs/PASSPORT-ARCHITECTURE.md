# Passport Architecture: Foundation as Sole Issuer

## Overview

**aethex.foundation** is the **sole issuer and authority** for all user passports/identities in the AeThex ecosystem. All other platforms (aethex.dev, future platforms) are **OAuth clients** that consume Foundation-issued identities.

This document defines the passport architecture and data flow.

## Core Principle

```
Foundation = Single Source of Truth (SSOT) for identity
Each Platform = Read-only cache of Foundation passport data
```

## Architecture

### 1. Foundation (aethex.foundation)

- **Owner of passport data**
- Issues and maintains all user identities
- Provides OAuth endpoints for authentication
- Provides passport API endpoints for clients to fetch user data
- Single authority for all identity mutations (updates, deletions)

### 2. Client Platforms (aethex.dev, etc.)

- **Consumers of Foundation identities**
- Cache Foundation passport data locally for performance
- Use cached data for reads (lookups, profile queries)
- Forward any profile updates to Foundation's API
- Validate passport integrity on each login

## Data Flow

### User Login Flow

```
User → Login → Redirect to Foundation
    ↓
Foundation (OAuth) → Verify credentials
    ↓
Return access_token + user data to aethex.dev
    ↓
aethex.dev (callback handler):
  1. Exchange code for token with Foundation
  2. Fetch userinfo from Foundation API
  3. Validate passport is complete
  4. SYNC (one-way) to local cache:
     - User profile data (from Foundation)
     - Achievements (from Foundation)
     - Projects (from Foundation)
  5. Create session on aethex.dev
    ↓
User authenticated, using Foundation passport
```

### Profile Update Flow

```
User edits profile on aethex.dev
    ↓
aethex.dev validates input locally
    ↓
Forward update request to Foundation API
    ↓
Foundation (SSOT) validates and applies changes
    ↓
Foundation returns updated passport
    ↓
aethex.dev syncs updated data to local cache
    ↓
Update confirmed to user
```

### Profile Read Flow

```
User/App requests profile on aethex.dev
    ↓
Check local cache
    ↓
If cache valid: Return cached data
If cache stale: Refresh from Foundation → update cache → return
    ↓
Never modify local cache outside of sync operations
```

## Key Rules

### ✅ ALLOWED Operations on aethex.dev

1. **Read from local cache** - Fast lookups of passport data
2. **Sync from Foundation** - One-way data import during login/refresh
3. **Validate against cache** - Use cached data for access control
4. **Forward to Foundation** - Route update requests to Foundation API
5. **Cache invalidation** - Clear stale cache on logout or explicit refresh

### ❌ FORBIDDEN Operations on aethex.dev

1. **Direct writes to passport data** - All identity mutations must go through Foundation
2. **Creating new passports** - Only Foundation can issue identities
3. **Modifying cached data** - Cache is read-only except during sync
4. **Trusting unvalidated data** - Always verify data came from Foundation

## Database Schema (aethex.dev)

```sql
-- Local cache of Foundation passport data
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY,                    -- Foundation user ID (immutable)
  email TEXT UNIQUE NOT NULL,             -- From Foundation
  username TEXT UNIQUE,                   -- From Foundation
  full_name TEXT,                         -- From Foundation
  avatar_url TEXT,                        -- From Foundation
  profile_completed BOOLEAN DEFAULT false,-- From Foundation

  -- Sync tracking
  foundation_synced_at TIMESTAMP,         -- When last synced from Foundation
  cache_valid_until TIMESTAMP,            -- When cache expires

  -- Local metadata (not from Foundation)
  last_login_at TIMESTAMP,                -- aethex.dev tracking only
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Data from Foundation that shouldn't be written locally
-- (achievements, projects, etc. are fetched on-demand)
```

## Sync Mechanism

### Initial Sync (On Login)

1. User authenticates with Foundation
2. aethex.dev receives `access_token` and basic user info
3. aethex.dev calls Foundation's `/api/oauth/userinfo` endpoint
4. All user data from Foundation gets UPSERTED to local cache
5. `foundation_synced_at` timestamp is updated

### Periodic Sync (Background)

```
Every 24 hours (or on explicit request):
  1. Fetch current user data from Foundation API
  2. Compare with local cache
  3. If Foundation data differs: update cache
  4. If local cache is newer: ERROR (shouldn't happen)
  5. Update `cache_valid_until` timestamp
```

### Cache Expiration

```
If (now > cache_valid_until):
  1. Treat cache as stale
  2. Fetch fresh from Foundation
  3. Update cache and expiration
```

## Error Handling

### What if Foundation is unavailable?

**During Login:**

- �� Cannot proceed - user must authenticate through Foundation
- Return error: "Identity service unavailable"

**For existing users (cache valid):**

- ✅ Can use cached data temporarily
- Continue serving from cache
- Log warning about Foundation unavailability
- Retry sync in background

**For profile updates:**

- ❌ Cannot proceed - updates must go through Foundation
- Queue update locally, retry when Foundation is available
- Or fail gracefully: "Identity service unavailable, please try again"

## Validation Rules

### On Every Auth Request

```javascript
if (!user.foundation_synced_at) {
  throw new Error("User not synced from Foundation");
}

if (now > user.cache_valid_until) {
  // Refresh from Foundation
  await syncFromFoundation(user.id);
}

// User is authenticated and passport is valid
```

### On Every Profile Update Request

```javascript
// Forward to Foundation API, never write locally
const updated = await foundation.api.updateProfile(userId, changes);

// On success, sync response back to cache
await syncFromFoundation(userId);

return updated;
```

## Migration from Old Model

**Old Model:** aethex.dev wrote directly to passport table
**New Model:** aethex.dev only syncs FROM Foundation

### Migration Steps

1. ✅ Remove Foundation arm from aethex.dev UI (DONE)
2. ✅ Clarify that aethex.dev is an OAuth client of Foundation (DONE)
3. Make profile endpoints read-only, forward writes to Foundation
4. Add cache validation on every auth request
5. Implement background sync for cache freshness
6. Monitor logs for any direct write attempts (should be 0)
7. Deprecate old direct-write endpoints

## API Endpoints Reference

### Foundation APIs (Used by aethex.dev)

```
GET  /api/oauth/authorize       - Start OAuth flow
POST /api/oauth/token           - Exchange code for token
GET  /api/oauth/userinfo        - Fetch authenticated user's passport
GET  /api/users/:id             - Fetch specific user passport (public data)
PATCH /api/users/:id            - Update passport (requires auth)
```

### aethex.dev APIs (Now read-only/cache-focused)

```
GET  /api/profile/:username     - Read from cache or fetch from Foundation
POST /api/profile/ensure        - Sync passport from Foundation (on login)
PATCH /api/profile/:id          - Forward to Foundation (no local writes)
```

## Monitoring & Observability

### Log these events

```
[Passport Sync] User synced from Foundation: {userId}
[Passport Error] User not found in Foundation: {userId}
[Passport Stale] Cache expired for user: {userId}, refreshing...
[Passport Write] Attempted direct write to local cache (FORBIDDEN): {userId}
[Passport Conflict] Local cache newer than Foundation (SYNC ERROR): {userId}
```

### Metrics to track

- Sync success rate (should be ~100%)
- Cache hit rate (should be >95% for logged-in users)
- Foundation API latency
- Failed sync attempts
- Stale cache detections

## Future Enhancements

1. **Webhook sync** - Foundation notifies clients when passport changes
2. **Event stream** - Subscribe to passport update events
3. **Multi-version support** - Handle different Foundation versions
4. **Distributed cache** - Redis layer for cross-instance consistency
5. **Audit trail** - Track all passport mutations at Foundation level

## Related Documentation

- `code/docs/PHASE3-SWITCHOVER-GUIDE.md` - OAuth migration guide
- `code/api/auth/callback.ts` - Login sync implementation
- `code/api/profile/ensure.ts` - Profile sync endpoint
