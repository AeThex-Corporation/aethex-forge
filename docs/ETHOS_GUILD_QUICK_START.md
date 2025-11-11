# Ethos Guild Quick Start Guide

## 🎵 What is Ethos?

**Ethos Guild** = Official audio identity program for AeThex. A synthwave-themed community of musicians, producers, and sound designers who create music and SFX for AeThex projects.

**Not a separate business.** It's a guild within the **Foundation** arm.

**Not optional.** It powers game audio for GameForge, provides talent for CORP clients, and creates revenue via the NEXUS marketplace.

---

## 📍 Where to Find Ethos

### Public Pages (Live Now)

| Page                | Route                     | Purpose                                |
| ------------------- | ------------------------- | -------------------------------------- |
| **Guild Community** | `/community/groups/ethos` | Overview, features, roadmap            |
| **Curriculum**      | `/docs/curriculum/ethos`  | Learning path (content coming Phase 3) |

### Admin Pages (Phase 2)

| Page                | Route                    | Purpose                                      |
| ------------------- | ------------------------ | -------------------------------------------- |
| Track Library       | `/ethos/library`         | Browse all published tracks                  |
| Artist Profiles     | `/ethos/artists/:userId` | View artist portfolio                        |
| Artist Settings     | `/ethos/settings`        | Manage profile & pricing (authenticated)     |
| Licensing Dashboard | `/ethos/licensing`       | Manage commercial agreements (authenticated) |

### Marketplace Integration (Phase 2)

| Page      | Feature  | Purpose                                        |
| --------- | -------- | ---------------------------------------------- |
| **NEXUS** | `/nexus` | "Audio Production" category with Ethos artists |

---

## 🗂️ What Was Built (Phase 1)

### 1. Database Schema ✅

**File:** `code/supabase/migrations/20250206_add_ethos_guild.sql`

4 tables:

- `ethos_tracks` - Music & SFX files
- `ethos_artist_profiles` - Artist info & pricing
- `ethos_guild_members` - Membership tracking
- `ethos_licensing_agreements` - Commercial contracts

**Status:** Ready to deploy. Run migration on Supabase.

### 2. Community Page ✅

**File:** `code/client/pages/community/EthosGuild.tsx`
**Route:** `/community/groups/ethos`

Features:

- Synthwave branding (neon pink/purple/cyan)
- Mission statement & value props
- 3 tabs: Overview, Features, Roadmap
- Stats dashboard (placeholder)
- CTAs to curriculum & NEXUS

**Status:** Live and public. Share with community.

### 3. Curriculum Page ✅

**File:** `code/client/pages/docs/DocsCurriculumEthos.tsx`
**Route:** `/docs/curriculum/ethos`

4 modules:

- Synthwave Foundations (4 hrs)
- Game Audio & SFX Design (5 hrs)
- Composition & Scoring (6 hrs)
- Licensing & Monetization (3 hrs)

**Status:** Skeleton ready. Content writing in Phase 3.

### 4. Routes & Navigation ✅

**File:** `code/client/App.tsx` (updated)

Routes added:

```
/community/groups/ethos  → EthosGuild
/docs/curriculum/ethos   → DocsCurriculumEthos (with DocsLayout)
```

**Status:** Wired and accessible.

### 5. Documentation ✅

**Files:**

- `ETHOS_GUILD_PHASE1_COMPLETE.md` - Full Phase 1 summary
- `ETHOS_GUILD_PHASE2_NEXUS_INTEGRATION.md` - Phase 2 technical plan
- `ETHOS_GUILD_QUICK_START.md` - This guide

---

## ⚙️ How It All Fits Together

```
Foundation (Red Arm)
    ├─ /community/groups/ethos (guild page)
    ├─ /docs/curriculum/ethos (learning)
    └─ Guild membership & community events

GameForge (Green Arm)
    ├─ "Sound Designer" mentee role
    ├─ Free access to ecosystem-licensed tracks
    └─ Commission custom music from guild

NEXUS (Purple Marketplace)
    ├─ "Audio Production" category
    ├─ Browse & hire artists
    ├─ Commercial track licensing
    └─ Set pricing & manage agreements

CORP (Blue Arm)
    ├─ Hire artists for client projects
    ├─ Custom compositions for commercial work
    └─ Revenue: licensing fees

DEV-Link (Cyan)
    ├─ EdTech game audio sourcing
    └─ CORP-negotiated B2B contracts

LABS (Yellow)
    ├─ AI music & SFX research
    └─ First access for guild artists
```

---

## 📋 What's Next (Phase 2)

### Tech Team (CTO) - 4 weeks, ~20 hours

**Week 1:** APIs + database

- `POST /api/ethos/tracks` - Upload track
- `GET /api/ethos/tracks` - List tracks
- `GET /api/ethos/artists` - List artists
- `POST /api/ethos/licensing-agreements` - Create licensing request

**Week 2:** Upload UI

- `TrackUploadModal.tsx` - File upload + progress
- `TrackMetadataForm.tsx` - Title, genre, license type, BPM, etc.
- `code/pages/ethos/TrackLibrary.tsx` - Browse all tracks

