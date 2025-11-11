# AeThex Complete Notification System

## Overview

A comprehensive notification system covering 15+ user interactions across social, collaboration, opportunities, and security features.

## All Notification Flows

### 1. Achievements (✅ Success)

**When:** User earns an achievement  
**Who Notified:** Achievement earner  
**Format:** `🏆 Achievement Unlocked: {name}` - "{xp} XP awarded"  
**Service:** `aethexAchievementService.awardAchievement()`

### 2. Team Creation (✅ Success)

**When:** Team is created  
**Who Notified:** Team creator  
**Format:** `🎯 Team Created: {name}` - "Your team is ready to go!"  
**Service:** `aethexCollabService.createTeam()`

### 3. Added to Team (ℹ️ Info)

**When:** User is added to a team  
**Who Notified:** New team member  
**Format:** `👥 Added to Team: {name}` - "You've been added as a {role}"  
**Service:** `aethexCollabService.addTeamMember()`

### 4. Project Creation (✅ Success)

**When:** Project is created  
**Who Notified:** Project creator  
**Format:** `🚀 Project Created: {name}` - "Your project is ready to go!"  
**Service:** `aethexProjectService.createProject()`

### 5. Added to Project (ℹ️ Info)

**When:** User is added to a project  
**Who Notified:** New project member  
**Format:** `📌 Added to Project: {name}` - "You've been added as a {role}"  
**Service:** `aethexCollabService.addProjectMember()`

### 6. Project Completed (✅ Success)

**When:** Project status changes to completed  
**Who Notified:** Project owner  
**Format:** `✅ Project Completed: {name}` - "Congratulations!"  
**Service:** `aethexProjectService.updateProject(status: "completed")`

### 7. Project Started (ℹ️ Info)

**When:** Project status changes to in_progress  
**Who Notified:** Project owner  
**Format:** `⏱️ Project Started: {name}` - "You've started working on this"  
**Service:** `aethexProjectService.updateProject(status: "in_progress")`

### 8. Level Up (✅ Success)

**When:** User gains enough XP to level up  
**Who Notified:** User  
**Format:** `⬆️ Level Up!` - "You've reached level {n}!"  
**Service:** `aethexAchievementService.updateUserXPAndLevel()`

### 9. Onboarding Complete (✅ Success)

**When:** User finishes onboarding  
**Who Notified:** User  
**Format:** `🎉 Welcome to AeThex!` - "Profile setup complete!"  
**Service:** `Onboarding.tsx -> finishOnboarding()`

### 10. Account Linked (✅ Success)

**When:** User links OAuth provider (Discord, GitHub, etc.)  
**Who Notified:** User  
**Format:** `🔗 Account Linked: {provider}` - "Successfully linked"  
**Service:** OAuth callback endpoints

### 11. Email Verified (✅ Success)

**When:** User verifies email  
**Who Notified:** User  
**Format:** `✉️ Email Verified` - "Your email has been verified"  
**Service:** Auth flow (future implementation)

### 12. Post Liked (ℹ️ Info)

**When:** Someone likes a community post  
**Who Notified:** Post author  
**Format:** `❤️ Your post was liked` - "{liker} liked your post"  
**Endpoint:** `POST /api/community/posts/:id/like`  
**Service:** `notificationTriggers.postLiked()`

### 13. Post Commented (ℹ️ Info)

**When:** Someone comments on a community post  
**Who Notified:** Post author  
**Format:** `💬 New comment on your post` - "{commenter} commented: {preview}"  
**Endpoint:** `POST /api/community/posts/:id/comments`  
**Service:** `notificationTriggers.postCommented()`

### 14. Endorsement Received (✅ Success)

**When:** User endorses another user's skill  
**Who Notified:** Endorsed user  
**Format:** `🎖️ New endorsement` - "{endorser} endorsed you for {skill}"  
**Endpoint:** `POST /api/social/endorse`

### 15. New Follower (ℹ️ Info)

