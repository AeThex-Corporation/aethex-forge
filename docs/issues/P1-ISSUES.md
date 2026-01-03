# P1 Priority Issues (Medium Priority)

These issues should be addressed after P0 items are complete.

---

## Issue 1: [P1] Build comprehensive notification system

**Labels:** `feature`, `P1`, `notifications`, `engagement`

### Problem
Users have no way to know when someone:
- Likes their post
- Comments on their post
- Follows them
- Mentions them
- Awards them an achievement

This leads to poor engagement and missed interactions.

### Proposed Features

#### 1. In-App Notifications
- Notification bell icon in header
- Badge with unread count
- Dropdown panel with recent notifications
- Mark as read functionality
- Clear all functionality

#### 2. Notification Types
- **Social:**
  - New follower
  - Post liked
  - Post commented
  - Mention in post/comment
- **Achievement:**
  - Achievement unlocked
  - Level up
  - Streak milestone
- **System:**
  - Welcome message
  - Onboarding completion
  - Subscription renewal
  - Payment issues

#### 3. Email Notifications
- Daily digest of activity
- Weekly summary
- Immediate alerts for important events
- Unsubscribe options

#### 4. Push Notifications (PWA)
- Browser push for real-time alerts
- Permission request UI
- Notification preferences

### Technical Implementation

#### Database Schema
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  type VARCHAR(50), -- 'follow', 'like', 'comment', etc.
  title VARCHAR(255),
  body TEXT,
  link VARCHAR(500), -- Where to go when clicked
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB -- Extra data specific to notification type
);

CREATE INDEX idx_notifications_user_read ON notifications(user_id, read);
CREATE INDEX idx_notifications_created ON notifications(created_at);
```

#### API Endpoints
- `GET /api/notifications` - Fetch user's notifications
- `POST /api/notifications/:id/read` - Mark as read
- `POST /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification
- `GET /api/notifications/unread-count` - Get count

#### Real-time Updates
Use Supabase Realtime subscriptions:
```typescript
const subscription = supabase
  .channel('notifications')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'notifications',
    filter: `user_id=eq.${userId}`
  }, handleNewNotification)
  .subscribe();
```

### Implementation Checklist
- [ ] Create notifications table
- [ ] Create NotificationContext
- [ ] Build NotificationBell component
- [ ] Build NotificationPanel component
- [ ] Add API endpoints
- [ ] Integrate Supabase Realtime
- [ ] Add notification triggers (on like, comment, etc.)
- [ ] Build email notification service
- [ ] Add user preferences UI
- [ ] Add push notification support
- [ ] Test all notification types

### Acceptance Criteria
- [ ] Users receive in-app notifications
- [ ] Unread count displays in header
- [ ] Clicking notification navigates to relevant content
- [ ] Users can mark notifications as read
- [ ] Users can configure notification preferences
- [ ] Email notifications sent for key events
- [ ] Real-time updates without page refresh

### Estimated Effort
**2-3 weeks**

---

## Issue 2: [P1] Complete project management workflows

**Labels:** `feature`, `P1`, `projects`, `collaboration`

### Problem
Project features are incomplete:
- ProjectBoard.tsx has TODO comment on line 1
- Project creation appears to be a stub
- No team collaboration features
- No file management

### Missing Features

#### 1. Project Creation
**File:** `client/pages/ProjectsNew.tsx`

**Needs:**
- Full project creation form
- Project templates (game dev, web app, etc.)
- Team member invitation
- Initial milestone setup
- File upload/attachment

#### 2. Project Board (Kanban)
**File:** `client/pages/ProjectBoard.tsx`

**Needs:**
- Drag-and-drop task cards
- Columns: Backlog, To Do, In Progress, Review, Done
- Task assignment
- Due dates
- Labels/tags
- Comments on tasks
- File attachments

#### 3. Team Collaboration
**New Features:**
- Multi-user projects
- Role management (owner, editor, viewer)
- Activity feed per project
- @mentions in comments
- Real-time collaboration
- Presence indicators

#### 4. Project Settings
- Edit project details
- Manage team members
- Archive/delete project
- Privacy settings (public/private/team-only)

### Database Schema Updates

#### Projects Table
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES profiles(id),
  status VARCHAR(50), -- 'active', 'archived', 'completed'
  visibility VARCHAR(20), -- 'public', 'private', 'team'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Project Members
```sql
CREATE TABLE project_members (
  project_id UUID REFERENCES projects(id),
  user_id UUID REFERENCES profiles(id),
  role VARCHAR(20), -- 'owner', 'editor', 'viewer'
  joined_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (project_id, user_id)
);
```

