import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, BookOpen, Code, Globe } from "lucide-react";

export default function Foundation() {
  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient py-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-red-500/10 to-transparent" />
          <div className="container mx-auto max-w-7xl relative px-4 py-20 md:py-32">
            <div className="text-center space-y-6 animate-slide-down">
              <div className="inline-block">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400">
                  <Heart className="h-4 w-4" />
                  <span className="text-sm font-medium">Aethex Foundation</span>
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white">
                Open Source &amp; Education
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Democratizing technology through open source and education. We believe knowledge should be free, and great tools should be accessible to everyone.
              </p>
              <div className="flex gap-4 justify-center pt-4">
                <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white">
                  Contribute
                </Button>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Grid */}
        <section className="container mx-auto max-w-7xl px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-card/50 border-border/50 hover:border-red-500/50 transition-colors">
              <CardHeader>
                <Code className="h-8 w-8 text-red-400 mb-2" />
                <CardTitle>Open Source</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Publishing and maintaining tools that benefit the entire community.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 hover:border-red-500/50 transition-colors">
              <CardHeader>
                <BookOpen className="h-8 w-8 text-red-400 mb-2" />
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Accessible learning resources for developers at all skill levels.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 hover:border-red-500/50 transition-colors">
              <CardHeader>
                <Globe className="h-8 w-8 text-red-400 mb-2" />
                <CardTitle>Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Building a welcoming ecosystem where everyone can grow and contribute.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 hover:border-red-500/50 transition-colors">
              <CardHeader>
                <Heart className="h-8 w-8 text-red-400 mb-2" />
                <CardTitle>Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Creating positive change through technology and knowledge sharing.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto max-w-7xl px-4 py-16">
          <div className="rounded-xl bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 p-8 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Make an Impact
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join us in our mission to make technology education and open source accessible to everyone around the world.
            </p>
            <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white">
              Get Involved
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
}
