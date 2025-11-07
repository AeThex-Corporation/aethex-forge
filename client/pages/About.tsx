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

          {/* Vision */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5" /> Vision
              </CardTitle>
              <CardDescription>
                A builder-first network that turns ideas into shipping products
                faster.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  We’re unifying services, platform, and community into a single
                  operating layer for creators and teams. Profiles,
                  collaboration, mentorship, and delivery run as one system—so
                  momentum compounds.
                </p>
                <p>
                  The long game: a trusted ecosystem where reputation, assets,
                  and learning follow you across projects.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "Quality over hype",
                  "Open + composable",
                  "Measure outcomes",
                  "Own your data",
                ].map((t) => (
                  <div
                    key={t}
                    className="rounded-lg border border-border/50 p-3 text-sm"
                  >
                    {t}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ecosystem Diagram */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" /> The AeThex Ecosystem
              </CardTitle>
              <CardDescription>
                Five specialized arms united by a shared mission to empower creators
                and builders.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-5 gap-4 mb-8">
                {[
                  {
                    name: "Labs",
                    color: "from-yellow-500 to-yellow-600",
                    bgColor: "bg-yellow-500/10",
                    borderColor: "border-yellow-400/30",
                    desc: "Research & Innovation",
                    link: "/labs",
                  },
                  {
                    name: "GameForge",
                    color: "from-green-500 to-green-600",
                    bgColor: "bg-green-500/10",
                    borderColor: "border-green-400/30",
                    desc: "Game Development",
                    link: "/game-development",
                  },
                  {
                    name: "Corp",
                    color: "from-blue-500 to-blue-600",
                    bgColor: "bg-blue-500/10",
                    borderColor: "border-blue-400/30",
                    desc: "Enterprise Solutions",
                    link: "/consulting",
                  },
                  {
                    name: "Foundation",
                    color: "from-red-500 to-red-600",
                    bgColor: "bg-red-500/10",
                    borderColor: "border-red-400/30",
                    desc: "Open Source & Education",
                    link: "/community",
                  },
                  {
                    name: "Dev-Link",
                    color: "from-cyan-500 to-cyan-600",
                    bgColor: "bg-cyan-500/10",
                    borderColor: "border-cyan-400/30",
                    desc: "Developer Network",
                    link: "/dev-link",
                  },
                ].map((arm) => (
                  <a
                    key={arm.name}
                    href={arm.link}
                    className={`rounded-lg border ${arm.borderColor} ${arm.bgColor} p-4 hover:border-opacity-60 transition cursor-pointer`}
                  >
                    <div
                      className={`h-12 w-full rounded mb-3 bg-gradient-to-r ${arm.color} opacity-20`}
                    />
                    <div className="font-semibold text-sm">{arm.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {arm.desc}
                    </div>
                  </a>
                ))}
              </div>

              <div className="rounded-lg border border-border/50 bg-gradient-to-b from-aethex-500/5 to-transparent p-6">
                <h3 className="font-semibold mb-3 text-sm">How They Connect</h3>
                <div className="grid sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <span className="text-aethex-400 font-bold">→</span>
                    <span>
                      <strong>Labs</strong> pioneers new tools and methods that
                      others can adopt
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-aethex-400 font-bold">→</span>
                    <span>
                      <strong>GameForge</strong> ships reliable products using Lab
                      innovations
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-aethex-400 font-bold">→</span>
                    <span>
                      <strong>Corp</strong> brings enterprise-grade solutions to
                      market
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-aethex-400 font-bold">→</span>
                    <span>
                      <strong>Foundation</strong> open-sources knowledge and
                      tools for the community
                    </span>
                  </div>
                  <div className="flex items-start gap-2 sm:col-span-2">
                    <span className="text-aethex-400 font-bold">→</span>
                    <span>
                      <strong>Dev-Link</strong> connects all creators in one
                      professional network
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Platform Overview */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5" /> Platform Overview
              </CardTitle>
              <CardDescription>
                What’s live today and what’s rolling out next.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Community Hub",
                  desc: "Profiles, feed, follows, reactions, and spotlights.",
                  href: "/community",
                },
                {
                  title: "Mentorship Network",
                  desc: "Directory, mentor profiles, and request workflow.",
                  href: "/community/mentorship",
                },
                {
                  title: "Developer Passport",
                  desc: "Unified identity with achievements and portfolio.",
                  href: "/passport/me",
                },
                {
                  title: "Admin Console",
                  desc: "Members, mentorship, content, and ops controls.",
                  href: "/admin",
                },
                {
                  title: "Roadmap & Dev Drops",
                  desc: "Public roadmap, voting, and feature showcases.",
                  href: "/roadmap",
                },
                {
                  title: "Studios & Opportunities",
                  desc: "Featured studios, hiring signals, and bounties.",
                  href: "/opportunities",
                },
                {
                  title: "Docs & Curriculum",
                  desc: "Guides, examples, and integrations for builders.",
                  href: "/docs",
                },
                {
                  title: "Investors Portal",
                  desc: "Overview, thesis, and secure outreach.",
                  href: "/investors",
                },
                {
                  title: "Realms & Access",
                  desc: "Role-based access across client, community, staff.",
                  href: "/realms",
                },
              ].map((f) => (
                <a
                  key={f.title}
                  href={f.href}
                  className="block rounded-lg border border-border/50 p-4 hover:border-aethex-400/50 transition"
                >
                  <div className="font-semibold">{f.title}</div>
                  <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
                </a>
              ))}
            </CardContent>
          </Card>

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
                  year: "2015",
                  title: "Community hub v1",
                  desc: "Forums, showcases, and lightweight collaboration features.",
                },
                {
                  year: "2019",
                  title: "Realtime systems",
                  desc: "Live updates, notifications, and multiplayer primitives.",
                },
                {
                  year: "2023",
                  title: "Creator network",
                  desc: "Dashboard foundations and social graph refresh.",
                },
                {
                  year: "2024 Q4",
                  title: "Mentorship launch",
                  desc: "Public mentor directory, profiles, and request flow.",
                },
                {
                  year: "2025 Q1",
                  title: "Realms + Admin",
                  desc: "Role-based access and consolidated admin console.",
                },
                {
                  year: "2025 Q2",
                  title: "Roadmap + Dev Drops",
                  desc: "Public roadmap with voting and feature spotlights.",
                },
                {
                  year: "2025 Q3",
                  title: "Investors portal",
                  desc: "Thesis, traction, and secure outreach channel.",
                },
              ].map((item) => (
                <div key={item.year} className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-aethex-400 mt-2" />
                  <div>
                    <div className="font-medium">
                      {item.year} • {item.title}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.desc}
                    </div>
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
