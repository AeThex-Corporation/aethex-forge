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
  ExternalLink,
  Flag,
  ListChecks,
  Rocket,
  Sparkles,
  Target,
} from "lucide-react";

const linearProjectUrl =
  "https://linear.app/duo-simulators/project/aethex-roadmap-8600b796e8ad";

const phases: {
  title: string;
  timeframe: string;
  items: string[];
  icon: any;
}[] = [
  {
    title: "Access & IA",
    timeframe: "Now — 0–2 weeks",
    icon: Target,
    items: [
      "Finalize realm gating across routes (RequireAccess + redirects)",
      "Unify navigation and top-level IA labels",
      "Admin: mentorship request status/actions and metrics",
      "Community IA cleanup incl. Featured Studios curation",
    ],
  },
  {
    title: "Community & Content",
    timeframe: "Month 1",
    icon: Sparkles,
    items: [
      "Mentor directory polish: filters, profiles, expertise tags",
      "Featured Studios: persistent API + management tools",
      "Blog: editor improvements, SEO (meta/OG), list pages",
      "UI tokens/style unification across pages",
    ],
  },
  {
    title: "Growth & Ops",
    timeframe: "Month 2",
    icon: Rocket,
    items: [
      "Opportunities tooling: applicant review, statuses, filters",
      "Engage/pricing funnels: plans and conversion tracking",
      "Observability & Sentry integration; surface Status metrics",
      "Production deploy pipeline (Vercel)",
    ],
  },
  {
    title: "Collaboration & Shipping",
    timeframe: "Month 3",
    icon: Flag,
    items: [
      "Teams & projects enhancements; notifications",
      "Advanced mentoring flows: availability, pricing, scheduling",
      "Public roadmap page linking to Linear; changelog integration",
    ],
  },
];

export default function AdminRoadmap() {
  return (
    <div className="space-y-6">
      <Card className="bg-card/60 border-border/40 backdrop-blur">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-aethex-300" />
            <CardTitle>Roadmap</CardTitle>
          </div>
          <CardDescription>
            High-level delivery plan. Track status in Linear or refine here.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className="border-emerald-500/40 text-emerald-300"
          >
            All systems focused
          </Badge>
          <Button asChild size="sm">
            <a
              href={linearProjectUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              Open Linear project <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {phases.map((p) => {
          const Icon = p.icon;
          return (
            <Card
              key={p.title}
              className="bg-card/60 border-border/40 backdrop-blur"
            >
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-aethex-300" />
                  <CardTitle>{p.title}</CardTitle>
                </div>
                <CardDescription>{p.timeframe}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {p.items.map((it) => (
                    <li key={it} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-aethex-300" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