**When:** Someone follows a user  
**Who Notified:** Followed user  
**Format:** `👥 New follower` - "{follower} started following you"  
**Endpoint:** `POST /api/social/follow`

### 16. Task Assigned (ℹ️ Info)

**When:** Task is assigned to user  
**Who Notified:** Assignee  
**Format:** `📋 Task assigned to you` - "{assigner} assigned: {title}"  
**Endpoints:**

- `POST /api/tasks` (on create with assignee)
- `PUT /api/tasks/:id/assign`  
  **Service:** `notificationTriggers.taskAssigned()`

### 17. Application Received (ℹ️ Info)

**When:** Creator applies for an opportunity  
**Who Notified:** Opportunity poster  
**Format:** `📋 New Application: {title}` - "{creator} applied"  
**Endpoint:** `POST /api/applications`  
**Service:** `notificationTriggers.applicationReceived()`

### 18. Application Status Changed (✅/❌ Success/Error)

**When:** Application is accepted/rejected  
**Who Notified:** Applicant  
**Format:** `✅/❌ Application {status}` - "{message}"  
**Endpoint:** `PUT /api/applications/:id`  
**Service:** `notificationTriggers.applicationStatusChanged()`

### 19. New Device Login (⚠️ Warning)

**When:** User logs in from new device  
**Who Notified:** User  
**Format:** `🔐 New device login detected` - "New login from {device}. If this wasn't you, secure your account."  
**Endpoint:** `POST /api/auth/login-device`  
**Service:** `notificationTriggers.newDeviceLogin()`

### 20. Moderation Report (⚠️ Warning)

**When:** User submits moderation report  
**Who Notified:** All staff/moderators  
**Format:** `🚨 New moderation report` - "A {type} report has been submitted"  
**Endpoint:** `POST /api/moderation/reports`  
**Service:** `notificationTriggers.moderationReportSubmitted()`

## Notification Types

| Type      | Color     | Icon | Use Cases                                   |
| --------- | --------- | ---- | ------------------------------------------- |
| `success` | 🟢 Green  | ✅   | Achievements, completion, account actions   |
| `info`    | 🔵 Blue   | ℹ️   | Team/project updates, social interactions   |
| `warning` | 🟡 Yellow | ⚠️   | Security alerts, moderation reports         |
| `error`   | 🔴 Red    | ❌   | Rejections, failed actions, security issues |

## Integration Points

### Client Services

- `code/client/lib/aethex-database-adapter.ts` - Project, achievement, profile notifications
- `code/client/lib/aethex-collab-service.ts` - Team/project member notifications
- `code/client/lib/notification-triggers.ts` - Centralized trigger utilities
- `code/client/pages/Onboarding.tsx` - Onboarding completion notification

### Server Endpoints

- `code/server/index.ts` - Social, community, task, application, moderation, auth endpoints
- `code/api/discord/oauth/callback.ts` - Account linking notifications
- `code/api/_notifications.ts` - Backend notification helper utilities

### Database

- `notifications` table - Stores all notifications
- `user_follows` - Follow notifications
- `community_post_likes` - Like notifications
- `community_comments` - Comment notifications
- `endorsements` - Endorsement notifications
- `mentorship_requests` - Mentorship notifications
- `aethex_applications` - Application notifications
- `project_tasks` - Task notifications
- `moderation_reports` - Moderation notifications
- `game_sessions` - Device login tracking

## Real-Time Features

- **Real-time Updates**: Supabase subscriptions push notifications to NotificationBell instantly
- **Cross-Tab Sync**: Notifications sync across browser tabs and devices
- **WebSocket Based**: Low-latency delivery without polling
- **Unread Tracking**: Badge shows count of unread notifications

## How Notifications Are Created

### Pattern 1: Direct Insert (Server Endpoints)

```javascript
await adminSupabase.from("notifications").insert({
  user_id: targetUserId,
  type: "info",
  title: "Notification Title",
  message: "Notification message",
});
```

