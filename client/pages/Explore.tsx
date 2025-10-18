import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Microscope, Sparkles, ArrowRight, Rocket, Layers, Users, BookOpen, Terminal, Shield, Compass } from "lucide-react";
import { useMemo } from "react";

export default function Explore() {
  const achievements = useMemo(
    () => [
      { metric: "10K+", label: "Active Creators" },
      { metric: "500+", label: "Projects Shipped" },
      { metric: "99.99%", label: "Feature Quality" },
      { metric: "24/7", label: "Global Community" },
    ],
    [],
  );

  const serviceOfferings = useMemo(
    () => [
      {
        title: "Game Development",
        description: "Studios and indie support",
        link: "/game-development",
        tags: ["Studios", "Tools"],
        icon: Rocket,
        cardClass:
          "border-blue-500/40 bg-gradient-to-br from-blue-950/60 via-indigo-950/30 to-purple-900/40 text-blue-100 hover:border-blue-400/80 hover:shadow-[0_0_25px_rgba(59,130,246,0.35)]",
        titleClass: "text-blue-100",
        descriptionClass: "text-blue-100/70",
        buttonClass:
          "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-400 hover:via-indigo-400 hover:to-purple-400 text-white shadow-[0_0_18px_rgba(59,130,246,0.25)]",
      },
      {
        title: "Consulting",
        description: "Architecture & delivery",
        link: "/consulting",
        tags: ["Architecture", "Delivery"],
        icon: Layers,
        cardClass:
          "border-fuchsia-500/40 bg-gradient-to-br from-fuchsia-950/60 via-rose-950/30 to-purple-900/40 text-fuchsia-100 hover:border-fuchsia-400/80 hover:shadow-[0_0_25px_rgba(217,70,239,0.35)]",
        titleClass: "text-fuchsia-100",
        descriptionClass: "text-fuchsia-100/70",
        buttonClass:
          "bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500 hover:from-fuchsia-400 hover:via-pink-400 hover:to-rose-400 text-white shadow-[0_0_18px_rgba(236,72,153,0.25)]",
      },
      {
        title: "Mentorship",
        description: "Programs and guidance",
        link: "/mentorship",
        tags: ["Programs", "Guidance"],
        icon: Users,
        cardClass:
          "border-emerald-500/40 bg-gradient-to-br from-emerald-950/60 via-teal-950/30 to-blue-900/40 text-emerald-100 hover:border-emerald-400/80 hover:shadow-[0_0_25px_rgba(16,185,129,0.35)]",
        titleClass: "text-emerald-100",
        descriptionClass: "text-emerald-100/70",
        buttonClass:
          "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-black font-semibold shadow-[0_0_18px_rgba(20,184,166,0.25)]",
      },
    ],
    [],
  );

  const resourceOfferings = useMemo(
    () => [
      {
        title: "Documentation",
        description: "Guides and tutorials",
        tags: ["Guides", "Tutorials"],
        icon: BookOpen,
        cardClass:
          "border-cyan-400/40 bg-gradient-to-br from-cyan-950/50 via-sky-950/25 to-blue-900/30 text-cyan-100 hover:border-cyan-300/70 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]",
        titleClass: "text-cyan-100",
        descriptionClass: "text-cyan-100/70",
        actions: [
          {
            label: "Docs",
            href: "/docs",
            variant: "outline",
            buttonClass:
              "border-cyan-400/60 text-cyan-200 hover:bg-cyan-500/10 hover:text-cyan-100",
          },
          {
            label: "Tutorials",
            href: "/docs/tutorials",
            variant: "outline",
            buttonClass:
              "border-cyan-400/60 text-cyan-200 hover:bg-cyan-500/10 hover:text-cyan-100",
          },
        ],
      },
      {
        title: "Community",
        description: "News and discussions",
        tags: ["Blog", "Hub"],
        icon: Shield,
        cardClass:
          "border-orange-400/40 bg-gradient-to-br from-amber-950/50 via-orange-950/25 to-rose-900/30 text-orange-100 hover:border-orange-300/70 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]",
        titleClass: "text-orange-100",
        descriptionClass: "text-orange-100/70",
        actions: [
          {
            label: "Community",
            href: "/community",
            variant: "outline",
            buttonClass:
              "border-orange-400/60 text-orange-200 hover:bg-orange-500/10 hover:text-orange-100",
          },
          {
            label: "Blog",
            href: "/blog",
            variant: "outline",
            buttonClass:
              "border-orange-400/60 text-orange-200 hover:bg-orange-500/10 hover:text-orange-100",
          },
        ],
      },
      {
        title: "Company",
        description: "About and contact",
        tags: ["About", "Contact"],
        icon: Compass,
        cardClass:
          "border-indigo-400/40 bg-gradient-to-br from-indigo-950/50 via-blue-950/25 to-slate-900/30 text-indigo-100 hover:border-indigo-300/70 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]",
        titleClass: "text-indigo-100",
        descriptionClass: "text-indigo-100/70",
        actions: [
          {
            label: "About",
            href: "/about",
            variant: "outline",
            buttonClass:
              "border-indigo-400/60 text-indigo-200 hover:bg-indigo-500/10 hover:text-indigo-100",
          },
          {
            label: "Contact",
            href: "/contact",
            variant: "outline",
            buttonClass:
              "border-indigo-400/60 text-indigo-200 hover:bg-indigo-500/10 hover:text-indigo-100",
          },
        ],
      },
    ],
    [],
  );

  return (
    <Layout>
      {/* Hero + Sticky Subnav */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-aethex-900/40 via-background to-neon-blue/10" />
        <div className="container mx-auto px-4 relative z-10 py-16 sm:py-20">
          <div className="max-w-6xl mx-auto text-center space-y-6">
            <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight">
              <span className="text-gradient">Explore AeThex</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our impact across the digital landscape
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {[
                { label: "Overview", href: "#overview" },
                { label: "Services", href: "#services" },
                { label: "Labs", href: "#labs" },
                { label: "Resources", href: "#resources" },
                { label: "Technology", href: "#technology" },
              ].map((item) => (
                <a key={item.href} href={item.href} className="px-3 py-1.5 text-sm rounded-full border border-border/50 hover:border-aethex-400/60 hover:text-aethex-300 transition-colors">
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="sticky top-16 z-40 border-t border-b border-border/30 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4">
            <div className="flex gap-4 overflow-x-auto py-3 text-sm">
              {[
                { label: "Overview", href: "#overview" },
                { label: "Services", href: "#services" },
                { label: "Labs", href: "#labs" },
                { label: "Resources", href: "#resources" },
                { label: "Technology", href: "#technology" },
              ].map((item) => (
                <a key={item.href} href={item.href} className="px-3 py-1.5 rounded-lg border border-border/40 hover:border-aethex-400/60 hover:text-aethex-300 transition-colors whitespace-nowrap">
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="overview" className="py-16 sm:py-20 bg-background/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-slide-up">
              <h1 className="text-3xl lg:text-4xl font-bold text-gradient mb-4">
                Explore AeThex
              </h1>
              <p className="text-lg text-muted-foreground">
                Our impact across the digital landscape
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="text-center space-y-4 animate-scale-in hover-lift"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="relative">
                    <div className="text-4xl lg:text-5xl font-bold text-gradient-purple animate-pulse-glow">
                      {achievement.metric}
                    </div>
                    <div className="absolute -inset-2 bg-gradient-to-r from-aethex-400/20 to-neon-blue/20 rounded-lg blur-xl opacity-50" />
                  </div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider">
                    {achievement.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Offerings Overview */}
      <section id="services" className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gradient">
              Everything We Offer
            </h2>
            <p className="text-muted-foreground mt-2">
              Explore services, programs, resources, and community
            </p>

            {/* Quick Links */}
            <div className="mt-6 flex flex-wrap justify-center gap-3 animate-fade-in">
              {[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Feed", href: "/feed" },
                { label: "Passport", href: "/passport/me" },
                { label: "Docs", href: "/docs" },
                { label: "Community", href: "/community" },
              ].map((q, i) => (
                <Button
                  key={q.label}
                  asChild
                  variant="outline"
                  className="border-border/50 hover:border-aethex-400/50"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <Link to={q.href}>{q.label}</Link>
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceOfferings.map((offering, idx) => (
              <Card
                key={offering.title}
                className={`relative overflow-hidden border transition-all duration-500 group hover:-translate-y-1 ${offering.cardClass}`}
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
                <CardHeader className="relative space-y-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className={`text-lg ${offering.titleClass}`}>
                      {offering.title}
                    </CardTitle>
                    {offering.icon && (
                      <div className="w-9 h-9 rounded-md bg-white/10 grid place-items-center">
                        {offering.icon && (
                          // @ts-ignore
                          <offering.icon className="h-4 w-4" />
                        )}
                      </div>
                    )}
                  </div>
                  <CardDescription
                    className={`text-sm ${offering.descriptionClass}`}
                  >
                    {offering.description}
                  </CardDescription>
                  {offering.tags && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {offering.tags.map((t: string) => (
                        <span key={t} className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded border border-white/10 text-white/80">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="relative pt-2">
                  <Button asChild className={`w-full ${offering.buttonClass}`}>
                    <Link to={offering.link}>Learn More</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}

            <Card id="labs" className="relative overflow-hidden border border-yellow-400/40 bg-black/80 text-yellow-100 shadow-[0_0_20px_rgba(250,204,21,0.15)] transition-all duration-500 hover:-translate-y-1 hover:border-yellow-300 group">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
              <CardHeader className="relative space-y-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Microscope className="h-5 w-5 text-yellow-300" />
                  AeThex Labs
                </CardTitle>
                <CardDescription className="text-yellow-100/70">
                  BlackSite R&D portal synced with Labs mainframe
                </CardDescription>
              </CardHeader>
              <CardContent className="relative space-y-3">
                <Button
                  asChild
                  className="w-full bg-yellow-400 text-black hover:bg-yellow-300 shadow-[0_0_18px_rgba(250,204,21,0.25)]"
                >
                  <Link to="/research">Open Interface</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-yellow-400/60 text-yellow-200 hover:bg-yellow-500/10"
                >
                  <a
                    href="https://labs.aethex.biz"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Visit labs.aethex.biz
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {resourceOfferings.map((offering, idx) => (
              <Card
                key={offering.title}
                className={`relative overflow-hidden border transition-all duration-500 group hover:-translate-y-1 ${offering.cardClass}`}
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-35 transition-opacity duration-500" />
                <CardHeader className="relative space-y-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className={`text-lg ${offering.titleClass}`}>
                      {offering.title}
                    </CardTitle>
                    {offering.icon && (
                      <div className="w-9 h-9 rounded-md bg-white/10 grid place-items-center">
                        {offering.icon && (
                          // @ts-ignore
                          <offering.icon className="h-4 w-4" />
                        )}
                      </div>
                    )}
                  </div>
                  <CardDescription
                    className={`text-sm ${offering.descriptionClass}`}
                  >
                    {offering.description}
                  </CardDescription>
                  {offering.tags && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {offering.tags.map((t: string) => (
                        <span key={t} className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded border border-white/10 text-white/80">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="relative">
                  <div className="flex flex-wrap gap-2">
                    {offering.actions.map((action) => (
                      <Button
                        key={action.label}
                        asChild
                        variant={action.variant as any}
                        className={`flex-1 min-w-[120px] ${action.buttonClass}`}
                      >
                        {action.external ? (
                          <a
                            href={action.href}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {action.label}
                          </a>
                        ) : (
                          <Link to={action.href}>{action.label}</Link>
                        )}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Showcase */}
      <section id="technology" className="py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-aethex-900/20 via-transparent to-neon-blue/20" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="animate-slide-up">
              <h2 className="text-3xl lg:text-4xl font-bold text-gradient mb-6">
                What We Build
              </h2>
              <p className="text-lg text-muted-foreground">
                Built on cutting-edge frameworks and powered by advanced
                algorithms
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {[
                {
                  name: "Game Studios",
                  status: "Active",
                  color: "from-purple-500 to-blue-600",
                },
                {
                  name: "Design Systems",
                  status: "Evolving",
                  color: "from-blue-500 to-green-600",
                },
                {
                  name: "Creator Tools",
                  status: "Live",
                  color: "from-green-500 to-yellow-600",
                },
                {
                  name: "Launch Ops",
                  status: "Scaling",
                  color: "from-yellow-500 to-red-600",
                },
                {
                  name: "Content Pipeline",
                  status: "In Progress",
                  color: "from-red-500 to-purple-600",
                },
                {
                  name: "Edge Experiences",
                  status: "Deployed",
                  color: "from-purple-500 to-pink-600",
                },
              ].map((tech, index) => (
                <Card
                  key={index}
                  className="relative overflow-hidden bg-card/30 border-border/50 hover:border-aethex-400/50 transition-all duration-500 hover-lift group animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gradient group-hover:animate-pulse">
                        {tech.name}
                      </h3>
                      <div
                        className={`w-3 h-3 rounded-full bg-gradient-to-r ${tech.color} animate-pulse`}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {tech.status}
                    </p>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-aethex-400/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-6 animate-slide-up">
              <h3 className="text-2xl font-bold text-gradient-purple">
                Ready to Build the Future?
              </h3>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90 glow-blue hover-lift interactive-scale"
                >
                  <Link
                    to="/onboarding"
                    className="flex items-center space-x-2 group"
                  >
                    <Sparkles className="h-5 w-5" />
                    <span>Join AeThex</span>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-aethex-400/50 hover:border-aethex-400 hover-lift interactive-scale"
                >
                  <Link to="/dashboard">Explore Platform</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
