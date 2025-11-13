import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useArmTheme } from "@/contexts/ArmThemeContext";
import {
  Heart,
  BookOpen,
  Code,
  Users,
  Zap,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import { useArmToast } from "@/hooks/use-arm-toast";

export default function Foundation() {
  const navigate = useNavigate();
  const { theme } = useArmTheme();
  const armToast = useArmToast();
  const [isLoading, setIsLoading] = useState(true);
  const toastShownRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!toastShownRef.current) {
        armToast.system("Foundation network connected");
        toastShownRef.current = true;
      }
    }, 900);

    return () => clearTimeout(timer);
  }, [armToast]);

  if (isLoading) {
    return (
      <LoadingScreen
        message="Connecting Foundation Network..."
        showProgress={true}
        duration={900}
        accentColor="from-red-500 to-red-400"
        armLogo="https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fc02cb1bf5056479bbb3ea4bd91f0d472?format=webp&width=800"
      />
    );
  }

  const openSourceProjects = [
    {
      name: "AeThex Game Engine",
      description:
        "Lightweight, performant game engine optimized for web and native platforms",
      stars: "2.5K",
      language: "Rust",
      link: "github.com/aethex/game-engine",
    },
    {
      name: "Roblox Toolkit",
      description:
        "Comprehensive library for building professional Roblox experiences",
      stars: "1.8K",
      language: "Lua",
      link: "github.com/aethex/roblox-toolkit",
    },
    {
      name: "Developer CLI",
      description:
        "Command-line tools for streamlined game development workflow",
      stars: "1.2K",
      language: "Go",
      link: "github.com/aethex/dev-cli",
    },
    {
      name: "Multiplayer Framework",
      description: "Drop-in networking layer for real-time multiplayer games",
      stars: "980",
      language: "TypeScript",
      link: "github.com/aethex/multiplayer",
    },
    {
      name: "Asset Pipeline",
      description:
        "Automated asset processing and optimization for game development",
      stars: "750",
      language: "Python",
      link: "github.com/aethex/asset-pipeline",
    },
    {
      name: "Education Platform",
      description: "Open-source learning platform for game development courses",
      stars: "640",
      language: "JavaScript",
      link: "github.com/aethex/education",
    },
  ];

  const workshops = [
    {
      title: "Intro to Roblox Development",
      date: "Every Saturday",
      duration: "2 hours",
      level: "Beginner",
      attendees: "150+/month",
    },
    {
      title: "Advanced Game Architecture",
      date: "Monthly",
      duration: "4 hours",
      level: "Advanced",
      attendees: "50+/month",
    },
    {
      title: "Multiplayer Game Design",
      date: "Bi-weekly",
      duration: "2 hours",
      level: "Intermediate",
      attendees: "100+/month",
    },
  ];

  const resources = [
    {
      title: "Game Development Fundamentals",
      type: "Video Course",
      lessons: 50,
      duration: "20 hours",
    },
    {
      title: "Roblox Best Practices Guide",
      type: "Written Guide",
      pages: 120,
      downloads: "10K+",
    },
    {
      title: "Architecture Patterns for Games",
      type: "Interactive Tutorial",
      modules: 8,
      projects: 4,
    },
    {
      title: "Performance Optimization Handbook",
      type: "Technical Reference",
      chapters: 15,
      code_samples: "100+",
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
          {/* Hero Section */}
          <section className="py-16 lg:py-24">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="mb-8 flex justify-center">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fc02cb1bf5056479bbb3ea4bd91f0d472?format=webp&width=800"
                  alt="Foundation Logo"
                  className="h-24 w-24 object-contain drop-shadow-lg"
                />
              </div>
              <Badge className="border-red-400/40 bg-red-500/10 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.2)] mb-6">
                <Heart className="h-4 w-4 mr-2" />
                AeThex Foundation
              </Badge>

              <div className="space-y-6 mb-12">
                <h1 className={`text-5xl lg:text-7xl font-black text-red-300 leading-tight ${theme.fontClass}`}>
                  Community Impact & Talent Pipeline
                </h1>
                <p className="text-xl text-red-100/70 max-w-3xl">
                  AeThex Foundation builds goodwill through open-source code
                  (permissive licensing for maximum adoption), educational
                  curriculum, and community workshops. We create a specialized
                  talent pipeline feeding our ecosystem while advancing the
                  broader developer community.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="bg-red-400 text-black hover:bg-red-300"
                  onClick={() => navigate("/foundation/get-involved")}
                >
                  Contribute
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="border-red-400/40 text-red-300 hover:bg-red-500/10"
                  onClick={() => navigate("/foundation/learn-more")}
                >
                  Learn Free
                </Button>
              </div>

              {/* Creator Network CTAs */}
              <div className="mt-8 pt-8 border-t border-red-400/20">
                <p className="text-sm text-red-200/70 mb-4">
                  Explore our creator community:
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-400/30 text-red-300 hover:bg-red-500/10"
                    onClick={() => navigate("/creators?arm=foundation")}
                  >
                    Browse Community Creators
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-400/30 text-red-300 hover:bg-red-500/10"
                    onClick={() => navigate("/opportunities?arm=foundation")}
                  >
                    View Community Opportunities
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Open Source Projects */}
          <section className="py-16 border-t border-red-400/10 bg-black/40">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-red-300 mb-12 flex items-center gap-2">
                <Code className="h-8 w-8" />
                Open Source Projects
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {openSourceProjects.map((project, idx) => (
                  <Card
                    key={idx}
                    className="bg-red-950/20 border-red-400/30 hover:border-red-400/60 transition-all"
                  >
                    <CardHeader>
                      <CardTitle className="text-red-300">
                        {project.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-red-200/70">
                        {project.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-red-500/20 text-red-300 border border-red-400/40">
                          ⭐ {project.stars}
                        </Badge>
                        <Badge className="bg-red-500/20 text-red-300 border border-red-400/40">
                          {project.language}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        className="w-full text-red-300 hover:bg-red-500/10"
                      >
                        View on GitHub →
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Community Workshops */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-red-300 mb-12 flex items-center gap-2">
                <Users className="h-8 w-8" />
                Community Workshops
              </h2>
              <div className="space-y-4">
                {workshops.map((workshop, idx) => (
                  <Card
                    key={idx}
                    className="bg-red-950/20 border-red-400/30 hover:border-red-400/60 transition-all"
                  >
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-red-400 mb-1">
                            WORKSHOP
                          </p>
                          <h3 className="text-lg font-bold text-red-300">
                            {workshop.title}
                          </h3>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-red-400 mb-1">
                            SCHEDULE
                          </p>
                          <p className="text-sm text-red-200/80">
                            {workshop.date}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-red-400 mb-1">
                            LEVEL
                          </p>
                          <Badge className="bg-red-500/20 text-red-300 border border-red-400/40">
                            {workshop.level}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold text-red-400 mb-1">
                            ATTENDEES
                          </p>
                          <p className="text-sm font-bold text-red-300">
                            {workshop.attendees}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Free Learning Resources */}
          <section className="py-16 border-t border-red-400/10 bg-black/40">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-red-300 mb-12 flex items-center gap-2">
                <BookOpen className="h-8 w-8" />
                Free Learning Resources
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {resources.map((resource, idx) => (
                  <Card key={idx} className="bg-red-950/20 border-red-400/30">
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div>
                          <Badge className="bg-red-500/20 text-red-300 border border-red-400/40 mb-3">
                            {resource.type}
                          </Badge>
                          <h3 className="text-lg font-bold text-red-300">
                            {resource.title}
                          </h3>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          {resource.lessons && (
                            <div>
                              <p className="text-xs text-red-400">Lessons</p>
                              <p className="text-red-300 font-semibold">
                                {resource.lessons}
                              </p>
                            </div>
                          )}
                          {resource.duration && (
                            <div>
                              <p className="text-xs text-red-400">Duration</p>
                              <p className="text-red-300 font-semibold">
                                {resource.duration}
                              </p>
                            </div>
                          )}
                          {resource.pages && (
                            <div>
                              <p className="text-xs text-red-400">Pages</p>
                              <p className="text-red-300 font-semibold">
                                {resource.pages}
                              </p>
                            </div>
                          )}
                          {resource.downloads && (
                            <div>
                              <p className="text-xs text-red-400">Downloads</p>
                              <p className="text-red-300 font-semibold">
                                {resource.downloads}
                              </p>
                            </div>
                          )}
                          {resource.modules && (
                            <div>
                              <p className="text-xs text-red-400">Modules</p>
                              <p className="text-red-300 font-semibold">
                                {resource.modules}
                              </p>
                            </div>
                          )}
                          {resource.projects && (
                            <div>
                              <p className="text-xs text-red-400">Projects</p>
                              <p className="text-red-300 font-semibold">
                                {resource.projects}
                              </p>
                            </div>
                          )}
                          {resource.chapters && (
                            <div>
                              <p className="text-xs text-red-400">Chapters</p>
                              <p className="text-red-300 font-semibold">
                                {resource.chapters}
                              </p>
                            </div>
                          )}
                          {resource.code_samples && (
                            <div>
                              <p className="text-xs text-red-400">
                                Code Samples
                              </p>
                              <p className="text-red-300 font-semibold">
                                {resource.code_samples}
                              </p>
                            </div>
                          )}
                        </div>

                        <Button
                          variant="ghost"
                          className="w-full text-red-300 hover:bg-red-500/10 mt-3"
                        >
                          Access Free →
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Get Involved */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-red-300 mb-6">
                Ways to Contribute
              </h2>
              <p className="text-lg text-red-100/80 mb-12 max-w-3xl">
                Join our community and help us build the future of game
                development. Whether you're a developer, designer, educator, or
                enthusiast, there's a place for you.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Submit Code",
                    description:
                      "Contribute to our open-source projects on GitHub",
                  },
                  {
                    title: "Teach a Workshop",
                    description:
                      "Share your expertise and train the next generation",
                  },
                  {
                    title: "Report Issues",
                    description:
                      "Help us improve by finding and reporting bugs",
                  },
                ].map((item, idx) => (
                  <Card key={idx} className="bg-red-950/20 border-red-400/30">
                    <CardContent className="pt-6 text-center">
                      <h3 className="font-bold text-red-300 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-red-200/70">
                        {item.description}
                      </p>
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
                Ready to Learn or Contribute?
              </h2>
              <p className="text-lg text-red-100/80 mb-8">
                Dive in today and become part of our global developer community.
              </p>
              <Button
                className="bg-red-400 text-black shadow-[0_0_30px_rgba(239,68,68,0.35)] hover:bg-red-300"
                onClick={() => navigate("/foundation/get-involved")}
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
