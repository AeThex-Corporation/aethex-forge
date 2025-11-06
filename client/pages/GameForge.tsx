import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2, Zap, Target, Trophy } from "lucide-react";

export default function GameForge() {
  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient py-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 to-transparent" />
          <div className="container mx-auto max-w-7xl relative px-4 py-20 md:py-32">
            <div className="text-center space-y-6 animate-slide-down">
              <div className="inline-block">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400">
                  <Gamepad2 className="h-4 w-4" />
                  <span className="text-sm font-medium">GameForge</span>
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white">
                The Heart of AeThex
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Month-to-month shipping cycles. Rapid iteration. Continuous delivery. We don't just build games—we build experiences with unstoppable momentum.
              </p>
              <div className="flex gap-4 justify-center pt-4">
                <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black">
                  Start Building
                </Button>
                <Button size="lg" variant="outline">
                  View Portfolio
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto max-w-7xl px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-card/50 border-border/50 hover:border-green-500/50 transition-colors">
              <CardHeader>
                <Zap className="h-8 w-8 text-green-400 mb-2" />
                <CardTitle>Monthly Releases</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Predictable shipping cycles. Every month, new features and improvements live.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 hover:border-green-500/50 transition-colors">
              <CardHeader>
                <Target className="h-8 w-8 text-green-400 mb-2" />
                <CardTitle>Rapid Iteration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Fast feedback loops. We listen, iterate, and ship what matters.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 hover:border-green-500/50 transition-colors">
              <CardHeader>
                <Trophy className="h-8 w-8 text-green-400 mb-2" />
                <CardTitle>Quality Driven</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  High standards. Polished experiences. Every release is battle-tested.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 hover:border-green-500/50 transition-colors">
              <CardHeader>
                <Gamepad2 className="h-8 w-8 text-green-400 mb-2" />
                <CardTitle>Player First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Always focused on player experience. We build what gets played.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto max-w-7xl px-4 py-16">
          <div className="rounded-xl bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 p-8 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ship With Momentum
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join the fastest shipping team in the industry. We're looking for creators, developers, and visionaries.
            </p>
            <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black">
              Join GameForge
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
}
