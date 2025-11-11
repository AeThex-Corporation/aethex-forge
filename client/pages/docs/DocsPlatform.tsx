import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  IdCard,
  Users,
  ActivitySquare,
  Sparkles,
  Compass,
  Workflow,
  ShieldCheck,
  Database,
  BarChart3,
  Globe,
  ArrowRight,
  Link as LinkIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

const platformPillars = [
  {
    title: "Unified dashboard",
    description:
      "Monitor deployments, live metrics, and release health from a single control surface. Jump into incidents, approvals, and audit trails without leaving the workspace.",
    icon: LayoutDashboard,
    href: "/dashboard",
    cta: "Visit dashboard",
  },
  {
    title: "AeThex Passport",
    description:
      "Give builders portable identity with verified skills, achievements, and cross-product progress synced to their Passport profile.",
    icon: IdCard,
    href: "/passport/me",
    cta: "Open passport",
  },
  {
    title: "Collaboration",
    description:
      "Coordinate teams with realms, role-based access, and shared project templates. Invite talent directly from the community directory.",
    icon: Users,
    href: "/community",
    cta: "Meet the community",
  },
  {
    title: "Live operations",
    description:
      "Run live experiences with analytics, status pages, and automated incident workflows wired into AeThex services.",
    icon: ActivitySquare,
    href: "/status",
    cta: "Check status",
  },
];

const collaborationWorkflows = [
  {
    label: "Onboard & align",
    description:
      "Welcome teammates through the guided onboarding flow, capture their interests, and assign the right mentorship programs from day one.",
    highlight:
      "Onboarding modules cover personal info, interests, and project preferences so teams ramp quickly.",
  },
  {
    label: "Build together",
    description:
      "Kick off projects with shared canvases, synced task boards, and CLI-generated environments. Use the realm switcher to target the correct workspace.",
    highlight:
      "In-app toasts notify collaborators when schema changes, deployments, or reviews need attention.",
  },
  {
    label: "Launch & iterate",
    description:
      "Promote builds through AeThex Deploy, track KPIs in the analytics feed, and publish release notes via the changelog tools.",
    highlight:
      "Community announcements and blog posts keep players and stakeholders in the loop automatically.",
  },
];

const experienceModules = [
  {
    name: "Social feed",
    description:
      "Share updates, prototypes, and patch notes in the feed. The composer supports media, Markdown, and rollout tags for targeted audiences.",
    href: "/feed",
  },
  {
    name: "Mentorship programs",
    description:
      "Match emerging studios with veteran advisors. Outline project goals, track sessions, and graduate mentors into full collaborators.",
    href: "/mentorship",
  },
  {
    name: "Community showcases",
    description:
      "Highlight standout creators, publish case studies, and route interested partners to booking forms right from the community page.",
    href: "/community",
  },
  {
    name: "Profile passport",
    description:
      "Curate public achievements, experience levels, and verified skill badges. Use the passport summary widget across marketing surfaces.",
    href: "/profile",
  },
];

const analyticsHighlights = [
  {
    title: "Realtime insights",
    detail:
      "Project metrics stream into dashboards with per-environment filters. Combine ingestion data with custom signals exposed via the REST API.",
    icon: BarChart3,
  },
  {
    title: "Governed data",
    detail:
      "Role-aware views ensure sensitive dashboards only appear for authorized users. Export snapshots or schedule recurring digests.",
    icon: ShieldCheck,
  },
  {
    title: "Operational history",
    detail:
      "Every deployment, incident, and advisory event lands in the shared timeline so teams can audit changes months later.",
    icon: Database,
  },
];

const governanceChecklist = [
  "OAuth connections let studios link third-party identity providers for single sign-on and group provisioning.",
  "Realm switcher enforces scoped access to projects, assets, and financial data.",
  "Compliance exports bundle audit logs, access reviews, and deployment manifests for regulatory submissions.",
  "Automated alerts surface risk when environments drift or policy checks fail during deploys.",
];

