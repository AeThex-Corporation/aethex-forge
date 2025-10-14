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
import { Link } from "react-router-dom";
import {
  Terminal,
  Cpu,
  PlayCircle,
  Settings,
  Activity,
  CloudLightning,
  Shield,
  ArrowRight,
} from "lucide-react";

const commands = [
  {
    command: "aethex init [name]",
    description: "Scaffold a new project with opinionated defaults",
    usage: "Creates configuration, environments, and starter services",
  },
  {
    command: "aethex login",
    description: "Authenticate the CLI with your AeThex identity",
    usage: "Support for browser-based login and personal access tokens",
  },
  {
    command: "aethex deploy",
    description: "Build and deploy the current project",
    usage:
      "Runs tests, packages artifacts, and promotes to the target environment",
  },
  {
    command: "aethex env pull",
    description: "Sync environment variables and secrets",
    usage: "Keeps local .env files mirrored with the dashboard",
  },
  {
    command: "aethex pipeline logs",
    description: "Stream deployment logs in real time",
    usage: "Supports filters by environment, branch, or commit SHA",
  },
];

const automationTips = [
  {
    title: "GitHub Actions",
    description:
      "Use the official AeThex GitHub Action to authenticate, run smoke tests, and deploy on every pull request merge.",
  },
  {
    title: "Audit Trails",
    description:
      "Every CLI deployment emits audit events. Stream them into your SIEM through the webhooks integration.",
  },
  {
    title: "Rollbacks",
    description:
      "`aethex deploy --rollback latest` instantly reverts to the previous stable release and notifies collaborators.",
  },
  {
    title: "Preview Environments",
    description:
      "`aethex preview create` spins up disposable stacks tied to feature branches for stakeholder reviews.",
  },
];

export default function DocsCli() {
  return (
    <div className="space-y-12">
      <section id="overview" className="space-y-4">
        <Badge className="bg-amber-500/20 text-amber-100 uppercase tracking-wide">
          <Terminal className="mr-2 h-3 w-3" />
          CLI Tools
        </Badge>
        <h2 className="text-3xl font-semibold text-white">
          Operate AeThex from the command line
        </h2>
        <p className="text-gray-300 max-w-3xl">
          The AeThex CLI automates local development, environment management,
          and production deployments. It is built with stability in mind,
          featuring transactional deploys, shell-friendly output, and native
          support for Linux, macOS, and Windows.
        </p>
      </section>

      <section id="commands" className="space-y-4">
        <div className="flex items-center gap-3">
          <Cpu className="h-6 w-6 text-amber-300" />
          <h3 className="text-2xl font-semibold text-white">Command catalog</h3>
        </div>
        <Card className="bg-slate-900/60 border-slate-700">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Command</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Usage notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commands.map((item) => (
                  <TableRow key={item.command}>
                    <TableCell className="font-mono text-purple-200">
                      {item.command}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {item.description}
                    </TableCell>
                    <TableCell className="text-gray-400 text-sm">
                      {item.usage}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption>
                Run <code className="bg-black/40 px-1">aethex --help</code> for
                the full command tree.
              </TableCaption>
            </Table>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="bg-slate-900/60 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <PlayCircle className="h-5 w-5 text-amber-300" />
              Local development
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-3 text-sm">
            <p>
              Run <code className="bg-black/40 px-1">aethex dev</code> to start
              local services with hot reloading and the AeThex mock identity
              provider. Inspect logs via the integrated tail view.
            </p>
            <p>
              Use <code className="bg-black/40 px-1">aethex data seed</code> to
              populate sample datasets for QA or demo accounts.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Settings className="h-5 w-5 text-amber-300" />
              Environment management
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-3 text-sm">
            <p>
              Synchronize configuration with{" "}
              <code className="bg-black/40 px-1">aethex env pull</code> or
              populate remote environments from local files using{" "}
              <code className="bg-black/40 px-1">aethex env push</code>.
            </p>
            <p>
              Inspect secrets securely through{" "}
              <code className="bg-black/40 px-1">aethex env inspect</code>.
              Output is redacted by default, keeping sensitive data safe in
              terminal logs.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Activity className="h-5 w-5 text-amber-300" />
              Deployment safety
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-3 text-sm">
            <p>
              Each deployment is transactional: a failure during build or
              migration automatically halts promotion and emits alerts to
              subscribed channels.
            </p>
            <p>
              Gates such as quality checks or approvals can be configured in{" "}
              <code className="bg-black/40 px-1">aethex.config.ts</code>
              and enforced automatically by the CLI.
            </p>
          </CardContent>
        </Card>
      </section>

      <section id="automation" className="space-y-4">
        <div className="flex items-center gap-3">
          <CloudLightning className="h-6 w-6 text-amber-300" />
          <h3 className="text-2xl font-semibold text-white">
            Automate everything
          </h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {automationTips.map((tip) => (
            <Card key={tip.title} className="bg-slate-900/60 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">
                  {tip.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-gray-300">
                  {tip.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section
        id="security"
        className="rounded-2xl border border-amber-500/40 bg-amber-900/20 p-8"
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-white">
              Stay safe in production
            </h3>
            <p className="text-gray-200 max-w-2xl text-sm">
              The CLI signs every build artifact and enforces checksums during
              deployment. Combine this with RBAC token policies to guarantee
              only trusted pipelines can trigger releases.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-amber-500 hover:bg-amber-400 text-black"
            >
              <Link to="/docs/getting-started">
                <ArrowRight className="mr-2 h-5 w-5" />
                Return to setup guide
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-amber-300/60 text-amber-100"
            >
              <Link to="/support">
                <Shield className="mr-2 h-5 w-5" />
                Security best practices
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="text-amber-100 hover:text-amber-50"
            >
              <Link to="/docs/platform">
                Discover platform features
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
