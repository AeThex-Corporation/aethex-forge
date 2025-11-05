# CLI Tools

## Operate AeThex from the command line

The AeThex CLI automates local development, environment management, and production deployments. It is built with stability in mind, featuring transactional deploys, shell-friendly output, and native support for Linux, macOS, and Windows.

## Command Catalog

| Command                | Description                                      | Usage Notes                                                            |
| ---------------------- | ------------------------------------------------ | ---------------------------------------------------------------------- |
| `aethex init [name]`   | Scaffold a new project with opinionated defaults | Creates configuration, environments, and starter services              |
| `aethex login`         | Authenticate the CLI with your AeThex identity   | Support for browser-based login and personal access tokens             |
| `aethex deploy`        | Build and deploy the current project             | Runs tests, packages artifacts, and promotes to the target environment |
| `aethex env pull`      | Sync environment variables and secrets           | Keeps local .env files mirrored with the dashboard                     |
| `aethex pipeline logs` | Stream deployment logs in real time              | Supports filters by environment, branch, or commit SHA                 |

Run `aethex --help` for the full command tree.

## Local Development

Develop and test locally with hot reloading, mocked services, and seeded sample data.

```bash
aethex dev
```

Features:

- Live reload on file changes
- Mock API responses for testing
- Local database snapshots
- Development SSL certificates

## Environment Management

Pull secrets and configuration from your AeThex dashboard:

```bash
aethex env pull
```

## Production Deployment

Build and deploy to production environments:

```bash
aethex deploy
```

Features:

- Automated testing
- Build artifact caching
- Transactional deployments
- Automatic rollback on failure

## Automation Tips

### GitHub Actions

Use the official AeThex GitHub Action to authenticate, run smoke tests, and deploy on every pull request merge.

### Audit Trails

Every CLI deployment emits audit events. Stream them into your SIEM through the webhooks integration.

### Rollbacks

Instantly revert to the previous stable release and notify collaborators:

```bash
aethex deploy --rollback latest
```

### Preview Environments

Spin up disposable stacks tied to feature branches for stakeholder reviews:

```bash
aethex preview create
```

## Configuration

Configure your project in `aethex.config.ts`:

```typescript
export default {
  name: "my-project",
  region: "us-central",
  runtime: "node18",
  environments: {
    staging: {
      domain: "staging.example.com",
    },
    production: {
      domain: "app.example.com",
    },
  },
};
```

## Troubleshooting

- Check logs with `aethex pipeline logs`
- Verify authentication with `aethex whoami`
- Test configuration with `aethex validate`
