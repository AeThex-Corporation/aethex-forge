# Ethos Guild Implementation Guide

## Overview

Ethos Guild is the AeThex audio production and music licensing platform that enables verified artists to upload, share, and license music and sound effects. This guide covers all the features implemented and how to set them up.

## Architecture

### Database Tables

1. **ethos_tracks** - Music and sound effects uploaded by artists
   - Stores track metadata: title, description, genre, license type, BPM
   - Tracks download counts and publication status
   - References artist via `user_id`

2. **ethos_artist_profiles** - Extended profiles for artists
   - Skills and specializations
   - Pricing for common services (custom track, SFX pack, full score)
   - Turnaround times and availability
   - Verification status

3. **ethos_guild_members** - Guild membership tracking
   - Role-based access (member, curator, admin)
   - Membership dates and bios

4. **ethos_licensing_agreements** - Commercial licensing contracts
   - Links artists (track owners) with licensees
   - Tracks agreement status (pending/approved)
   - Stores license type (one-time, exclusive, broadcast)

5. **ethos_verification_requests** - Artist verification workflow
   - Tracks pending verification submissions
   - Admin review workflow with approval/rejection
   - Audit logging for compliance

6. **ethos_verification_audit_log** - Compliance and audit trail
   - Records all verification decisions
   - Tracks who reviewed and when

### Storage

**Bucket: `ethos-tracks`**
- Stores actual audio files (MP3, WAV)
- Organized by user ID: `/{user_id}/{timestamp}-{filename}`
- Public read access for streaming
- Private write/delete for artists only

## Setup Instructions

### 1. Database Migration

Run these migrations in order in your Supabase dashboard:

```sql
-- 1. Main schema (20250206_add_ethos_guild.sql)
-- Creates core tables: ethos_tracks, ethos_artist_profiles, ethos_guild_members, ethos_licensing_agreements

-- 2. Verification system (20250210_add_ethos_artist_verification.sql)
-- Creates verification request and audit log tables

-- 3. Storage setup (20250210_setup_ethos_storage.sql)
-- Sets up RLS policies for storage bucket
```

### 2. Storage Bucket Setup

1. Go to Supabase Dashboard > Storage
2. Create a new bucket named `ethos-tracks`
3. Make it **PUBLIC** (for streaming access)
4. Apply the RLS policies from migration 20250210_setup_ethos_storage.sql

The RLS policies ensure:
- Authenticated users can upload to their own folder
- Public can read all files (for streaming)
- Users can only delete their own files

### 3. Email Configuration

Verify SMTP settings are configured:

```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=support@aethex.tech
SMTP_PASSWORD=***
SMTP_FROM_EMAIL=no-reply@aethex.tech
```

The system sends notifications for:
- Artist verification approval/rejection
- Licensing request notifications
- License agreement approvals/rejections

### 4. API Endpoints

#### Track Management
- `GET /api/ethos/tracks` - List tracks with filters
- `POST /api/ethos/tracks` - Create new track
- `PUT /api/ethos/tracks` - Update track
- `DELETE /api/ethos/tracks` - Delete track

#### Artist Profiles
- `GET /api/ethos/artists` - List/get artist profile
- `PUT /api/ethos/artists` - Update artist profile

#### Licensing
- `GET /api/ethos/licensing-agreements` - List agreements
- `POST /api/ethos/licensing-agreements` - Create agreement
- `PUT /api/ethos/licensing-agreements` - Approve/reject agreement
- `DELETE /api/ethos/licensing-agreements` - Archive agreement

#### Verification
- `GET /api/ethos/verification` - List verification requests (admin)
- `POST /api/ethos/verification` - Submit/approve/reject verification

#### Notifications
- `POST /api/ethos/licensing-notifications` - Send licensing notifications

## Features

### 1. Artist Verification Workflow

**For Artists:**
1. Go to `/ethos/settings`
2. Fill out artist profile (skills, pricing, portfolio)
3. Submit verification request with portfolio links and notes
4. Wait for admin review (status shown in settings)

**For Admins:**
1. Go to Admin → Ethos Verification tab
2. Review pending artist applications
3. View artist skills, portfolio links, and submission notes
4. Approve or reject with optional feedback
5. Artists receive email notification

