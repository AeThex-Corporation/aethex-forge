# Feed Phase 1: The Axiom Model in Action

## Overview

Phase 1 is the **read-only, curated foundation** that proves the Axiom Model works. The feed is now the "living, public proof" that our Guardian (Foundation) and Engine (Corp/GameForge/Labs) can operate side-by-side with full transparency.

### Strategic Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Community Pulse Feed                       │
│                  (Unified Town Square)                       │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  [All Stories] [Following] [Trending]    [Manage Arms]       │
│  [Labs][GameForge][Corp][Foundation][Dev-Link][Nexus][Staff]│
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ ✨ Labs Post                          [LABS BADGE]      │ │
│  │ Left Border: Yellow                                     │ │
│  └─────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ ✨ Foundation Announcement            [FOUNDATION BADGE]│ │
│  │ Left Border: Red (The "Firewall" is visible)           │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  👉 Every post shows: Arm Badge + Left Border Color Accent   │
│                                                               │
└──────────────────��──────────────────────────────────────────┘
```

---

## Features Implemented

### 1. **Arm Affiliation Theming** ✅

Every post displays a **color-coded badge** and **left border accent** matching the Arm:

- **LABS** (Yellow): Innovation & experimentation
- **GAMEFORGE** (Green): Game development
- **CORP** (Blue): Commercial partnerships
- **FOUNDATION** (Red): Education & mentorship
- **DEV-LINK** (Cyan): Developer networking
- **NEXUS** (Purple): Talent marketplace
- **STAFF** (Indigo): Internal operations

**Why this matters**: The colors are the **visual proof of the Firewall**. At a glance, you know what type of content you're reading.

### 2. **Arm Follow System** ✅

Users can now:

- Follow specific Arms
- Personalize their feed to show only followed Arms
- Access the "Following" tab to see curated content

**Database**:

- New `arm_follows` table tracks user -> arm relationships
- RLS policies ensure users can only manage their own follows

### 3. **Arm-Specific Feeds** ✅

New routes available:

- `/labs` - Labs feed only
- `/gameforge` - GameForge feed only
- `/corp` - Corp feed only
- `/foundation` - Foundation feed only
- `/devlink` - Dev-Link feed only
- `/nexus` - Nexus feed only
- `/staff` - Staff feed only

Each has:

- Dedicated header with Arm icon & description
- Content filtered to that Arm only
- Same interaction system (like, comment, share)

### 4. **Admin Feed Manager** ✅

**Route**: `/admin/feed`

Founders/Admins can now create **system announcements** that seed the feed. Features:

- Title & content editor (max 500 & 5000 chars)
- Arm affiliation selector
- Tag management
- One-click publish

**Use cases**:

- Announce new partnerships
- Showcase Arm-to-Arm collaborations
- Prove the "Talent Flywheel" in action
- Demonstrate ethical separation

### 5. **Discord Announcements Sync** ✅

**One-way**: Discord → AeThex Feed

The Discord bot now listens to configured announcement channels and automatically:

1. Posts to the AeThex feed
2. Auto-detects Arm affiliation from channel/guild name
3. Includes media (images, videos)
4. Tags posts with source
5. Reacts with ✅ when successful

**Configuration**:

```env
DISCORD_ANNOUNCEMENT_CHANNELS=1435667453244866702,your_other_channels
DISCORD_FEED_WEBHOOK_URL=https://discord.com/api/webhooks/...
DISCORD_FEED_GUILD_ID=515711457946632232
DISCORD_FEED_CHANNEL_ID=1425114041021497454
```

---

## Database Schema

### New Tables

#### `arm_follows`

```sql
id BIGSERIAL PRIMARY KEY
user_id UUID REFERENCES auth.users(id)
arm_affiliation TEXT CHECK (arm_affiliation IN (
  'labs', 'gameforge', 'corp', 'foundation', 'devlink', 'nexus', 'staff'
))
followed_at TIMESTAMP WITH TIME ZONE
UNIQUE(user_id, arm_affiliation)
```

#### `community_posts` (Updated)

```sql
-- Already existed, now with validated arm_affiliation
arm_affiliation TEXT NOT NULL CHECK (arm_affiliation IN (...))
-- Indexes added for faster filtering
CREATE INDEX idx_community_posts_arm_affiliation ON community_posts(arm_affiliation)
CREATE INDEX idx_community_posts_created_at ON community_posts(created_at DESC)
```

---

## API Endpoints

### Feed Management

#### Get Arm Follows

```
GET /api/user/arm-follows?user_id={userId}
Returns: { arms: ["labs", "gameforge", ...] }
```

#### Follow an Arm

```
POST /api/user/arm-follows?user_id={userId}
Body: { arm_affiliation: "labs" }
```

#### Unfollow an Arm

```
DELETE /api/user/arm-follows?user_id={userId}
Body: { arm_affiliation: "labs" }
```

#### Create Post (Admin)

```
POST /api/community/posts
Body: {
  title: string,
  content: string,
  arm_affiliation: "labs" | "gameforge" | "corp" | "foundation" | "devlink" | "nexus" | "staff",
  author_id: uuid,
  tags?: string[],
  category?: string
}
```

### Discord Integration

#### Discord Webhook Sync

```
POST /api/discord/feed-sync
Body: {
  id: string,
  title: string,
  content: string,
  author_name: string,
  author_avatar?: string,
  arm_affiliation: string,
  likes_count: number,
  comments_count: number,
  created_at: string
}
```

---

## File Changes Summary

### New Files Created

- `code/client/pages/AdminFeed.tsx` - Admin feed manager UI
- `code/client/components/feed/ArmFeed.tsx` - Reusable Arm feed component
- `code/client/pages/ArmFeeds.tsx` - Individual Arm feed page exports
- `code/api/user/arm-follows.ts` - ARM follows CRUD API
- `code/api/discord/feed-sync.ts` - Discord → Feed webhook handler
- `code/discord-bot/events/messageCreate.js` - Enhanced message handler
- `code/supabase/migrations/20250115_feed_phase1_schema.sql` - Database schema
- `code/discord-bot/.env.example` - Environment variable template

### Modified Files

- `code/client/components/social/FeedItemCard.tsx` - Added Arm badges & visual theming
- `code/client/pages/Feed.tsx` - Added arm follow management UI
- `code/discord-bot/bot.js` - Enhanced to load event listeners with correct intents

---

## Deployment Checklist

### 1. Database Migrations

```bash
npx supabase migration up
# OR manually apply:
# code/supabase/migrations/20250115_feed_phase1_schema.sql
```

### 2. Environment Variables

Set in your production environment:

```env
DISCORD_ANNOUNCEMENT_CHANNELS=1435667453244866702
DISCORD_FEED_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_ID/YOUR_TOKEN
DISCORD_FEED_GUILD_ID=515711457946632232
DISCORD_FEED_CHANNEL_ID=1425114041021497454
VITE_API_BASE=https://your-api-domain.com
```

### 3. Update App Routing

Add these routes to `code/client/App.tsx`:

```typescript
{
  path: "/admin/feed",
  element: <AdminFeed />,
},
{
  path: "/labs",
  element: <LabsFeed />,
},
{
  path: "/gameforge",
  element: <GameForgeFeed />,
},
{
  path: "/corp",
  element: <CorpFeed />,
},
{
  path: "/foundation",
  element: <FoundationFeed />,
},
{
  path: "/devlink",
  element: <DevLinkFeed />,
},
{
  path: "/nexus",
  element: <NexusFeed />,
},
{
  path: "/staff",
  element: <StaffFeed />,
},
```

### 4. Discord Bot Restart

Restart the Discord bot for it to:

1. Load the new message event listener
2. Subscribe to announcement channels
3. Start syncing posts

---

## Usage Guide

### For Founders/Admins

1. Go to `/admin/feed`
2. Write your announcement
3. Select the appropriate Arm
4. Publish

Example post:

> **Title**: GameForge + Foundation Partnership
> **Content**: We're thrilled to announce that GameForge will hire 3 Artists from Foundation via Nexus. This is the Talent Flywheel in action.
> **Arm**: gameforge

### For Users

1. Go to `/feed` (main unified feed)
2. Manage which Arms you follow using "Manage Follows"
3. Filter the feed with the Arm buttons
4. Click on `/labs`, `/gameforge`, etc. for dedicated feeds
5. Like, comment, share posts

---

## Phase 2: User-Generated Posts

Once Phase 1 is proven (admin posts working, Discord sync working), Phase 2 will add:

- User post composer in the `/feed` page
- Moderation queue for new user posts
- Reputation scoring
- Collaboration post type (target specific Arms)
- Cross-Arm partnership showcases

---

## Testing Checklist

- [ ] Admin can create posts via `/admin/feed`
- [ ] Posts show correct Arm badge & color
- [ ] Posts appear in unified `/feed` with filtering
- [ ] Arm-specific feeds (`/labs`, `/gameforge`, etc.) show only that Arm
- [ ] Users can follow/unfollow Arms
- [ ] Discord #announcements sync works
- [ ] Synced posts show correct Arm based on channel name
- [ ] Badges and borders display correctly
- [ ] Database queries are performant (check indexes)

---

## Performance Notes

**Indexes Added**:

- `idx_community_posts_arm_affiliation` - Fast Arm filtering
- `idx_community_posts_created_at` - Fast sorting by date
- `idx_arm_follows_user_id` - Fast user follow lookups
- `idx_arm_follows_arm` - Fast arm-based queries

**Caching Recommendations** (Phase 2):

- Cache user's followed Arms for 5 minutes
- Cache trending posts per Arm
- Use Redis for real-time engagement counts

---

## Contact & Support

For questions on Phase 1 implementation or moving to Phase 2, refer to:

- `/api/community/posts` - Main post creation API
- `/api/user/arm-follows` - Arm follow management
- `code/discord-bot/events/messageCreate.js` - Discord sync logic
- `code/client/components/social/FeedItemCard.tsx` - Badge theming
