import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rocket, Cpu, Users, Shield, Zap, GitBranch } from "lucide-react";

export default function About() {
  const values = [
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Integrity",
      desc: "Transparent processes, honest communication, dependable delivery.",
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Excellence",
      desc: "Relentless attention to quality, performance, and user experience.",
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Partnership",
      desc: "We win with our customers, not at their expense.",
    },
  ];

  const capabilities = [
    {
      title: "Product Engineering",
      points: [
        "Web & Mobile Apps",
        "Realtime & AI Systems",
        "3D & Game Experiences",
      ],
    },
    {
      title: "Platform & Infra",
      points: [
        "Cloud-native Architecture",
        "DevOps & Observability",
        "Security & Compliance",
      ],
    },
    {
      title: "Advisory & Enablement",
      points: [
        "Technical Strategy",
        "Codebase Modernization",
        "Team Upskilling",
      ],
    },
  ];

  const milestones = [
    { kpi: "99.9%", label: "Uptime targets" },
    { kpi: "10x", label: "Perf improvements" },
    { kpi: "50+", label: "Projects shipped" },
    { kpi: "<30d", label: "MVP timelines" },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient py-12">
        <div className="container mx-auto px-4 max-w-6xl space-y-10">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-gradient-purple">
                About AeThex
              </h1>
              <p className="text-muted-foreground text-lg">
                AeThex is a community-driven platform for builders, game
                developers, and clients to create together. We craft reliable,
                scalable software—shipping fast without compromising quality.
                From prototypes to global platforms, we partner end-to-end:
                strategy, design, engineering, and growth.
              </p>
              <div className="mt-2 p-3 rounded-lg border border-aethex-500/30 bg-aethex-500/10 text-sm text-aethex-200">
                What this site is about: a social, collaborative hub to share
                work, post updates, discover projects, and level up through
                mentorship, open-source, and real-time community features.
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">TypeScript</Badge>
                <Badge variant="outline">React</Badge>
                <Badge variant="outline">Node</Badge>
                <Badge variant="outline">Supabase</Badge>
                <Badge variant="outline">Edge</Badge>
              </div>
              <div className="flex gap-3 pt-2">
                <Button asChild>
                  <a href="/community">Join the community</a>
                </Button>
                <Button asChild variant="outline">
                  <a href="/feed">Explore the feed</a>
                </Button>
              </div>
            </div>
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5" /> Mission
                </CardTitle>
                <CardDescription>
                  Turn bold ideas into useful, loved software.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                {capabilities.map((c) => (
                  <div key={c.title}>
                    <div className="font-medium mb-1">{c.title}</div>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                      {c.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {milestones.map((m) => (
              <Card
                key={m.label}
                className="bg-card/50 border-border/50 text-center"
              >
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-gradient">
                    {m.kpi}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {m.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5" /> Our Approach
              </CardTitle>
              <CardDescription>
                Opinionated engineering, measurable outcomes.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-6">
              {values.map((v) => (
                <div
                  key={v.title}
                  className="p-4 rounded-lg border border-border/50"
                >
                  <div className="flex items-center gap-2 font-semibold">
                    {v.icon}
                    {v.title}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{v.desc}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" /> Timeline
              </CardTitle>
              <CardDescription>
                From humble beginnings to a thriving community (2011 → today).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  year: "2011",
                  title: "First open-source experiments",
                  desc: "Indie tools and game mods shared with small dev circles.",
                },
                {
                  year: "2013",
                  title: "Early indie projects",
                  desc: "Shipped community prototypes; grew a network of collaborators.",
                },
                {
                  year: "2015",
                  title: "Community hub v1",
                  desc: "Forums, showcases, and lightweight collaboration features.",
                },
                {
                  year: "2017",
                  title: "Cloud-native foundations",
                  desc: "Scaled infra, observability, and CI/CD to support growth.",
                },
                {
                  year: "2019",
                  title: "Realtime systems",
                  desc: "Live updates, notifications, and multiplayer primitives.",
                },
                {
                  year: "2021",
                  title: "Open-source toolkit",
                  desc: "Reusable UI, data, and deployment patterns for rapid builds.",
                },
                {
                  year: "2023",
                  title: "Community events",
                  desc: "Mentorship programs, workshops, and collaborative sprints.",
                },
                {
                  year: "2024",
                  title: "Network + Dashboard",
                  desc: "Creator-centric dashboard and social graph foundations.",
                },
                {
                  year: "2025",
                  title: "Realtime feed",
                  desc: "Vertical feed with follows, reactions, and guided onboarding.",
                },
              ].map((item) => (
                <div key={item.year} className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-aethex-400 mt-2" />
                  <div>
                    <div className="font-medium">{item.year} • {item.title}</div>
                    <div className="text-sm text-muted-foreground">{item.desc}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
