import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Code,
  GitBranch,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FoundationContribute() {
  const navigate = useNavigate();

  const contributionWays = [
    {
      icon: Code,
      title: "Code Contributions",
      description: "Help develop and improve our open-source projects",
      ways: [
        "Submit pull requests",
        "Fix bugs and issues",
        "Add new features",
        "Improve documentation",
      ],
    },
    {
      icon: Sparkles,
      title: "Ideas & Feedback",
      description: "Share your ideas for new features and improvements",
      ways: [
        "Report issues",
        "Suggest features",
        "Provide user feedback",
        "Review pull requests",
      ],
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Help other developers in our community",
      ways: [
        "Answer questions",
        "Help on Discord",
        "Mentor newcomers",
        "Share knowledge",
      ],
    },
    {
      icon: Star,
      title: "Sponsorship",
      description: "Support our mission financially",
      ways: [
        "GitHub sponsorship",
        "Monthly donations",
        "Corporate support",
        "In-kind support",
      ],
    },
  ];

  const projects = [
    {
      name: "AeThex Game Engine",
      description:
        "Lightweight, performant game engine optimized for web and native platforms",
      stars: "2.5K",
      language: "Rust",
      issues: "12 open",
      difficulty: "Intermediate",
    },
    {
      name: "Roblox Toolkit",
      description:
        "Comprehensive library for building professional Roblox experiences",
      stars: "1.8K",
      language: "Lua",
      issues: "8 open",
      difficulty: "Beginner",
    },
    {
      name: "Developer CLI",
      description:
        "Command-line tools for streamlined game development workflow",
      stars: "1.2K",
      language: "Go",
      issues: "15 open",
      difficulty: "Intermediate",
    },
    {
      name: "Multiplayer Framework",
      description: "Drop-in networking layer for real-time multiplayer games",
      stars: "980",
      language: "TypeScript",
      issues: "10 open",
      difficulty: "Advanced",
    },
  ];

  const steps = [
    {
      step: "1",
      title: "Fork the Repository",
      description: "Start by forking the project on GitHub",
    },
    {
      step: "2",
      title: "Create a Branch",
      description: "Create a feature branch for your changes",
    },
    {
      step: "3",
      title: "Make Changes",
      description: "Implement your improvements or fixes",
    },
    {
      step: "4",
      title: "Submit Pull Request",
      description: "Submit your PR with a clear description",
    },
    {
      step: "5",
      title: "Review & Merge",
      description: "Community reviews and merges your contribution",
    },
  ];

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#ef4444_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(239,68,68,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(239,68,68,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(239,68,68,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-red-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-red-600/10 rounded-full blur-3xl animate-blob animation-delay-2000" />

        <main className="relative z-10">
          {/* Header */}
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
                Ways to Contribute
              </h1>
              <p className="text-lg text-red-100/80 max-w-3xl">
                Join our community and help us build amazing open-source
                projects. There are many ways to contribute, regardless of your
                skill level.
              </p>
            </div>
          </section>

          {/* Contribution Ways */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-red-300 mb-8">
                Get Involved
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {contributionWays.map((way, idx) => {
                  const Icon = way.icon;
                  return (
                    <Card key={idx} className="bg-red-950/20 border-red-400/30">
                      <CardContent className="pt-6">
                        <Icon className="h-8 w-8 text-red-400 mb-3" />
                        <h3 className="text-lg font-bold text-red-300 mb-2">
                          {way.title}
                        </h3>
                        <p className="text-sm text-red-200/70 mb-4">
                          {way.description}
                        </p>
                        <ul className="space-y-2">
                          {way.ways.map((w, i) => (
                            <li
                              key={i}
                              className="flex items-center gap-2 text-sm text-red-300"
                            >
                              <CheckCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                              {w}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          {/* How to Contribute */}
          <section className="py-16 border-t border-red-400/10 bg-black/40">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-red-300 mb-12">
                Contribution Process
              </h2>
              <div className="grid md:grid-cols-5 gap-4">
                {steps.map((item, idx) => (
                  <div key={idx} className="relative">
                    <Card className="bg-red-950/20 border-red-400/30">
                      <CardContent className="pt-6">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center text-white font-bold mb-3">
                          {item.step}
                        </div>
                        <h3 className="font-bold text-red-300 mb-2 text-sm">
                          {item.title}
                        </h3>
                        <p className="text-xs text-red-200/70">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                    {idx < steps.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 right-0 translate-x-1/2 transform">
                        <ArrowRight className="h-5 w-5 text-red-400/40" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Featured Projects */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-red-300 mb-8">
                Open Projects
              </h2>
              <div className="space-y-4">
                {projects.map((project, idx) => (
                  <Card
                    key={idx}
                    className="bg-red-950/20 border-red-400/30 hover:border-red-400/60 transition-all"
                  >
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-bold text-red-300 mb-2">
                            {project.name}
                          </h3>
                          <p className="text-sm text-red-200/70 mb-3">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Badge className="bg-red-500/20 text-red-300 border border-red-400/40 text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              {project.stars}
                            </Badge>
                            <Badge className="bg-red-500/20 text-red-300 border border-red-400/40 text-xs">
                              {project.language}
                            </Badge>
                            <Badge className="bg-red-500/20 text-red-300 border border-red-400/40 text-xs">
                              {project.issues}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-red-400 font-semibold mb-1">
                              DIFFICULTY
                            </p>
                            <Badge
                              className={`${
                                project.difficulty === "Beginner"
                                  ? "bg-green-500/20 text-green-300"
                                  : project.difficulty === "Intermediate"
                                    ? "bg-yellow-500/20 text-yellow-300"
                                    : "bg-orange-500/20 text-orange-300"
                              } border`}
                            >
                              {project.difficulty}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            className="text-red-300 hover:bg-red-500/10"
                          >
                            View →
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 border-t border-red-400/10">
            <div className="container mx-auto max-w-4xl px-4 text-center">
              <h2 className="text-3xl font-bold text-red-300 mb-4">
                Ready to Contribute?
              </h2>
              <p className="text-lg text-red-100/80 mb-8">
                Check out our GitHub repositories and start contributing today.
                Even small contributions make a big difference!
              </p>
              <Button
                className="bg-red-400 text-black hover:bg-red-300 shadow-[0_0_30px_rgba(239,68,68,0.35)]"
                onClick={() => navigate("/foundation/learn-more")}
              >
                View Learning Resources
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
