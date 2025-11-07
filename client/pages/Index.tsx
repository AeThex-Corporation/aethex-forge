import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
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
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  Users,
  TrendingUp,
  LayoutDashboard,
  Microscope,
  IdCard,
  Briefcase,
  Code,
  BookOpen,
  Network,
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
    color: string;
    link?: string;
    tags?: string[];
  };

  // Ecosystem Audience Navigation
  const audienceNav = [
    {
      title: "Solutions for Business",
      description: "Custom software development, consulting, and digital transformation",
      icon: Briefcase,
      color: "from-blue-500 to-cyan-500",
      link: "/corp",
      audience: "Enterprise clients",
    },
    {
      title: "Explore & Learn",
      description: "Open source projects, educational workshops, and community resources",
      icon: BookOpen,
      color: "from-red-500 to-pink-500",
      link: "/foundation",
      audience: "Developers & learners",
    },
    {
      title: "Join the Network",
      description: "Professional networking, job board, and portfolio showcase for Roblox devs",
      icon: Network,
      color: "from-cyan-500 to-blue-500",
      link: "/dev-link",
      audience: "Individual developers",
    },
    {
      title: "Careers & Innovation",
      description: "Join our team and work on cutting-edge R&D and experimental features",
      icon: Zap,
      color: "from-yellow-500 to-amber-500",
      link: "/labs",
      audience: "Top-tier talent",
    },
  ];

  // Platform Features (Dashboard, Feed, etc.)
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

  // Showcase wins from each division
  const showcaseWins = [
    {
      division: "Corp",
      title: "Enterprise Transformation",
      description: "Helped Fortune 500 company modernize their tech stack",
      metric: "$2.5M revenue impact",
      color: "bg-blue-500/10 border-blue-400/30",
    },
    {
      division: "Foundation",
      title: "Community Education",
      description: "Launched Roblox development workshop series",
      metric: "500+ developers trained",
      color: "bg-red-500/10 border-red-400/30",
    },
    {
      division: "Labs",
      title: "AI Innovation",
      description: "Breakthrough in procedural game content generation",
      metric: "Published research paper",
      color: "bg-yellow-500/10 border-yellow-400/30",
    },
    {
      division: "Dev-Link",
      title: "Network Growth",
      description: "Reached 10K+ Roblox developers on the platform",
      metric: "1000+ jobs posted",
      color: "bg-cyan-500/10 border-cyan-400/30",
    },
  ];

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
    <>
      <SEO
        pageTitle="Home"
        description="AeThex: Building the Future of Immersive Digital Experiences. Consulting, Open Source, Developer Network, and Innovation."
        canonical={
          typeof window !== "undefined"
            ? window.location.href
            : (undefined as any)
        }
      />
      <Layout hideFooter>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-start justify-center overflow-hidden pt-24 sm:pt-36">
          {/* Geometric Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-aethex-900/50 via-background to-aethex-800/50" />
            <div className="absolute inset-0">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative w-96 h-96 opacity-5">
                  <img
                    src="https://docs.aethex.tech/~gitbook/image?url=https%3A%2F%2F1143808467-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Forganizations%252FDhUg3jal6kdpG645FzIl%252Fsites%252Fsite_HeOmR%252Flogo%252FqxDYz8Oj2SnwUTa8t3UB%252FAeThex%2520Origin%2520logo.png%3Falt%3Dmedia%26token%3D200e8ea2-0129-4cbe-b516-4a53f60c512b&width=512&dpr=1&quality=100&sign=6c7576ce&sv=2"
                    alt="Background"
                    className="w-full h-full animate-float"
                  />
                </div>
              </div>

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
              {/* Title & Value Prop */}
              <div className="space-y-6 animate-scale-in">
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold">
                    <span className="text-gradient-purple">AeThex</span>
                  </h1>
                  <h2 className="text-2xl lg:text-3xl text-gradient animate-fade-in">
                    Building the Future of Immersive Digital Experiences
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-3xl mx-auto animate-slide-up">
                    Software innovation, enterprise consulting, open source education, and professional networking—all in one ecosystem.
                  </p>
                </div>
              </div>

              {/* Audience Navigation Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto animate-slide-up">
                {audienceNav.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={index}
                      to={item.link}
                      className="group"
                    >
                      <Card className="relative overflow-hidden rounded-xl border border-border/30 hover:border-aethex-400/50 bg-card/60 backdrop-blur-sm hover:translate-y-[-4px] hover:shadow-[0_12px_40px_rgba(80,80,120,0.3)] transition-all duration-300 h-full cursor-pointer"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/6 via-transparent to-white/0" />
                        <CardContent className="p-6 flex flex-col items-center text-center gap-4 h-full justify-between">
                          <div
                            className={`relative w-14 h-14 rounded-lg bg-gradient-to-r ${item.color} grid place-items-center shadow-inner`}
                          >
                            <Icon className="h-7 w-7 text-white drop-shadow" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg mb-2">
                              {item.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              {item.description}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {item.audience}
                            </Badge>
                          </div>
                          <div
                            className={`h-[2px] w-12 rounded-full bg-gradient-to-r ${item.color} opacity-60 group-hover:opacity-100 transition-opacity`}
                          />
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>

              {/* Division Showcase */}
              <div className="max-w-6xl mx-auto animate-slide-up mt-8">
                <h3 className="text-2xl font-bold mb-6">Recent Wins</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {showcaseWins.map((win, index) => (
                    <Card key={index} className={`border ${win.color} bg-opacity-50`}>
                      <CardContent className="pt-6">
                        <Badge variant="outline" className="mb-3 text-xs">
                          {win.division}
                        </Badge>
                        <h4 className="font-semibold text-sm mb-2">{win.title}</h4>
                        <p className="text-xs text-muted-foreground mb-3">
                          {win.description}
                        </p>
                        <p className="text-xs font-bold text-aethex-300">
                          {win.metric}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Platform Features Section */}
              <div className="max-w-6xl mx-auto animate-slide-up mt-12">
                <h3 className="text-2xl font-bold mb-6">Your Platform</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-6 animate-slide-up mt-8">
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
                    <span>Get Started</span>
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
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
