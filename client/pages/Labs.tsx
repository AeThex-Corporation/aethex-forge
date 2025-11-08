import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Microscope,
  Zap,
  Users,
  ArrowRight,
  Lightbulb,
  Target,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Labs() {
  const navigate = useNavigate();

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
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#fbbf24_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(251,191,36,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(251,191,36,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(251,191,36,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-yellow-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-yellow-600/10 rounded-full blur-3xl animate-blob animation-delay-2000" />

        <main className="relative z-10">
          {/* Hero Section */}
          <section className="py-16 lg:py-24">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="mb-8 flex justify-center">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F85fe7910cff6483db1ea99c154684844?format=webp&width=800"
                  alt="Labs Logo"
                  className="h-24 w-24 object-contain drop-shadow-lg"
                />
              </div>
              <Badge className="border-yellow-400/40 bg-yellow-500/10 text-yellow-300 shadow-[0_0_20px_rgba(251,191,36,0.2)] mb-6">
                <Microscope className="h-4 w-4 mr-2" />
                AeThex Labs
              </Badge>

              <div className="space-y-6 mb-12">
                <h1 className="text-5xl lg:text-7xl font-black text-yellow-300 leading-tight">
                  The Innovation Engine
                </h1>
                <p className="text-xl text-yellow-100/70 max-w-3xl">
                  AeThex Labs is our dedicated R&D pillar, focused on
                  breakthrough technologies that create lasting competitive
                  advantage. We invest in bleeding-edge research—from advanced
                  AI to next-generation web architectures—while cultivating
                  thought leadership that shapes industry direction.
                </p>
                <p className="text-xl text-yellow-100/80 max-w-3xl">
                  Applied R&D pushing the boundaries of what's possible in
                  software, games, and digital experiences. Our research today
                  shapes tomorrow's products.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="bg-yellow-400 text-black hover:bg-yellow-300"
                  onClick={() => navigate("/labs/explore-research")}
                >
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
              <div className="mt-8 pt-8 border-t border-yellow-400/20">
                <p className="text-sm text-yellow-200/70 mb-4">
                  Explore our creator community:
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
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
          </section>

          {/* Current Research Projects */}
          <section className="py-16 border-t border-yellow-400/10 bg-black/40">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-yellow-300 mb-12">
                Active Research Projects
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {projects.map((project, idx) => (
                  <Card
                    key={idx}
                    className="bg-yellow-950/20 border-yellow-400/30 hover:border-yellow-400/60 transition-all"
                  >
                    <CardHeader>
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-r ${project.color} flex items-center justify-center text-white mb-4`}
                      >
                        <Lightbulb className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-yellow-300">
                        {project.title}
                      </CardTitle>
                      <div className="flex gap-2 mt-3">
                        <Badge className="bg-yellow-500/20 border border-yellow-400/40 text-yellow-300 text-xs">
                          {project.status}
                        </Badge>
                        <Badge className="bg-yellow-500/20 border border-yellow-400/40 text-yellow-300 text-xs">
                          {project.team} researchers
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-yellow-200/70">
                        {project.description}
                      </p>
                      <div className="pt-4 border-t border-yellow-400/10">
                        <p className="text-xs font-semibold text-yellow-400">
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

          {/* Innovations & Publications */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-yellow-300 mb-12">
                Recent Innovations
              </h2>
              <div className="space-y-4">
                {innovations.map((item, idx) => (
                  <Card
                    key={idx}
                    className="bg-yellow-950/20 border-yellow-400/30 hover:border-yellow-400/60 transition-all"
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
          <section className="py-16 border-t border-yellow-400/10 bg-black/40">
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

          {/* CTA */}
          <section className="py-16 border-t border-yellow-400/10">
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