**Status Flow:**
- Pending → Artist has submitted
- Approved → Artist is verified, can upload/license
- Rejected �� Admin provided feedback, artist can resubmit

### 2. Track Upload with Supabase Storage

**Process:**
1. Artist clicks "Upload New Track"
2. Selects MP3/WAV file (up to 50MB)
3. Fills in track metadata:
   - Title, description, genre, BPM
   - License type (ecosystem/commercial)
   - Publication status
4. File uploaded to Supabase Storage at: `/{user_id}/{timestamp}-{filename}`
5. Audio duration automatically detected
6. Track record created in database with storage path

**File Management:**
- Files stored in public bucket for streaming
- Organized by artist to enable bulk deletion
- Version control via timestamps

### 3. Licensing Workflow

**Creating a Licensing Agreement:**
1. Licensee finds track in Ethos Library
2. Selects license type (one-time, exclusive, broadcast)
3. Artist reviews request in Licensing Dashboard
4. Artist approves/declines
5. Both parties notified via email

**Email Notifications:**
- Artist notified of new license request
- Licensee notified if approved
- Licensee notified if rejected

**License Types:**
- `commercial_one_time` - Single use
- `commercial_exclusive` - Exclusive to one licensee
- `broadcast` - Broadcasting rights

### 4. Email Notifications

Sent for:

**Verification Events:**
- ✅ Artist verification approved (with quick links)
- �� Artist verification rejected (with feedback)

**Licensing Events:**
- 📝 New licensing request submitted (artist notification)
- ✅ Licensing agreement approved (artist notification)
- ❌ Licensing agreement rejected (licensee notification)

All emails include:
- Personalized greeting
- Clear action items
- Direct links to relevant dashboard pages
- Support contact information

## Frontend Pages

### Public Pages
- `/ethos` - Ethos Guild landing page
- `/ethos/library` - Browse all public tracks

### Artist Pages (Authenticated)
- `/ethos/settings` - Profile, skills, services, upload
- `/ethos/licensing` - View and manage licensing agreements
- `/creators` - Browse other artists

### Admin Pages
- `/admin` → Ethos tab - Verification request review

## Security & Compliance

### Row-Level Security (RLS)
- Artists can only see/edit their own data
- Public can read published tracks
- Licensing agreements visible to involved parties only
- Admins can manage guild members

### Data Protection
- Email addresses not exposed publicly
- Audio files stored with user ownership
- Verification audit log for compliance
- Rejection reasons logged for accountability

## Future Enhancements

### Stripe Integration
- Payment processing for licensing agreements
- Commission tracking (artist/AeThex split)
- Invoice generation

### Analytics
- Track download analytics
- Licensing revenue reporting
- Artist performance metrics

### Community Features
- Artist ratings and reviews
- Collaboration requests
- Featured artist showcase
- Award system (gold, platinum, etc.)

### Advanced Search
- Full-text search on metadata
- AI-powered similar track discovery
- Genre and mood filtering

## Troubleshooting

### Storage Upload Fails
- Check bucket exists and is public
- Verify file size < 50MB
- Check CORS settings in Supabase

### Verification Emails Not Sending
- Verify SMTP credentials in environment
- Check spam folder
- Verify email addresses in database

### License Requests Not Appearing
- Check user has authenticated session
- Verify licensing_agreements table has records
- Check RLS policies allow user access

### Verification Status Not Loading
- Ensure ethos_verification_requests table exists
- Check user_id matches authenticated user
- Verify indexes created

## Environment Variables

Required:

```env
# Supabase
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE=

# Email
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM_EMAIL=
```

## Testing Checklist

- [ ] Create artist account
- [ ] Upload track with valid metadata
- [ ] Verify file appears in storage
- [ ] Submit for verification
- [ ] Review in admin panel
- [ ] Approve artist
- [ ] Verify email received
- [ ] Request license for track
- [ ] Approve license request
- [ ] Verify both parties notified
- [ ] Test artist deletion of track

## Support

For questions or issues:
- Check `/internal-docs` for technical documentation
- Review migration files for schema details
- Contact: support@aethex.tech
