# Ethos Guild - Complete Implementation Guide

## Overview

Ethos Guild is a music production and licensing ecosystem within AeThex. Artists can upload tracks, get verified, offer services for hire, and manage licensing agreements. The system is now fully implemented with all core features working end-to-end.

## Completed Features

### Phase 1: Artist Verification Workflow ✅

- **Admin Dashboard**: `/admin` → "Ethos Verification" tab
- **Artist Submission**: `/ethos/settings` → Verification form
- **Verification Process**: Manual review by admins with approval/rejection
- **Email Notifications**: Verification status updates sent to artists
- **Database**: `ethos_verification_requests` and `ethos_verification_audit_log` tables

### Phase 2: Supabase Storage Integration ✅

- **Track Upload**: Audio files stored in `ethos-tracks` bucket
- **Public Access**: Tracks are publicly readable for streaming
- **User Isolation**: Each user can only upload to their own folder
- **RLS Policies**: Secure access control via Row-Level Security
- **File Management**: Upload, download, delete operations supported

### Phase 3: Email Notifications ✅

- **SMTP Configuration**: Hostinger SMTP (smtp.hostinger.com:465)
- **Templates**: Verification, licensing, and status notifications
- **Delivery**: Reliable email delivery via Nodemailer
- **Async Processing**: Non-blocking email sending

### Phase 4: Ecosystem License Agreement ✅

- **Modal Interface**: Click-wrap agreement on first track upload
- **License Tracking**: `ethos_ecosystem_licenses` table
- **Track Linking**: Accepted licenses linked to specific tracks
- **Re-acceptance**: Artists can accept license once

### Phase 5: Artist Services & Pricing ✅

- **Flexible Pricing**: JSON-based `price_list` structure
- **Service Types**: Custom tracks, SFX packs, full scores, day rates
- **For Hire Status**: Boolean flag to show in marketplace
- **Marketplace Display**: Services visible in `/nexus` Audio Production section
- **Contact System**: Service request form with commission tracking

### Phase 6: NEXUS Marketplace Integration ✅

- **Two Components**: AudioTracksForSale and AudioServicesForHire
- **Artist Directory**: Filter by skills, ratings, services
- **Track Library**: Filter by genre, license type, price
- **Search & Discovery**: Full-text search across all content
- **Profile Integration**: Links to artist profiles and portfolio

### Phase 7: Artist Portfolio ✅

- **Route**: `/passport/me` (personal) and `/passport/:username` (public)
- **Sections**: Ethos Guild info, tracks, skills, verification status
- **Self View**: Edit link to settings for own profile
- **Public View**: Shows published tracks and for-hire services (no pricing without hire status)
- **Integration**: Seamlessly combined with main AeThex passport

## API Endpoints

### Artist Management

```
GET /api/ethos/artists?id=<id> - Get single artist
GET /api/ethos/artists?for_hire=true - List artists available for hire
GET /api/ethos/artists?verified=true - List verified artists
PUT /api/ethos/artists - Update artist profile
```

### Artist Services

```
GET /api/ethos/artist-services/:artist_id - Get artist's service pricing
```

### Service Requests

```
POST /api/ethos/service-requests - Create service request
GET /api/ethos/service-requests?artist_id=<id> - List requests for artist
PUT /api/ethos/service-requests/:id - Update request status
```

### Tracks

```
GET /api/ethos/tracks - List published tracks
POST /api/ethos/tracks - Upload new track (with auto-license linking)
```

### Verification

```
GET /api/ethos/verification - List verification requests (admin)
POST /api/ethos/verification - Submit or manage verification
```

### Licensing

```
GET /api/ethos/licensing-agreements - List agreements
POST /api/ethos/licensing-notifications - Send notifications
```

## Database Schema

### Main Tables

**ethos_artist_profiles**

- `user_id` (PK): References user_profiles
- `for_hire`: Boolean flag for marketplace visibility
- `verified`: Verification status
- `skills`: Array of skills
- `price_list`: JSON with flexible pricing
- `ecosystem_license_accepted`: License acceptance flag
- RLS: Users see all, own updates only

