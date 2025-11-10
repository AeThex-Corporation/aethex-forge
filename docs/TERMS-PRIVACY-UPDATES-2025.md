# Terms of Service & Privacy Policy Updates - 2025

## Overview

Updated both Terms of Service and Privacy Policy to reflect all new integrations and features added to AeThex platform in 2025.

**Effective Date:** January 21, 2025

---

## Discord URLs for Developer Portal

All Discord Developer Portal settings are now configured with these URLs:

| Setting                           | URL                           | Purpose                      |
| --------------------------------- | ----------------------------- | ---------------------------- |
| **Linked Roles Verification URL** | `https://aethex.dev/discord`  | Discord Activity entry point |
| **Terms of Service URL**          | `https://aethex.dev/terms`    | Full Terms of Service        |
| **Privacy Policy URL**            | `https://aethex.dev/privacy`  | Full Privacy Policy          |
| **Deep Link URL**                 | `https://aethex.dev/activity` | Mobile Activity link         |

---

## Privacy Policy Updates

### New Sections Added:

1. **Discord Integration**

   - What data is collected (Discord user ID, username, profile picture, email)
   - How it's used (account linking, bot commands, role assignment, Activity display)
   - Unlinking capability
   - Discord's Privacy Policy governance

2. **Web3 & Ethereum Wallet Integration**

   - Wallet address collection
   - Uses (authentication, signature verification)
   - Security notes (no private key storage, local verification)
   - Public blockchain data acknowledgment

3. **Roblox Integration**

   - Data collected (user ID, username, profile, game data)
   - Uses (account linking, game tracking, portfolio display)
   - Roblox Terms of Service applicability

4. **Game Authentication & Server Integration**

   - Game session token collection
   - Uses (player verification, session management, analytics)
   - Developer data deletion rights

5. **OAuth Providers**
   - Comprehensive section covering all providers (GitHub, Google, Discord, Roblox, Web3)
   - Account management and unlinking
   - Each provider's privacy policy reference

### Updated Sections:

- **Effective Date:** Changed from October 18, 2025 to January 21, 2025
- **Information We Collect:** Already comprehensive, no changes needed
- **How We Use Information:** Covers all new integration types

---

## Terms of Service Updates

### New Sections Added:

1. **Discord Integration & Bot Services**

   - Authorization scope definition
   - Bot command availability (/verify, /set-realm, /profile, /unlink)
   - User responsibility for Discord actions
   - Discord's Terms of Service applicability

2. **Web3 & Wallet Authentication**

   - Message signing authorization (read-only)
   - Acknowledgment that signing doesn't authorize fund transfers
   - User responsibility for wallet security
   - AeThex's non-involvement with funds

3. **Roblox Account Linking**

   - OAuth authorization scope
   - Roblox Terms of Service applicability
   - Credential management responsibility
   - Unlinking capability

4. **Game Authentication & Developer Services**

   - Token confidentiality requirement
   - Token usage restrictions (authorized use only)
   - Game server validation responsibility
   - AeThex liability limitations
   - Session data retention for analytics

5. **OAuth & Third-Party Authorization**
   - Multi-provider support (GitHub, Google, Discord, Roblox, Web3)
   - Authorization granularity and review
   - Revocation capability through settings or third-party provider
   - Feature limitations after revoking access

### Updated Sections:

- **Effective Date:** Changed from October 18, 2025 to January 21, 2025
- **Third-Party Services:** Updated to specifically reference Discord, Web3, Roblox, and Game services

---

## Compliance Notes

### Discord

- ✅ Complies with Discord Developer Terms
- ✅ Covers OAuth scopes
- ✅ Documents bot command behavior
- ✅ References Discord privacy policy

### Web3 / Ethereum

- ✅ Clarifies read-only authorization (no fund transfer)
- ✅ States no private key storage
- ✅ Acknowledges public blockchain data
- ✅ Local signature verification

### Roblox

- ✅ Covers OAuth authorization
- ✅ References Roblox Terms of Service
- ✅ User credential responsibility
- ✅ Unlinking capability

### Game Developers

- ✅ Token security responsibility
- ✅ Usage restrictions clearly defined
- ✅ Validation responsibility on game server
- ✅ Analytics and debugging data retention
- ✅ Data deletion request capability

---

## Files Updated

| File                            | Changes                            | Status      |
| ------------------------------- | ---------------------------------- | ----------- |
| `code/client/pages/Privacy.tsx` | Added 5 new sections + date update | ✅ Complete |
| `code/client/pages/Terms.tsx`   | Added 5 new sections + date update | ✅ Complete |

---

## What's Covered

### ✅ Authentication Methods

- [x] Email/Password
- [x] GitHub OAuth
- [x] Google OAuth
- [x] Discord OAuth
- [x] Roblox OAuth
- [x] Web3/Ethereum Wallet

### ✅ Third-Party Integrations

- [x] Discord bot commands
- [x] Discord role assignment
- [x] Discord Activity
- [x] Web3 message signing
- [x] Roblox game data
- [x] Game server authentication (Unity, Unreal, Godot)

### ✅ Data Handling

- [x] Data collection methods
- [x] Data usage purposes
- [x] Data sharing practices
- [x] Data retention policies
- [x] User rights and controls
- [x] Third-party provider policies

---

## User-Facing Changes

Users will now see documentation about:

1. **When linking Discord:** Clear terms about what data is shared, how roles are assigned, and how to unlink
2. **When connecting Web3:** Assurance that no private keys are stored and signing is read-only
3. **When linking Roblox:** Clear terms about Roblox data usage and unlinking capability
4. **When using game authentication:** Terms for developers about token security and usage
5. **When managing OAuth:** Ability to review and revoke all connected accounts

---

## Testing Checklist

- [x] Privacy Policy loads without errors
- [x] Terms of Service loads without errors
- [x] Both pages display all new sections correctly
- [x] Effective date is January 21, 2025
- [x] All links in documents work
- [x] Mobile responsive formatting maintained
- [x] No content missing from originals
- [x] Discord Developer Portal URLs are correct

---

## Discord Developer Portal Configuration

These URLs have been tested and are ready:

```
Linked Roles Verification URL: https://aethex.dev/discord
Terms of Service URL: https://aethex.dev/terms
Privacy Policy URL: https://aethex.dev/privacy
Deep Link URL: https://aethex.dev/activity
```

---

## Version History

| Date       | Version | Changes                                                                        |
| ---------- | ------- | ------------------------------------------------------------------------------ |
| 2025-01-21 | 1.0     | Initial comprehensive update with Discord, Web3, Roblox, and Game integrations |

---

## Questions?

For legal review or questions about specific sections, contact legal@aethex.biz

---

## Related Documentation

- [DISCORD-LINKING-FLOW-ANALYSIS.md](./DISCORD-LINKING-FLOW-ANALYSIS.md) - Discord linking flow
- [DISCORD-OAUTH-SETUP-VERIFICATION.md](./DISCORD-OAUTH-SETUP-VERIFICATION.md) - Discord setup guide
- [GAME-INTEGRATION-GUIDE.md](./GAME-INTEGRATION-GUIDE.md) - Game authentication guide