#### Project Tasks
```sql
CREATE TABLE project_tasks (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50), -- 'backlog', 'todo', 'in_progress', 'review', 'done'
  assigned_to UUID REFERENCES profiles(id),
  due_date DATE,
  priority VARCHAR(20), -- 'low', 'medium', 'high', 'urgent'
  position INTEGER, -- For ordering within column
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Implementation Checklist
- [ ] Complete ProjectsNew form
- [ ] Implement project creation API
- [ ] Build Kanban board with drag-and-drop
- [ ] Add task CRUD operations
- [ ] Implement team member management
- [ ] Add comments system for tasks
- [ ] Add file attachment support
- [ ] Implement project activity feed
- [ ] Add real-time collaboration
- [ ] Build project settings page
- [ ] Add project templates
- [ ] Implement project search/filter

### Acceptance Criteria
- [ ] Users can create projects
- [ ] Users can manage tasks on Kanban board
- [ ] Users can invite team members
- [ ] Team members can collaborate in real-time
- [ ] Users can upload files to projects
- [ ] Users can comment on tasks
- [ ] Users can archive/delete projects

### Estimated Effort
**3-4 weeks**

---

## Issue 3: [P1] Add image upload functionality

**Labels:** `feature`, `P1`, `media`, `storage`

### Problem
Users cannot upload images for:
- Profile avatars
- Post media
- Project screenshots
- Comments/attachments

### Proposed Solution
Integrate Supabase Storage for image uploads.

### Features Needed

#### 1. Avatar Upload
**Location:** Profile editing page

**Features:**
- Click avatar to upload new image
- Crop/resize before upload
- Preview before saving
- Remove avatar option
- Support JPG, PNG, WebP
- Max 5MB file size

#### 2. Post Media
**Location:** Feed post composer

**Features:**
- Upload 1-10 images per post
- Drag-and-drop upload
- Image preview with remove option
- Automatic compression
- Progress indicator

#### 3. Project Media
**Location:** Project showcase/board

**Features:**
- Project cover image
- Screenshot gallery
- File attachments (not just images)
- Organize in folders

### Technical Implementation

#### Storage Buckets
```typescript
// Create buckets in Supabase
- avatars (public)
- post-media (public)
- project-files (private with RLS)
- attachments (private with RLS)
```

#### Upload Component
```typescript
// components/ImageUpload.tsx
import { supabase } from '@/lib/supabase';

function ImageUpload({ bucket, onUpload }) {
  const handleUpload = async (file: File) => {
    // 1. Validate file (type, size)
    // 2. Compress if needed
    // 3. Generate unique filename
    // 4. Upload to Supabase Storage
    // 5. Get public URL
    // 6. Call onUpload with URL
  };
}
```

#### Image Compression
```bash
npm install browser-image-compression
```

```typescript
import imageCompression from 'browser-image-compression';

const options = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true
};

