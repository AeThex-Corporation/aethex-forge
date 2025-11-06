import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Zap, TrendingUp, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DevLinkAbout() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Animated backgrounds */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#06b6d4_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(6,182,212,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(6,182,212,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl animate-blob" />

        <main className="relative z-10">
          {/* Header */}
          <section className="relative overflow-hidden py-12 lg:py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <Button
                onClick={() => navigate("/dev-link")}
                variant="ghost"
                className="text-cyan-300 hover:bg-cyan-500/10 mb-8"
              >
                ← Back to Dev-Link
              </Button>

              <h1 className="text-4xl font-black tracking-tight text-cyan-300 sm:text-5xl mb-4">
                About Dev-Link
              </h1>
              <p className="text-lg text-cyan-100/80 max-w-2xl">
                The professional network for Roblox developers
              </p>
            </div>
          </section>

          {/* Content */}
          <section className="py-12 lg:py-16">
            <div className="container mx-auto max-w-4xl px-4">
              <div className="rounded-lg border border-cyan-400/30 bg-cyan-950/20 p-8 mb-12">
                <h2 className="text-2xl font-bold text-cyan-300 mb-4">Our Mission</h2>
                <p className="text-cyan-200/80 text-lg leading-relaxed">
                  Dev-Link is a professional networking platform designed specifically for Roblox developers. We 
                  connect talented creators, studios, and teams to build meaningful professional relationships, 
                  discover opportunities, and advance careers in the thriving Roblox ecosystem.
                </p>
              </div>

              {/* Values */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-cyan-950/20 border-cyan-400/30">
                  <CardHeader>
                    <Users className="h-8 w-8 text-cyan-400 mb-2" />
                    <CardTitle className="text-cyan-300">Connection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-cyan-200/70">
                      Connecting Roblox developers with peers and opportunities
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-cyan-950/20 border-cyan-400/30">
                  <CardHeader>
                    <Zap className="h-8 w-8 text-cyan-400 mb-2" />
                    <CardTitle className="text-cyan-300">Impact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-cyan-200/70">
                      Creating tangible career and business opportunities
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-cyan-950/20 border-cyan-400/30">
                  <CardHeader>
                    <TrendingUp className="h-8 w-8 text-cyan-400 mb-2" />
                    <CardTitle className="text-cyan-300">Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-cyan-200/70">
                      Supporting career advancement and professional development
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-cyan-950/20 border-cyan-400/30">
                  <CardHeader>
                    <Globe className="h-8 w-8 text-cyan-400 mb-2" />
                    <CardTitle className="text-cyan-300">Community</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-cyan-200/70">
                      Building a vibrant global community of Roblox creators
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
