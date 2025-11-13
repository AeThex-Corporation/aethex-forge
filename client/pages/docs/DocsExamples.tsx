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
  Blocks,
  Flame,
  Share2,
  ArrowRight,
  Github,
  Code2,
  Globe,
} from "lucide-react";

const exampleSnippets = [
  {
    title: "Server-side matchmaking",
    description:
      "Quickly assemble a matchmaking service that uses AeThex queues, weighting rules, and player telemetry streams.",
    language: "TypeScript",
    href: "https://github.com/aethex/examples/tree/main/matchmaking-service",
    code: `import { createQueue, matchPlayers } from "@aethex/matchmaking";

const queue = await createQueue({
  region: "us-central",
  size: 4,
  constraints: [
    { field: "skillRating", tolerance: 120 },
    { field: "latency", max: 90 },
  ],
});

export async function enqueuePlayer(player) {
  await queue.enqueue(player.id, {
    skillRating: player.mmr,
    latency: player.ping,
  });

  const match = await matchPlayers(queue);
  if (match) {
    await queue.lock(match.id);
    return match;
  }

  return null;
}`,
  },
  {
    title: "Realtime activity overlays",
    description:
      "Broadcast live deployment and incident updates to your in-game HUD or operations dashboard using AeThex events.",
    language: "React",
    href: "https://github.com/aethex/examples/tree/main/realtime-overlay",
    code: `import { useEffect, useState } from "react";
import { subscribe } from "@aethex/events";

export function ActivityOverlay() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribe("deployment.*", (event) => {
      setEvents((current) => [event, ...current].slice(0, 5));
    });

    return () => unsubscribe();
  }, []);

  return (
    <aside className="rounded-xl border border-purple-500/40 bg-black/60 p-4">
      <h3 className="text-sm font-semibold text-purple-200">Live activity</h3>
      <ul className="mt-3 space-y-2 text-xs text-gray-200">
        {events.map((evt) => (
          <li key={evt.id} className="rounded border border-purple-500/20 bg-purple-900/20 p-2">
            <span className="font-mono text-purple-300">{evt.type}</span>
            <span className="ml-2 text-gray-400">{evt.payload.summary}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}`,
  },
  {
    title: "Workshop automation",
    description:
      "Automate the packaging and publishing of custom workshop content across AeThex environments using the CLI.",
    language: "Shell",
    href: "https://github.com/aethex/examples/tree/main/workshop-automation",
    code: `#!/usr/bin/env bash
set -euo pipefail

WORKSPACE=\${1:-"mods"}

npm install
aethex login --token "$AETHEX_TOKEN"

aethex workshop package "$WORKSPACE" --out dist/
aethex deploy --environment production --artifact dist/workshop.tgz

echo "Workshop build published"`,
  },
];

const integrationIdeas = [
  {
    title: "Commerce hooks",
    description:
      "Sync AeThex purchase events into your billing or CRM system using the webhook relay template.",
    link: "/docs/api",
  },
  {
    title: "Live operations dashboard",
    description:
      "Combine project metrics, incident response playbooks, and player sentiment into a single React dashboard.",
    link: "/docs/tutorials",
  },
  {
    title: "Cross-platform presence",
    description:
      "Mirror AeThex voice and party status with your Discord or Slack community using the presence bridge sample.",
    link: "/community",
  },
  {
    title: "Analytics pipeline",
    description:
      "Export gameplay events to your data warehouse with the managed streaming connectors.",
    link: "/docs/getting-started",
  },
];

export default function DocsExamples() {
  return (
    <div className="space-y-12">
      <section id="overview" className="space-y-4">
        <Badge className="bg-emerald-500/20 text-emerald-100 uppercase tracking-wide">
          <Blocks className="mr-2 h-3 w-3" />
          Examples & Templates
        </Badge>
        <h2 className="text-3xl font-semibold text-white">
          Production-ready patterns you can copy
        </h2>
        <p className="text-gray-300 max-w-3xl">
          Explore curated examples covering backend services, realtime overlays,
          automation scripts, and workflow integrations. Each project includes
          detailed READMEs, infrastructure diagrams, and deployment runbooks.
        </p>
      </section>

      <section id="code-gallery" className="grid gap-6 lg:grid-cols-3">
        {exampleSnippets.map((snippet) => (
          <Card
            key={snippet.title}
            className="bg-slate-900/60 border-slate-700"
          >
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">
                  {snippet.title}
                </CardTitle>
                <Badge variant="outline">{snippet.language}</Badge>
              </div>
              <CardDescription className="text-gray-300 text-sm">
                {snippet.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <pre className="rounded-lg border border-slate-700 bg-slate-950/60 p-4 text-xs text-emerald-200 overflow-x-auto">
                <code>{snippet.code}</code>
              </pre>
              <Button
                asChild
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black"
              >
                <Link to={snippet.href} target="_blank" rel="noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  Open repository
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      <section id="templates" className="space-y-4">
        <div className="flex items-center gap-3">
          <Flame className="h-6 w-6 text-emerald-300" />
          <h3 className="text-2xl font-semibold text-white">
            Deploy faster with templates
          </h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {integrationIdeas.map((idea) => (
            <Card key={idea.title} className="bg-slate-900/60 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-base">
                  {idea.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-sm mb-4">
                  {idea.description}
                </CardDescription>
                <Button
                  asChild
                  variant="ghost"
                  className="text-emerald-300 hover:text-emerald-200 justify-start"
                >
                  <Link to={idea.link}>
                    Continue learning
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section
        id="share"
        className="rounded-2xl border border-emerald-500/40 bg-emerald-900/20 p-8"
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-white">
              Share what you build
            </h3>
            <p className="text-gray-200 max-w-2xl text-sm">
              Publish your own templates or improvements by opening a pull
              request to the public AeThex examples repository. Every accepted
              contribution is highlighted in the monthly creator spotlight.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              asChild
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-400 text-black"
            >
              <Link to="https://github.com/aethex/examples" target="_blank">
                <Code2 className="mr-2 h-5 w-5" />
                Contribute on GitHub
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-emerald-300/60 text-emerald-100"
            >
              <Link to="/community">
                <Share2 className="mr-2 h-5 w-5" />
                Showcase to the community
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section
        id="services"
        className="rounded-2xl border border-emerald-500/20 bg-slate-900/80 p-8"
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h4 className="text-xl font-semibold text-white">
              Need a custom integration?
            </h4>
            <p className="text-gray-300 text-sm">
              Our professional services team partners with studios to build
              tailored pipelines, analytics dashboards, and automation workflows
              on top of AeThex.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-emerald-300/60 text-emerald-100"
          >
            <Link to="/corp">
              <Globe className="mr-2 h-5 w-5" />
              Talk to AeThex consultants
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
