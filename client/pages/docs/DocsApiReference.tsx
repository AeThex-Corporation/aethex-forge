import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  KeyRound,
  Network,
  ServerCog,
  Activity,
  ShieldCheck,
  ArrowRight,
  AlertTriangle,
  Webhook,
} from "lucide-react";

const apiEndpoints = [
  {
    method: "POST",
    path: "/v1/auth/token",
    description: "Exchange client credentials for an access token",
  },
  {
    method: "GET",
    path: "/v1/projects",
    description: "List projects the current identity can access",
  },
  {
    method: "POST",
    path: "/v1/projects",
    description: "Create a project with environment defaults",
  },
  {
    method: "GET",
    path: "/v1/projects/{projectId}/metrics",
    description: "Retrieve runtime metrics and usage breakdowns",
  },
  {
    method: "POST",
    path: "/v1/webhooks/verify",
    description: "Validate webhook signatures from AeThex",
  },
];

const webhookTopics = [
  {
    event: "deployment.succeeded",
    description:
      "Triggered when a deployment pipeline completes successfully with promoted build artifacts.",
  },
  {
    event: "deployment.failed",
    description:
      "Sent when a pipeline fails. Includes failure stage, summary, and recommended remediation steps.",
  },
  {
    event: "incident.opened",
    description:
      "Raised when monitoring detects outages or SLA breaches in production environments.",
  },
  {
    event: "member.invited",
    description:
      "Notify downstream systems when a collaborator invitation is created or accepted.",
  },
];

const errorExamples = [
  {
    code: "401",
    label: "Unauthorized",
    hint: "Verify the Bearer token and ensure it has not expired.",
  },
  {
    code: "403",
    label: "Forbidden",
    hint: "The identity lacks the required scope. Request the project-admin role.",
  },
  {
    code: "429",
    label: "Too Many Requests",
    hint: "Respect the rate limit headers or enable adaptive backoff via the SDK.",
  },
  {
    code: "503",
    label: "Service Unavailable",
    hint: "Retry with exponential backoff. AeThex dashboards surface ongoing maintenance windows.",
  },
];

