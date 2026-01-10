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
  Puzzle,
  Server,
  Brush,
  Shield,
  RefreshCw,
  ArrowRight,
  Link as LinkIcon,
  Palette,
  AlertTriangle,
  FileText,
  Headset,
  Gamepad2,
  Boxes,
  Globe,
  Cuboid,
  Box,
} from "lucide-react";

const connectorFields = [
  {
    name: "key",
    description:
      "Unique identifier referenced across dashboards, APIs, and audit logs.",
    defaultValue: '"analytics-segment"',
  },
  {
    name: "category",
    description:
      "Integration taxonomy aligned with AeThex surfaces (analytics, identity, commerce, ops).",
    defaultValue: '"analytics"',
  },
  {
    name: "capabilities",
    description:
      "Feature flags that unlock widgets, automation hooks, and data pipelines.",
    defaultValue: "['metrics', 'webhooks']",
  },
  {
    name: "connectionMode",
    description:
      "Determines how credentials are managed (oauth, apiKey, managedVault).",
    defaultValue: '"oauth"',
  },
  {
    name: "webhookEndpoint",
    description:
      "Optional callback URL for outbound events delivered by AeThex.",
    defaultValue: '"https://app.example.com/aethex/webhooks"',
  },
  {
    name: "uiEmbeds",
    description:
      "Declarative config describing dashboard cards, modals, or launchers this integration renders.",
    defaultValue: "[{ surface: 'dashboard', placement: 'sidebar' }]",
  },
];

const troubleshooting = [
  {
    title: "OAuth handshake fails",
    detail:
      "Confirm the integration's redirect URI matches the value registered in the partner console. AeThex surfaces expose the required callback under Settings → Integrations.",
  },
  {
    title: "Webhook retries exhausted",
    detail:
      "Inspect delivery attempts in the Integrations dashboard. Update retry policies or verify your endpoint responds with a 2xx status within 10 seconds.",
  },
  {
    title: "Embedded widget styling",
    detail:
      "Override component tokens through the integration theme utilities or wrap the widget in a container that inherits AeThex gradient variables.",
  },
];

