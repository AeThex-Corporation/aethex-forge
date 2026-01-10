# Discord OAuth Login Fix - Account Auto-Creation Removed

## Problem

When logging in via Discord OAuth with an email that doesn't match any existing AeThex account, the system was automatically creating a brand new account.

**Example**:

- You have an AeThex account: `mrpiglr@gmail.com`
- Your Discord email: `someone@discord-email.com`
- **Before**: Clicking "Continue with Discord" created a NEW account with `someone@discord-email.com`
- **Result**: You had two accounts and couldn't access your original account

## Solution

Discord OAuth login now requires an exact email match. If the Discord email doesn't match an existing account:

1. User is redirected to `/login` with error message
2. Error message: "Discord email (xxx@example.com) not found. Please sign in with your email account first, then link Discord from settings."
3. User signs in with their email (e.g., `mrpiglr@gmail.com`)
4. User goes to Dashboard → Connections → Link Discord
5. Discord is now linked to the existing account

## Changed Files

- `code/api/discord/oauth/callback.ts`: Removed auto-account-creation logic
  - No longer creates new auth users
  - No longer creates new user profiles
  - Only links Discord if email matches existing account
  - Redirects to login if no email match

## New User Flow

Users with NO existing AeThex account:

1. Click "Continue with Discord" on `/login`
2. Authorize Discord
3. If Discord email matches an existing account → Linked + logged in ✅
4. If Discord email is NEW → Redirected to `/login` with error ⚠️
   - They must create account via Email/Password OR continue with GitHub/Google (if available)
   - Then they can link Discord from Dashboard

## For You Specifically

Your situation:

1. ✅ You have AeThex account: `mrpiglr@gmail.com`
2. ✅ Your Discord email is different
3. **New behavior**: Clicking "Continue with Discord" now shows error
4. **What to do**:
   - Go to `/login` and sign in with `mrpiglr@gmail.com` password
   - Go to `/dashboard?tab=connections`
   - Click "Link Discord"
   - Authorize Discord
   - ✅ Discord is now linked to `mrpiglr@gmail.com` account

## Testing

### Test Case 1: Existing User, Matching Email

```
1. Create account with Discord email: person@example.com
2. Logout
3. Click "Continue with Discord"
4. Should login to existing account (not create new)
✅ Success: Only one account
```

### Test Case 2: Existing User, Different Email

```
1. Create account: mrpiglr@gmail.com (email/password)
2. Discord email: something_else@example.com
3. Click "Continue with Discord"
4. Should see error: "Discord email not found"
5. Sign in with mrpiglr@gmail.com
6. Go to Dashboard → Link Discord
✅ Success: Discord linked to correct account
```

### Test Case 3: New User, No Existing Account

```
1. Click "Continue with Discord" (no account exists)
2. Discord email: new_user@example.com
3. Should see error: "Discord email not found"
4. User must sign up with email/password or other OAuth first
✅ Success: No auto-created account with mismatched email
```

## Why This Change?

- **Prevents account duplication**: No more accidentally creating second accounts
- **User confusion prevented**: Users see clear error message explaining what to do
- **Email consistency**: Each AeThex account now has one email, reducing support issues
- **Better linking experience**: Forces intentional linking, not accidental account creation

## Rollback (if needed)

If this change causes issues, the old behavior can be restored by:

1. Uncommenting the account creation logic in `code/api/discord/oauth/callback.ts`
2. Using the `isNewUser` flag to redirect to onboarding for new accounts

However, this will re-introduce the original problem.
