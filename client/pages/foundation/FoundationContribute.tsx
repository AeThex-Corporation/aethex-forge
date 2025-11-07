import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Github, BookOpen, Users, CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FoundationContribute() {
  const navigate = useNavigate();

  const projects = [
    {
      name: "AeThex Game Engine",
      description: "High-performance game engine for web and native platforms",
      stars: "2.5K",
      language: "Rust",
      difficulty: "Intermediate",
      goodFirst: ["docs", "examples", "tests"],
    },
    {
      name: "Roblox Toolkit",
      description: "Professional Roblox development library and utilities",
      stars: "1.8K",
      language: "Lua",
      difficulty: "Beginner",
      goodFirst: ["bug fixes", "documentation", "examples"],
    },
    {
      name: "Procedural Generation Library",
      description: "Advanced PCG algorithms for game content",
      stars: "980",
      language: "Rust",
      difficulty: "Advanced",
      goodFirst: ["tests", "optimization", "examples"],
    },
  ];

  const contributionTypes = [
    {
      title: "Code Contributions",
      description: "Submit bug fixes, features, or optimizations",
      benefits: ["Build portfolio", "Earn recognition", "Shape projects"],
    },
    {
      title: "Documentation",
      description: "Improve guides, README files, and API docs",
      benefits: ["Help community", "Easy to start", "High impact"],
    },
    {
      title: "Bug Reports",
      description: "Find and report issues with clear details",
      benefits: ["Free to start", "No coding needed", "Helps everyone"],
    },
    {
      title: "Translations",
      description: "Help translate docs and guides to other languages",
      benefits: ["Global impact", "Flexible work", "Community valued"],
    },
  ];

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#ef4444_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(239,68,68,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(239,68,68,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(239,68,68,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-red-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-red-600/10 rounded-full blur-3xl animate-blob animation-delay-2000" />

        <main className="relative z-10">
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <Button
                variant="ghost"
                className="text-red-300 hover:bg-red-500/10 mb-8"
                onClick={() => navigate("/foundation")}
              >
                ← Back to Foundation
              </Button>

              <h1 className="text-4xl lg:text-5xl font-black text-red-300 mb-4">
                Contribute to Open Source
              </h1>
              <p className="text-lg text-red-100/80 max-w-3xl">
                Help us build better tools and resources for the developer community. All skill levels welcome.
              </p>
            </div>
          </section>

          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-red-300 mb-8">
                Featured Projects
              </h2>
              <div className="space-y-6">
                {projects.map((project, idx) => (
                  <Card
                    key={idx}
                    className="bg-red-950/20 border-red-400/30 hover:border-red-400/60 transition-all"
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-red-300 mb-1">
                            {project.name}
                          </h3>
                          <p className="text-sm text-red-200/70">
                            {project.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-red-500/20 text-red-300 border border-red-400/40 mb-2">
                            ⭐ {project.stars}
                          </Badge>
                          <Badge className="bg-red-500/20 text-red-300 border border-red-400/40 block">
                            {project.language}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-red-400/10">
                        <p className="text-xs font-semibold text-red-400">
                          Good for Beginners
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {project.goodFirst.map((tag, i) => (
                            <Badge
                              key={i}
                              className="bg-red-500/10 text-red-300 border border-red-400/30 text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-300 hover:bg-red-500/10 mt-2"
                        >
                          <Github className="h-4 w-4 mr-1" />
                          View on GitHub
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 border-t border-red-400/10 bg-black/40">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-red-300 mb-8">
                Ways to Contribute
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {contributionTypes.map((type, idx) => (
                  <Card
                    key={idx}
                    className="bg-red-950/20 border-red-400/30"
                  >
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-bold text-red-300 mb-2">
                        {type.title}
                      </h3>
                      <p className="text-sm text-red-200/70 mb-4">
                        {type.description}
                      </p>
                      <ul className="space-y-2">
                        {type.benefits.map((benefit, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-2 text-xs text-red-300"
                          >
                            <CheckCircle className="h-4 w-4 text-red-400" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 border-t border-red-400/10">
            <div className="container mx-auto max-w-4xl px-4 text-center">
              <h2 className="text-3xl font-bold text-red-300 mb-4">
                Ready to Contribute?
              </h2>
              <p className="text-lg text-red-100/80 mb-8">
                Choose a project and start making an impact today.
              </p>
              <Button
                className="bg-red-400 text-black hover:bg-red-300"
              >
                Browse Repositories
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