const resourceLinks = [
  {
    title: "Explore onboarding",
    href: "/onboarding",
    label: "Review builder flow",
  },
  {
    title: "Configure OAuth",
    href: "/docs/api#authentication",
    label: "Manage identity",
  },
  {
    title: "Launch new project",
    href: "/projects/new",
    label: "Start from template",
  },
  {
    title: "Track live status",
    href: "/status",
    label: "Monitor ops",
  },
];

export default function DocsPlatform() {
  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <Badge className="bg-cyan-500/20 text-cyan-100 uppercase tracking-wide">
          <Sparkles className="mr-2 h-3 w-3" />
          Platform Experience
        </Badge>
        <h2 className="text-3xl font-semibold text-white">
          Deliver cohesive player and builder journeys on AeThex
        </h2>
        <p className="text-gray-300 max-w-3xl">
          Beyond deployment pipelines and CLI tooling, AeThex bundles
          collaboration, identity, and live-ops systems so teams can craft
          unforgettable experiences. Use this guide to orient new stakeholders
          and plan end-to-end platform rollouts.
        </p>
      </section>

      <section id="pillars" className="space-y-6">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="h-6 w-6 text-cyan-300" />
          <h3 className="text-2xl font-semibold text-white">Core pillars</h3>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {platformPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Card
                key={pillar.title}
                className="bg-slate-900/60 border-slate-700"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="h-6 w-6 text-cyan-300" />
                      <CardTitle className="text-white text-lg">
                        {pillar.title}
                      </CardTitle>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-xs text-cyan-200 border-cyan-500/40"
                    >
                      Platform
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-gray-300 text-sm">
                    {pillar.description}
                  </CardDescription>
                  <Button
                    asChild
                    variant="ghost"
                    className="justify-start text-cyan-200 hover:text-cyan-100 hover:bg-cyan-500/10"
                  >
                    <Link to={pillar.href}>
                      {pillar.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section id="workflows" className="space-y-6">
        <div className="flex items-center gap-3">
          <Workflow className="h-6 w-6 text-cyan-300" />
          <h3 className="text-2xl font-semibold text-white">
            Collaboration workflows
          </h3>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {collaborationWorkflows.map((stage, index) => (
            <Card
              key={stage.label}
              className="bg-slate-900/60 border-slate-700"
            >
              <CardHeader className="space-y-2">
                <Badge className="w-fit bg-cyan-600/30 text-cyan-100">
                  Step {index + 1}
                </Badge>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Globe className="h-5 w-5 text-cyan-300" />
                  {stage.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <CardDescription className="text-gray-300 text-sm leading-relaxed">
                  {stage.description}
                </CardDescription>
                <p className="text-cyan-200 text-sm bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                  {stage.highlight}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="modules" className="space-y-6">
        <div className="flex items-center gap-3">
          <Compass className="h-6 w-6 text-cyan-300" />
          <h3 className="text-2xl font-semibold text-white">
            Experience modules
          </h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {experienceModules.map((module) => (
            <Card
              key={module.name}
              className="bg-slate-900/60 border-slate-700"
            >
              <CardHeader>
                <CardTitle className="text-white text-base flex items-center justify-between">
                  {module.name}
                  <Badge
                    variant="outline"
                    className="text-xs text-cyan-200 border-cyan-500/40"
                  >
                    Platform
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-gray-300 text-sm">
                  {module.description}
                </CardDescription>
                <Button
                  asChild
                  variant="ghost"
                  className="justify-start text-cyan-200 hover:text-cyan-100 hover:bg-cyan-500/10"
                >
                  <Link to={module.href}>
                    Learn more
                    <LinkIcon className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="analytics" className="space-y-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-cyan-300" />
          <h3 className="text-2xl font-semibold text-white">
            Insights & analytics
          </h3>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {analyticsHighlights.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.title}
                className="bg-slate-900/60 border-slate-700"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Icon className="h-6 w-6 text-cyan-300" />
                    <CardTitle className="text-white text-lg">
                      {item.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-sm">
                    {item.detail}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section id="governance" className="space-y-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-cyan-300" />
          <h3 className="text-2xl font-semibold text-white">
            Governance checklist
          </h3>
        </div>
        <Card className="bg-slate-900/60 border-slate-700">
          <CardContent>
            <ul className="list-disc space-y-3 pl-6 text-gray-300 text-sm">
              {governanceChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Architecture */}
      <section id="architecture" className="space-y-6">
        <div className="flex items-center gap-3">
          <Globe className="h-6 w-6 text-cyan-300" />
          <h3 className="text-2xl font-semibold text-white">
            Architecture overview
          </h3>
        </div>
        <Card className="bg-slate-900/60 border-slate-700">
          <CardContent>
            <p className="text-gray-300 text-sm leading-relaxed">
              AeThex is composed of a lightweight React + Vite frontend, a
              Node.js backend that exposes API endpoints (under{" "}
              <code>/api/*</code>), and a Supabase-backed PostgreSQL database.
              The system integrates several services:
            </p>
            <ul className="list-disc pl-6 mt-3 text-gray-300 text-sm space-y-2">
              <li>
                <strong>Frontend:</strong> React + TypeScript, Docs and Internal
                hubs use a separate layout and access control.
              </li>
              <li>
                <strong>Backend:</strong> Node/Express handlers for public APIs,
                Discord webhooks, and OAuth flows.
              </li>
              <li>
                <strong>Database:</strong> Supabase (Postgres) stores user
                profiles, creator data, and operational tables. Migrations live
                under <code>code/supabase/migrations</code>.
              </li>
              <li>
                <strong>Integrations:</strong> OAuth providers (Google, GitHub,
                Discord, Roblox), Discord bot for role mapping & verification,
                and optional Web3 wallet linking.
              </li>
              <li>
                <strong>Docs & CMS:</strong> Public docs are rendered with
                DocsLayout and editable in Builder CMS (MCP). Internal docs live
                under <code>/internal-docs</code> and require authentication.
              </li>
            </ul>
            <p className="mt-3 text-gray-300 text-sm">
              This arrangement lets staff operate private operational processes
              while exposing curated platform docs publicly.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Troubleshooting */}
      <section id="troubleshooting" className="space-y-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-cyan-300" />
          <h3 className="text-2xl font-semibold text-white">
            Common troubleshooting
          </h3>
        </div>
        <Card className="bg-slate-900/60 border-slate-700">
          <CardContent>
            <h4 className="text-white font-semibold mb-2">
              OAuth redirect issues
            </h4>
            <p className="text-gray-300 text-sm">
              If an OAuth provider returns an <code>invalid_redirect_uri</code>{" "}
              error, verify that the callback URL configured in the provider
              matches the deployed app's API base (e.g.{" "}
              <code>https://aethex.dev/api/discord/oauth/callback</code> for
              Discord). For local development use the configured VITE_API_BASE
              when available.
            </p>
            <h4 className="text-white font-semibold mt-4 mb-2">
              Session/linking problems
            </h4>
            <p className="text-gray-300 text-sm">
              If a linking flow (e.g. linking Discord) redirects to login or
              loses session, check cookie SameSite settings and ensure the
              redirect URI domain matches where cookies are set. Staff can
              consult internal docs under <code>/internal-docs/onboarding</code>{" "}
              for detailed diagnostic steps.
            </p>
            <h4 className="text-white font-semibold mt-4 mb-2">
              Missing emails
            </h4>
            <p className="text-gray-300 text-sm">
              Verification and notification emails are sent from{" "}
              <code>support@aethex.tech</code>. If emails are not arriving,
              check spam filters and outbound SMTP logs (Hostinger) for delivery
              failures.
            </p>
          </CardContent>
        </Card>
      </section>

      <section
        id="next-steps"
        className="rounded-2xl border border-cyan-500/40 bg-cyan-900/20 p-8"
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-white">
              Keep exploring the platform
            </h3>
            <p className="text-gray-300 max-w-2xl text-sm">
              Share this page with non-technical teammates. It links out to
              every major surface area so marketing, product, and operations
              groups can navigate confidently.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {resourceLinks.map((resource) => (
              <Button
                key={resource.title}
                asChild
                size="lg"
                className="bg-cyan-600 hover:bg-cyan-500 text-white"
              >
                <Link to={resource.href}>
                  {resource.label}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
