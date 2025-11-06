import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Beaker, Lightbulb, Zap, Users } from "lucide-react";

export default function Labs() {
  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white">
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#fbbf24_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(251,191,36,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />

        <main className="relative z-10">
          {/* Hero Section */}
          <section className="relative overflow-hidden py-20 lg:py-28">
            <div className="container mx-auto max-w-6xl px-4 text-center">
              <div className="mx-auto flex max-w-3xl flex-col items-center gap-8">
                <Badge
                  variant="outline"
                  className="border-yellow-400/40 bg-yellow-500/10 text-yellow-300 shadow-[0_0_20px_rgba(251,191,36,0.2)]"
                >
                  <span className="mr-2 inline-flex h-2 w-2 animate-pulse rounded-full bg-yellow-300" />
                  Aethex Labs
                </Badge>

                <h1 className="text-4xl font-black tracking-tight text-yellow-300 sm:text-5xl lg:text-6xl">
                  Research &amp; Development
                </h1>

                <p className="text-lg text-yellow-100/90 sm:text-xl">
                  Where innovation meets experimentation. We push the boundaries of what's possible, exploring cutting-edge technologies and building the future.
                </p>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button
                    size="lg"
                    className="bg-yellow-400 text-black shadow-[0_0_30px_rgba(251,191,36,0.35)] transition hover:bg-yellow-300"
                  >
                    <Beaker className="mr-2 h-5 w-5" />
                    Explore Research
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-yellow-400/60 text-yellow-300 hover:bg-yellow-500/10"
                  >
                    Join Our Team
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="border-y border-yellow-400/10 bg-black/80 py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-yellow-950/20 border-yellow-400/30 hover:border-yellow-400/60 transition-colors">
                  <CardHeader>
                    <Lightbulb className="h-8 w-8 text-yellow-400 mb-2" />
                    <CardTitle className="text-yellow-300">Innovation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-yellow-200/70">
                      Exploring new technologies and methodologies to stay ahead of the curve.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-yellow-950/20 border-yellow-400/30 hover:border-yellow-400/60 transition-colors">
                  <CardHeader>
                    <Zap className="h-8 w-8 text-yellow-400 mb-2" />
                    <CardTitle className="text-yellow-300">Experimentation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-yellow-200/70">
                      Testing ideas in controlled environments to validate concepts before production.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-yellow-950/20 border-yellow-400/30 hover:border-yellow-400/60 transition-colors">
                  <CardHeader>
                    <Users className="h-8 w-8 text-yellow-400 mb-2" />
                    <CardTitle className="text-yellow-300">Collaboration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-yellow-200/70">
                      Working with researchers and developers to push technical boundaries.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-yellow-950/20 border-yellow-400/30 hover:border-yellow-400/60 transition-colors">
                  <CardHeader>
                    <Beaker className="h-8 w-8 text-yellow-400 mb-2" />
                    <CardTitle className="text-yellow-300">Documentation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-yellow-200/70">
                      Sharing findings and insights with the community for collective growth.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 lg:py-28">
            <div className="container mx-auto max-w-4xl px-4 text-center">
              <h2 className="text-4xl font-bold text-yellow-300 mb-4">
                Be Part of the Future
              </h2>
              <p className="text-lg text-yellow-100/80 mb-8">
                Join our research initiatives and help shape the next generation of technology.
              </p>
              <Button
                size="lg"
                className="bg-yellow-400 text-black shadow-[0_0_30px_rgba(251,191,36,0.35)] hover:bg-yellow-300"
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
