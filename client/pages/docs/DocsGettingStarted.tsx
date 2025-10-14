import { Link } from "react-router-dom";
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
  CheckCircle2,
  ArrowRight,
  PlugZap,
  Download,
  Rocket,
  Shield,
  Layers,
  Code,
} from "lucide-react";

const docCategories = [
  {
    title: "Getting Started",
    description: "Quick start guides and tutorials for beginners",
    docs: 12,
    sections: ["Installation", "First Steps", "Basic Concepts", "Hello World"],
    color: "from-green-500 to-emerald-600",
  },
  {
    title: "API Reference",
    description: "Complete API documentation with examples",
    docs: 45,
    sections: ["Authentication", "Endpoints", "SDKs", "Rate Limits"],
    color: "from-blue-500 to-cyan-600",
  },
  {
    title: "Tutorials",
    description: "Step-by-step guides for common use cases",
    docs: 28,
    sections: ["Game Development", "Web Apps", "Mobile Apps", "AI Integration"],
    color: "from-purple-500 to-indigo-600",
  },
  {
    title: "CLI Tools",
    description: "Command-line interface documentation",
    docs: 15,
    sections: ["Installation", "Commands", "Configuration", "Scripts"],
    color: "from-orange-500 to-red-600",
  },
];

const prerequisites = [
  {
    title: "AeThex Account",
    description:
      "You will need an active AeThex account to access the dashboard, API console, and deployment tools.",
    actionLabel: "Create account",
    actionHref: "/get-started",
  },
  {
    title: "Node.js 18+ & npm",
    description:
      "The AeThex CLI relies on modern Node runtimes. Verify your local toolchain before continuing.",
    actionLabel: "Verify environment",
    actionHref: "https://nodejs.org/en/download",
  },
  {
    title: "Project Workspace",
    description:
      "Choose an empty directory for your new AeThex project or clone an existing team template.",
    actionLabel: "Browse templates",
    actionHref: "/projects/new",
  },
];

const setupSteps = [
  {
    title: "Install the CLI",
    description:
      "The CLI bootstraps local projects, provisions cloud environments, and manages deployments.",
    command: "npm install -g aethex",
  },
  {
    title: "Authenticate",
    description:
      "Log in with your AeThex credentials or paste a personal access token from the dashboard.",
    command: "aethex login",
  },
  {
    title: "Initialize a Project",
    description:
      "Scaffold configuration, environment files, and example services for your team.",
    command: "aethex init studio-hub",
  },
  {
    title: "Start the Dev Server",
    description:
      "Run the local environment with hot reloading, mocked services, and seeded sample data.",
    command: "npm run dev",
  },
];

const deploymentChecklist = [
  {
    title: "Configure Environments",
    description:
      "Define staging and production targets, secrets, and automated health probes in aethex.config.ts.",
  },
  {
    title: "Provision Resources",
    description:
      "Use `aethex deploy --preview` to create sandbox infrastructure before promoting to production.",
  },
  {
    title: "Enable Safeguards",
    description:
      "Turn on role-based access controls, audit logging, and automated rollbacks from the dashboard.",
  },
];

const explorationLinks = [
  {
    title: "Platform Walkthrough",
    description: "Tour the dashboard, notification center, and collaboration features.",
    href: "/dashboard",
  },
  {
    title: "API Reference",
    description: "Review authentication flows, REST endpoints, and webhook schemas.",
    href: "/docs/api",
  },
  {
    title: "Tutorial Library",
    description: "Follow guided builds for matchmaking services, player analytics, and live events.",
    href: "/docs/tutorials",
  },
  {
    title: "Community Support",
    description: "Ask questions, share templates, and pair up with mentors in the public forums.",
    href: "/community",
  },
  {
    title: "Integrations Playbook",
    description: "Review the HelloSkip embed and extend it to other partners.",
    href: "/docs/integrations",
  },
];

