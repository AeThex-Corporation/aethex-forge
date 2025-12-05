# AeThex - Advanced Development Platform

## Project Overview
AeThex is a full-stack web application built with React, Vite, Express, and Supabase. It's an advanced development platform and community for builders featuring project collaboration, mentorship programs, research labs, and more.

## Tech Stack
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **Backend**: Express.js (integrated with Vite dev server)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: TanStack Query
- **Routing**: React Router DOM

## Project Structure
```
├── client/               # React frontend code (web)
│   ├── components/       # React components
│   ├── pages/            # Page components
│   ├── lib/              # Utility libraries
│   ├── hooks/            # Custom React hooks
│   ├── contexts/         # React contexts
│   ├── desktop/          # Desktop-specific React code
│   │   ├── components/   # TitleBar, DesktopShell, Overlay
│   │   ├── desktop-main.tsx    # Desktop app entry point
│   │   └── desktop-overlay.tsx # Overlay window entry point
│   ├── main.tsx          # Web app entry point
│   ├── desktop-main.html # Desktop HTML entry
│   └── desktop-overlay.html # Overlay HTML entry
├── electron/             # Electron main process
│   ├── main.js           # Electron entry point
│   ├── preload.js        # Secure IPC bridge
│   ├── windows.js        # Window management
│   ├── ipc.js            # IPC handlers
│   └── sentinel.js       # Clipboard PII monitoring
├── server/               # Express backend
│   └── index.ts          # Main server file with API routes
├── services/             # Backend services
│   ├── watcher.js        # File watcher for dev workflow
│   └── pii-scrub.js      # PII scrubbing utility
├── api/                  # API route handlers
├── discord-bot/          # Discord bot integration
├── docs/                 # Documentation files
└── shared/               # Shared code between client/server

```

## Environment Setup

### Required Environment Variables
The following Supabase environment variables need to be configured:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

Optional variables for full functionality:
- `VITE_SUPABASE_SERVICE_ROLE_KEY` - Service role key for admin operations
- Discord-related variables (see `.env.discord.example`)
- Foundation OAuth variables (see `.env.foundation-oauth.example`)

### Development
```bash
npm install          # Install dependencies
npm run dev         # Start development server on port 5000
```

### Production Build
```bash
npm run build       # Build all components (API, client, server)
npm start           # Start production server
```

## Replit Configuration

