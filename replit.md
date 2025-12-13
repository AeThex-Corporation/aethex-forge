# AeThex - Advanced Development Platform

## Overview
AeThex is a full-stack web application designed as an advanced development platform and community for builders. It integrates features for project collaboration, mentorship programs, research labs, and a creator network. The platform aims to be a single source of truth for identity and project passports, fostering a vibrant ecosystem for creators and developers.

## User Preferences
I prefer detailed explanations.
I want iterative development.
Ask before making major changes.
Do not make changes to the folder `electron/`.
Do not make changes to the folder `services/`.
Do not make changes to the folder `api/`.
Do not make changes to the file `server/index.ts`.

## System Architecture
AeThex is built as a full-stack web application utilizing React 18 with TypeScript for the frontend, Vite 6 as the build tool, and Express.js for the backend. Supabase (PostgreSQL) serves as the primary database. Styling is handled with Tailwind CSS, and UI components leverage Radix UI. TanStack Query is used for state management, and React Router DOM for routing.

The application features a multi-realm system including Nexus, GameForge, Foundation, Labs, Corp, and Staff (6 realms), each with specific functionalities. Dev-Link has been merged into Nexus as an ecosystem filter. Key capabilities include community features (feed, posts, comments), a Creator Network with profile passports and achievements, and a Nexus Marketplace for opportunities and contracts.

### Discord Integration Architecture
Discord functionality is split between two deployments:
- **Main Bot (aethex-bot-master.replit.app)**: Handles slash commands, feed sync, role management, and bot presence
- **Activity (aethex.dev)**: Hosts the Discord Activity UI, Activity OAuth, and embedded app experience

Activity-specific endpoints in this project:
- `/api/discord/activity-auth` - Activity authentication
- `/api/discord/token` - OAuth token exchange
- `/api/discord/oauth/*` - OAuth flow handlers
- `/discord-manifest.json` - Activity manifest

The UI/UX emphasizes an isometric 2.5D realm selector, replacing 3D scenes with CSS-based isometric cards for performance. It features responsive grids, ambient particles, and interactive tilt effects. The platform also supports an Electron desktop application with a secure IPC bridge and an automated build/release pipeline for multi-platform distribution.

Domain architecture is centralized around `aethex.foundation` as the Identity Authority (SSOT) for all identity and passport data, with all other platforms acting as OAuth clients. Creator and Project Passports are accessed via wildcard subdomains (`*.aethex.me`, `*.aethex.space`).

## Axiom Model Routing (Legal Entity Separation)
The monolith (`aethex.dev`) implements split routing to enforce legal separation between For-Profit and Non-Profit arms:

| Route | Destination | Legal Entity | Action | Purpose |
|-------|-------------|--------------|--------|---------|
| `/foundation/*` | `https://aethex.foundation` | Non-Profit (Guardian) | **Redirect** | Public showcase |
| `/gameforge` | `https://aethex.foundation/gameforge` | Non-Profit (Program) | **Redirect** | Public showcase (GET/Read-Only) |
| `/gameforge/*` (public) | `https://aethex.foundation/gameforge` | Non-Profit (Program) | **Redirect** | Browse/apply |
| `/dashboard/gameforge` | stays on `aethex.dev` | For-Profit (Management) | **Local** | Management Hub (POST/PUT/DELETE) |
| `/gameforge/manage/*` | stays on `aethex.dev` | For-Profit (Management) | **Local** | Management routes |
| `/labs/*` | `https://aethex.studio` | For-Profit (Skunkworks) | **Redirect** | R&D |
| `/dashboard/labs` | `https://aethex.studio/dashboard` | For-Profit (Skunkworks) | **Redirect** | Labs dashboard |
| `/nexus/*` | stays on `aethex.dev` | For-Profit (Monetization) | **Local** | Marketplace |
| `/corp/*` | stays on `aethex.dev` | For-Profit (Services) | **Local** | Services |

### GameForge Routing Mandate
Per the Axiom Model, GameForge routes are split by ownership/function:
- **aethex.foundation/gameforge** = The Mission (Public Showcase) - GET only, read-only
- **aethex.dev/gameforge** = The Money (Management Hub) - POST, PUT, DELETE operations

