import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Beaker, Lightbulb, Zap, Users } from "lucide-react";

export default function Labs() {
  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient py-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/10 to-transparent" />
          <div className="container mx-auto max-w-7xl relative px-4 py-20 md:py-32">
            <div className="text-center space-y-6 animate-slide-down">
              <div className="inline-block">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/20 border border-yellow-500/30 text-yellow-400">
                  <Beaker className="h-4 w-4" />
                  <span className="text-sm font-medium">Aethex Labs</span>
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white">
                Research &amp; Development
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Where innovation meets experimentation. We push the boundaries of what's possible, exploring cutting-edge technologies and building the future.
              </p>
              <div className="flex gap-4 justify-center pt-4">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  Explore Research
                </Button>
                <Button size="lg" variant="outline">
                  Join Our Team
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto max-w-7xl px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-card/50 border-border/50 hover:border-yellow-500/50 transition-colors">
              <CardHeader>
                <Lightbulb className="h-8 w-8 text-yellow-400 mb-2" />
                <CardTitle>Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Exploring new technologies and methodologies to stay ahead of the curve.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 hover:border-yellow-500/50 transition-colors">
              <CardHeader>
                <Zap className="h-8 w-8 text-yellow-400 mb-2" />
                <CardTitle>Experimentation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Testing ideas in controlled environments to validate concepts before production.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 hover:border-yellow-500/50 transition-colors">
              <CardHeader>
                <Users className="h-8 w-8 text-yellow-400 mb-2" />
                <CardTitle>Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Working with researchers and developers to push technical boundaries.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 hover:border-yellow-500/50 transition-colors">
              <CardHeader>
                <Beaker className="h-8 w-8 text-yellow-400 mb-2" />
                <CardTitle>Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Sharing findings and insights with the community for collective growth.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto max-w-7xl px-4 py-16">
          <div className="rounded-xl bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 p-8 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Be Part of the Future
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join our research initiatives and help shape the next generation of technology.
            </p>
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black">
              Get Involved
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
}
