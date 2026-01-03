# P2 Priority Issues (Low Priority / Nice to Have)

These are enhancement requests and quality-of-life improvements that can be addressed after P0 and P1 items.

---

## Issue 1: [P2] Add dark/light mode toggle

**Labels:** `enhancement`, `P2`, `UI/UX`

### Problem
Theme is currently locked to dark mode. Some users prefer light mode or system preference.

### Proposed Solution
- Theme toggle in header or settings
- Persist preference in localStorage
- Respect system preference by default
- Smooth theme transitions

### Implementation
```typescript
// Use next-themes or custom context
import { ThemeProvider } from 'next-themes';

// In App.tsx
<ThemeProvider attribute="class" defaultTheme="system">
  <App />
</ThemeProvider>
```

### Estimated Effort
**3-5 days**

---

## Issue 2: [P2] Internationalization (i18n) support

**Labels:** `enhancement`, `P2`, `i18n`

### Problem
App is English-only. Limits international user base.

### Proposed Solution
- Use react-i18next
- Support languages: English, Spanish, French, Japanese
- Locale switcher in settings
- Detect browser language

### Estimated Effort
**2-3 weeks** (including translations)

---

## Issue 3: [P2] Add keyboard shortcuts for power users

**Labels:** `enhancement`, `P2`, `accessibility`

### Proposed Shortcuts
- `/` - Focus search
- `n` - New post
- `?` - Show shortcuts modal
- `g h` - Go to home
- `g p` - Go to profile
- `Esc` - Close modals

### Implementation
```bash
npm install react-hotkeys-hook
```

### Estimated Effort
**1 week**

---

## Issue 4: [P2] Progressive Web App (PWA) support

**Labels:** `enhancement`, `P2`, `mobile`

### Features
- Install prompt
- Offline support
- App icons
- Splash screens
- Push notifications

### Implementation
Use Vite PWA plugin:
```bash
npm install vite-plugin-pwa
```

### Estimated Effort
**1-2 weeks**

---

## Issue 5: [P2] Advanced analytics dashboard

**Labels:** `enhancement`, `P2`, `analytics`

### User Analytics
- Profile views
- Post engagement rate
- Follower growth
- Top performing posts
- Audience demographics

### Admin Analytics
- Daily/weekly/monthly active users
- User retention rates
- Feature adoption
- Revenue metrics
- Funnel analysis

### Estimated Effort
**2-3 weeks**

---

## Issue 6: [P2] Add profile customization themes

**Labels:** `enhancement`, `P2`, `personalization`

### Features
- Custom profile colors
- Background images
- Layout options
- Badge placement
- Bio formatting (markdown)

### Estimated Effort
**1-2 weeks**

---

## Issue 7: [P2] Implement direct messaging (DM)

**Labels:** `feature`, `P2`, `messaging`

### Features
- One-on-one messaging
- Message threads
- Typing indicators
- Read receipts
- File sharing in DMs
- Message search

### Estimated Effort
**3-4 weeks**

---

## Issue 8: [P2] Add content bookmarking/saving

**Labels:** `feature`, `P2`, `social`

### Features
- Save posts for later
- Organize saved posts into collections
- Private bookmarks
- Search saved content

### Estimated Effort
**1 week**

---

## Issue 9: [P2] Implement polls and reactions

**Labels:** `feature`, `P2`, `social`

### Features
- Create polls in posts
- Vote on polls
- See poll results
- Emoji reactions beyond likes
- Reaction counts

### Estimated Effort
**1-2 weeks**

---

## Issue 10: [P2] Add accessibility improvements

**Labels:** `accessibility`, `P2`, `a11y`

### Improvements
- ARIA labels on all interactive elements
- Keyboard navigation
- Screen reader support
- Focus indicators
- Color contrast compliance (WCAG AA)
- Alt text for images
- Skip to content link
- Reduced motion option

### Estimated Effort
**2-3 weeks**

---

## Issue 11: [P2] Performance optimizations

**Labels:** `performance`, `P2`, `optimization`

### Optimizations
- Route-based code splitting
- Image lazy loading
- Virtual scrolling for long lists
- Bundle size reduction
- Memoization audit
- Remove unused dependencies
- Lighthouse score improvements

### Estimated Effort
**2-3 weeks**

---

## Issue 12: [P2] Add comprehensive testing

**Labels:** `testing`, `P2`, `quality`

### Testing Strategy
- **Unit Tests:**
  - Utility functions
  - Hooks
  - Services

- **Component Tests:**
  - React Testing Library
  - User interactions
  - Edge cases

- **Integration Tests:**
  - API flows
  - Authentication
  - Critical user journeys

- **E2E Tests:**
  - Playwright or Cypress
  - Happy paths
  - Error scenarios

### Target Coverage
- 80% code coverage
- All critical paths tested
- CI/CD integration

### Estimated Effort
**4-6 weeks**

---

## Issue 13: [P2] Mobile app (React Native)

**Labels:** `feature`, `P2`, `mobile`

### Features
- Native iOS and Android apps
- Shared codebase with web (Expo)
- Push notifications
- Biometric authentication
- Camera integration
- App store deployment

### Estimated Effort
**8-12 weeks**

---

## Issue 14: [P2] Add export/import user data (GDPR)

**Labels:** `compliance`, `P2`, `privacy`

### Features
- Export all user data (JSON/CSV)
- Import data from other platforms
- Delete all user data
- Data portability compliance
- Privacy policy integration

### Estimated Effort
**1-2 weeks**

---

## Issue 15: [P2] Implement referral program

**Labels:** `growth`, `P2`, `monetization`

### Features
- Unique referral links
- Track referrals
- Reward system (credits, XP, badges)
- Leaderboard
- Share on social media

### Estimated Effort
**1-2 weeks**

---

## Summary

P2 issues are nice-to-have enhancements that improve the user experience but aren't critical for core functionality. They can be addressed based on user feedback and business priorities.

**Quick wins** (1-2 weeks):
- Dark mode toggle
- Keyboard shortcuts
- PWA support
- Bookmarking
- Referral program

**Longer term** (3+ weeks):
- i18n support
- Analytics dashboard
- DM system
- Mobile app
- Comprehensive testing

Total estimated effort for all P2: **40-60 weeks** (could be distributed across multiple developers)
