import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LoadingScreen from "@/components/LoadingScreen";
import { SkeletonStats, SkeletonUserPath } from "@/components/Skeleton";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  Sparkles,
  Zap,
  Target,
  Users,
  TrendingUp,
  LayoutDashboard,
  Microscope,
  IdCard,
} from "lucide-react";

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSection((prev) => (prev + 1) % 4);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  type FeatureCard = {
    title: string;
    description: string;
    icon: any;
    color: string; // tailwind gradient from-to
    link?: string;
    tags?: string[];
  };

  const features: FeatureCard[] = [
    {
      title: "Game Development",
      description: "Full‑cycle production and tooling",
      icon: Zap,
      color: "from-sky-500 to-indigo-600",
      link: "/game-development",
      tags: ["Studios", "Tools"],
    },
    {
      title: "Product Design",
      description: "UX/UI, prototyping, and branding",
      icon: Target,
      color: "from-rose-500 to-fuchsia-600",
      link: "/consulting",
      tags: ["UX", "Branding"],
    },
    {
      title: "Platform Engineering",
      description: "Web, mobile, and backend foundations",
      icon: Users,
      color: "from-emerald-500 to-teal-600",
      link: "/consulting",
      tags: ["Web", "Backend"],
    },
    {
      title: "Community & Growth",
      description: "Programs, content, and engagement",
      icon: TrendingUp,
      color: "from-amber-500 to-orange-600",
      link: "/community",
      tags: ["Programs", "Content"],
    },
  ];

  const platformFeatures: FeatureCard[] = [
    {
      title: "Dashboard",
      description: "Your projects, applications, and rewards — in one place",
      icon: LayoutDashboard,
      color: "from-rose-500 to-amber-500",
      link: "/dashboard",
      tags: ["Overview", "Rewards"],
    },
    {
      title: "Community Feed",
      description: "Share progress, discover collaborators, and stay updated",
      icon: Users,
      color: "from-indigo-500 to-cyan-500",
      link: "/feed",
      tags: ["Posts", "Collab"],
    },
    {
      title: "Developer Passport",
      description: "A public profile with verifiable achievements",
      icon: IdCard,
      color: "from-fuchsia-500 to-violet-600",
      link: "/passport/me",
      tags: ["Profile", "Badges"],
    },
    {
      title: "Docs & CLI",
      description: "Guides, API reference, and tooling to ship faster",
      icon: Microscope,
      color: "from-lime-500 to-emerald-600",
      link: "/docs",
      tags: ["Guides", "API"],
    },
  ];

  const achievements = [
    { metric: "10K+", label: "Active Creators" },
    { metric: "500+", label: "Projects Shipped" },
    { metric: "99.99%", label: "Feature Quality" },
    { metric: "24/7", label: "Global Community" },
  ];

  const serviceOfferings = [
    {
      title: "Game Development",
      description: "Studios and indie support",
      link: "/game-development",
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
      cardClass:
        "border-emerald-500/40 bg-gradient-to-br from-emerald-950/60 via-teal-950/30 to-blue-900/40 text-emerald-100 hover:border-emerald-400/80 hover:shadow-[0_0_25px_rgba(16,185,129,0.35)]",
      titleClass: "text-emerald-100",
      descriptionClass: "text-emerald-100/70",
      buttonClass:
        "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-black font-semibold shadow-[0_0_18px_rgba(20,184,166,0.25)]",
    },
  ];

  const resourceOfferings = [
    {
      title: "Documentation",
      description: "Guides and tutorials",
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
  ];

  const [homeBanner, setHomeBanner] = useState<{ text: string; enabled?: boolean; style?: string } | null>(null);

  useEffect(() => {
    fetch("/api/site-settings?key=home_banner")
      .then((r) => (r.ok ? r.json() : null))
      .then((v) => {
        if (v && typeof v === "object") setHomeBanner(v as any);
      })
      .catch(() => void 0);
  }, []);

  if (isLoading) {
    return (
      <LoadingScreen
        message="Initializing AeThex OS..."
        showProgress={true}
        duration={1200}
      />
    );
  }

  return (
    <Layout hideFooter>
      {/* Top Banner (editable via Admin → Operations) */}
      {homeBanner?.enabled !== false && (
        <>
          {/* Gamified top banner */}
          {/* eslint-disable-next-line react/no-unknown-property */}
          <div data-home-banner>
            {/* @ts-ignore - component default export */}
            {/* Using dynamic styling keyed by homeBanner.style */}
            {/* Prefer emoji prefix in text for style */}
            {/* The component handles disabled state upstream */}
          </div>
        </>
      )}

      {/* Hero Section - Geometric Design */}
      <section className="relative min-h-screen flex items-start justify-center overflow-hidden pt-24 sm:pt-36">
        {/* Geometric Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-aethex-900/50 via-background to-aethex-800/50" />
          <div className="absolute inset-0">
            {/* Large Logo-inspired Geometric Shape */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative w-96 h-96 opacity-5">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F3979ec9a8a28471d900a80e94e2c45fe?format=webp&width=800"
                  alt="Background"
                  className="w-full h-full animate-float"
                />
              </div>
            </div>

            {/* Floating Geometric Elements */}
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-aethex-400/20 animate-float"
                style={{
                  width: `${10 + Math.random() * 20}px`,
                  height: `${10 + Math.random() * 20}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${4 + Math.random() * 3}s`,
                  clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 relative z-10 pb-24 sm:pb-28">
          <div className="text-center space-y-12">
            {/* Title */}
            <div className="space-y-6 animate-scale-in">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold">
                  <span className="text-gradient-purple">AeThex</span>
                </h1>
                <h2 className="text-2xl lg:text-3xl text-gradient animate-fade-in">
                  Crafting Digital Realities
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up">
                  Where vision meets execution. We craft experiences through
                  design, development, and community.
                </p>
              </div>
            </div>

            {/* Interactive Features Grid (Services) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto animate-slide-up">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                const isActive = activeSection === index;
                return (
                  <Card
                    key={`old-${index}`}
                    className={`relative overflow-hidden rounded-xl border transition-all duration-500 group animate-fade-in ${
                      isActive
                        ? "border-aethex-500/60 glow-blue"
                        : "border-border/30 hover:border-aethex-400/50"
                    } bg-card/60 backdrop-blur-sm hover:translate-y-[-2px] hover:shadow-[0_8px_30px_rgba(80,80,120,0.25)]`}
                    style={{ animationDelay: `${index * 0.08}s` }}
                  >
                    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/6 via-transparent to-white/0" />
                    <CardContent className="p-5 sm:p-6 flex flex-col items-center text-center gap-3">
                      <div
                        className={`relative w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} grid place-items-center shadow-inner`}
                      >
                        <div className="absolute -inset-[2px] rounded-xl bg-gradient-to-r from-white/20 to-transparent blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Icon className="h-6 w-6 text-white drop-shadow" />
                      </div>
                      <h3 className="font-semibold text-sm tracking-wide">
                        {feature.title}
                      </h3>
                      <div className="flex flex-wrap justify-center gap-2 min-h-[24px]">
                        {(feature.tags || []).slice(0, 2).map((tag, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="border-white/10 text-xs text-foreground/80"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {feature.description}
                      </p>
                      <div
                        className={`mt-1 h-[2px] w-16 rounded-full bg-gradient-to-r ${feature.color} opacity-60 group-hover:opacity-100 transition-opacity`}
                      />
                      {feature.link ? (
                        <div className="pt-1">
                          <Link
                            to={feature.link}
                            className="text-xs inline-flex items-center gap-1 text-aethex-300 hover:text-aethex-200"
                          >
                            Explore
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Platform Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto animate-slide-up mt-6">
              {platformFeatures.map((feature, index) => {
                const Icon = feature.icon;
                const isActive = activeSection === index;
                return (
                  <Card
                    key={`platform-${index}`}
                    className={`relative overflow-hidden rounded-xl border transition-all duration-500 group animate-fade-in ${
                      isActive
                        ? "border-aethex-500/60 glow-blue"
                        : "border-border/30 hover:border-aethex-400/50"
                    } bg-card/60 backdrop-blur-sm hover:translate-y-[-2px] hover:shadow-[0_8px_30px_rgba(80,80,120,0.25)]`}
                    style={{ animationDelay: `${(index + 4) * 0.08}s` }}
                  >
                    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/6 via-transparent to-white/0" />
                    <CardContent className="p-5 sm:p-6 flex flex-col items-center text-center gap-3">
                      <div
                        className={`relative w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} grid place-items-center shadow-inner`}
                      >
                        <div className="absolute -inset-[2px] rounded-xl bg-gradient-to-r from-white/20 to-transparent blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Icon className="h-6 w-6 text-white drop-shadow" />
                      </div>
                      <h3 className="font-semibold text-sm tracking-wide">
                        {feature.title}
                      </h3>
                      <div className="flex flex-wrap justify-center gap-2 min-h-[24px]">
                        {(feature.tags || []).slice(0, 2).map((tag, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="border-white/10 text-xs text-foreground/80"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {feature.description}
                      </p>
                      <div
                        className={`mt-1 h-[2px] w-16 rounded-full bg-gradient-to-r ${feature.color} opacity-60 group-hover:opacity-100 transition-opacity`}
                      />
                      {feature.link ? (
                        <div className="pt-1">
                          <Link
                            to={feature.link}
                            className="text-xs inline-flex items-center gap-1 text-aethex-300 hover:text-aethex-200"
                          >
                            Explore
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-6 animate-slide-up mb-8 sm:mb-10">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90 glow-blue hover-lift text-base sm:text-lg px-6 py-4 sm:px-8 sm:py-6"
              >
                <Link
                  to="/onboarding"
                  className="flex items-center space-x-2 group"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>Start Your Journey</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-aethex-400/50 hover:border-aethex-400 hover-lift text-base sm:text-lg px-6 py-4 sm:px-8 sm:py-6"
              >
                <Link to="/explore">Explore Platform</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="hover-lift text-base sm:text-lg px-6 py-4 sm:px-8 sm:py-6"
              >
                <a href="https://aethex.net" target="_blank" rel="noreferrer">Visit aethex.net</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
