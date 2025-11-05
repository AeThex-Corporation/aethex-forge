# Getting Started

## Launch your first AeThex project in under 30 minutes

### Prerequisites

#### AeThex Account

You will need an active AeThex account to access the dashboard, API console, and deployment tools.

- [Create account](/get-started)

#### Node.js 18+ & npm

The AeThex CLI relies on modern Node runtimes. Verify your local toolchain before continuing.

- [Verify environment](https://nodejs.org/en/download)

#### Project Workspace

Choose an empty directory for your new AeThex project or clone an existing team template.

- [Browse templates](/projects/new)

## Setup Steps

### 1. Install the CLI

The CLI bootstraps local projects, provisions cloud environments, and manages deployments.

```bash
npm install -g aethex
```

### 2. Authenticate

Log in with your AeThex credentials or paste a personal access token from the dashboard.

```bash
aethex login
```

### 3. Initialize a Project

Scaffold configuration, environment files, and example services for your team.

```bash
aethex init studio-hub
```

### 4. Start the Dev Server

Run the local environment with hot reloading, mocked services, and seeded sample data.

```bash
npm run dev
```

## Deployment Checklist

### Configure Environments

Define staging and production targets, secrets, and automated health probes in aethex.config.ts.

### Provision Resources

Use `aethex deploy --preview` to create sandbox infrastructure before promoting to production.

### Enable Safeguards

Turn on role-based access controls, audit logging, and automated rollbacks from the dashboard.

## Platform Highlights

### Unified Dashboard

Monitor deployments, review incidents, and share announcements with stakeholders from a single console.

### Passport Identity

Give every builder a portable profile that aggregates achievements, verified skills, and mentorship history.

### Community and Mentorship

Pair emerging studios with advisors, host showcase events, and recruit collaborators through the community hub.

### Live Ops Analytics

Track real-time KPIs, automate status updates, and route alerts into your team's notification channels.

## Next Steps

- [Platform Walkthrough](/dashboard) - Tour the dashboard
- [Platform Documentation](/docs/platform) - High-level platform overview
- [API Reference](/docs/api) - Review authentication flows
- [Tutorial Library](/docs/tutorials) - Follow guided builds
- [Community Support](/community) - Ask questions and find mentors
- [Integrations Playbook](/docs/integrations) - Extend with partner tools