export default function DocsGettingStarted() {
  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <Badge className="bg-purple-600/20 text-purple-200 uppercase tracking-wide">
          <Rocket className="mr-2 h-3 w-3" />
          Getting Started
        </Badge>
        <h2 className="text-3xl font-semibold text-white">
          Launch your first AeThex project in under 30 minutes
        </h2>
        <p className="text-gray-300 max-w-3xl">
          This guide walks through the minimum setup required to ship a production-ready AeThex application.
          Complete the prerequisites, initialize a workspace with the CLI, and review the deployment checklist
          before inviting collaborators.
        </p>
      </section>

      <section id="categories" className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-semibold text-white">Documentation categories</h3>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm">
            Jump into the area you need most. Each category below is mirrored in Builder CMS for collaborative
            editing.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {docCategories.map((category) => (
            <Card key={category.title} className="border-border/50 hover:border-aethex-400/40 transition-all">
              <CardHeader>
                <div
                  className={`inline-flex rounded-lg bg-gradient-to-r ${category.color} px-3 py-1 text-xs uppercase tracking-wider text-white`}
                >
                  {category.docs} docs
                </div>
                <CardTitle className="text-xl text-white mt-3">{category.title}</CardTitle>
                <CardDescription className="text-gray-300">
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                  {category.sections.map((section) => (
                    <li key={section} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-aethex-400" />
                      {section}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="prerequisites" className="grid gap-6 lg:grid-cols-3">
        {prerequisites.map((item) => (
          <Card key={item.title} className="bg-slate-900/60 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-purple-400" />
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-gray-300">
                {item.description}
              </CardDescription>
              <Button asChild variant="outline" className="justify-start">
                <Link to={item.actionHref} target={item.actionHref.startsWith("http") ? "_blank" : undefined}>
                  <ArrowRight className="mr-2 h-4 w-4" />
                  {item.actionLabel}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      <section id="setup-workflow" className="space-y-6">
        <div className="flex items-center gap-3">
          <PlugZap className="h-6 w-6 text-purple-400" />
          <h3 className="text-2xl font-semibold text-white">Setup workflow</h3>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {setupSteps.map((step, index) => (
            <Card key={step.title} className="bg-slate-900/60 border-slate-700">
              <CardHeader className="space-y-1">
                <Badge variant="outline" className="w-fit">
                  Step {index + 1}
                </Badge>
                <CardTitle className="text-white text-lg">{step.title}</CardTitle>
                <CardDescription className="text-gray-300">
                  {step.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="rounded-lg border border-slate-700 bg-slate-950/60 p-4 text-sm text-purple-200">
                  <code>{step.command}</code>
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="deployment-checklist" className="grid gap-6 lg:grid-cols-3">
        {deploymentChecklist.map((item) => (
          <Card key={item.title} className="bg-slate-900/60 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white text-lg">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm leading-relaxed">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section id="next-steps" className="space-y-4">
        <div className="flex items-center gap-3">
          <Layers className="h-6 w-6 text-purple-400" />
          <h3 className="text-2xl font-semibold text-white">Next steps</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {explorationLinks.map((link) => (
            <Card key={link.title} className="bg-slate-900/60 border-slate-700 hover:border-purple-500/40 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white text-base">
                  {link.title}
                  <ArrowRight className="h-4 w-4 text-purple-300" />
                </CardTitle>
                <CardDescription className="text-gray-300 text-sm">
                  {link.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start text-purple-300 hover:text-purple-200"
                >
                  <Link to={link.href}>
                    Explore
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="deploy" className="rounded-2xl border border-purple-500/40 bg-purple-900/20 p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-white">
              Ready to automate your first deployment?
            </h3>
            <p className="text-gray-300 max-w-2xl">
              Run <code className="rounded bg-black/40 px-2 py-1 text-purple-200">aethex deploy</code> once you have
              verified environment variables, migrations, and smoke tests. Ship changes with confidence knowing
              guardrails are enabled by default.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-500">
              <Link to="/docs/cli">
                <Download className="mr-2 h-5 w-5" />
                Review CLI commands
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-purple-400/60 text-purple-200">
              <Link to="/support">
                <Code className="mr-2 h-5 w-5" />
                Talk to an engineer
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
