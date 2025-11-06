import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, BookOpen, Code } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FoundationAbout() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Animated backgrounds */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#ef4444_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(239,68,68,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(239,68,68,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(239,68,68,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-red-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-red-600/10 rounded-full blur-3xl animate-blob" />

        <main className="relative z-10">
          {/* Header */}
          <section className="relative overflow-hidden py-12 lg:py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <Button
                onClick={() => navigate("/community")}
                variant="ghost"
                className="text-red-300 hover:bg-red-500/10 mb-8"
              >
                ← Back to Foundation
              </Button>

              <h1 className="text-4xl font-black tracking-tight text-red-300 sm:text-5xl mb-4">
                About AeThex Foundation
              </h1>
              <p className="text-lg text-red-100/80 max-w-2xl">
                Empowering developers through education and open source
              </p>
            </div>
          </section>

          {/* Content */}
          <section className="py-12 lg:py-16">
            <div className="container mx-auto max-w-4xl px-4">
              <div className="rounded-lg border border-red-400/30 bg-red-950/20 p-8 mb-12">
                <h2 className="text-2xl font-bold text-red-300 mb-4">Our Mission</h2>
                <p className="text-red-200/80 text-lg leading-relaxed">
                  AeThex Foundation is dedicated to democratizing game development through education, open-source 
                  software, and community engagement. We believe that making powerful development tools and knowledge 
                  freely available lifts the entire industry and empowers creators of all skill levels.
                </p>
              </div>

              {/* Values */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-red-950/20 border-red-400/30">
                  <CardHeader>
                    <Heart className="h-8 w-8 text-red-400 mb-2" />
                    <CardTitle className="text-red-300">Community</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-red-200/70">
                      Building inclusive communities of passionate developers
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-red-950/20 border-red-400/30">
                  <CardHeader>
                    <Code className="h-8 w-8 text-red-400 mb-2" />
                    <CardTitle className="text-red-300">Open Source</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-red-200/70">
                      Maintaining and advancing open-source projects
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-red-950/20 border-red-400/30">
                  <CardHeader>
                    <BookOpen className="h-8 w-8 text-red-400 mb-2" />
                    <CardTitle className="text-red-300">Education</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-red-200/70">
                      Creating accessible learning resources for all levels
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-red-950/20 border-red-400/30">
                  <CardHeader>
                    <Users className="h-8 w-8 text-red-400 mb-2" />
                    <CardTitle className="text-red-300">Mentorship</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-red-200/70">
                      Supporting the next generation of game developers
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