**Week 3:** Artist profiles + NEXUS

- `ArtistProfile.tsx` - View artist portfolio
- `ArtistSettings.tsx` - Manage profile & pricing
- Update `/nexus` to show "Audio Production" category

**Week 4:** Licensing + testing

- `LicensingDashboard.tsx` - Manage agreements
- Error handling & validation
- Performance testing

**Deliverable:** MVP ready for founding artists to upload.

### CEO - This Week ⏳

**Draft 3 legal templates:**

1. **Ecosystem License** - Free non-exclusive use (internal AeThex projects)
2. **Commercial License** - Paid (CORP client projects)
3. **Artist Agreement** - Rights, ownership, guidelines

**Blocker:** Upload feature cannot launch until templates drafted.

### Community Team (Dylan) - Phase 3

**Identify founding artists**

- 5-10 seed artists to launch with
- Reach out & onboard to guild

**Write curriculum**

- Schedule writing sprints
- Covers: synthwave, SFX design, composition, licensing
- Target: Live by Q2 2025

**Community management**

- Guild leadership roles (curator, admin)
- Monthly spotlights & events
- Artist guidelines & COC

---

## 🚀 Launching Ethos (Timeline)

| Date          | Phase          | Milestone                            |
| ------------- | -------------- | ------------------------------------ |
| **This week** | Phase 1 → 2    | CEO approves legal templates         |
| **Next week** | Phase 2 Start  | CTO schedules 4-week sprint          |
| **Week 1-4**  | Phase 2 Build  | API endpoints + upload UI            |
| **Week 5**    | Phase 2 QA     | Testing & final polish               |
| **Week 6**    | Phase 2 Launch | MVP live, founding artists invited   |
| **Month 2-3** | Phase 3        | Curriculum writing, community growth |

---

## 💡 Key Design Decisions

### Why Synthwave?

- '80s retro-futuristic aesthetic = AeThex brand
- Neon pink, purple, cyan visuals
- Instantly recognizable, culturally cool
- Differentiates from other game studios

### Why Not a Separate Venture?

- Ethos is **for the ecosystem**, not profits alone
- Foundation owns & nurtures it
- Revenue flows back to CORP client work
- Talent pipeline strengthens all arms

### Why NEXUS Integration?

- Makes artists discoverable across AeThex
- Unifies creator economy (designers, devs, musicians)
- Enables CORP to hire for commercial projects
- Builds network effects

---

## 📊 Success Metrics (Phase 2+)

| Metric                              | Q1 2025 Target | Q2+ Target  |
| ----------------------------------- | -------------- | ----------- |
| Guild members                       | 10 founding    | 100+ active |
| Tracks uploaded                     | 50             | 500+        |
| Commercial licensing agreements     | 2-3            | 20+         |
| CORP revenue from Ethos (licensing) | $5K            | $50K+       |
| GameForge games using Ethos audio   | 3-5            | 15+         |

---

## 🔗 Quick Links

**Documentation:**

- Phase 1 Summary: `code/docs/ETHOS_GUILD_PHASE1_COMPLETE.md`
- Phase 2 Plan: `code/docs/ETHOS_GUILD_PHASE2_NEXUS_INTEGRATION.md`
- Database: `code/supabase/migrations/20250206_add_ethos_guild.sql`

**Code:**

- Community page: `code/client/pages/community/EthosGuild.tsx`
- Curriculum page: `code/client/pages/docs/DocsCurriculumEthos.tsx`
- Routes: `code/client/App.tsx` (search "ethos" or "EthosGuild")

**Team Responsibilities:**

- **CEO:** Legal templates (this week)
- **CTO:** Phase 2 sprint planning & build
- **Community:** Founding artist outreach & curriculum

---

## ❓ FAQ

**Q: Is Ethos a separate music label?**
A: No. It's a guild within Foundation, part of the ecosystem. It creates music for AeThex use + serves as a talent pool for CORP client work.

**Q: Can artists sell their music elsewhere?**
A: Yes! The ecosystem license is non-exclusive. Artists can sell on Spotify, Bandcamp, etc. They just also grant AeThex a free license for internal use.

**Q: How do artists make money?**
A: Three ways:

1. CORP hires them for commercial projects (via NEXUS)
2. Streaming revenue on other platforms
3. (Future) Royalty share on successful games using their music

**Q: What about copyright & IP?**
A: Artist retains ownership of original composition. AeThex gets a license for specific use cases. Managed via legal templates (CEO responsibility).

**Q: When can I upload tracks?**
A: Phase 2 (4-6 weeks). Founding artists invited first, then open to community.

---

## 📞 Contact & Questions

- **Strategic questions:** CEO (Anderson)
- **Technical questions:** CTO (Braden)
- **Community questions:** Community Lead (Dylan)
- **Documentation questions:** Refer to `ETHOS_GUILD_PHASE1_COMPLETE.md`

---

**🎵 Ready to make AeThex sound? Let's build Phase 2. 🎵**
