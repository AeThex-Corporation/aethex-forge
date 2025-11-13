import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useArmTheme } from "@/contexts/ArmThemeContext";
import {
  Microscope,
  Zap,
  Users,
  ArrowRight,
  Sparkles,
  Target,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import { useArmToast } from "@/hooks/use-arm-toast";

export default function Labs() {
  const navigate = useNavigate();
  const { theme } = useArmTheme();
  const armToast = useArmToast();
  const [isLoading, setIsLoading] = useState(true);
  const toastShownRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!toastShownRef.current) {
        armToast.system("Labs mainframe linked");
        toastShownRef.current = true;
      }
    }, 900);

    return () => clearTimeout(timer);
  }, [armToast]);

  if (isLoading) {
    return (
      <LoadingScreen
        message="Initializing Research Module..."
        showProgress={true}
        duration={900}
        accentColor="from-yellow-500 to-yellow-400"
        armLogo="https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F85fe7910cff6483db1ea99c154684844?format=webp&width=800"
      />
    );
  }

  const projects = [
    {
      title: "AI-Powered NPC Behavior Systems",
      description:
        "Machine learning models for realistic, adaptive NPC behavior in games",
      status: "In Progress",
      team: 5,
      impact: "Next-gen game AI",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Next-Gen Web Architecture",
      description:
        "Exploring edge computing and serverless patterns for ultra-low latency",
      status: "Research Phase",
      team: 3,
      impact: "Platform performance",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Procedural Content Generation",
      description: "Algorithms for infinite, dynamic game world generation",
      status: "Published Research",
      team: 4,
      impact: "Game development tools",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Real-Time Ray Tracing Optimization",
      description:
        "Breakthrough techniques for ray tracing on consumer hardware",
      status: "Development",
      team: 6,
      impact: "Graphics technology",
      color: "from-orange-500 to-red-500",
    },
  ];

  const innovations = [
    {
      title: "Whitepaper: Distributed Game Sync",
      date: "December 2024",
      authors: "Dr. Sarah Chen, Marcus Johnson",
      citation: "Proceedings of Game Dev Summit 2024",
    },
    {
      title: "Open Source: AeThex Game Engine",
      date: "November 2024",
      description:
        "Lightweight, high-performance game engine for web and native",
      stars: "2.5K GitHub stars",
    },
    {
      title: "Talk: Building Scalable Game Backends",
      date: "October 2024",
      event: "GDC 2024",
      audience: "500+ game developers",
    },
  ];

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Cyberpunk Background Effects */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#facc15_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(250,204,21,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(251,191,36,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(251,191,36,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-96 h-96 bg-yellow-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-96 h-96 bg-yellow-600/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />

        <main className="relative z-10">
          {/* Hero Section - L.A.B.S. Interface */}
          <section className="relative overflow-hidden py-20 lg:py-28 border-b border-yellow-400/10">
            <div className="container mx-auto max-w-6xl px-4 text-center">
              <div className="mx-auto flex max-w-3xl flex-col items-center gap-8">
                <div className="flex justify-center mb-4">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fd93f7113d34347469e74421c3a3412e5?format=webp&width=800"
                    alt="Labs Logo"
                    className="h-24 w-24 object-contain drop-shadow-lg filter drop-shadow-[0_0_20px_rgba(251,191,36,0.4)]"
                  />
                </div>

                <Badge className="border-yellow-400/40 bg-yellow-500/10 text-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.2)]">
                  <span className="mr-2 inline-flex h-2 w-2 animate-pulse rounded-full bg-yellow-300" />
                  Research & Development Uplink
                </Badge>

                <div>
                  <h1 className={`text-5xl lg:text-7xl font-black text-yellow-300 leading-tight mb-4 ${theme.fontClass}`}>
                    The Innovation Engine
                  </h1>
                  <p className="text-lg text-yellow-100/90 mb-4">
                    Real-time window into the AeThex Labs mainframe.
                    Breakthrough R&D pushing the boundaries of what's possible.
                  </p>
                </div>

                <p className="text-xl text-yellow-100/80 max-w-3xl">
                  AeThex Labs is our dedicated R&D pillar, focused on
                  breakthrough technologies that create lasting competitive
                  advantage. Applied R&D pushing the boundaries of what's
                  possible in software, games, and digital experiences.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    className="bg-yellow-400 text-black hover:bg-yellow-300 shadow-[0_0_30px_rgba(250,204,21,0.35)]"
                    onClick={() => navigate("/labs/explore-research")}
                  >
                    <Microscope className="mr-2 h-5 w-5" />
                    Explore Research
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="border-yellow-400/40 text-yellow-300 hover:bg-yellow-500/10"
                    onClick={() => navigate("/careers")}
                  >
                    Join Our Team
                  </Button>
                </div>

                {/* Creator Network CTAs */}
                <div className="pt-8 border-t border-yellow-400/20 w-full">
                  <p className="text-sm text-yellow-200/70 mb-4">
                    Explore our creator community:
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-yellow-400/30 text-yellow-300 hover:bg-yellow-500/10"
                      onClick={() => navigate("/creators?arm=labs")}
                    >
                      Browse Labs Creators
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-yellow-400/30 text-yellow-300 hover:bg-yellow-500/10"
                      onClick={() => navigate("/opportunities?arm=labs")}
                    >
                      View Labs Opportunities
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Active Research Projects - Core Directives */}
          <section className="border-b border-yellow-400/10 bg-black/80 py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="mb-12 flex items-start justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-bold text-yellow-300 sm:text-4xl">
                    Active Research Projects
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm text-yellow-100/70 sm:text-base">
                    Programmes sourced from the Labs backbone. Core directives
                    driving innovation across all AeThex platforms.
                  </p>
                </div>
                <Zap className="hidden h-10 w-10 text-yellow-400/70 sm:block" />
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                {projects.map((project, idx) => (
                  <Card
                    key={idx}
                    className="flex h-full flex-col border border-yellow-400/20 bg-black/60 backdrop-blur"
                  >
                    <CardHeader className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-12 h-12 rounded-lg bg-gradient-to-r ${project.color} flex items-center justify-center text-white`}
                        >
                          <Sparkles className="h-6 w-6" />
                        </div>
                        <Badge className="bg-yellow-500/10 text-xs text-yellow-300">
                          {project.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl text-yellow-100">
                        {project.title}
                      </CardTitle>
                      <Badge className="bg-yellow-500/20 border border-yellow-400/40 text-yellow-300 text-xs w-fit">
                        {project.team} researchers
                      </Badge>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col gap-4">
                      <p className="text-sm text-yellow-100/80">
                        {project.description}
                      </p>
                      <div className="pt-4 border-t border-yellow-400/10">
                        <p className="text-xs font-semibold text-yellow-400 uppercase">
                          Expected Impact
                        </p>
                        <p className="text-sm text-yellow-200/80">
                          {project.impact}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Innovation in Action - Video Showcase */}
          <section className="py-16 border-b border-yellow-400/10 bg-gradient-to-b from-black/20 to-black/80">
            <div className="container mx-auto max-w-5xl px-4">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-yellow-300 mb-2">
                  Innovation in Action
                </h2>
                <p className="text-yellow-200/70">
                  See our groundbreaking research and development in action
                </p>
              </div>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500/30 via-transparent to-yellow-600/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                <div className="relative bg-black rounded-lg overflow-hidden border border-yellow-400/30 shadow-2xl">
                  <video
                    className="w-full aspect-video object-cover"
                    controls
                    autoPlay
                    muted
                    loop
                    poster="https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fd93f7113d34347469e74421c3a3412e5?format=webp&width=800"
                  >
                    <source
                      src="https://cdn.builder.io/o/assets%2Ffc53d607e21d497595ac97e0637001a1%2Ff34f06fb256c44c98103fd2fc72f1af1?alt=media&token=a23b3a3c-59e4-4894-8b61-43b02e5df904&apiKey=fc53d607e21d497595ac97e0637001a1"
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2 text-sm text-yellow-200/60">
                <Target className="h-4 w-4" />
                <p>
                  Cutting-edge research pushing the boundaries of what's
                  possible
                </p>
              </div>
            </div>
          </section>

          {/* Recent Innovations - Labs Transmissions */}
          <section className="py-16 border-b border-yellow-400/10">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-yellow-300 sm:text-4xl">
                    Recent Innovations
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm text-yellow-100/70 sm:text-base">
                    Broadcasts directly from Labs operations. Latest
                    breakthroughs and publications from our research teams.
                  </p>
                </div>
                <Zap className="hidden h-10 w-10 text-yellow-400/70 sm:block" />
              </div>

              <div className="space-y-4">
                {innovations.map((item, idx) => (
                  <Card
                    key={idx}
                    className="border border-yellow-400/10 bg-black/70 backdrop-blur"
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-yellow-300 mb-2">
                            {item.title}
                          </h3>
                          {item.description && (
                            <p className="text-sm text-yellow-200/70 mb-2">
                              {item.description}
                            </p>
                          )}
                          {item.authors && (
                            <p className="text-xs text-yellow-200/60 mb-2">
                              by {item.authors}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-2">
                            {item.date && (
                              <Badge className="bg-yellow-500/20 text-yellow-300 border border-yellow-400/40 text-xs">
                                {item.date}
                              </Badge>
                            )}
                            {item.citation && (
                              <Badge className="bg-yellow-500/20 text-yellow-300 border border-yellow-400/40 text-xs">
                                {item.citation}
                              </Badge>
                            )}
                            {item.stars && (
                              <Badge className="bg-yellow-500/20 text-yellow-300 border border-yellow-400/40 text-xs">
                                {item.stars}
                              </Badge>
                            )}
                            {item.event && (
                              <Badge className="bg-yellow-500/20 text-yellow-300 border border-yellow-400/40 text-xs">
                                {item.event}
                              </Badge>
                            )}
                            {item.audience && (
                              <Badge className="bg-yellow-500/20 text-yellow-300 border border-yellow-400/40 text-xs">
                                {item.audience}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Zap className="h-5 w-5 text-yellow-400 mt-1 ml-4 flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Lab Team Section */}
          <section className="py-16 border-b border-yellow-400/10 bg-black/40">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-yellow-300 mb-6">
                Meet the Lab
              </h2>
              <p className="text-lg text-yellow-100/80 max-w-3xl mb-12">
                Our research team consists of PhD-level researchers, innovative
                engineers, and pioneering thinkers. We collaborate across
                disciplines to tackle the hardest problems in technology.
              </p>
              <Button
                className="bg-yellow-400 text-black hover:bg-yellow-300"
                onClick={() => navigate("/labs/join-team")}
              >
                Explore the Team
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </section>

          {/* CTA - Be Part of Innovation */}
          <section className="py-16">
            <div className="container mx-auto max-w-4xl px-4 text-center">
              <h2 className="text-3xl font-bold text-yellow-300 mb-4">
                Be Part of the Innovation
              </h2>
              <p className="text-lg text-yellow-100/80 mb-8">
                We're hiring researchers and engineers to push the boundaries of
                what's possible.
              </p>
              <Button
                className="bg-yellow-400 text-black shadow-[0_0_30px_rgba(251,191,36,0.35)] hover:bg-yellow-300"
                onClick={() => navigate("/careers")}
              >
                View Open Positions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