### Pattern 2: Service Method (Client Services)

```javascript
await aethexNotificationService.createNotification(
  userId,
  "success",
  "Title",
  "Message",
);
```

### Pattern 3: Trigger Utilities (Client)

```javascript
await notificationTriggers.postLiked(userId, likerName);
```

## Performance Considerations

1. **Non-Blocking**: Notifications don't block main operations
2. **Batch Inserts**: Multiple staff notifications inserted in batch
3. **Lazy Loading**: Only latest 20 notifications fetched initially
4. **Real-Time Subscription**: Efficient WebSocket streaming
5. **Error Handling**: Notification failures don't crash main operation

## Notification Display

**NotificationBell Component** (`code/client/components/notifications/NotificationBell.tsx`)

- Bell icon with unread count badge
- Dropdown showing latest notifications
- Type-specific icons (emoji-based)
- Mark individual or all as read
- Real-time update via Supabase subscription

**Dashboard Tab** (`code/client/pages/Dashboard.tsx`)

- Full notification history
- Type filtering options
- Batch actions (mark as read)

## Testing Notifications

### Manual Testing Checklist

- [ ] Create team/project → notification
- [ ] Get added to team/project → notification
- [ ] Like community post → post author notified
- [ ] Comment on post → post author notified
- [ ] Submit job application → opportunity poster notified
- [ ] Application status changed → applicant notified
- [ ] Assign task → assignee notified
- [ ] New device login → user warned
- [ ] Submit moderation report → staff notified
- [ ] Earn achievement → user notified
- [ ] Level up → user notified
- [ ] Link Discord → user notified

### Database Verification

```sql
-- Check notifications for user
SELECT * FROM notifications
WHERE user_id = '...'
ORDER BY created_at DESC
LIMIT 20;

-- Check notification types
SELECT type, COUNT(*) FROM notifications GROUP BY type;

-- Check unread count
SELECT COUNT(*) FROM notifications
WHERE user_id = '...' AND read = false;
```

## Future Enhancements

- [ ] Daily/weekly digest emails
- [ ] In-app notification center with search
- [ ] Notification preferences/categories
- [ ] Scheduled reminders (task due dates)
- [ ] Batch notifications (15+ activity summary)
- [ ] Push notifications (mobile)
- [ ] Notification templates (customizable text)
- [ ] Notification history export
- [ ] Engagement analytics on notification clicks

## Monitoring

Check in Supabase dashboard:

1. `notifications` table → see all notifications
2. Real-time → verify subscriptions active
3. Database stats → monitor table growth
4. Query performance → check index usage

## Support & Troubleshooting

**Notifications not showing?**

1. Check NotificationBell is rendered in Layout.tsx
2. Verify Supabase subscription in browser console
3. Check notifications table for entries
4. Clear browser cache and reload

**Real-time not working?**

1. Check Supabase realtime enabled
2. Verify WebSocket connection in browser DevTools
3. Check RLS policies allow reading notifications
4. Restart browser and clear session

**Spam notifications?**

1. Check for duplicate inserts
2. Verify notification triggers have `try-catch`
3. Add deduplication logic (check for recent identical notifications)

## Files Summary

| File                                                        | Purpose                             | Lines |
| ----------------------------------------------------------- | ----------------------------------- | ----- |
| `code/server/index.ts`                                      | Server endpoints with notifications | 4800+ |
| `code/client/lib/notification-triggers.ts`                  | Trigger utilities                   | 250+  |
| `code/client/lib/aethex-database-adapter.ts`                | Service notifications               | 2000+ |
| `code/client/components/notifications/NotificationBell.tsx` | UI display                          | 300+  |
| `code/api/_notifications.ts`                                | Backend helpers                     | 40+   |

**Total Notification Triggers: 20+**  
**Notification Types: 4** (success, info, warning, error)  
**Real-time Subscribers: Unlimited**