export default function DocsApiReference() {
  return (
    <div className="space-y-12">
      <section id="overview" className="space-y-4">
        <Badge className="bg-blue-600/20 text-blue-200 uppercase tracking-wide">
          <ServerCog className="mr-2 h-3 w-3" />
          API Reference
        </Badge>
        <h2 className="text-3xl font-semibold text-white">
          Integrate programmatically with the AeThex API
        </h2>
        <p className="text-gray-300 max-w-3xl">
          The REST API exposes every core capability of the AeThex platform.
          Authenticate with OAuth 2.1 or personal access tokens, call idempotent
          endpoints, and subscribe to webhooks to react to changes in real time.
        </p>
      </section>

      <section id="authentication" className="grid gap-6 md:grid-cols-2">
        <Card className="bg-slate-900/60 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-blue-400" />
              Authentication flow
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <p>
              Use the OAuth client credentials grant for service-to-service
              integrations:
            </p>
            <pre className="rounded-lg border border-slate-700 bg-slate-950/60 p-4 text-sm text-blue-200">
              {`curl -X POST https://api.aethex.dev/v1/auth/token \
  -u CLIENT_ID:CLIENT_SECRET \
  -d "grant_type=client_credentials" \
  -d "scope=projects:read deployments:write"`}
            </pre>
            <p>
              Prefer user-scoped access? Direct builders through the hosted
              OAuth consent screen and exchange their authorization code using
              the same endpoint.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Network className="h-5 w-5 text-blue-400" />
              Request example
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <p className="text-gray-300">
              Call the Projects endpoint with your Bearer token and inspect
              pagination headers for large result sets.
            </p>
            <pre className="rounded-lg border border-slate-700 bg-slate-950/60 p-4 text-sm text-teal-200">
              {
                'fetch("https://api.aethex.dev/v1/projects?page=1&limit=25", {\n  headers: {\n    Authorization: "Bearer ${TOKEN}",\n    "AeThex-Environment": "production",\n  },\n}).then(async (res) => {\n  if (!res.ok) throw new Error(await res.text());\n  console.log("Projects", await res.json());\n});'
              }
            </pre>
            <p>
              Responses include{" "}
              <code className="rounded bg-black/40 px-2 py-1 text-blue-200">
                X-RateLimit-Remaining
              </code>
              and{" "}
              <code className="rounded bg-black/40 px-2 py-1 text-blue-200">
                X-Request-ID
              </code>{" "}
              headers. Share the request ID when contacting support for faster
              triage.
            </p>
          </CardContent>
        </Card>
      </section>

      <section id="core-endpoints" className="space-y-4">
        <div className="flex items-center gap-3">
          <Activity className="h-6 w-6 text-blue-400" />
          <h3 className="text-2xl font-semibold text-white">Core endpoints</h3>
        </div>
        <Card className="bg-slate-900/60 border-slate-700">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Method</TableHead>
                  <TableHead>Path</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiEndpoints.map((endpoint) => (
                  <TableRow key={`${endpoint.method}-${endpoint.path}`}>
                    <TableCell>
                      <Badge className="bg-blue-600/30 text-blue-100">
                        {endpoint.method}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-purple-200">
                      {endpoint.path}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {endpoint.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption>
                Need deeper coverage? The JavaScript SDK ships with typed
                request builders for every endpoint.
              </TableCaption>
            </Table>
          </CardContent>
        </Card>
      </section>

      <section id="webhooks" className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-slate-900/60 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Webhook className="h-5 w-5 text-blue-400" />
              Webhook topics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {webhookTopics.map((topic) => (
              <div
                key={topic.event}
                className="rounded-lg border border-slate-700 bg-slate-950/40 p-4"
              >
                <p className="font-mono text-sm text-blue-300">{topic.event}</p>
                <p className="text-gray-300 text-sm mt-2">
                  {topic.description}
                </p>
              </div>
            ))}
            <p className="text-gray-400 text-sm">
              Configure webhook destinations and signing secrets from the{" "}
              <Link
                to="/dashboard"
                className="text-blue-300 hover:text-blue-200"
              >
                dashboard
              </Link>
              . Verify requests with the{" "}
              <code className="rounded bg-black/40 px-2 py-1 text-blue-200">
                AeThex-Signature
              </code>
              header to guarantee authenticity.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-400" />
              Resilience & errors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <p className="text-gray-300">
              All endpoints are idempotent where appropriate and support
              conditional requests via the
              <code className="rounded bg-black/40 px-2 py-1 text-blue-200">
                If-Match
              </code>{" "}
              header.
            </p>
            <div className="grid gap-3">
              {errorExamples.map((error) => (
                <div
                  key={error.code}
                  className="flex items-start gap-3 rounded-lg border border-slate-700 bg-slate-950/60 p-3"
                >
                  <Badge className="bg-red-600/30 text-red-200">
                    {error.code}
                  </Badge>
                  <div>
                    <p className="text-white font-medium">{error.label}</p>
                    <p className="text-sm text-gray-400">{error.hint}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-gray-300">
              Monitor rate-limit headers and retry using an exponential backoff
              strategy. Persistent errors can be escalated to the AeThex support
              team with the failing request ID.
            </p>
          </CardContent>
        </Card>
      </section>

      <section
        id="resources"
        className="rounded-2xl border border-blue-500/40 bg-blue-900/20 p-8"
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-white">
              Ship production-ready integrations
            </h3>
            <p className="text-gray-300 max-w-2xl">
              Combine the REST API with event webhooks for a full-duplex
              integration pattern. Use the official TypeScript SDK for typed
              helpers or generate your own client with the published OpenAPI
              schema.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-500">
              <Link to="https://api.aethex.dev/docs" target="_blank">
                <ArrowRight className="mr-2 h-5 w-5" />
                OpenAPI explorer
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-blue-400/60 text-blue-200"
            >
              <Link to="/docs/examples">
                <AlertTriangle className="mr-2 h-5 w-5" />
                See implementation patterns
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