This ensures the Foundation's user-facing URLs display `aethex.foundation` in the browser for public content, while management operations remain on the for-profit platform.

## NEXUS Core Architecture (Universal Data Layer)
The NEXUS Core serves as the Single Source of Truth for all talent/contract metadata, supporting AZ Tax Commission reporting and legal entity separation.

### Layer Architecture
| Layer | Function | Legal Significance |
|-------|----------|-------------------|
| **NEXUS Core** (Universal Data Layer) | Single Source of Truth for all talent/contract metadata | Submits verifiable Time Logs to AZ Tax Commission |
| **aethex.dev** (FULL Access UI) | Manages Client Billing, Escrow, and Payroll | The Financial Nexus that claims the Tax Credit and pays the Corp employees |
| **aethex.foundation** (READ-ONLY UI) | Displays "Gig Radar" for student placement | The Legal Firewall—prevents the Non-Profit from seeing Corp client financials |
| **.studio** (API Calls Only) | Secure, direct reporting of employee/contractor hours | Proof of AZ Activity required for the AIC Grant and Tax Credit eligibility |

### Database Schema (NEXUS Core Tables)
- `nexus_talent_profiles` - Legal/tax info, encrypted PII, compliance status, AZ eligibility
- `nexus_time_logs` - Hour tracking with location, AZ-eligible hours calculation
- `nexus_time_log_audits` - Review decisions, AZ Tax Commission submission tracking
- `nexus_compliance_events` - Cross-entity audit trail for legal separation
- `nexus_escrow_ledger` - Escrow account tracking per contract
- `nexus_payouts` - Payout records with tax form tracking
- `foundation_gig_radar` - Read-only view for Foundation (no financial data exposed)

### API Endpoints
| Endpoint | Layer | Purpose |
|----------|-------|---------|
| `/api/nexus-core/talent-profiles` | NEXUS Core | Talent legal/tax profile management |
| `/api/nexus-core/time-logs` | NEXUS Core | Time log CRUD operations |
| `/api/nexus-core/time-logs-submit` | NEXUS Core | Batch submit time logs for review |
| `/api/nexus-core/time-logs-approve` | NEXUS Core | Client/admin approval workflow |
| `/api/foundation/gig-radar` | Foundation | Read-only opportunity listings |
| `/api/studio/time-logs` | Studio | Service-to-service hour reporting |
| `/api/studio/contracts` | Studio | Contract status lookup |
| `/api/corp/escrow` | Corp | Escrow funding and management |
| `/api/corp/payroll` | Corp | Payroll processing (admin only) |

### TypeScript Types
See `client/lib/nexus-core-types.ts` for all NEXUS Core type definitions.

