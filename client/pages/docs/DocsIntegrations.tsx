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
} from "lucide-react";

const embedSettings = [
  {
    name: "buttonSize",
    description: "Controls the floating launcher dimensions in pixels.",
    defaultValue: "60",
  },
  {
    name: "buttonPosition",
    description: "Places the launcher in one of four corners (e.g. bottom-right).",
    defaultValue: "bottom-right",
  },
  {
    name: "buttonOffset",
    description: "Fine-tunes horizontal/vertical offsets from the viewport edge.",
    defaultValue: "{ x: 32, y: 32 }",
  },
  {
    name: "iframeWidth",
    description: "Maximum width of the opened assistant panel.",
    defaultValue: "448",
  },
  {
    name: "iframeHeight",
    description: "Viewport height percentage for the assistant panel.",
    defaultValue: "85vh",
  },
  {
    name: "tooltipText",
    description: "Copy shown when hovering the launcher button.",
    defaultValue: "Need a hand?\\nAeThex Copilot is live.",
  },
];

const troubleshooting = [
  {
    title: "Failed to fetch status",
    detail:
      "If the HelloSkip API cannot be reached, the embed skips initialization. Verify outbound network access or retry when the environment regains connectivity.",
  },
  {
    title: "Agent inactive",
    detail:
      "Status responses containing `active: false` mean the agent is disabled. Update the agent inside HelloSkip or switch the data-agent-id.",
  },
  {
    title: "Styling conflicts",
    detail:
      "AeThex injects a dedicated theme stylesheet. Ensure no additional overrides remove the `.skip-agent-*` classes or the gradient tokens defined in `global.css`.",
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
        <h2 className="text-3xl font-semibold text-white">Embedding partner services in AeThex</h2>
        <p className="text-gray-300 max-w-3xl">
          AeThex supports secure, theme-aware embeds for third-party agents and tools. This guide covers the
          HelloSkip support assistant that ships with the platform and outlines patterns you can reuse for future
          integrations.
        </p>
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
              The HelloSkip agent is lazily loaded at runtime from <code className="bg-black/40 px-2">main.tsx</code> using a
              guarded fetch. Before executing the external runtime, AeThex performs a status preflight against
              <code className="bg-black/40 px-2">/api/agent/status</code>. If the agent is unavailable, initialization is skipped to
              prevent console noise.
            </p>
            <p>
              On success, the script injects HelloSkip&apos;s global object and immediately calls
              <code className="bg-black/40 px-2">window.SkipAgent.embed</code> with AeThex-specific sizing, copy, and z-index values.
              A companion stylesheet applies the gradient, border, and focus treatments to match the site aesthetic.
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
              AeThex provides a handcrafted theme in <code className="bg-black/40 px-2">SKIP_AGENT_THEME</code>. It uses the gradient
              palette defined in <code className="bg-black/40 px-2">global.css</code> to restyle the floating launcher, tooltip, and
              assistant container.
            </p>
            <p>
              Add additional overrides by extending the same template literal and keeping selectors scoped to
              <code className="bg-black/40 px-2">.skip-agent-*</code>. The embed only injects the style block once via the
              <code className="bg-black/40 px-2">createSkipAgentTheme</code> helper.
            </p>
          </CardContent>
        </Card>
      </section>

      <section id="configuration" className="space-y-4">
        <div className="flex items-center gap-3">
          <Palette className="h-6 w-6 text-indigo-300" />
          <h3 className="text-2xl font-semibold text-white">Configuration options</h3>
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
                {embedSettings.map((setting) => (
                  <TableRow key={setting.name}>
                    <TableCell className="font-mono text-indigo-200">{setting.name}</TableCell>
                    <TableCell className="text-gray-300">{setting.description}</TableCell>
                    <TableCell className="text-gray-400 text-sm">{setting.defaultValue}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption>
                Update values inside <code className="bg-black/40 px-1">SKIP_AGENT_EMBED_OPTIONS</code> in
                <code className="bg-black/40 px-1">client/main.tsx</code>.
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
              <li>Keep the preflight status check in place for stability in staging or offline previews.</li>
              <li>Regenerate the blob URL after each successful load to avoid memory leaks.</li>
              <li>Wrap additional embeds in the same helper to maintain a single initialization flag.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white text-lg">
              <RefreshCw className="h-5 w-5 text-indigo-300" />
              Updating the agent
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-gray-300 text-sm">
            <p>
              To switch agents, update <code className="bg-black/40 px-1">SKIP_AGENT_ID</code>. If the HelloSkip host changes,
              adjust <code className="bg-black/40 px-1">SKIP_AGENT_SRC</code>—the origin is derived automatically for status checks.
            </p>
            <p>
              For full replacements, swap the fetch target to your new integration and continue calling the same
              <code className="bg-black/40 px-1">embedSkipAgent</code> helper to retain theme and lifecycle management.
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
            <Card key={issue.title} className="bg-slate-900/60 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-base">{issue.title}</CardTitle>
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

      <section id="resources" className="rounded-2xl border border-indigo-500/40 bg-indigo-900/20 p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-white">Further reading</h3>
            <p className="text-gray-300 text-sm max-w-2xl">
              Manage integration documentation centrally in Builder CMS or export static knowledge base pages. Use the
              same theming primitives to embed other providers consistently across the platform.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-500">
              <Link to="/docs/api">
                <LinkIcon className="mr-2 h-5 w-5" />
                Review API hooks
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-indigo-400/60 text-indigo-200">
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
