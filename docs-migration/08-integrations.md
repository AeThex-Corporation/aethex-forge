# Integrations

## Connecting partner services to AeThex

AeThex Integrations wrap third-party analytics, identity, payments, and live-ops tooling behind a consistent runtime, security model, and visual system. Use this guide to register new connectors, surface partner UI in product flows, and automate data exchange without hand-rolled plumbing.

## Architecture Overview

### Runtime Flow

Integration manifests are stored in the AeThex Integrations service and synced across the dashboard and runtime. Client components resolve connector metadata through the shared API helpers, ensuring credentials and capability flags stay consistent with server state.

During hydration the runtime mounts partner SDKs behind AeThex loaders, applying sandboxed execution where required. Use lifecycle hooks to emit analytics, hydrate widgets with scoped credentials, and gate access through the same role-based policies used elsewhere in the platform.

### Theming Hook

Use the integration theming utilities to adapt partner widgets to AeThex gradients, typography, and focus states. Tokens flow through CSS variables defined in `global.css`, so embeds stay visually aligned with dashboards and consumer apps.

## Connector Configuration

### Required Fields

| Field             | Description                                                          | Default Value                                    |
| ----------------- | -------------------------------------------------------------------- | ------------------------------------------------ |
| `key`             | Unique identifier referenced across dashboards, APIs, and audit logs | "analytics-segment"                              |
| `category`        | Integration taxonomy (analytics, identity, commerce, ops)            | "analytics"                                      |
| `capabilities`    | Feature flags that unlock widgets, hooks, and pipelines              | ['metrics', 'webhooks']                          |
| `connectionMode`  | Credential management (oauth, apiKey, managedVault)                  | "oauth"                                          |
| `webhookEndpoint` | Optional callback URL for outbound events                            | "https://app.example.com/aethex/webhooks"        |
| `uiEmbeds`        | Declarative config for dashboard cards and modals                    | [{ surface: 'dashboard', placement: 'sidebar' }] |

## Common Integrations

### Analytics

Connect your analytics platform to track KPIs and user behavior.

Supported platforms:

- Segment
- Mixpanel
- Amplitude
- Custom webhooks

### Identity & Auth

Integrate third-party identity providers for single sign-on.

Supported platforms:

- Auth0
- Okta
- Azure AD
- Custom OAuth

### Payments & Commerce

Sync purchase events and manage subscriptions.

Supported platforms:

- Stripe
- Paddle
- Gumroad
- Custom webhooks

### Live Operations

Connect incident management and status page services.

Supported platforms:

- PagerDuty
- OpsGenie
- Datadog
- Custom webhooks

## Troubleshooting

### OAuth Handshake Fails

Confirm the integration's redirect URI matches the value registered in the partner console. AeThex surfaces expose the required callback under Settings → Integrations.

### Webhook Retries Exhausted

Inspect delivery attempts in the Integrations dashboard. Update retry policies or verify your endpoint responds with a 2xx status within 10 seconds.

### Embedded Widget Styling

Override component tokens through the integration theme utilities or wrap the widget in a container that inherits AeThex gradient variables.

## Building Custom Integrations

### Step 1: Register Connector

Create a manifest in your integration service:

```json
{
  "key": "my-integration",
  "category": "analytics",
  "capabilities": ["metrics", "webhooks"],
  "connectionMode": "oauth"
}
```

### Step 2: Implement OAuth Flow

Handle the OAuth handshake to securely store credentials.

### Step 3: Create UI Components

Build dashboard cards or modal embeds using the AeThex component library.

### Step 4: Setup Webhooks

Configure event forwarding for real-time data sync.

## Best Practices

- Always validate webhook signatures
- Use managed vaults for sensitive credentials
- Implement rate limiting for API calls
- Test integrations in preview environments first
- Monitor webhook delivery and retry failures
- Document your integration with examples

## Support

For integration support and questions:

- [View API documentation](/docs/api)
- [Explore examples](/docs/examples)
- [Join community](/community)