## Recent Changes (December 2025)
- **XP & Leveling System**: Complete XP earning logic with 12 event types (daily_login, profile_complete, create_post, earn_badge, etc.). 1000 XP per level, automatic level-up notifications. Integrated with daily login streak (25 XP + 10 per streak day), profile completion (100 XP), badge earning (200 XP), and post creation (20 XP). Services: `aethexXPService` in database adapter, `useXP` React hook.
- **Unified Role/Tier System**: Combines paid subscriptions (Stripe) with earned badges for AI persona access. Tiers: Free/Pro ($9/mo)/Council ($29/mo). Badges unlock specific AI personas.
- **Stripe Integration**: Checkout endpoints for subscriptions, webhook handler for subscription events, manage endpoint for cancel/resume/portal.
- **Profile Membership Display**: User profile shows tier, upgrade button, and earned badges grid.
- **Admin Tier/Badge Manager**: Admin panel tab for managing user tiers and awarding/revoking badges.
- **Discord Activity UI Improvements**: Comprehensive tabbed dashboard with Feed (live posts with quick-like), Realms (visual selector linking to main site), Badges (progress tracking), Leaderboard (rankings with streak display), Opportunities (live jobs), and Quests (daily XP claims with localStorage). Features include: dynamic gradient header based on current realm, animated XP ring with level display (framer-motion), tab icons with smooth animations, confetti celebration on level-up, XP gain toast notifications (+25 XP), streak fire animations, and optimistic UI for post likes. Uses relative API paths for Discord CSP compliance and mock data for user stats to avoid server modifications.
- **Set Realm API**: Added `/api/user/set-realm` endpoint for updating user's primary_arm (requires Supabase auth token)
- **Maintenance Mode**: Site-wide maintenance mode with admin bypass. Admins can toggle via Admin Dashboard overview tab. Uses MAINTENANCE_MODE env var for initial state. Allowed paths during maintenance: /login, /staff/login, /reset-password, /health
- **Health Endpoint**: Added /health endpoint at aethex.dev/health that aggregates platform and Discord bot status
- **Axiom Model Routing**: Foundation and GameForge routes redirect to `aethex.foundation` domain for legal entity separation
- **AI Intelligent Agent Integration**: Added global AI chat with 10 specialized personas (Network Agent, Forge Master, Ethics Sentinel, SBS Architect, Curriculum Weaver, QuantumLeap, Vapor, Apex, Ethos Producer, AeThex Archivist)
- **Tiered Access Control**: AI personas gated by user tier (Free/Architect/Council) based on roles
- **Realm-Aware Suggestions**: AI PersonaSelector suggests relevant personas based on current realm context
- **Secure Backend API**: Chat endpoints at /api/ai/chat and /api/ai/title using Gemini API via Replit secrets
- Enhanced landing page with hero section ("Build the Future" tagline), dual CTAs, and comprehensive footer
- Added Staff realm to isometric realm selector (6 realms total after Dev-Link merge)
- Created Downloads page with Windows/macOS/Linux platform cards and mobile "Coming Soon" section
- Updated Roadmap with Desktop App milestones (Beta in Now, Stable in Month 2) and Mobile App milestones (iOS/Android in Month 3)
- Fixed GitHub Actions workflows: icon generation pipeline, deprecated action updates, Vitest test command
- **Landing Page Styling Alignment**: Updated hero CTAs and featured realm button to use shared Button component with asChild prop for consistent styling and ripple effects. Fixed Button component to support ripple animation for both native buttons and asChild elements. Removed unused backgroundGradient variable. Custom landing page cards (featured-card, stats-strip, hero-intro) intentionally use advanced CSS effects while still leveraging design tokens (--aethex-*, --foreground, --background, --muted, etc.).
- **Get Started Page Enhancement**: Comprehensive onboarding page (`/get-started`) with: Stats/Social Proof section (animated counters: 12k+ builders, 500+ projects, 6 realms, 10 AI agents), Video Demo placeholder, 3-step guided signup flow, Platform Features section (6 cards: XP & Leveling, AI Agents, Creator Passports, Community, Badges, Security), Realms Overview (all 6 realms with descriptions and feature tags), Testimonials section (4 community quotes), and FAQ section (6 expandable questions). AnimatedCounter uses proper useRef cleanup for requestAnimationFrame.
- **Axiom Model Code Cleanup**: Removed orphaned page files in `foundation/`, `gameforge/`, and `labs/` folders (20+ files) that were dead code since all routes redirect to external domains. Cleaned up unused imports from App.tsx. Routes continue to redirect: `/foundation/*` → aethex.foundation, `/gameforge/*` → aethex.foundation/gameforge, `/labs/*` → aethex.studio.
- **Dev-Link Merged into Nexus**: Dev-Link realm eliminated as standalone. Roblox and other platform communities now accessible via ecosystem filter tabs in Nexus Opportunities Hub. Filter tabs: [All] [Roblox] [Unity] [Web] [Audio] [Design]. Routes `/dev-link/*` redirect to `/opportunities?ecosystem=roblox`. Deleted 8 Dev-Link page files and updated App.tsx routes.

## External Dependencies
- **Supabase**: Used for database (PostgreSQL), authentication, and real-time features.
- **Discord API**: Integrated for Discord bot functionality, OAuth for user verification and linking, and feed bridging.
- **Vite**: Frontend build tool.
- **Express.js**: Backend web framework.
- **React**: Frontend library.
- **Tailwind CSS**: Utility-first CSS framework.
- **Radix UI**: Unstyled UI component library.
- **TanStack Query**: Data fetching and state management.
- **React Router DOM**: Client-side routing.
- **Electron**: Framework for building desktop applications.