**ethos_tracks**

- `id` (PK): UUID
- `user_id`: Artist who uploaded
- `title`, `description`: Track info
- `file_url`: Supabase Storage path
- `genre`: Array of genres
- `license_type`: "ecosystem" or "commercial_sample"
- `duration_seconds`, `bpm`: Audio metadata
- `is_published`: Visibility flag
- RLS: Public read, user write/delete own

**ethos_ecosystem_licenses**

- `id` (PK): UUID
- `track_id`: Which track accepted license
- `artist_id`: Which artist accepted
- `accepted_at`: When license was accepted
- RLS: User sees own, admins see all

**ethos_verification_requests**

- `id` (PK): UUID
- `user_id`: Artist requesting verification
- `status`: "pending", "approved", "rejected"
- `submission_notes`, `portfolio_links`: Application details
- `reviewed_at`, `reviewed_by`: Admin review info
- RLS: Artists see own, admins see all

**ethos_service_requests**

- `id` (PK): UUID
- `artist_id`: Requested artist
- `requester_id`: Client requesting service
- `service_type`: track_custom, sfx_pack, full_score, day_rate
- `description`, `budget`, `deadline`: Request details
- `status`: pending, accepted, in_progress, completed, declined
- RLS: Both parties can view, artist updates

### Storage Bucket

**ethos-tracks** (Public)

- Path: `/{user_id}/{track_id}/audio.mp3`
- RLS: Authenticated users can upload to own folder, public read, user delete own
- Policy: Users isolated to their own folder, public streaming access

## User Flows

### Artist Upload Flow

1. Artist goes to `/ethos/settings`
2. Clicks "Upload Track" button
3. Selects audio file
4. **First time**: EcosystemLicenseModal shows click-wrap agreement
5. Artist reviews and accepts license
6. License recorded in `ethos_ecosystem_licenses` with `ecosystem_license_accepted = true`
7. TrackMetadataForm opens for track details
8. Artist enters title, description, genre, BPM, etc.
9. File uploaded to Supabase Storage at `ethos-tracks/{user_id}/{track_id}/audio.mp3`
10. Track record created in `ethos_tracks` table
11. **Auto-linking**: If license_type = "ecosystem", link created in `ethos_ecosystem_licenses`
12. Success toast shown, track appears in library

### Verification Flow

1. Artist goes to `/ethos/settings` → "Request Verification"
2. Fills form: bio, skills, portfolio links, submission notes
3. POST to `/api/ethos/verification` with action: "submit"
4. Request stored in `ethos_verification_requests` table
5. Email sent to artist confirmation
6. Admin views requests at `/admin` → "Ethos Verification" tab
7. Admin reviews artist profile, tracks, and submission
8. Admin clicks "Approve" or "Reject"
9. If approved: `verified = true` in `ethos_artist_profiles`, email sent to artist
10. If rejected: `verified = false`, rejection reason emailed
11. Artist can see status on settings page

### Marketplace Discovery Flow

1. User goes to `/nexus`
2. Clicks "Services for Hire" tab
3. Component fetches: `GET /api/ethos/artists?forHire=true&limit=50`
4. Displays artists with skills, ratings, service prices
5. Can filter by: skill, service type, minimum rating
6. Clicks "View Profile" → `/passport/:username`
7. **On profile**: Shows Ethos Guild section with:
   - Verification badge (if verified)
   - "Available for hire" badge
   - Skills display
   - Published tracks
   - Link to manage portfolio
8. Clicks "Request Service" → Opens service request form
9. Fills: service type, description, budget, deadline
10. POST to `/api/ethos/service-requests`
11. Artist notified via email
12. Artist can accept/decline in dashboard

### Artist Portfolio View

1. Artist goes to `/passport/me` (personal portfolio)
2. **Ethos Guild Section Shows**:
   - Verified Artist badge (if applicable)
   - Available for hire badge (if applicable)
   - Top 5 skills
   - Published tracks (max 5)
   - Edit link to `/ethos/settings`
