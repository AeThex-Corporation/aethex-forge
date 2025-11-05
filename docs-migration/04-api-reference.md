# API Reference

## Integrate programmatically with the AeThex API

The REST API exposes every core capability of the AeThex platform. Authenticate with OAuth 2.1 or personal access tokens, call idempotent endpoints, and subscribe to webhooks to react to changes in real time.

## Authentication

### OAuth Client Credentials Grant

Use the OAuth client credentials grant for service-to-service integrations:

```bash
curl -X POST https://api.aethex.dev/v1/auth/token \
  -u CLIENT_ID:CLIENT_SECRET \
  -d "grant_type=client_credentials" \
  -d "scope=projects:read deployments:write"
```

Prefer user-scoped access? Direct builders through the hosted OAuth consent screen and exchange their authorization code using the same endpoint.

### Request Example

Call the Projects endpoint with your Bearer token and inspect pagination headers for large result sets.

```javascript
fetch("https://api.aethex.dev/v1/projects?page=1&limit=25", {
  headers: {
    Authorization: "Bearer ${TOKEN}",
    "AeThex-Environment": "production",
  },
}).then(async (res) => {
  if (!res.ok) throw new Error(await res.text());
  console.log("Projects", await res.json());
});
```

Responses include `X-RateLimit-Remaining` and `X-Request-ID` headers. Share the request ID when contacting support for faster triage.

## Core Endpoints

| Method | Path                             | Description                                     |
| ------ | -------------------------------- | ----------------------------------------------- |
| POST   | /v1/auth/token                   | Exchange client credentials for an access token |
| GET    | /v1/projects                     | List projects the current identity can access   |
| POST   | /v1/projects                     | Create a project with environment defaults      |
| GET    | /v1/projects/{projectId}/metrics | Retrieve runtime metrics and usage breakdowns   |
| POST   | /v1/webhooks/verify              | Validate webhook signatures from AeThex         |

## Webhooks

Subscribe to webhooks to react to changes in real time.

### Webhook Events

- **deployment.succeeded** - Triggered when a deployment pipeline completes successfully with promoted build artifacts.
- **deployment.failed** - Sent when a pipeline fails. Includes failure stage, summary, and recommended remediation steps.
- **incident.opened** - Raised when monitoring detects outages or SLA breaches in production environments.
- **member.invited** - Notify downstream systems when a collaborator invitation is created or accepted.

## Error Handling

| Code | Label               | Hint                                                                                   |
| ---- | ------------------- | -------------------------------------------------------------------------------------- |
| 401  | Unauthorized        | Verify the Bearer token and ensure it has not expired.                                 |
| 403  | Forbidden           | The identity lacks the required scope. Request the project-admin role.                 |
| 429  | Too Many Requests   | Respect the rate limit headers or enable adaptive backoff via the SDK.                 |
| 503  | Service Unavailable | Retry with exponential backoff. AeThex dashboards surface ongoing maintenance windows. |

## SDK Documentation

Available SDKs:

- JavaScript/TypeScript
- Python
- Go
- Java
- Ruby

For detailed SDK documentation, see the respective package documentation.
