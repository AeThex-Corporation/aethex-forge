# Axiom Model - Phase 1 Migration
## How to Use This Package

You have 3 files to help with the Phase 1 code migration:

### 1. **PHASE1-CHECKLIST.txt** ← START HERE
Simple, easy-to-read checklist of all files to copy.
- ✅ Just check off items as you copy them
- 📋 Best for quick reference while working
- 👥 Share this with your team

### 2. **PHASE1-FILES.json**
Machine-readable list of all files with metadata.
- 🤖 Use this if you want to script/automate the copy
- 📊 Includes priority levels, categories, and notes
- 💻 Parse this in your favorite tool

### 3. **AXIOM-MODEL-PHASE1-SCOPE.md**
Complete detailed documentation.
- 📖 Full explanation of every file and why it matters
- 🎯 Includes adaptation notes and potential blockers
- 🔍 Reference this if you get stuck on something

---

## Quick Start

1. **Read** PHASE1-CHECKLIST.txt
2. **Copy** all files listed from aethex.dev → aethex.foundation
3. **Update** environment variables on Replit
4. **Test** login flow end-to-end
5. **Proceed** to Phase 2 when Phase 1 passes

---

## Key Things to Remember

- **Update VITE_API_BASE** from `https://aethex.dev` → `https://aethex.foundation`
- **Convert API endpoints** from Vercel `/api/*` to Express routes
- **Update Discord OAuth app** redirect URI to use aethex.foundation
- **Set all environment variables** on Replit (Supabase, Discord, etc.)

---

## Estimated Time
**17-25 hours** for complete Phase 1 migration

---

## Questions?
Refer to AXIOM-MODEL-PHASE1-SCOPE.md sections:
- **Import issues?** → Section 7: Libraries & Dependencies
- **What file goes where?** → Sections 1-5: Complete file listing
- **How do I adapt?** → Section 7: Critical Adaptations
- **How do I test?** → Section 9: Checklist → Testing Phase 1

---

## Next: Phase 2
Once Phase 1 is complete, Phase 2 involves:
- Supabase permission migration (Foundation gets full access)
- `aethex.dev` loses direct write access to user_profiles

Then Phase 3:
- Reroute `aethex.dev` login → `aethex.foundation` (SSO)

**Done!** The Axiom Model is live.
