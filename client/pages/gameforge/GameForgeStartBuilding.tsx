import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2, BookOpen, Zap, Code } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function GameForgeStartBuilding() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Animated grid background */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#22c55e_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(34,197,94,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(34,197,94,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(34,197,94,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-green-600/10 rounded-full blur-3xl animate-blob animation-delay-2000" />

        <main className="relative z-10">
          {/* Hero Section */}
          <section className="relative overflow-hidden py-20 lg:py-28">
            <div className="container mx-auto max-w-6xl px-4 text-center">
              <div className="mx-auto flex max-w-3xl flex-col items-center gap-8">
                <Button
                  variant="ghost"
                  className="text-green-300 hover:bg-green-500/10"
                  onClick={() => navigate("/gameforge")}
                >
                  ← Back to GameForge
                </Button>

                <Badge
                  variant="outline"
                  className="border-green-400/40 bg-green-500/10 text-green-300 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                >
                  <Gamepad2 className="h-5 w-5 mr-2" />
                  Start Building
                </Badge>

                <h1 className="text-4xl font-black tracking-tight text-green-300 sm:text-5xl lg:text-6xl">
                  Build Amazing Games
                </h1>

                <p className="text-lg text-green-100/90 sm:text-xl">
                  Everything you need to start creating. From tutorials to
                  templates, we've got you covered.
                </p>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button
                    size="lg"
                    className="bg-green-400 text-black shadow-[0_0_30px_rgba(34,197,94,0.35)] transition hover:bg-green-300"
                  >
                    <BookOpen className="mr-2 h-5 w-5" />
                    View Tutorials
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-green-400/60 text-green-300 hover:bg-green-500/10"
                  >
                    Get Templates
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Resources Grid */}
          <section className="border-y border-green-400/10 bg-black/80 py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-green-300 mb-8">
                Building Resources
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-green-950/20 border-green-400/30 hover:border-green-400/60 transition-colors">
                  <CardHeader>
                    <Code className="h-8 w-8 text-green-400 mb-2" />
                    <CardTitle className="text-green-300">
                      Documentation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-green-200/70">
                      Comprehensive guides and API reference for all tools and
                      frameworks.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-green-950/20 border-green-400/30 hover:border-green-400/60 transition-colors">
                  <CardHeader>
                    <Zap className="h-8 w-8 text-green-400 mb-2" />
                    <CardTitle className="text-green-300">
                      Quick Start
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-green-200/70">
                      Get your first game up and running in minutes with our
                      setup guides.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-green-950/20 border-green-400/30 hover:border-green-400/60 transition-colors">
                  <CardHeader>
                    <BookOpen className="h-8 w-8 text-green-400 mb-2" />
                    <CardTitle className="text-green-300">
                      Video Tutorials
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-green-200/70">
                      Learn by watching. Hundreds of video tutorials for all
                      skill levels.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-green-950/20 border-green-400/30 hover:border-green-400/60 transition-colors">
                  <CardHeader>
                    <Gamepad2 className="h-8 w-8 text-green-400 mb-2" />
                    <CardTitle className="text-green-300">
                      Game Templates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-green-200/70">
                      Starting templates and boilerplates for various game genres
                      and styles.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
