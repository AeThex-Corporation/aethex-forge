# Ethos Guild Phase 2: NEXUS Marketplace Integration Plan

## Overview

This document outlines the Phase 2 technical implementation plan for integrating Ethos Guild into the NEXUS talent marketplace. This phase follows **Phase 1: Foundation**, which has already delivered:

- ✅ Database schema (ethos_tracks, ethos_artist_profiles, ethos_guild_members, ethos_licensing_agreements)
- ✅ Community group page (/community/groups/ethos)
- ✅ Curriculum skeleton (/docs/curriculum/ethos)
- ✅ Legal licensing templates (CEO to deliver this week)

**Phase 2 Focus:** MVP build of the actual feature—upload UI, artist profiles, NEXUS integration, and licensing workflow.

---

## Phase 2: MVP Build Objectives

### 1. Track Upload & Library Interface

**Goal:** Allow Ethos Guild members to upload their music and sound effects.

**Technical Scope:**

- **File Upload Component**

  - Location: `code/client/components/ethos/TrackUploadModal.tsx`
  - Features:
    - Support MP3, WAV file formats
    - File size limit: 50MB per track
    - Progress bar for uploads
    - Error handling for invalid files
  - Storage: Supabase Storage (`ethos-tracks/{user_id}/{track_id}.{ext}`)

- **Track Metadata Form**

  - Location: `code/client/components/ethos/TrackMetadataForm.tsx`
  - Fields:
    - `title` (required, text)
    - `description` (optional, textarea)
    - `genre[]` (required, multi-select: "Synthwave", "Orchestral", "SFX", "Ambient", "Electronic")
    - `bpm` (optional, number)
    - `license_type` (required, radio: "ecosystem" vs "commercial_sample")
    - `is_published` (optional, toggle)

- **Track Library Page**

  - Location: `code/client/pages/ethos/TrackLibrary.tsx`
  - Features:
    - Grid view of all published tracks
    - Filter by genre, license type, artist
    - Search by title
    - Sort by: date, downloads, artist name
    - Show: title, artist, genre badges, duration, license type, download count
    - CTA: "Listen", "Download", "Use in My Project" (if ecosystem licensed), "Contact Artist" (if commercial)

- **API Endpoints**
  - `POST /api/ethos/tracks` - Create track (with file upload)
  - `GET /api/ethos/tracks` - List all published tracks (paginated, filterable)
  - `GET /api/ethos/tracks/:id` - Get track details
  - `PUT /api/ethos/tracks/:id` - Update track metadata
  - `DELETE /api/ethos/tracks/:id` - Delete track (soft delete, owner only)
  - `POST /api/ethos/tracks/:id/download` - Increment download count

---

### 2. Artist Profile Pages & Portfolio

**Goal:** Let artists showcase their work and set up their portfolio.

**Technical Scope:**

- **Artist Profile Page**

  - Location: `code/client/pages/ethos/ArtistProfile.tsx`
  - Route: `/ethos/artists/:userId` or `/passport/:username/ethos`
  - Displays:
    - Artist name, avatar, bio
    - Verified badge (if applicable)
    - Skills (Synthwave, SFX Design, Orchestral, etc.)
    - "For Hire" status
    - Sample pricing (Custom Track $500, SFX Pack $150, Full Score $2000)
    - Portfolio grid: all tracks (filter by published/private)
    - Stats: total downloads, member since, success rate
    - CTA: "Contact Artist", "Hire for Project"

- **Artist Settings Page**

  - Location: `code/client/pages/ethos/ArtistSettings.tsx`
  - Route: `/ethos/settings` (authenticated)
  - Features:
    - Edit bio, avatar, portfolio URL
    - Manage skills (multi-select)
    - Toggle "for_hire" status
    - Set sample pricing (track, SFX, score)
    - Set turnaround_days estimate
    - View licensing agreements (pending & approved)

- **API Endpoints**
  - `GET /api/ethos/artists/:userId` - Get artist profile
  - `PUT /api/ethos/artists/:userId` - Update artist profile (owner only)
  - `GET /api/ethos/artists/:userId/tracks` - Get artist's tracks
  - `GET /api/ethos/artists` - List all artists (for discovery)

---

### 3. NEXUS "Audio Production" Category Integration

**Goal:** Ethos artists appear in NEXUS marketplace as "Audio Production" service providers.

**Technical Scope:**

- **NEXUS Audio Category**

  - New service category on `/nexus`
  - Display: Audio Production (alongside existing categories)
  - Filter options:
    - By skill: Synthwave, SFX, Orchestral, Ambient, Electronic
    - By price range: $500-1000, $1000-5000, $5000+
    - By turnaround: 1-7 days, 1-4 weeks, 4+ weeks
    - By rating: sort by downloads, artist rating

