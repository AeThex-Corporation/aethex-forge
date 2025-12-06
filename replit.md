# AeThex - Advanced Development Platform

## Overview
AeThex is a full-stack web application designed as an advanced development platform and community for builders. It integrates features for project collaboration, mentorship programs, research labs, and a creator network. The platform aims to be a single source of truth for identity and project passports, fostering a vibrant ecosystem for creators and developers.

## User Preferences
I prefer detailed explanations.
I want iterative development.
Ask before making major changes.
Do not make changes to the folder `electron/`.
Do not make changes to the folder `discord-bot/`.
Do not make changes to the folder `services/`.
Do not make changes to the folder `api/`.
Do not make changes to the file `server/index.ts`.

## System Architecture
AeThex is built as a full-stack web application utilizing React 18 with TypeScript for the frontend, Vite 6 as the build tool, and Express.js for the backend. Supabase (PostgreSQL) serves as the primary database. Styling is handled with Tailwind CSS, and UI components leverage Radix UI. TanStack Query is used for state management, and React Router DOM for routing.

The application features a multi-realm system including Labs, GameForge, Corp, Foundation, and Dev-Link, each with specific functionalities. Key capabilities include community features (feed, posts, comments), a Creator Network with profile passports and achievements, and a Nexus Marketplace for opportunities and contracts. A significant component is the Discord Integration, which includes a bot for commands, OAuth, and role management, alongside a bidirectional feed bridge for syncing content between Discord and the platform.

The UI/UX emphasizes an isometric 2.5D realm selector, replacing 3D scenes with CSS-based isometric cards for performance. It features responsive grids, ambient particles, and interactive tilt effects. The platform also supports an Electron desktop application with a secure IPC bridge and an automated build/release pipeline for multi-platform distribution.

Domain architecture is centralized around `aethex.foundation` as the Identity Authority (SSOT) for all identity and passport data, with all other platforms acting as OAuth clients. Creator and Project Passports are accessed via wildcard subdomains (`*.aethex.me`, `*.aethex.space`).

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