import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  Users,
  Clock,
  Zap,
  Download,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LabsExploreResearch() {
  const navigate = useNavigate();

  const researchProjects = [
    {
      title: "AI-Powered NPC Behavior Systems",
      status: "Active Research",
      team: 5,
      duration: "6 months",
      description:
        "Machine learning models for realistic, adaptive NPC behavior in games. Uses reinforcement learning to create NPCs that learn from player interactions.",
      keyAchievements: [
        "50% faster training time vs baseline",
        "Natural conversation patterns",
        "Dynamic difficulty scaling",
      ],
      technologies: ["TensorFlow", "Python", "Lua"],
      impact: "Shipping in Q2 2025 GameForge games",
      paper: null,
      code: "github.com/aethex/ai-npc",
    },
    {
      title: "Next-Gen Web Architecture",
      status: "Exploration Phase",
      team: 3,
      duration: "3 months",
      description:
        "Exploring edge computing and serverless patterns for ultra-low latency experiences. Focus on reducing load times to <100ms.",
      keyAchievements: [
        "Proof of concept complete",
        "80% latency reduction achieved",
        "Framework design finalized",
      ],
      technologies: ["Cloudflare Workers", "WebAssembly", "TypeScript"],
      impact: "Foundation for next-gen platform",
      paper: "Next-Gen Architecture White Paper (Dec 2024)",
      code: null,
    },
    {
      title: "Procedural Content Generation",
      status: "Published",
      team: 4,
      duration: "8 months",
      description:
        "Algorithms for infinite, dynamic game world generation. Published research accepted at Game Dev Summit 2024.",
      keyAchievements: [
        "Paper published in proceedings",
        "Open-source library released",
        "3K+ GitHub stars",
      ],
      technologies: ["Rust", "Perlin Noise", "Graph Theory"],
      impact: "Used in 5+ community games",
      paper: "Procedural Generation at Scale",
      code: "github.com/aethex/proc-gen",
    },
    {
      title: "Real-Time Ray Tracing Optimization",
      status: "Development",
      team: 6,
      duration: "5 months",
      description:
        "Breakthrough techniques for ray tracing on consumer hardware without sacrificing performance. Hybrid rasterization + ray tracing approach.",
      keyAchievements: [
        "4x performance improvement",
        "Production-ready implementation",
        "Works on mobile hardware",
      ],
      technologies: ["GLSL", "C++", "GPU Compute"],
      impact: "Launching as free SDK in 2025",
      paper: null,
      code: "github.com/aethex/raytracing-sdk",
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
          {/* Header */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <Button
                variant="ghost"
                className="text-yellow-300 hover:bg-yellow-500/10 mb-8"
                onClick={() => navigate("/labs")}
              >
                ← Back to Labs
              </Button>

              <h1 className="text-4xl lg:text-5xl font-black text-yellow-300 mb-4">
                Research Projects
              </h1>
              <p className="text-lg text-yellow-100/80 max-w-3xl">
                Explore the cutting-edge research being conducted in AeThex
                Labs. Each project represents our commitment to pushing the
                boundaries of technology.
              </p>
            </div>
          </section>

          {/* Projects Grid */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="space-y-8">
                {researchProjects.map((project, idx) => (
                  <Card
                    key={idx}
                    className="bg-yellow-950/20 border-yellow-400/30 hover:border-yellow-400/60 transition-all"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <CardTitle className="text-2xl text-yellow-300 mb-2">
                            {project.title}
                          </CardTitle>
                          <Badge
                            className={`${
                              project.status === "Published"
                                ? "bg-green-500/20 border border-green-400/40 text-green-300"
                                : project.status === "Active Research"
                                  ? "bg-yellow-500/20 border border-yellow-400/40 text-yellow-300"
                                  : "bg-purple-500/20 border border-purple-400/40 text-purple-300"
                            }`}
                          >
                            {project.status}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-yellow-400 font-semibold">
                            {project.team} researchers
                          </p>
                          <p className="text-sm text-yellow-200/70">
                            {project.duration}
                          </p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {/* Description */}
                      <p className="text-yellow-200/80">
                        {project.description}
                      </p>

                      {/* Key Achievements */}
                      <div>
                        <p className="text-sm font-semibold text-yellow-400 mb-3">
                          Key Achievements
                        </p>
                        <ul className="space-y-2">
                          {project.keyAchievements.map((achievement, i) => (
                            <li
                              key={i}
                              className="flex items-center gap-2 text-sm text-yellow-200/80"
                            >
                              <Zap className="h-4 w-4 text-yellow-400" />
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Technologies */}
                      <div>
                        <p className="text-sm font-semibold text-yellow-400 mb-3">
                          Technologies
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, i) => (
                            <Badge
                              key={i}
                              className="bg-yellow-500/20 text-yellow-300 border border-yellow-400/40"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Impact & Links */}
                      <div className="pt-4 border-t border-yellow-400/10 flex flex-wrap items-center justify-between gap-4">
                        <p className="text-sm text-yellow-200/80">
                          <span className="font-semibold text-yellow-400">
                            Impact:
                          </span>{" "}
                          {project.impact}
                        </p>
                        <div className="flex gap-3">
                          {project.paper && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-yellow-300 hover:bg-yellow-500/10"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Paper
                            </Button>
                          )}
                          {project.code && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-yellow-300 hover:bg-yellow-500/10"
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Code
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 border-t border-yellow-400/10">
            <div className="container mx-auto max-w-4xl px-4 text-center">
              <h2 className="text-3xl font-bold text-yellow-300 mb-4">
                Interested in Research?
              </h2>
              <p className="text-lg text-yellow-100/80 mb-8">
                Join our research team and contribute to the future of
                technology.
              </p>
              <Button
                className="bg-yellow-400 text-black hover:bg-yellow-300"
                onClick={() => navigate("/careers")}
              >
                View Research Positions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