- **Ethos Service Card** (in NEXUS grid)

  - Artist name, avatar, verified badge
  - Sample pricing preview: "Custom Track $500 • SFX Pack $150"
  - Skills tags: [Synthwave] [SFX Design] [Electronic]
  - Quick stats: 847 downloads, "For Hire"
  - Rating: 4.8★ (based on licensing agreement ratings)
  - CTA: "View Portfolio" → `/ethos/artists/:userId`

- **Integration Points**

  - Location: `code/client/pages/Nexus.tsx`
  - Modify:
    - Add "Audio Production" filter/category button
    - Add Ethos service cards to the marketplace grid
    - Ensure responsive layout (grid works on mobile/desktop)
    - Add "Browse Audio Production" navigation link in hero

- **API Changes**
  - Update `GET /api/nexus/services` endpoint to include Ethos artists
  - Query: `SELECT * FROM ethos_artist_profiles WHERE for_hire = true`
  - Join with `user_profiles` for name, avatar, bio
  - Include computed stats: total_downloads, license_agreements_count

---

### 4. Licensing Agreement Workflow

**Goal:** Manage commercial licensing agreements from inquiry to contract.

**Technical Scope:**

- **Contact Artist Flow**

  - Location: `code/client/components/ethos/ContactArtistModal.tsx`
  - When user clicks "Contact Artist" on a track or profile:
    - Modal asks: "What's your project about?"
    - Textarea for project description
    - Link to sample commercial contract (stored in docs)
    - CTA: "Request Licensing Agreement"
  - Backend: Creates a `pending` agreement in ethos_licensing_agreements table
  - Email: Notify artist that someone wants to license their track

- **Artist Licensing Dashboard**

  - Location: `code/client/pages/ethos/LicensingDashboard.tsx`
  - Tab 1: "Pending Agreements" (awaiting response)
    - Card per agreement: licensee name, track, project desc, created date
    - CTA: "Review & Approve" or "Decline"
  - Tab 2: "Active Agreements" (approved)
    - Card per agreement: licensee, track, license type, expires_at
    - Status: "Active", "Expiring Soon", "Expired"
  - Tab 3: "Declined"
    - Archive of declined agreements

- **Approval Flow**

  - Artist clicks "Review & Approve"
  - Modal shows:
    - Licensee info, project description
    - Contract preview (linked to agreement_url)
    - Options: "Approve" or "Decline with Message"
  - If "Approve":
    - Set `approved = true` in database
    - Email licensee a confirmation & next steps (how to sign contract)

- **API Endpoints**
  - `POST /api/ethos/licensing-agreements` - Create agreement request
  - `GET /api/ethos/licensing-agreements` - List for artist or licensee
  - `PUT /api/ethos/licensing-agreements/:id` - Approve/decline
  - `DELETE /api/ethos/licensing-agreements/:id` - Archive

---

## UI/UX Design Principles

### Color Palette

