import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, BookOpen, Code, Globe } from "lucide-react";

export default function Foundation() {
  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#ef4444_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(239,68,68,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(239,68,68,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(239,68,68,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-red-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-red-600/10 rounded-full blur-3xl animate-blob animation-delay-2000" />

        <main className="relative z-10">
          {/* Hero Section */}
          <section className="relative overflow-hidden py-20 lg:py-28">
            <div className="container mx-auto max-w-6xl px-4 text-center">
              <div className="mx-auto flex max-w-3xl flex-col items-center gap-8">
                <Badge
                  variant="outline"
                  className="border-red-400/40 bg-red-500/10 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                >
                  <span className="mr-2 inline-flex h-2 w-2 animate-pulse rounded-full bg-red-300" />
                  Aethex Foundation
                </Badge>

                <h1 className="text-4xl font-black tracking-tight text-red-300 sm:text-5xl lg:text-6xl">
                  Open Source &amp; Education
                </h1>

                <p className="text-lg text-red-100/90 sm:text-xl">
                  Democratizing technology through open source and education. We believe knowledge should be free, and great tools should be accessible to everyone.
                </p>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button
                    size="lg"
                    className="bg-red-400 text-black shadow-[0_0_30px_rgba(239,68,68,0.35)] transition hover:bg-red-300"
                  >
                    <Heart className="mr-2 h-5 w-5" />
                    Contribute
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-red-400/60 text-red-300 hover:bg-red-500/10"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Mission Grid */}
          <section className="border-y border-red-400/10 bg-black/80 py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-red-950/20 border-red-400/30 hover:border-red-400/60 transition-colors">
                  <CardHeader>
                    <Code className="h-8 w-8 text-red-400 mb-2" />
                    <CardTitle className="text-red-300">Open Source</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-red-200/70">
                      Publishing and maintaining tools that benefit the entire community.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-red-950/20 border-red-400/30 hover:border-red-400/60 transition-colors">
                  <CardHeader>
                    <BookOpen className="h-8 w-8 text-red-400 mb-2" />
                    <CardTitle className="text-red-300">Education</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-red-200/70">
                      Accessible learning resources for developers at all skill levels.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-red-950/20 border-red-400/30 hover:border-red-400/60 transition-colors">
                  <CardHeader>
                    <Globe className="h-8 w-8 text-red-400 mb-2" />
                    <CardTitle className="text-red-300">Community</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-red-200/70">
                      Building a welcoming ecosystem where everyone can grow and contribute.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-red-950/20 border-red-400/30 hover:border-red-400/60 transition-colors">
                  <CardHeader>
                    <Heart className="h-8 w-8 text-red-400 mb-2" />
                    <CardTitle className="text-red-300">Impact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-red-200/70">
                      Creating positive change through technology and knowledge sharing.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 lg:py-28">
            <div className="container mx-auto max-w-4xl px-4 text-center">
              <h2 className="text-4xl font-bold text-red-300 mb-4">
                Make an Impact
              </h2>
              <p className="text-lg text-red-100/80 mb-8">
                Join us in our mission to make technology education and open source accessible to everyone around the world.
              </p>
              <Button
                size="lg"
                className="bg-red-400 text-black shadow-[0_0_30px_rgba(239,68,68,0.35)] hover:bg-red-300"
              >
                Get Involved
              </Button>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
