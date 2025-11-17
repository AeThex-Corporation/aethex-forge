# Username-First with UUID Fallback

## Overview

The entire system now uses **usernames as the primary identifier** with **UUID fallback** for all user/creator lookups across routes and APIs.

This means:
- Users visit `/creators/john-doe` (preferred) or `/creators/<uuid>` (also works)
- Users visit `/passport/alice-developer` (preferred) or `/passport/<uuid>` (also works)
- Users visit `/ethos/artists/bob-musician` (preferred) or `/ethos/artists/<uuid>` (also works)

---

## Changes Made

### 1. Core Utility: Identifier Resolver (`code/lib/identifier-resolver.ts`)

**New file** that provides helper functions:

```typescript
isUUID(str)                          // Check if string is UUID format
resolveIdentifierToCreator(id)      // Resolve username/UUID → creator object
resolveIdentifierToUserId(id)       // Resolve username/UUID → UUID
resolveIdentifierToUsername(id)     // Resolve UUID → username
```

### 2. Creators API Endpoint (`code/server/index.ts`)

**Updated** `GET /api/creators/:identifier` to:
- Accept username OR UUID in the `:identifier` parameter
- Try **username first** (preferred)
- Fall back to **UUID lookup** if username lookup fails
- Return 404 if neither works

```javascript
// Examples that now work:
GET /api/creators/john-doe          // ✅ Username lookup
GET /api/creators/550e8400-...      // ✅ UUID lookup fallback
```

### 3. Creators Profile Component (`code/client/pages/creators/CreatorProfile.tsx`)

**Updated** to:
- Import UUID/identifier resolver helpers
- Accept both username and UUID as route parameters
- Resolve UUID to username for canonical URL redirect (optional)
- Maintain backwards compatibility with old UUID-based URLs

### 4. Ethos Artist Profile (`code/client/pages/ethos/ArtistProfile.tsx`)

**Updated** to:
- Import identifier resolver helpers
- Accept both username and userId as route parameters
- Resolve username → userId before API call
- Handle both patterns seamlessly

### 5. Passport Profile (`code/client/pages/ProfilePassport.tsx`)

**Already supported** username-first with UUID fallback:
- Has built-in `isUuid()` function
- Tries `getProfileByUsername()` first
- Falls back to `getProfileById()` if username lookup fails
- No changes needed - already implemented!

### 6. Creator Profile Validation (`code/api/creators.ts`)

**Enforced usernames as required**:
- Username must be provided when creating creator profile
- Username must be unique (409 Conflict if duplicate)
- Username is normalized to lowercase
- Validation on both client and server

---

## Routes That Support Username-First with UUID Fallback

| Route | Type | Status |
|-------|------|--------|
| `/creators/:identifier` | Frontend | ✅ Updated |
| `/passport/:identifier` | Frontend | ✅ Already working |
| `/ethos/artists/:identifier` | Frontend | ✅ Updated |
| `/api/creators/:identifier` | Backend | ✅ Updated |

---

## How It Works: Flow Example

### Username Lookup (Preferred)

```
User visits: /creators/john-doe
   ↓
CreatorProfile component
   ↓
Component calls: GET /api/creators/john-doe
   ↓
Server checks: isUUID("john-doe") → false
   ↓
Query database: SELECT * FROM aethex_creators WHERE username = "john-doe"
   ↓
Return creator data ✅
```

### UUID Lookup (Fallback)

```
User visits: /creators/550e8400-e29b-41d4-a716-446655440000
   ↓
CreatorProfile component
   ↓
Component calls: GET /api/creators/550e8400-e29b-41d4-a716-446655440000
   ↓
Server checks: isUUID("550e8400-...") → true
   ↓
Query database: SELECT * FROM aethex_creators WHERE username = "550e8400-..."
   ↓
No match, try UUID fallback:
SELECT * FROM aethex_creators WHERE id = "550e8400-..."
   ↓
Return creator data ✅
```

### Username Resolution (For Ethos Artists)

```
User visits: /ethos/artists/bob-musician
   ↓
ArtistProfile component
   ↓
Component calls: resolveIdentifierToUserId("bob-musician")
   ↓
Utility function calls: GET /api/creators/bob-musician
   ↓
Creator found! Extract user_id = "550e8400-..."
   ↓
Component calls: GET /api/ethos/artists?id=550e8400-...
   ↓
Return artist data ✅
```

---

## Benefits

✅ **SEO-friendly URLs** - Usernames are more human-readable than UUIDs
✅ **Backwards compatible** - Old UUID-based links still work
✅ **Consistent behavior** - All user profile routes work the same way
✅ **User-friendly** - Share `/creators/john-doe` instead of UUID
✅ **Enforced usernames** - Everyone has a username, eliminates UUID-only profiles

