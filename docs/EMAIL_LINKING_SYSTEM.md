# Email Linking System

## Overview

The email linking system allows users to authenticate with multiple email addresses that all resolve to the same account. This is particularly useful for developers with both work (`@aethex.dev`) and personal email addresses.

## Architecture

### Database Tables

#### `user_email_links`

Links multiple email addresses to a single user account.

```sql
- id: UUID (primary key)
- user_id: UUID (FK to user_profiles.user_id)
- email: TEXT (unique)
- is_primary: BOOLEAN (marks the main email)
- verified_at: TIMESTAMP
- linked_at: TIMESTAMP
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### `user_profiles` (additions)

```sql
- primary_email: TEXT (the primary email for the account)
- is_dev_account: BOOLEAN (marks if this is a developer account)
- merged_to_user_id: UUID (if this account was merged, points to the primary account)
```

## User Flows

### Flow 1: Login with Linked Email

```
User attempts login with: mrpiglr@gmail.com
↓
SignIn catches "invalid credentials" error
↓
Calls /api/user/resolve-linked-email with email
↓
Check user_email_links table
↓
Found! Returns primary email: mrpiglr@aethex.dev
↓
Retry SignIn with primary email
↓
Success - user logged in
```

### Flow 2: Link Additional Email (Settings)

```
User clicks "Link Email" in settings
↓
Enters secondary email: mrpiglr@gmail.com
↓
Verification sent to that email
↓
User verifies via link
↓
Email added to user_email_links with is_primary=false
↓
UI shows: "Also logged in as mrpiglr@gmail.com"
```

## API Endpoints

### POST `/api/user/resolve-linked-email`

Resolve a linked email to its primary email address.

**Request:**

```json
{
  "email": "mrpiglr@gmail.com"
}
```

**Response (linked email):**

```json
{
  "primaryEmail": "mrpiglr@aethex.dev",
  "linkedFrom": "mrpiglr@gmail.com",
  "userId": "uuid-here"
}
```

**Response (non-linked email):**

```json
{
  "primaryEmail": "some@email.com"
}
```

### POST `/api/user/link-email`

Link two existing user accounts by merging one into the other.

**Request:**

```json
{
  "primaryEmail": "mrpiglr@aethex.dev",
  "linkedEmail": "mrpiglr@gmail.com"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Successfully linked mrpiglr@gmail.com to mrpiglr@aethex.dev",
  "targetUserId": "primary-user-uuid",
  "sourceUserId": "linked-user-uuid"
}
```

### POST `/api/user/link-mrpiglr-accounts` (Admin Only)

Special endpoint to link the mrpiglr accounts.

**Request:**

```bash
curl -X POST https://aethex.dev/api/user/link-mrpiglr-accounts \
  -H "Authorization: Bearer mrpiglr-admin-token" \
  -H "Content-Type: application/json"
```

**Response:**

```json
{
  "success": true,
  "message": "Successfully linked mrpiglr@aethex.dev and mrpiglr@gmail.com",
  "primaryEmail": "mrpiglr@aethex.dev",
  "linkedEmail": "mrpiglr@gmail.com",
  "note": "Both emails can now log in and will access the same account."
}
```

## Implementation Details

### Authentication Resolution

When a user tries to sign in with a linked email:

1. **First attempt**: Try with provided email (normal auth flow)
2. **If it fails with "invalid credentials"**:
   - Check `/api/user/resolve-linked-email`
   - If email is linked, get primary email
   - **Retry with primary email**
   - If successful, user is logged in

This is transparent to the user - they can log in with any linked email.

### Data Transfer on Merge

When two accounts are merged:

1. **Achievements**: Transferred to primary account
2. **Creator Profile**: Transferred or preserved if not duplicate
3. **Applications**: Transferred to primary account
4. **Discord Links**: Transferred (avoiding duplicates)
5. **Web3 Wallets**: Transferred (avoiding duplicates)
6. **Email Links**: Both emails added to user_email_links table
7. **Profile**: Source profile marked as `merged_to_user_id`

### For Developers (Dev Accounts)

Developer accounts with `@aethex.dev` email:

- `is_dev_account = true`
- `primary_email = "@aethex.dev email"`
- Public profile shows work email
- Can link personal email for authentication convenience

## Usage Examples

### Link mrpiglr Accounts

```bash
# Admin endpoint (one-time setup)
curl -X POST https://aethex.dev/api/user/link-mrpiglr-accounts \
  -H "Authorization: Bearer mrpiglr-admin-token" \
  -H "Content-Type: application/json"
```

### Link Any Two Accounts

```bash
# Generic link endpoint
curl -X POST https://aethex.dev/api/user/link-email \
  -H "Content-Type: application/json" \
  -d '{
    "primaryEmail": "user@aethex.dev",
    "linkedEmail": "user@gmail.com"
  }'
```

### Check Email Resolution

```bash
curl -X POST https://aethex.dev/api/user/resolve-linked-email \
  -H "Content-Type: application/json" \
  -d '{"email": "user@gmail.com"}'
```

## Database Migration

Applied via: `code/supabase/migrations/20250206_add_email_linking.sql`

Includes:

- `user_email_links` table with RLS policies
- `get_primary_user_by_email()` function
- Columns on `user_profiles` for dev accounts and primary email
- Proper indexes for performance

## Future Enhancements

1. **Email Verification**: Add verification flow before linking new emails
2. **Settings UI**: Add "Linked Emails" section in user settings
3. **Email Change Request**: Allow users to change primary email
4. **Admin Dashboard**: View all linked emails for a user
5. **Notification**: Email both addresses when a new email is linked
