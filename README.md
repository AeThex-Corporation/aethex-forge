# AeThex Forge – Local Development Setup

## Quick Start Guide

This guide will help you set up and run the AeThex Developer Platform locally.

## Prerequisites

1. **Node.js** (v18 or higher)
   - [Download Node.js](https://nodejs.org/)
   - Includes npm (Node Package Manager)

2. **Git** (recommended for updates)
   - [Download Git](https://git-scm.com/)

## Installation Steps

### 1. Install Node.js

- Download and install the LTS version from [nodejs.org](https://nodejs.org/)
- Follow the setup wizard
- Restart your terminal after installation

### 2. Verify Installation

Open your terminal and run:

```bash
node --version
npm --version
```

You should see version numbers (e.g., v20.x.x and 10.x.x)

### 3. Install Project Dependencies

Navigate to the project folder and install dependencies:

```bash
cd /path/to/aethex-forge
npm install
```

This may take a few minutes as it downloads all required packages.

### 4. Set Up Environment Variables

Create a `.env` file in the root directory (`aethex-forge/`) with the following variables:

**Minimum Required (to run the app):**

```env
# Supabase Configuration (Required)
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE=your_service_role_key_here
SUPABASE_URL=your_supabase_url_here

# API Base URL
VITE_API_BASE=http://localhost:5000
```

**Optional (for full functionality):**

```env
# Discord Integration
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_BOT_TOKEN=your_discord_bot_token
DISCORD_PUBLIC_KEY=your_discord_public_key
DISCORD_REDIRECT_URI=http://localhost:5000/api/discord/oauth/callback

# Foundation OAuth
VITE_FOUNDATION_URL=https://aethex.foundation
FOUNDATION_OAUTH_CLIENT_ID=your_foundation_client_id
FOUNDATION_OAUTH_CLIENT_SECRET=your_foundation_client_secret

# Email Service (SMTP)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password

# Other Services
VITE_GHOST_API_URL=your_ghost_api_url
GHOST_ADMIN_API_KEY=your_ghost_admin_key
```

**Note:** You can start with just the Supabase variables to get the app running. Add other credentials as needed for full functionality.

### 5. Run the Development Server

```bash
npm run dev
```

The application will start on **[http://localhost:5000](http://localhost:5000)** (or the port set in your config).

Open your browser and navigate to that URL to view the application.

## Available Commands

- `npm run dev` – Start development server (default: port 5000)
- `npm run build` – Build for production
- `npm start` – Start production server
- `npm run typecheck` – Check TypeScript types
- `npm test` – Run tests

aethex-forge/
aethex-forge/
## Project Structure

```text
aethex-forge/
├── client/       # React SPA frontend (pages, components, UI)
├── server/       # Express backend API
├── api/          # API route handlers (modular)
├── shared/       # Shared types/interfaces (client/server)
├── supabase/     # Database migrations & SQL
├── docs/         # Project documentation
└── ...           # Other supporting folders
```

## Getting Supabase Credentials

If you don't have Supabase credentials yet:

1. Go to [supabase.com](https://supabase.com/)
2. Create a free account and project
3. In your project, go to **Settings → API**
4. Copy:
   - Project URL → `VITE_SUPABASE_URL` and `SUPABASE_URL`
   - `anon` public key → `VITE_SUPABASE_ANON_KEY`
   - `service_role` secret key → `SUPABASE_SERVICE_ROLE`

## Troubleshooting

### Port Already in Use

If port 5000 is already in use, you can change it in `vite.config.ts`:

```typescript
server: {
   port: 5001, // Change to any available port
}
```

### Module Not Found Errors

Try deleting `node_modules` and `package-lock.json`, then run `npm install` again:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Environment Variables Not Loading

- Ensure `.env` is in the root `aethex-forge` directory
- Restart the dev server after adding new environment variables
- Variables starting with `VITE_` are exposed to the client

## Need Help?

- See the `docs/` folder for detailed documentation
- Review `AGENTS.md` for architecture and tech stack
- See `replit.md` for cloud deployment info
- For advanced troubleshooting, check `DEPLOYMENT_CHECKLIST.md` and `PHASE1_IMPLEMENTATION_SUMMARY.md`

