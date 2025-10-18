import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Database,
  Globe,
  Layers,
  Network,
  Route,
  ServerCog,
  ShieldCheck,
  Spline,
  Users,
  Workflow,
} from "lucide-react";

type Node = {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  subtitle?: string;
  group: "entry" | "frontend" | "services" | "backend" | "infra";
};

const NODES: Node[] = [
  // Entry/realms
  {
    id: "realms",
    label: "Realms",
    subtitle: "GD / Consulting / Community / Get Started",
    icon: Workflow,
    group: "entry",
  },
  {
    id: "onboarding",
    label: "Onboarding",
    subtitle: "Profile • Interests • Path",
    icon: Users,
    group: "entry",
  },

  // Frontend app
  {
    id: "dashboard",
    label: "Dashboard",
    subtitle: "Realm‑aware UI",
    icon: Globe,
    group: "frontend",
  },
  {
    id: "routes",
    label: "Routes",
    subtitle: "/feed • /status • /teams • /docs",
    icon: Route,
    group: "frontend",
  },

  // Product services (frontend+api)
  {
    id: "feed",
    label: "Social Feed",
    subtitle: "Posts • Likes • Comments • Tags",
    icon: Layers,
    group: "services",
  },
  {
    id: "mentorship",
    label: "Mentorship",
    subtitle: "Requests • Mentors • Moderation",
    icon: Users,
    group: "services",
  },
  {
    id: "status",
    label: "Status",
    subtitle: "Live health from /api/status",
    icon: ShieldCheck,
    group: "services",
  },
  {
    id: "investors",
    label: "Investors",
    subtitle: "Interest • Client realm",
    icon: Network,
    group: "services",
  },

  // Backend
  {
    id: "api",
    label: "API",
    subtitle: "Node/Express server routes",
    icon: ServerCog,
    group: "backend",
  },
  {
    id: "db",
    label: "Supabase",
    subtitle: "Auth • Profiles • Content • Migrations",
    icon: Database,
    group: "backend",
  },

  // Infra
  {
    id: "hosting",
    label: "Hosting/CDN",
    subtitle: "Vercel/Netlify + Edge",
    icon: Spline,
    group: "infra",
  },
];

// Directed edges between nodes
const EDGES: Array<[string, string, string]> = [
  ["realms", "dashboard", "realm -> UI personalization"],
  ["onboarding", "dashboard", "profile bootstraps"],
  ["dashboard", "routes", "primary navigation"],

  ["routes", "feed", "component mounts"],
  ["routes", "mentorship", "community flow"],
  ["routes", "status", "observability"],
  ["routes", "investors", "IR page"],

  ["feed", "api", "CRUD, reactions"],
  ["mentorship", "api", "requests, listings"],
  ["status", "api", "/api/status"],
  ["investors", "api", "POST /api/investors/interest"],

  ["api", "db", "RLS, SQL, RPC"],
  ["api", "hosting", "deploy, logs"],
];

const groupStyles: Record<Node["group"], string> = {
  entry: "from-emerald-900/40 to-emerald-700/20 border-emerald-500/30",
  frontend: "from-indigo-900/40 to-indigo-700/20 border-indigo-500/30",
  services: "from-fuchsia-900/40 to-fuchsia-700/20 border-fuchsia-500/30",
  backend: "from-sky-900/40 to-sky-700/20 border-sky-500/30",
  infra: "from-amber-900/40 to-amber-700/20 border-amber-500/30",
};

function NodeCard({ node }: { node: Node }) {
  const Icon = node.icon ?? Globe;
  return (
    <div
      className={cn(
        "rounded-xl border p-3 text-sm shadow-sm",
        "bg-gradient-to-br",
        groupStyles[node.group],
      )}
    >
      <div className="flex items-center gap-2">
        <div className="rounded-lg bg-black/30 p-1.5">
          <Icon className="h-4 w-4 text-white/90" />
        </div>
        <div>
          <div className="font-medium text-white/90">{node.label}</div>
          {node.subtitle && (
            <div className="text-[11px] text-white/60">{node.subtitle}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminSystemMap() {
  return (
    <Card className="bg-card/60 border-border/40 backdrop-blur">
      <CardHeader>
        <CardTitle>System map</CardTitle>
        <CardDescription>
          High‑level architecture and primary flows
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {/* Row: entry */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {NODES.filter((n) => n.group === "entry").map((n) => (
              <NodeCard key={n.id} node={n} />
            ))}
          </div>

          {/* Row: frontend */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {NODES.filter((n) => n.group === "frontend").map((n) => (
              <NodeCard key={n.id} node={n} />
            ))}
          </div>

          {/* Row: services */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {NODES.filter((n) => n.group === "services").map((n) => (
              <NodeCard key={n.id} node={n} />
            ))}
          </div>

          {/* Row: backend + infra */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {NODES.filter((n) => n.group === "backend").map((n) => (
              <NodeCard key={n.id} node={n} />
            ))}
            {NODES.filter((n) => n.group === "infra").map((n) => (
              <NodeCard key={n.id} node={n} />
            ))}
          </div>

          {/* Legend */}
          <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
            <Badge
              variant="outline"
              className="border-emerald-500/30 text-emerald-200"
            >
              Entry
            </Badge>
            <Badge
              variant="outline"
              className="border-indigo-500/30 text-indigo-200"
            >
              Frontend
            </Badge>
            <Badge
              variant="outline"
              className="border-fuchsia-500/30 text-fuchsia-200"
            >
              Services
            </Badge>
            <Badge variant="outline" className="border-sky-500/30 text-sky-200">
              Backend
            </Badge>
            <Badge
              variant="outline"
              className="border-amber-500/30 text-amber-200"
            >
              Infra
            </Badge>
          </div>

          {/* Edges list (readable relationships) */}
          <div className="mt-4 rounded-xl border border-border/40 bg-background/40 p-3">
            <div className="text-xs font-medium text-foreground mb-2">
              Flows
            </div>
            <ul className="grid gap-1 text-xs text-muted-foreground sm:grid-cols-2 lg:grid-cols-3">
              {EDGES.map(([from, to, note]) => (
                <li key={`${from}-${to}`}>
                  <span className="text-foreground/80">{from}</span>
                  <span className="mx-1 opacity-60">→</span>
                  <span className="text-foreground/80">{to}</span>
                  <span className="opacity-60"> — {note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