const compressedFile = await imageCompression(file, options);
```

### Implementation Checklist
- [ ] Create Supabase storage buckets
- [ ] Configure RLS policies
- [ ] Build ImageUpload component
- [ ] Add image compression
- [ ] Implement avatar upload in Profile
- [ ] Implement media upload in PostComposer
- [ ] Implement cover image in Projects
- [ ] Add image preview/lightbox
- [ ] Add delete image functionality
- [ ] Add progress indicators
- [ ] Handle upload errors gracefully
- [ ] Add drag-and-drop support

### Acceptance Criteria
- [ ] Users can upload profile avatars
- [ ] Users can upload images in posts
- [ ] Users can upload project media
- [ ] Images are compressed automatically
- [ ] Upload progress is visible
- [ ] Errors are handled gracefully
- [ ] Uploaded images can be deleted

### Estimated Effort
**1-2 weeks**

---

## Issue 4: [P1] Implement content moderation tools

**Labels:** `feature`, `P1`, `moderation`, `safety`

### Problem
No way to moderate user-generated content:
- Inappropriate posts
- Spam
- Harassment
- Copyright violations

### Proposed Features

#### 1. Report System
**User Actions:**
- Report post
- Report comment
- Report user
- Report reason categories
- Additional details text field

#### 2. Admin Moderation Dashboard
**Location:** `/staff/moderation` (requires admin role)

**Features:**
- Queue of reported content
- Review reports
- Take actions:
  - Approve (dismiss report)
  - Remove content
  - Warn user
  - Suspend user
  - Ban user
- View user's history
- Bulk actions

#### 3. Automated Filters
- Profanity filter (optional, toggle per community)
- Link spam detection
- Image content scanning (AI-based)
- Rate limiting on posts/comments

#### 4. User Controls
- Block users
- Mute users
- Hide posts
- Privacy settings

### Database Schema

#### Reports Table
```sql
CREATE TABLE content_reports (
  id UUID PRIMARY KEY,
  reporter_id UUID REFERENCES profiles(id),
  reported_user_id UUID REFERENCES profiles(id),
  content_type VARCHAR(20), -- 'post', 'comment', 'user'
  content_id UUID,
  reason VARCHAR(50), -- 'spam', 'harassment', 'inappropriate', 'copyright'
  details TEXT,
  status VARCHAR(20), -- 'pending', 'reviewed', 'actioned', 'dismissed'
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMP,
  action_taken VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### User Moderation Actions
```sql
CREATE TABLE moderation_actions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  moderator_id UUID REFERENCES profiles(id),
  action VARCHAR(50), -- 'warn', 'suspend', 'ban', 'content_removed'
  reason TEXT,
  expires_at TIMESTAMP, -- For temporary suspensions
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Blocked Users
```sql
CREATE TABLE user_blocks (
  blocker_id UUID REFERENCES profiles(id),
  blocked_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (blocker_id, blocked_id)
);
```

### Implementation Checklist
- [ ] Create report system tables
- [ ] Build ReportModal component
- [ ] Add "Report" buttons to posts/comments
- [ ] Create moderation dashboard page
- [ ] Build report queue UI
- [ ] Add moderation action buttons
- [ ] Implement user blocking
- [ ] Add automated filters
- [ ] Create moderation logs
- [ ] Add appeal system
- [ ] Set up email notifications for moderators

### Acceptance Criteria
- [ ] Users can report inappropriate content
- [ ] Admins can review reports
- [ ] Admins can take moderation actions
- [ ] Users can block other users
- [ ] Spam is automatically filtered
- [ ] Moderation actions are logged
- [ ] Users receive feedback on reports

### Estimated Effort
**2-3 weeks**

---

## Issue 5: [P1] Add session management and security improvements

**Labels:** `security`, `P1`, `authentication`

### Problem
Missing security features:
- No 2FA (two-factor authentication)
- No session management UI
- No login history
- No account recovery options
- Weak password requirements

### Proposed Features

#### 1. Two-Factor Authentication (2FA)
- **Setup Flow:**
  - Navigate to Settings → Security
  - Choose 2FA method (TOTP app or SMS)
  - Scan QR code (for TOTP)
  - Enter verification code
  - Save backup codes

- **Login Flow:**
  - Enter email/password
  - If 2FA enabled, prompt for code
  - Enter 6-digit code
  - Option to "Trust this device"

- **Recovery:**
  - Use backup codes
  - SMS fallback
  - Contact support

#### 2. Session Management
**Location:** Settings → Security → Active Sessions

**Display:**
- Current session (highlighted)
- Other active sessions:
  - Device/browser
  - IP address
  - Location (city)
  - Last active timestamp
  - "Revoke" button for each

#### 3. Login History
**Location:** Settings → Security → Login History

**Display:**
- Last 30 login attempts
- Date/time
- Device/browser
- IP address
- Location
- Success/failure status

#### 4. Password Strength Requirements
Update from current 6 chars to:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character
- Visual strength indicator
- Password breach check (Have I Been Pwned API)

#### 5. Account Recovery
- Security questions
- Recovery email (separate from login email)
- SMS verification
- Backup codes

### Technical Implementation

#### 2FA with TOTP
```bash
npm install otplib qrcode
```

```typescript
// Generate secret
import { authenticator } from 'otplib';
const secret = authenticator.generateSecret();

// Generate QR code
import QRCode from 'qrcode';
const otpauth = authenticator.keyuri(user.email, 'AeThex', secret);
const qrcode = await QRCode.toDataURL(otpauth);

// Verify code
const isValid = authenticator.verify({ token: userCode, secret });
```

#### Database Schema
```sql
-- Add to profiles table
ALTER TABLE profiles ADD COLUMN two_factor_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN two_factor_secret VARCHAR(255);
ALTER TABLE profiles ADD COLUMN backup_codes TEXT[]; -- Array of hashed codes

-- Sessions table
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  token_hash VARCHAR(255),
  device VARCHAR(255),
  browser VARCHAR(100),
  ip_address INET,
  location VARCHAR(255),
  trusted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  last_active TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- Login history
CREATE TABLE login_history (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  success BOOLEAN,
  ip_address INET,
  device VARCHAR(255),
  browser VARCHAR(100),
  location VARCHAR(255),
  failure_reason VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Implementation Checklist
- [ ] Install 2FA dependencies
- [ ] Create 2FA setup UI
- [ ] Implement TOTP generation and verification
- [ ] Add 2FA to login flow
- [ ] Generate backup codes
- [ ] Build session management UI
- [ ] Track active sessions
- [ ] Implement session revocation
- [ ] Build login history page
- [ ] Log all login attempts
- [ ] Update password requirements
- [ ] Add password strength indicator
- [ ] Implement breach check
- [ ] Add account recovery options
- [ ] Add "trusted device" feature

### Acceptance Criteria
- [ ] Users can enable 2FA
- [ ] 2FA required on login if enabled
- [ ] Users can view active sessions
- [ ] Users can revoke sessions
- [ ] Login history is tracked
- [ ] Password requirements enforced
- [ ] Account recovery works

### Estimated Effort
**3-4 weeks**

---

## Summary

P1 issues in order of priority:
1. **Notification system** (improves engagement)
2. **Project workflows** (core feature completion)
3. **Image upload** (enables rich content)
4. **Content moderation** (platform safety)
5. **Session management & 2FA** (security)

Total estimated effort: **11-16 weeks**
