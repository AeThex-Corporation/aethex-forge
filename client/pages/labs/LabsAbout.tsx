import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Target, Users, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LabsAbout() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Animated backgrounds */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#fbbf24_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(251,191,36,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(251,191,36,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(251,191,36,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-yellow-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-yellow-600/10 rounded-full blur-3xl animate-blob" />

        <main className="relative z-10">
          {/* Header */}
          <section className="relative overflow-hidden py-12 lg:py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <Button
                onClick={() => navigate("/labs")}
                variant="ghost"
                className="text-yellow-300 hover:bg-yellow-500/10 mb-8"
              >
                ← Back to Labs
              </Button>

              <h1 className="text-4xl font-black tracking-tight text-yellow-300 sm:text-5xl mb-4">
                About AeThex Labs
              </h1>
              <p className="text-lg text-yellow-100/80 max-w-2xl">
                Pushing the boundaries of what's possible in game development
              </p>
            </div>
          </section>

          {/* Mission */}
          <section className="py-12 lg:py-16">
            <div className="container mx-auto max-w-4xl px-4">
              <div className="rounded-lg border border-yellow-400/30 bg-yellow-950/20 p-8 mb-12">
                <h2 className="text-2xl font-bold text-yellow-300 mb-4">Our Mission</h2>
                <p className="text-yellow-200/80 text-lg leading-relaxed">
                  AeThex Labs is dedicated to advancing the state of game development through cutting-edge research, 
                  comprehensive documentation, and community education. We believe in the power of collaborative innovation 
                  and are committed to making game development more accessible and efficient for creators everywhere.
                </p>
              </div>

              {/* Values */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <Card className="bg-yellow-950/20 border-yellow-400/30">
                  <CardHeader>
                    <Zap className="h-8 w-8 text-yellow-400 mb-2" />
                    <CardTitle className="text-yellow-300">Innovation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-yellow-200/70">
                      Constantly exploring new techniques and frameworks to push creative boundaries
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-yellow-950/20 border-yellow-400/30">
                  <CardHeader>
                    <Target className="h-8 w-8 text-yellow-400 mb-2" />
                    <CardTitle className="text-yellow-300">Excellence</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-yellow-200/70">
                      Maintaining the highest standards in our research and educational initiatives
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-yellow-950/20 border-yellow-400/30">
                  <CardHeader>
                    <Users className="h-8 w-8 text-yellow-400 mb-2" />
                    <CardTitle className="text-yellow-300">Collaboration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-yellow-200/70">
                      Working together with developers, studios, and tools like Dev-Link to grow the ecosystem
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-yellow-950/20 border-yellow-400/30">
                  <CardHeader>
                    <BookOpen className="h-8 w-8 text-yellow-400 mb-2" />
                    <CardTitle className="text-yellow-300">Education</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-yellow-200/70">
                      Creating resources and knowledge that empower the next generation of developers
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Dev-Link Connection */}
              <div className="rounded-lg border border-yellow-400/30 bg-yellow-950/20 p-8">
                <Badge className="border-yellow-400/40 bg-yellow-500/10 text-yellow-300 mb-4">
                  Ecosystem
                </Badge>
                <h3 className="text-2xl font-bold text-yellow-300 mb-4">
                  Partnering with Dev-Link
                </h3>
                <p className="text-yellow-200/80 mb-4">
                  AeThex Labs works closely with Dev-Link, our professional network platform for Roblox developers, 
                  to ensure our research and innovations directly benefit the developer community. Through Dev-Link, 
                  we connect researchers with talented developers who can implement and refine our findings.
                </p>
                <Button
                  onClick={() => navigate("/dev-link/waitlist")}
                  className="bg-yellow-400 text-black hover:bg-yellow-300"
                >
                  Join Dev-Link
                </Button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
