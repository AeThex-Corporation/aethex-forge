import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Video, Code, Users, ArrowRight, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FoundationLearnMore() {
  const navigate = useNavigate();

  const learningPaths = [
    {
      title: "Game Development Fundamentals",
      description: "Master the core concepts and best practices",
      duration: "6 weeks",
      level: "Beginner",
      format: "Video Course",
      modules: 12,
    },
    {
      title: "Roblox Development Mastery",
      description: "Build professional Roblox experiences",
      duration: "8 weeks",
      level: "Intermediate",
      format: "Interactive Tutorial",
      modules: 16,
    },
    {
      title: "Advanced Game Architecture",
      description: "Scalable systems and optimization",
      duration: "10 weeks",
      level: "Advanced",
      format: "Project-Based",
      modules: 20,
    },
    {
      title: "Game Art & Animation",
      description: "Create stunning visuals and smooth animations",
      duration: "7 weeks",
      level: "Intermediate",
      format: "Video Tutorials",
      modules: 14,
    },
  ];

  const resources = [
    {
      type: "Documentation",
      icon: <BookOpen className="h-6 w-6" />,
      count: "50+",
      description: "Guides and API reference",
    },
    {
      type: "Video Tutorials",
      icon: <Video className="h-6 w-6" />,
      count: "200+",
      description: "Hours of content",
    },
    {
      type: "Code Examples",
      icon: <Code className="h-6 w-6" />,
      count: "100+",
      description: "Ready-to-use code",
    },
    {
      type: "Community",
      icon: <Users className="h-6 w-6" />,
      count: "50K+",
      description: "Active developers",
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
                Learning Resources
              </h1>
              <p className="text-lg text-red-100/80 max-w-3xl">
                Free educational content to help you master game development and Roblox.
              </p>
            </div>
          </section>

          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-red-300 mb-8">
                Learning Paths
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {learningPaths.map((path, idx) => (
                  <Card
                    key={idx}
                    className="bg-red-950/20 border-red-400/30 hover:border-red-400/60 transition-all"
                  >
                    <CardContent className="pt-6 space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-red-300 mb-1">
                          {path.title}
                        </h3>
                        <p className="text-sm text-red-200/70">
                          {path.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-red-500/20 text-red-300 border border-red-400/40 text-xs">
                          {path.level}
                        </Badge>
                        <Badge className="bg-red-500/20 text-red-300 border border-red-400/40 text-xs">
                          {path.format}
                        </Badge>
                      </div>

                      <div className="pt-4 border-t border-red-400/10 space-y-2">
                        <div className="text-xs text-red-400 font-semibold">
                          {path.duration} • {path.modules} modules
                        </div>
                        <Button
                          className="w-full bg-red-400 text-black hover:bg-red-300"
                          size="sm"
                        >
                          Start Learning
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
                What's Included
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {resources.map((resource, idx) => (
                  <Card
                    key={idx}
                    className="bg-red-950/20 border-red-400/30 text-center"
                  >
                    <CardContent className="pt-6">
                      <div className="text-red-400 mb-3 flex justify-center">
                        {resource.icon}
                      </div>
                      <p className="text-2xl font-black text-red-300 mb-1">
                        {resource.count}
                      </p>
                      <p className="text-xs font-semibold text-red-400 mb-1">
                        {resource.type}
                      </p>
                      <p className="text-xs text-red-200/70">
                        {resource.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 border-t border-red-400/10">
            <div className="container mx-auto max-w-4xl px-4 text-center">
              <h2 className="text-3xl font-bold text-red-300 mb-4">
                Start Your Journey
              </h2>
              <p className="text-lg text-red-100/80 mb-8">
                Choose a learning path and begin mastering game development.
              </p>
              <Button
                className="bg-red-400 text-black hover:bg-red-300"
              >
                Browse All Courses
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