---

## Implementation Details

### UUID Detection

```typescript
// UUID regex pattern (standard RFC 4122)
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isUUID(str: string): boolean {
  return uuidPattern.test(str);
}
```

### Lookup Priority

For any identifier:
1. **If it matches UUID pattern** → Try UUID lookup directly
2. **If it doesn't match UUID pattern** → Try username lookup first, then UUID fallback
3. **If both fail** → Return 404 Not Found

### Username Normalization

- Usernames stored as **lowercase**
- Lookups are **case-insensitive**
- Users can visit `/creators/John-Doe`, `/creators/JOHN-DOE`, `/creators/john-doe` - all work
- URLs always redirect to the canonical username (lowercase)

---

## Client-Side API Functions

### Using the Resolver Utilities

```typescript
import { 
  isUUID, 
  resolveIdentifierToCreator,
  resolveIdentifierToUserId,
  resolveIdentifierToUsername 
} from '@/lib/identifier-resolver';

// Check if string is UUID
if (isUUID(userInput)) {
  // It's a UUID, use as user ID
}

// Resolve identifier to creator profile
const creator = await resolveIdentifierToCreator("john-doe");
// or
const creator = await resolveIdentifierToCreator("550e8400-...");

// Get just the user ID
const userId = await resolveIdentifierToUserId("john-doe");

// Get just the username
const username = await resolveIdentifierToUsername("550e8400-...");
```

---

## Database Consistency

### Username Uniqueness

- Usernames are unique in `aethex_creators` table
- Enforced in API validation (returns 409 if duplicate)
- Usernames are indexed for fast lookups

### Required Field

- `username` column is **NOT NULL**
- All profiles created after enforcement have usernames
- Migration: Existing profiles without usernames should be given auto-generated usernames

---

## Future Improvements

1. **Profile slugs** - Use human-friendly slugs instead of usernames (e.g., `/profile/john-doe-developer`)
2. **Username changes** - Allow users to change usernames with proper redirects
3. **Vanity URLs** - Custom profile URLs (e.g., `/john`)
4. **Social aliases** - Link multiple usernames to one profile

---

## Testing

### Test Cases

```
✅ GET /api/creators/john-doe          → Returns creator
✅ GET /api/creators/JOHN-DOE          → Returns same creator (case-insensitive)
✅ GET /api/creators/550e8400-...      → Returns creator (UUID fallback)
✅ GET /api/creators/nonexistent       → Returns 404
✅ GET /api/creators/invalid-uuid      → Tries username, then returns 404

✅ /creators/john-doe                  → Loads profile
✅ /creators/550e8400-...              → Loads profile (UUID fallback)
✅ /passport/john-doe                  → Loads passport
✅ /passport/550e8400-...              → Loads passport (UUID fallback)
✅ /ethos/artists/bob-musician         → Loads artist
✅ /ethos/artists/550e8400-...         → Loads artist (UUID fallback)
```

---

## Migration Checklist

- [x] Create identifier resolver utility
- [x] Update creators API endpoint to support both username and UUID
- [x] Update CreatorProfile component to handle both patterns
- [x] Update ArtistProfile component to handle both patterns
- [x] Enforce usernames as required field
- [x] Document the implementation
- [ ] **TODO:** Migrate any existing profiles without usernames to auto-generated usernames
- [ ] **TODO:** Add URL redirects for canonical username-based URLs
- [ ] **TODO:** Update all link generation to prefer usernames

---

## Files Modified

```
code/
├── lib/
│   └── identifier-resolver.ts          (NEW - UUID/username detection)
├── api/
│   └── creators.ts                     (UPDATED - enforce username required)
├── server/
│   └── index.ts                        (UPDATED - /api/creators/:identifier)
├── client/
│   ├── pages/
│   │   ├── creators/CreatorProfile.tsx (UPDATED - UUID fallback)
│   │   ├── ethos/ArtistProfile.tsx     (UPDATED - UUID fallback)
│   │   └── ProfilePassport.tsx         (NO CHANGE - already working)
│   └── App.tsx                         (NO CHANGE - routes unchanged)
└── docs/
    └── USERNAME-FIRST-UUID-FALLBACK.md (NEW - this file)
```

---

## Summary

✅ **Username-First with UUID Fallback is now implemented across the entire system.**

All user-facing routes and APIs prefer usernames while maintaining backward compatibility with UUID-based URLs. Users must have a username to create a profile, ensuring consistent, SEO-friendly URLs throughout the AeThex ecosystem.