export default function DocsIntegrations() {
  return (
    <div className="space-y-12">
      <section id="overview" className="space-y-4">
        <Badge className="bg-indigo-500/20 text-indigo-100 uppercase tracking-wide">
          <Puzzle className="mr-2 h-3 w-3" />
          Integrations
        </Badge>
        <h2 className="text-3xl font-semibold text-white">
          Connecting partner services to AeThex
        </h2>
        <p className="text-gray-300 max-w-3xl">
          AeThex Integrations wrap third-party analytics, identity, payments,
          and live-ops tooling behind a consistent runtime, security model, and
          visual system. Use this guide to register new connectors, surface
          partner UI in product flows, and automate data exchange without
          hand-rolled plumbing.
        </p>
      </section>

      {/* Game Engines */}
      <section id="engines" className="space-y-6">
        <div className="flex items-center gap-3">
          <Brush className="h-6 w-6 text-blue-300" />
          <h3 className="text-2xl font-semibold text-white">
            Game Engines
          </h3>
        </div>
        <p className="text-gray-400">
          Integrate AeThex into your game engine of choice with native SDKs and code examples.
        </p>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-gradient-to-br from-blue-950/50 to-indigo-950/50 border-blue-500/30 hover:border-blue-400/60 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <Gamepad2 className="h-6 w-6 text-blue-400" />
                Godot Engine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-gray-300">
                Open-source MIT-licensed engine with GDScript and C# support
              </CardDescription>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-200">GDScript</Badge>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-200">C#</Badge>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-200">Open Source</Badge>
              </div>
              <Button variant="outline" className="w-full border-blue-400/50 text-blue-300 hover:bg-blue-500/10" asChild>
                <Link to="/docs/integrations/godot">
                  View Documentation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-950/50 to-emerald-950/50 border-green-500/30 hover:border-green-400/60 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <Gamepad2 className="h-6 w-6 text-green-400" />
                GameMaker
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-gray-300">
                Powerful 2D engine with GML scripting for rapid game development
              </CardDescription>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-green-500/20 text-green-200">GML</Badge>
                <Badge variant="secondary" className="bg-green-500/20 text-green-200">2D</Badge>
                <Badge variant="secondary" className="bg-green-500/20 text-green-200">Multi-Platform</Badge>
              </div>
              <Button variant="outline" className="w-full border-green-400/50 text-green-300 hover:bg-green-500/10" asChild>
                <Link to="/docs/integrations/gamemaker">
                  View Documentation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Distribution Platforms */}
      <section id="distribution" className="space-y-6">
        <div className="flex items-center gap-3">
          <Globe className="h-6 w-6 text-pink-300" />
          <h3 className="text-2xl font-semibold text-white">
            Distribution Platforms
          </h3>
        </div>
        <p className="text-gray-400">
          Publish your games on indie storefronts with AeThex backend integration for cloud saves and cross-platform features.
        </p>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-gradient-to-br from-purple-950/50 to-violet-950/50 border-purple-500/30 hover:border-purple-400/60 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <Gamepad2 className="h-6 w-6 text-purple-400" />
                GameJolt
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-gray-300">
                Community gaming platform with 10M+ players and trophy sync
              </CardDescription>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-200">Trophies</Badge>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-200">10M Players</Badge>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-200">Free</Badge>
              </div>
              <Button variant="outline" className="w-full border-purple-400/50 text-purple-300 hover:bg-purple-500/10" asChild>
                <Link to="/docs/integrations/gamejolt">
                  View Documentation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-950/50 to-rose-950/50 border-pink-500/30 hover:border-pink-400/60 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <Gamepad2 className="h-6 w-6 text-pink-400" />
                Itch.io
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-gray-300">
                Indie marketplace with 500K+ games and flexible pay-what-you-want pricing
              </CardDescription>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-pink-500/20 text-pink-200">PWYW</Badge>
                <Badge variant="secondary" className="bg-pink-500/20 text-pink-200">500K Games</Badge>
                <Badge variant="secondary" className="bg-pink-500/20 text-pink-200">HTML5</Badge>
              </div>
              <Button variant="outline" className="w-full border-pink-400/50 text-pink-300 hover:bg-pink-500/10" asChild>
                <Link to="/docs/integrations/itchio">
                  View Documentation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Platform Integrations */}
      <section id="platforms" className="space-y-6">
        <div className="flex items-center gap-3">
          <Boxes className="h-6 w-6 text-indigo-300" />
          <h3 className="text-2xl font-semibold text-white">
            Social VR & Metaverse Platforms
          </h3>
        </div>
        <p className="text-gray-400">
          Deploy your games and apps across social VR and metaverse platforms using AeThex's unified API.
        </p>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-gradient-to-br from-purple-950/50 to-indigo-950/50 border-purple-500/30 hover:border-purple-400/60 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <Headset className="h-6 w-6 text-purple-400" />
                VRChat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-gray-300">
                Build immersive VR worlds with Udon scripting and cross-platform authentication
              </CardDescription>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-200">Unity</Badge>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-200">Udon C#</Badge>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-200">VR</Badge>
              </div>
              <Button variant="outline" className="w-full border-purple-400/50 text-purple-300 hover:bg-purple-500/10" asChild>
                <Link to="/docs/integrations/vrchat">
                  View Documentation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-950/50 to-cyan-950/50 border-blue-500/30 hover:border-blue-400/60 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <Gamepad2 className="h-6 w-6 text-blue-400" />
                RecRoom
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-gray-300">
                Create social games using Circuits visual scripting for VR and mobile
              </CardDescription>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-200">Circuits</Badge>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-200">VR + Mobile</Badge>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-200">Social</Badge>
              </div>
              <Button variant="outline" className="w-full border-blue-400/50 text-blue-300 hover:bg-blue-500/10" asChild>
                <Link to="/docs/integrations/recroom">
                  View Documentation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>cyan-950/50 to-blue-950/50 border-cyan-500/30 hover:border-cyan-400/60 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <Globe className="h-6 w-6 text-cyan-400" />
                Spatial
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-gray-300">
                Build browser-based 3D experiences for VR, desktop, and mobile devices
              </CardDescription>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-200">TypeScript</Badge>
                <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-200">Web3</Badge>
                <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-200">No Install</Badge>
              </div>
              <Button variant="outline" className="w-full border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/10" asChild>
                <Link to="/docs/integrations/spatial">
                  View Documentation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-950/50 to-orange-950/50 border-red-500/30 hover:border-red-400/60 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <Cuboid className="h-6 w-6 text-red-400" />
                Decentraland
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-gray-300">
                Create Ethereum-powered metaverse experiences with NFT integration
              </CardDescription>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-red-500/20 text-red-200">Ethereum</Badge>
                <Badge variant="secondary" className="bg-red-500/20 text-red-200">LAND</Badge>
                <Badge variant="secondary" className="bg-red-500/20 text-red-200">DAO</Badge>
              </div>
              <Button variant="outline" className="w-full border-red-400/50 text-red-300 hover:bg-red-500/10" asChild>
                <Link to="/docs/integrations/decentraland">
                  View Documentation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-950/50 to-yellow-950/50 border-amber-500/30 hover:border-amber-400/60 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <Box className="h-6 w-6 text-amber-400" />
                The Sandbox
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-gray-300">
                Build voxel games with visual editor and Polygon NFT rewards
              </CardDescription>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-amber-500/20 text-amber-200">Polygon</Badge>
                <Badge variant="secondary" className="bg-amber-500/20 text-amber-200">Voxels</Badge>
                <Badge variant="secondary" className="bg-amber-500/20 text-amber-200">NFTs</Badge>
              </div>
              <Button variant="outline" className="w-full border-amber-400/50 text-amber-300 hover:bg-amber-500/10" asChild>
                <Link to="/docs/integrations/thesandbox">
                  View Documentation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="architecture" className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-slate-900/60 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Server className="h-5 w-5 text-indigo-300" />
              Runtime flow
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300 text-sm leading-relaxed">
            <p>
              Integration manifests are stored in the AeThex Integrations
              service and synced across the dashboard and runtime. Client
              components resolve connector metadata through the shared API
              helpers, ensuring credentials and capability flags stay consistent
              with server state.
            </p>
            <p>
              During hydration the runtime mounts partner SDKs behind AeThex
              loaders, applying sandboxed execution where required. Use
              lifecycle hooks to emit analytics, hydrate widgets with scoped
              credentials, and gate access through the same role-based policies
              used elsewhere in the platform.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brush className="h-5 w-5 text-indigo-300" />
              Theming hook
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-gray-300 text-sm">
            <p>
              Use the integration theming utilities to adapt partner widgets to
              AeThex gradients, typography, and focus states. Tokens flow
              through CSS variables defined in{" "}
              <code className="bg-black/40 px-2">global.css</code>, so embeds
              stay visually aligned with dashboards and consumer apps.
            </p>
            <p>
              Extend styling with scoped class names or CSS variables exported
              by the partner SDK. When shipping multiple widgets, prefer design
              tokens over hard-coded overrides to keep dark-mode and
              accessibility tweaks in sync.
            </p>
          </CardContent>
        </Card>
      </section>

      <section id="configuration" className="space-y-4">
        <div className="flex items-center gap-3">
          <Palette className="h-6 w-6 text-indigo-300" />
          <h3 className="text-2xl font-semibold text-white">
            Configuration options
          </h3>
        </div>
        <Card className="bg-slate-900/60 border-slate-700">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Default</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {connectorFields.map((field) => (
                  <TableRow key={field.name}>
                    <TableCell className="font-mono text-indigo-200">
                      {field.name}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {field.description}
                    </TableCell>
                    <TableCell className="text-gray-400 text-sm">
                      {field.defaultValue}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption>
                Manage manifests in the Integrations dashboard or via the Admin
                API to keep environments in sync.
              </TableCaption>
            </Table>
          </CardContent>
        </Card>
      </section>

      <section id="usage" className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-slate-900/60 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white text-lg">
              <Shield className="h-5 w-5 text-indigo-300" />
              Best practices
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-gray-300 text-sm">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Store credentials in AeThex-managed vaults and rotate them from
                the dashboard rather than hard-coding.
              </li>
              <li>
                Limit embed rendering to audiences that have access to the
                underlying data to avoid leaking partner UI.
              </li>
              <li>
                Log integration events through the shared telemetry helpers so
                support can trace partner-side failures.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white text-lg">
              <RefreshCw className="h-5 w-5 text-indigo-300" />
              Lifecycle management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-gray-300 text-sm">
            <p>
              Promote integration changes through staging first. AeThex
              snapshots connector manifests per environment so you can test
              credentials, capability flags, and UI placements without impacting
              production users.
            </p>
            <p>
              When partners publish SDK updates, pin versions in your manifest,
              document the change log, and coordinate rollout windows with
              stakeholders subscribing to the integration.
            </p>
          </CardContent>
        </Card>
      </section>

      <section id="troubleshooting" className="space-y-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-indigo-300" />
          <h3 className="text-2xl font-semibold text-white">Troubleshooting</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {troubleshooting.map((issue) => (
            <Card
              key={issue.title}
              className="bg-slate-900/60 border-slate-700"
            >
              <CardHeader>
                <CardTitle className="text-white text-base">
                  {issue.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-sm">
                  {issue.detail}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section
        id="resources"
        className="rounded-2xl border border-indigo-500/40 bg-indigo-900/20 p-8"
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-white">
              Further reading
            </h3>
            <p className="text-gray-300 text-sm max-w-2xl">
              Manage integration documentation centrally in Builder CMS or
              export static guides for partner teams. Keep manifests, onboarding
              playbooks, and support runbooks together so each connector has a
              clear owner.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              asChild
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-500"
            >
              <Link to="/docs/api">
                <LinkIcon className="mr-2 h-5 w-5" />
                Review API hooks
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-indigo-400/60 text-indigo-200"
            >
              <Link to="/docs/examples#code-gallery">
                <FileText className="mr-2 h-5 w-5" />
                Explore sample repos
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