### Development
- The development server runs on **port 5000** (required for Replit's webview)
- Host is set to `0.0.0.0` to allow Replit proxy access
- `allowedHosts: true` configured to allow Replit's dynamic proxy hostnames
- Vite HMR is configured for proper hot reload in Replit environment

### Deployment
- Deployment type: **Autoscale**
- Build command: `npm run build`
- Run command: `npm start`
- The production build serves the client from `dist/spa` and runs the Express server from `dist/server`

## Key Features
- **Multi-Realm System**: Labs, GameForge, Corp, Foundation, Dev-Link
- **Community Features**: Feed, posts, comments, likes
- **Creator Network**: Profile passports, achievements, mentorship
- **Nexus Marketplace**: Opportunities, contracts, commissions
- **Discord Integration**: Bot commands, OAuth, role management
- **Ethos Guild**: Music licensing and artist services
- **GameForge**: Sprint management, team collaboration
- **Foundation**: Courses, mentorship programs, achievements

## Discord Bot Integration

### Bot Details
- **Bot Name**: AeThex#9389
- **Workflow**: "Discord Bot" runs alongside main application
- **Health Check**: Port 8044

### Slash Commands
| Command | Description |
|---------|-------------|
| `/verify` | Link Discord account to AeThex |
| `/profile` | View AeThex profile |
| `/set-realm` | Set preferred realm |
| `/unlink` | Unlink Discord from AeThex |
| `/verify-role` | Verify Discord roles |

### Database Tables
- `discord_verifications` - Temporary verification codes (15 min expiry)
- `discord_links` - Permanent Discord-to-AeThex account links

### Required Secrets
- `DISCORD_BOT_TOKEN` - Bot token from Discord Developer Portal
- `DISCORD_CLIENT_ID` - Application client ID
- `SUPABASE_SERVICE_ROLE` - Service role key for database operations

## Domain Architecture

### Identity Authority
- **aethex.foundation** - Single Source of Truth (SSOT) for all identity/passport data
- All platforms are OAuth clients consuming Foundation-issued identities

### Domain Routing
| Domain | Purpose |
|--------|---------|
| `aethex.dev` | Main application platform |
| `aethex.foundation` | Identity authority, passport API |
| `*.aethex.me` | Creator Passports (wildcard subdomains) |
| `*.aethex.space` | Project Passports (wildcard subdomains) |
| `aethex.app`, `.locker`, `.site` | Redirect to aethex.dev |
| `aethex.studio` | Redirect to aethex.dev/ethos |
| `aethex.info` | Redirect to aethex.dev/foundation |

### Passport API Flow
```
user.aethex.me → fetches from https://aethex.foundation/api/passport/subdomain/{user}
project.aethex.space → fetches from https://aethex.foundation/api/passport/project/{slug}
```

## Discord OAuth Configuration

### Discord Developer Portal (OAuth2 > Redirects)
```
https://aethex.dev/api/discord/oauth/callback
https://aethex.foundation/api/discord/oauth/callback
https://supabase.aethex.tech/auth/v1/callback
```

### Supabase Dashboard (Authentication > URL Configuration)
- **Site URL**: `https://aethex.foundation`
- **Redirect URLs**:
  - `https://aethex.dev/**`
  - `https://aethex.foundation/**`
  - `https://supabase.aethex.tech/auth/v1/callback`

## Recent Changes (December 5, 2025)
- ✅ **Electron Desktop App Support**: Added desktop application framework
  - `electron/main.js` - Main Electron process with window management
  - `electron/preload.js` - Secure IPC bridge for frontend communication
  - `electron-builder.yml` - Build configuration for packaging
  - `client/components/DesktopShell.tsx` - Desktop wrapper with title bar
  - `client/components/TitleBar.tsx` - Custom title bar with pin/minimize/maximize/close
  - `client/pages/Overlay.tsx` - File watcher overlay for development tools
- ✅ **3D Scene Landing Page**: New immersive realm selector
  - `client/components/Scene.tsx` - Three.js/React Three Fiber 3D scene
  - Animated gateway meshes for each realm (Nexus, GameForge, Foundation, Labs, Corp)
  - Camera rig with smooth transitions on realm selection
  - WebGL fallback UI when 3D rendering isn't available
- ✅ **Utility Services**: New backend services
  - `services/pii-scrub.js` - PII scrubbing utility for privacy
  - `services/watcher.js` - File watcher for development workflow
- ✅ **TypeScript Fixes**: Fixed THREE namespace import and WebkitAppRegion typing

## Recent Changes (December 4, 2025)
- ✅ **RealmSwitcher Alignment Fix**: Fixed realm IDs to match ARMS taxonomy
  - Old IDs (`game_developer`, `client`, `community_member`, `customer`) replaced with ARMS IDs (`labs`, `gameforge`, `corp`, `foundation`, `devlink`, `nexus`, `staff`)
  - Realm selection now persists correctly and pre-selects on page load
  - Routes aligned with actual dashboard routes (`/dashboard/labs`, `/gameforge`, `/hub/client`, etc.)
- ✅ **Profile Update Security**: Added JWT authentication to `/api/profile/update` endpoint
  - Bearer token authentication required for all profile updates
  - User can only update their own profile (user_id validation against auth session)
  - Dashboard now sends auth token with all profile API requests
- ✅ **Bot Panel** (`/bot-panel`): Comprehensive Discord bot management dashboard
  - Overview tab: Bot info, feed bridge stats, uptime
  - Servers tab: All connected Discord servers with member counts
  - Commands tab: All slash commands with "Register Commands" button
  - Linked Users tab: Discord-linked AeThex users (sanitized PII)
  - Feed tab: Recent feed activity from Discord and website
  - Protected with admin token authentication
- ✅ **New Discord Slash Commands**: Added 4 new commands
  - `/help` - Shows all bot commands with descriptions
  - `/stats` - View your AeThex statistics (posts, likes, comments)
  - `/leaderboard` - Top contributors with category filter (posts, likes, creators)
  - `/post` - Create a post directly from Discord with category and image support
- ✅ **Bot API Security**: Added authentication and CORS to management endpoints
  - All management endpoints require admin token
  - PII sanitized in linked users endpoint
  - CORS headers added for browser access
  - Server-side proxy endpoints (`/api/discord/bot-*`) to keep admin token secure
  - Client uses proxied endpoints - no tokens exposed in frontend bundle

## Recent Changes (December 3, 2025)
- ✅ **Discord Feed Bridge Bug Fix**: Fixed critical 14x duplicate post issue with three-layer protection
  - Added polling lock to prevent overlapping poll cycles
  - Immediate timestamp updates before sending to Discord
  - Processed ID tracking to skip already-sent posts
- ✅ **Creator Directory "Become a Creator" Flow**: Registration modal for new creators
  - Form validation for username, bio, and primary arm affiliation
  - Pre-fills data from user profile where available
  - Integrates with `aethex_creators` table in Supabase
- ✅ **Dashboard Realm & Settings**: Functional realm switching with persistence
  - RealmSwitcher component wired with proper state management
  - Saves realm preference to Supabase database
  - Profile update functionality in Settings tab
- ✅ **Toast Notification Fixes**: Migrated all calls to use `description` property
- ✅ **Bidirectional Discord-Feed Bridge**: Full two-way sync between Discord and AeThex feed
  - **Discord → AeThex**: Messages from Discord FEED channel sync to community feed
  - **AeThex → Discord**: Bot polls Supabase every 5 seconds for new posts (works from production!)
  - Bot listens to configured channel (DISCORD_MAIN_CHAT_CHANNELS env var)
  - Posts display with purple Discord badge and channel name
  - Supports images/videos from both platforms
  - Loop prevention: Discord-sourced posts don't re-post back to Discord
  - **Architecture**: Bot polls `community_posts` table directly - no HTTP dependency on server
- ✅ **Moved /feed to /community/feed**: Feed is now a tab within the Community page
  - Old /feed URL redirects to /community/feed
  - Added redirect in vercel.json for production
- ✅ Fixed passport subdomain API to call aethex.foundation (identity authority)
- ✅ Fixed API paths: `subdomain-data` → `subdomain`, `project-data` → `project`
- ✅ Restored wildcard rewrites in vercel.json for `*.aethex.me` and `*.aethex.space`
- ✅ Added missing routes to vercel.json: /community/*, /developers/*, /discord-verify/*, /ethos/*
- ✅ Added catch-all route for future paths
- ✅ Fixed Discord verification code input to accept alphanumeric codes (was filtering out letters)
- ✅ Added step-by-step error tracking to verify-code API for debugging
- ✅ Configured Discord OAuth redirect URLs for multi-domain setup
- ✅ Discord bot running on Replit (moved from Railway)

## Recent Changes (December 2, 2025)
- ✅ Configured Vite to run on port 5000 for Replit compatibility
- ✅ Set up proper host configuration (0.0.0.0) for Replit proxy
- ✅ Added `allowedHosts: true` to allow Replit's dynamic proxy hostnames
- ✅ Updated .gitignore to properly exclude environment files
- ✅ Installed all npm dependencies
- ✅ Configured deployment settings for Replit autoscale
- ✅ Fixed server build to output `dist/server/production.mjs` for deployment
- ✅ Verified application runs without errors in Replit environment
- ✅ Discord bot (AeThex#9389) running and connected to 7 servers
- ✅ Created discord_verifications and discord_links database tables
- ✅ Registered all 5 slash commands with Discord API
- ✅ Extended auth loading timeout to 30s for slow networks
- ✅ Fixed /community route with wildcard for nested tabs
- ✅ Fixed /developers route showing real user data

## Notes
- Supabase credentials must be configured in Replit Secrets for the app to fully function
- The application integrates an Express backend directly into the Vite dev server for seamless API development
- Discord bot runs as a separate workflow on port 8044 (health check only)
- Main application runs on port 5000
