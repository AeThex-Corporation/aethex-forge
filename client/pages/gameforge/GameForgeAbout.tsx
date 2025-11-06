import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Target, Users, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function GameForgeAbout() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Animated backgrounds */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#22c55e_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(34,197,94,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(34,197,94,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(34,197,94,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-green-600/10 rounded-full blur-3xl animate-blob" />

        <main className="relative z-10">
          {/* Header */}
          <section className="relative overflow-hidden py-12 lg:py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <Button
                onClick={() => navigate("/game-development")}
                variant="ghost"
                className="text-green-300 hover:bg-green-500/10 mb-8"
              >
                ← Back to GameForge
              </Button>

              <h1 className="text-4xl font-black tracking-tight text-green-300 sm:text-5xl mb-4">
                About GameForge
              </h1>
              <p className="text-lg text-green-100/80 max-w-2xl">
                Empowering developers to ship faster and better
              </p>
            </div>
          </section>

          {/* Content */}
          <section className="py-12 lg:py-16">
            <div className="container mx-auto max-w-4xl px-4">
              <div className="rounded-lg border border-green-400/30 bg-green-950/20 p-8 mb-12">
                <h2 className="text-2xl font-bold text-green-300 mb-4">Our Mission</h2>
                <p className="text-green-200/80 text-lg leading-relaxed">
                  GameForge is dedicated to accelerating game development by providing studios with the tools, 
                  practices, and infrastructure they need to maintain monthly shipping cycles. We believe that faster 
                  iteration leads to better games and happier teams.
                </p>
              </div>

              {/* Values */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-green-950/20 border-green-400/30">
                  <CardHeader>
                    <Zap className="h-8 w-8 text-green-400 mb-2" />
                    <CardTitle className="text-green-300">Speed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-200/70">
                      Fast iteration cycles that keep your team productive
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-green-950/20 border-green-400/30">
                  <CardHeader>
                    <Target className="h-8 w-8 text-green-400 mb-2" />
                    <CardTitle className="text-green-300">Reliability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-200/70">
                      Stable tools and practices you can depend on
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-green-950/20 border-green-400/30">
                  <CardHeader>
                    <Users className="h-8 w-8 text-green-400 mb-2" />
                    <CardTitle className="text-green-300">Community</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-200/70">
                      Support from developers and studios using GameForge
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-green-950/20 border-green-400/30">
                  <CardHeader>
                    <Lightbulb className="h-8 w-8 text-green-400 mb-2" />
                    <CardTitle className="text-green-300">Innovation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-200/70">
                      Continuous improvement driven by user feedback
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
