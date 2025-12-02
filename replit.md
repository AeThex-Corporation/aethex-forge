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
├── client/           # React frontend code
│   ├── components/   # React components
│   ├── pages/        # Page components
│   ├── lib/          # Utility libraries
│   ├── hooks/        # Custom React hooks
│   └── contexts/     # React contexts
├── server/           # Express backend
│   └── index.ts      # Main server file with API routes
├── api/              # API route handlers
├── discord-bot/      # Discord bot integration
├── docs/             # Documentation files
└── shared/           # Shared code between client/server

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

## Recent Changes (December 2, 2025)
- ✅ Configured Vite to run on port 5000 for Replit compatibility
- ✅ Set up proper host configuration (0.0.0.0) for Replit proxy
- ✅ Updated .gitignore to properly exclude environment files
- ✅ Installed all npm dependencies
- ✅ Configured deployment settings for Replit autoscale
- ✅ Verified application runs without errors in Replit environment

## Notes
- Supabase credentials must be configured in Replit Secrets for the app to fully function
- The application integrates an Express backend directly into the Vite dev server for seamless API development
- Discord bot functionality requires additional Discord API credentials