- Primary: Neon pink (#ec4899), purple (#a855f7), cyan (#06b6d4)
- Synthwave aesthetic: dark backgrounds, glowing accents
- Consistent with NEXUS (purple) and existing AeThex arms

### Components

- Reuse existing UI components (Button, Card, Badge, Input, Textarea)
- Create new Ethos-specific components:
  - `TrackUploadModal.tsx`
  - `TrackMetadataForm.tsx`
  - `TrackCard.tsx` (for grid display)
  - `ArtistCard.tsx` (for NEXUS integration)
  - `ContactArtistModal.tsx`
  - `LicensingAgreementCard.tsx`

### Navigation

- Add Ethos link to main nav: "Ethos Guild"
- Link to: `/ethos` or `/community/groups/ethos` (Phase 1 page)
- From Ethos Guild page, link to:
  - `/ethos/library` - Browse all tracks
  - `/ethos/artists` - Discover artists
  - `/ethos/settings` - Artist settings (authenticated)

---

## Database Queries & Indexing

### Optimized Queries

```sql
-- Get all published tracks (with artist info)
SELECT t.*, p.full_name as artist_name, p.avatar_url
FROM ethos_tracks t
JOIN user_profiles p ON t.user_id = p.id
WHERE t.is_published = true
ORDER BY t.created_at DESC
LIMIT 20 OFFSET 0;

-- Get artist profile with stats
SELECT ap.*, p.full_name, p.avatar_url,
  COUNT(t.id) as track_count,
  SUM(t.download_count) as total_downloads
FROM ethos_artist_profiles ap
JOIN user_profiles p ON ap.user_id = p.id
LEFT JOIN ethos_tracks t ON ap.user_id = t.user_id AND t.is_published = true
WHERE ap.user_id = $1
GROUP BY ap.user_id, p.id;

-- Get pending licensing agreements for artist
SELECT la.*, t.title as track_title, p.full_name as licensee_name
FROM ethos_licensing_agreements la
JOIN ethos_tracks t ON la.track_id = t.id
JOIN user_profiles p ON la.licensee_id = p.id
WHERE t.user_id = $1 AND la.approved = false
ORDER BY la.created_at DESC;
```

### Index Strategy

- `ethos_tracks`: index on (is_published, created_at), (user_id), (genre)
- `ethos_artist_profiles`: index on (for_hire, verified)
- `ethos_licensing_agreements`: index on (track_id, approved), (licensee_id)

---

## API Endpoint Specifications

### Tracks API

**POST /api/ethos/tracks**

```
Headers: Authorization: Bearer <token>
Body: FormData {
  file: File,
  title: string,
  description: string,
  genre: string[],
  bpm: number,
  license_type: 'ecosystem' | 'commercial_sample',
  is_published: boolean
}
Response: { id, user_id, title, file_url, ... }
```

**GET /api/ethos/tracks**

```
Query: ?genre=Synthwave&license_type=ecosystem&page=1&limit=20&sort=downloads
Response: { tracks: [...], total, page, limit }
```

**PUT /api/ethos/tracks/:id**

```
Headers: Authorization: Bearer <token>
Body: Partial track update (title, description, genre, license_type, is_published)
Response: Updated track
```

**DELETE /api/ethos/tracks/:id**

```
Headers: Authorization: Bearer <token>
Response: { success: true }
```

### Artists API

**GET /api/ethos/artists**

```
Query: ?for_hire=true&verified=true&page=1&limit=20&skills=Synthwave
Response: { artists: [...], total }
```

**GET /api/ethos/artists/:userId**

```
Response: { id, user_id, full_name, avatar_url, bio, skills, for_hire, pricing, stats }
```

**PUT /api/ethos/artists/:userId**

```
Headers: Authorization: Bearer <token>
Body: { bio, skills, for_hire, portfolio_url, sample_price_track, ... }
Response: Updated artist profile
```

### Licensing API

**POST /api/ethos/licensing-agreements**

```
Headers: Authorization: Bearer <token>
Body: { track_id, project_description }
Response: { id, track_id, licensee_id, status: 'pending', ... }
```

**PUT /api/ethos/licensing-agreements/:id**

```
Headers: Authorization: Bearer <token> (artist only)
Body: { approved: boolean, message?: string }
Response: Updated agreement
```

---

## File Structure

```
code/client/
├── pages/
│   ├── ethos/
│   │   ├── TrackLibrary.tsx
│   │   ├── ArtistProfile.tsx
│   │   ├── ArtistSettings.tsx
│   │   └── LicensingDashboard.tsx
├── components/
│   └── ethos/
│       ├── TrackUploadModal.tsx
│       ├── TrackMetadataForm.tsx
│       ├── TrackCard.tsx
│       ├── ArtistCard.tsx
│       ├── ContactArtistModal.tsx
│       └── LicensingAgreementCard.tsx
│
code/api/
├── ethos/
│   ├── tracks.ts
│   ├── artists.ts
│   └── licensing-agreements.ts
```

---

## Timeline Estimate

- **Week 1:** API endpoints + database queries (4 hours)
- **Week 2:** Track upload UI + library page (6 hours)
- **Week 3:** Artist profiles + NEXUS integration (6 hours)
- **Week 4:** Licensing workflow + testing (4 hours)

**Total:** ~20 hours development

---

## Success Criteria

- ✅ Artists can upload tracks with metadata
- ✅ Tracks appear in library and NEXUS marketplace
- ✅ Artists can manage profiles and set pricing
- ✅ Licensing agreements workflow functional
- ✅ Downloads tracked and displayed
- ✅ Error handling and validation complete
- ✅ Performance: Track queries <200ms, artist queries <150ms
- ✅ Mobile responsive on all pages

---

## Legal & Compliance

- All licensing agreements linked to signed contract (agreement_url)
- Ecosystem license terms displayed at upload (user must agree)
- Commercial licensing disabled until legal templates approved
- Email notifications to artists for pending agreements
- Archive all licensing agreements for audit trail

---

## Follow-Up: Phase 3 (Content & Community)

Once Phase 2 MVP is live:

1. Community team writes music production curriculum
2. Founding artists invited to upload their tracks
3. Monthly artist spotlights & events launched
4. Integration with Dev-Link for B2B game projects
5. CORP arm can hire artists for commercial projects via NEXUS

---

## Related Documents

- `code/docs/ETHOS_GUILD_STRATEGIC_BRIEF.md` - Strategic overview
- `code/supabase/migrations/20250206_add_ethos_guild.sql` - Database schema
- `/community/groups/ethos` - Community group landing page
- `/docs/curriculum/ethos` - Curriculum skeleton
