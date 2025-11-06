import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Settings, TrendingUp, Users } from "lucide-react";

export default function Corp() {
  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient py-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent" />
          <div className="container mx-auto max-w-7xl relative px-4 py-20 md:py-32">
            <div className="text-center space-y-6 animate-slide-down">
              <div className="inline-block">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400">
                  <Briefcase className="h-4 w-4" />
                  <span className="text-sm font-medium">Aethex Corp</span>
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white">
                Enterprise Solutions
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Strategic consulting, technology integration, and digital transformation for enterprises. We help companies navigate the future.
              </p>
              <div className="flex gap-4 justify-center pt-4">
                <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white">
                  Schedule Consultation
                </Button>
                <Button size="lg" variant="outline">
                  View Case Studies
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="container mx-auto max-w-7xl px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-card/50 border-border/50 hover:border-blue-500/50 transition-colors">
              <CardHeader>
                <Settings className="h-8 w-8 text-blue-400 mb-2" />
                <CardTitle>Consulting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Strategic guidance for digital transformation and technology adoption.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 hover:border-blue-500/50 transition-colors">
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-blue-400 mb-2" />
                <CardTitle>Scale & Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Build robust systems designed for enterprise scale and reliability.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 hover:border-blue-500/50 transition-colors">
              <CardHeader>
                <Users className="h-8 w-8 text-blue-400 mb-2" />
                <CardTitle>Team Partnership</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Work with dedicated teams augmenting your existing development capacity.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 hover:border-blue-500/50 transition-colors">
              <CardHeader>
                <Briefcase className="h-8 w-8 text-blue-400 mb-2" />
                <CardTitle>Solutions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Custom solutions tailored to your business needs and technical requirements.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto max-w-7xl px-4 py-16">
          <div className="rounded-xl bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 p-8 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Transform Your Business
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Let's discuss how AeThex Corp can help accelerate your digital initiatives and drive growth.
            </p>
            <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white">
              Contact Us
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
}
