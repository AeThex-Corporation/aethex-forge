# AeThex - Advanced Development Platform

## Overview
AeThex is a full-stack web application serving as an advanced development platform and community. It facilitates project collaboration, mentorship, research, and a creator network. The platform aims to be a single source of truth for identity and project passports, fostering a vibrant ecosystem for creators and developers. Key capabilities include community features, a Creator Network with profile passports and achievements, and a Nexus Marketplace for opportunities and contracts. The project envisions centralizing identity and project data, with a focus on a multi-realm system including Nexus, GameForge, Foundation, Labs, Corp, and Staff.

## User Preferences
I prefer detailed explanations.
I want iterative development.
Ask before making major changes.
Do not make changes to the folder `electron/`.

## System Architecture
AeThex is a full-stack web application built with React 18 and TypeScript for the frontend, Vite 6 as the build tool, and Express.js for the backend. Supabase (PostgreSQL) is the primary database. Styling uses Tailwind CSS and Radix UI components. TanStack Query manages state, and React Router DOM handles routing.

The application incorporates a multi-realm system (Nexus, GameForge, Foundation, Labs, Corp, Staff). The UI/UX features an isometric 2.5D realm selector using CSS-based cards for performance, responsive grids, ambient particles, and interactive tilt effects. It also includes an Electron desktop application with a secure IPC bridge and automated build/release pipelines.

Domain architecture centralizes around `aethex.foundation` as the Identity Authority (SSOT), with other platforms acting as OAuth clients. Creator and Project Passports are accessed via wildcard subdomains (`*.aethex.me`, `*.aethex.space`).

The system implements Axiom Model Routing to enforce legal separation between For-Profit and Non-Profit entities, with specific routes redirecting to `aethex.foundation` or `aethex.studio` for public and R&D content, while management operations remain on `aethex.dev`. The NEXUS Core serves as a Universal Data Layer, acting as the Single Source of Truth for talent and contract metadata, crucial for compliance and legal separation.

Key features include an XP & Leveling System, a Unified Role/Tier System (combining paid subscriptions with earned badges for AI persona access), Stripe Integration for subscriptions, and a comprehensive Discord Integration architecture. The Discord integration involves a main bot and an activity application, providing features like live presence, chat, polls, challenges, and project showcases within Discord. An AI Intelligent Agent Integration provides 10 specialized personas with tiered access control and realm-aware suggestions. A site-wide maintenance mode with admin bypass is also implemented.

## External Dependencies
- **Supabase**: Database (PostgreSQL), authentication, real-time features.
- **Discord API**: Bot functionality, OAuth for user verification and linking, feed bridging.
- **Vite**: Frontend build tool.
- **Express.js**: Backend web framework.
- **React**: Frontend library.
- **Tailwind CSS**: Utility-first CSS framework.
- **Radix UI**: Unstyled UI component library.
- **TanStack Query**: Data fetching and state management.
- **React Router DOM**: Client-side routing.
- **Electron**: Framework for building desktop applications.
- **Stripe**: Payment processing for subscriptions.
- **Gemini API**: AI chat functionality.