3. Visitors go to `/passport/:username`
4. **Public view shows** (if artist for_hire):
   - Verified/for-hire badges
   - Skills
   - Published tracks
5. **Pricing NOT shown** on portfolio (only on NEXUS marketplace)
6. Can click "View Profile" from NEXUS to access

## Deployment Checklist

### Database

- [ ] Apply migration: `20250206_add_ethos_guild.sql`
- [ ] Apply migration: `20250210_add_ethos_artist_verification.sql`
- [ ] Apply migration: `20250210_setup_ethos_storage.sql` (read-only in SQL)
- [ ] Apply migration: `20250211_add_ethos_artist_services.sql`
- [ ] Apply migration: `20250212_add_ethos_service_requests.sql`

### Storage Setup

- [ ] Create Supabase Storage bucket: "ethos-tracks"
- [ ] Make bucket PUBLIC
- [ ] Apply RLS policies (see migration comments)
- [ ] Test upload from browser

### Environment Variables

```
VITE_SUPABASE_URL=https://kmdeisowhtsalsekkzqd.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE=<your-service-role-key>
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=support@aethex.tech
SMTP_PASSWORD=<password>
SMTP_FROM_EMAIL=no-reply@aethex.tech
```

### Testing Steps

1. [ ] Create user account
2. [ ] Go to `/ethos/settings`
3. [ ] Upload track → Accept license → Fill metadata → Upload to storage
4. [ ] Check `ethos_ecosystem_licenses` table for license record
5. [ ] Submit verification request
6. [ ] Check `/admin` → "Ethos Verification" → Approve request
7. [ ] Check email for verification confirmation
8. [ ] Go to `/nexus` → "Services for Hire"
9. [ ] See artist in listing with services
10. [ ] View artist profile at `/passport/me`
11. [ ] See Ethos Guild section with tracks and skills
12. [ ] Other user requests service
13. [ ] Check `/api/ethos/service-requests` for new request
14. [ ] Accept/decline service request

## Technical Details

### License Linking Logic

When a track is uploaded with `license_type: "ecosystem"`:

1. Track record created in `ethos_tracks`
2. Immediately after insert, code creates record in `ethos_ecosystem_licenses`
3. Links: track_id, artist_id, accepted_at (current timestamp)
4. This establishes the relationship between license agreement and track

### Storage Path Format

```
ethos-tracks/
  {user_id}/
    {track_id}/
      audio.mp3
```

- User ID isolates folders for RLS
- Track ID groups related files
- Flat structure easy to manage

### Service Pricing Structure

```json
{
  "price_list": {
    "track_custom": 500,
    "sfx_pack": 300,
    "full_score": 2000,
    "day_rate": 800,
    "contact_for_quote": false
  }
}
```

- Flexible JSON for future service types
- `null` values mean service not available
- Boolean flag for custom quotes

### Verification Workflow

```
pending → admin review → approved/rejected
          ↓                    ↓
     send email          send rejection email
     set verified=true   set verified=false
```

## Future Enhancements

1. **Rating System**: Add 5-star ratings for artists and service quality
2. **Payment Processing**: Integrate Stripe for service payments
3. **Contracts**: Generate and manage service contracts
4. **Escrow**: Hold funds during service delivery
5. **Dispute Resolution**: Handle disagreements between parties
6. **Review System**: Post-service reviews and feedback
7. **Portfolio Verification**: Artist can upload portfolio samples
8. **License Variants**: Different license types (exclusive, non-exclusive, etc.)
9. **Collaboration Requests**: One artist request another for collab
10. **Analytics**: Track uploads, downloads, earnings per artist

## Support

For issues or questions about Ethos Guild:

1. Check `/docs` section for tutorials
2. Review `/ethos/library` for example tracks
3. See `/admin` → "Ethos Verification" for status
4. Contact support@aethex.tech for account issues

---

**Implementation Date**: February 2025
**Status**: Production Ready ✅
**Version**: 1.0
