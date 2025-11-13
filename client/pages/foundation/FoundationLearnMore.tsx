import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  Play,
  FileText,
  Code,
  ArrowRight,
  Download,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FoundationLearnMore() {
  const navigate = useNavigate();

  const resources = [
    {
      id: 1,
      title: "Game Development Fundamentals",
      type: "Video Course",
      icon: Play,
      description:
        "Complete introduction to game development concepts and best practices",
      lessons: "50",
      duration: "20 hours",
      topics: ["Game loops", "Physics", "Input handling", "Asset management"],
      free: true,
    },
    {
      id: 2,
      title: "Roblox Best Practices Guide",
      type: "Written Guide",
      icon: FileText,
      description:
        "Comprehensive guide to building professional Roblox experiences",
      pages: "120",
      downloads: "10K+",
      topics: [
        "Server architecture",
        "Security practices",
        "Performance tips",
        "UI/UX patterns",
      ],
      free: true,
    },
    {
      id: 3,
      title: "Architecture Patterns for Games",
      type: "Interactive Tutorial",
      icon: Code,
      description:
        "Learn scalable architectural patterns used in professional game development",
      modules: "8",
      projects: "4",
      topics: ["MVC pattern", "ECS systems", "Networking", "State management"],
      free: true,
    },
    {
      id: 4,
      title: "Performance Optimization Handbook",
      type: "Technical Reference",
      icon: BookOpen,
      description:
        "In-depth guide to optimizing game performance and reducing latency",
      chapters: "15",
      samples: "100+",
      topics: [
        "Memory optimization",
        "GPU optimization",
        "Network optimization",
        "Profiling tools",
      ],
      free: true,
    },
  ];

  const workshops = [
    {
      title: "Intro to Roblox Development",
      schedule: "Every Saturday",
      time: "2 hours",
      level: "Beginner",
      attendees: "150+/month",
      nextDate: "Jan 18, 2025",
    },
    {
      title: "Advanced Game Architecture",
      schedule: "Monthly (2nd Friday)",
      time: "4 hours",
      level: "Advanced",
      attendees: "50+/month",
      nextDate: "Feb 14, 2025",
    },
    {
      title: "Multiplayer Game Design",
      schedule: "Bi-weekly (Thursdays)",
      time: "2 hours",
      level: "Intermediate",
      attendees: "100+/month",
      nextDate: "Jan 23, 2025",
    },
    {
      title: "Performance & Optimization",
      schedule: "Monthly (3rd Wednesday)",
      time: "3 hours",
      level: "Intermediate",
      attendees: "75+/month",
      nextDate: "Jan 15, 2025",
    },
  ];

  const curriculumPaths = [
    {
      name: "Beginner Game Developer",
      duration: "8 weeks",
      modules: 8,
      description: "Start your game development journey from scratch",
    },
    {
      name: "Roblox Professional",
      duration: "12 weeks",
      modules: 12,
      description: "Master Roblox development for professional work",
    },
    {
      name: "Multiplayer Expert",
      duration: "10 weeks",
      modules: 10,
      description: "Learn to build complex multiplayer systems",
    },
    {
      name: "Game Architecture Master",
      duration: "14 weeks",
      modules: 14,
      description: "Design scalable systems for production games",
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
                Free Learning Resources
              </h1>
              <p className="text-lg text-red-100/80 max-w-3xl">
                Learn game development from the ground up with our free,
                comprehensive educational resources. Everything you need to
                become an expert developer.
              </p>
            </div>
          </section>

          {/* Featured Resources */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-red-300 mb-8">
                Featured Resources
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {resources.map((resource) => {
                  const Icon = resource.icon;
                  return (
                    <Card
                      key={resource.id}
                      className="bg-red-950/20 border-red-400/30 hover:border-red-400/60 transition-all"
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <Icon className="h-8 w-8 text-red-400" />
                          <Badge className="bg-red-500/20 text-red-300 border border-red-400/40">
                            {resource.type}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-bold text-red-300 mb-2">
                          {resource.title}
                        </h3>
                        <p className="text-sm text-red-200/70 mb-4">
                          {resource.description}
                        </p>

                        <div className="grid grid-cols-2 gap-3 mb-4 py-4 border-y border-red-400/10">
                          {resource.lessons && (
                            <div>
                              <p className="text-xs text-red-400 font-semibold">
                                LESSONS
                              </p>
                              <p className="text-red-300 font-bold">
                                {resource.lessons}
                              </p>
                            </div>
                          )}
                          {resource.duration && (
                            <div>
                              <p className="text-xs text-red-400 font-semibold">
                                DURATION
                              </p>
                              <p className="text-red-300 font-bold">
                                {resource.duration}
                              </p>
                            </div>
                          )}
                          {resource.pages && (
                            <div>
                              <p className="text-xs text-red-400 font-semibold">
                                PAGES
                              </p>
                              <p className="text-red-300 font-bold">
                                {resource.pages}
                              </p>
                            </div>
                          )}
                          {resource.downloads && (
                            <div>
                              <p className="text-xs text-red-400 font-semibold">
                                DOWNLOADS
                              </p>
                              <p className="text-red-300 font-bold">
                                {resource.downloads}
                              </p>
                            </div>
                          )}
                          {resource.modules && (
                            <div>
                              <p className="text-xs text-red-400 font-semibold">
                                MODULES
                              </p>
                              <p className="text-red-300 font-bold">
                                {resource.modules}
                              </p>
                            </div>
                          )}
                          {resource.projects && (
                            <div>
                              <p className="text-xs text-red-400 font-semibold">
                                PROJECTS
                              </p>
                              <p className="text-red-300 font-bold">
                                {resource.projects}
                              </p>
                            </div>
                          )}
                          {resource.chapters && (
                            <div>
                              <p className="text-xs text-red-400 font-semibold">
                                CHAPTERS
                              </p>
                              <p className="text-red-300 font-bold">
                                {resource.chapters}
                              </p>
                            </div>
                          )}
                          {resource.samples && (
                            <div>
                              <p className="text-xs text-red-400 font-semibold">
                                CODE SAMPLES
                              </p>
                              <p className="text-red-300 font-bold">
                                {resource.samples}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="mb-4">
                          <p className="text-xs text-red-400 font-semibold mb-2">
                            TOPICS
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {resource.topics.map((topic, idx) => (
                              <Badge
                                key={idx}
                                className="bg-red-500/20 text-red-300 border border-red-400/40 text-xs"
                              >
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Button
                          className="w-full bg-red-400 text-black hover:bg-red-300"
                          size="sm"
                          onClick={() => navigate("/foundation/curriculum")}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Get Resource
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Learning Paths */}
          <section className="py-16 border-t border-red-400/10 bg-black/40">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-red-300 mb-8">
                Learning Paths
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {curriculumPaths.map((path, idx) => (
                  <Card key={idx} className="bg-red-950/20 border-red-400/30">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-bold text-red-300">
                          {path.name}
                        </h3>
                        <Badge className="bg-red-500/20 text-red-300 border border-red-400/40">
                          {path.modules} modules
                        </Badge>
                      </div>
                      <p className="text-sm text-red-200/70 mb-4">
                        {path.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-red-400 font-semibold">
                          Duration: {path.duration}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-300 hover:bg-red-500/10"
                          onClick={() => navigate("/foundation/curriculum")}
                        >
                          Start →
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Workshops */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-red-300 mb-8">
                Upcoming Workshops
              </h2>
              <div className="space-y-4">
                {workshops.map((workshop, idx) => (
                  <Card
                    key={idx}
                    className="bg-red-950/20 border-red-400/30 hover:border-red-400/60 transition-all"
                  >
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-red-400 mb-1">
                            WORKSHOP
                          </p>
                          <p className="font-bold text-red-300">
                            {workshop.title}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-red-400 mb-1">
                            NEXT DATE
                          </p>
                          <p className="text-red-300">{workshop.nextDate}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-red-400 mb-1">
                            DURATION
                          </p>
                          <p className="text-red-300">{workshop.time}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-red-400 mb-1">
                            LEVEL
                          </p>
                          <Badge className="bg-red-500/20 text-red-300 border border-red-400/40">
                            {workshop.level}
                          </Badge>
                        </div>
                        <div className="flex items-end">
                          <Button
                            className="w-full bg-red-400 text-black hover:bg-red-300"
                            size="sm"
                            onClick={() => navigate("/foundation/curriculum")}
                          >
                            Register
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
                Start Your Learning Journey
              </h2>
              <p className="text-lg text-red-100/80 mb-8">
                Choose a learning path and begin mastering game development
                today. Everything is completely free and open to the community.
              </p>
              <Button
                className="bg-red-400 text-black shadow-[0_0_30px_rgba(239,68,68,0.35)] hover:bg-red-300"
                onClick={() => navigate("/foundation/get-involved")}
              >
                Explore More Ways to Contribute
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
