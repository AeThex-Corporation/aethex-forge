import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2, Zap, Target, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function GameForge() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#22c55e_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(34,197,94,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(34,197,94,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(34,197,94,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-green-600/10 rounded-full blur-3xl animate-blob animation-delay-2000" />

        <main className="relative z-10">
          {/* Hero Section */}
          <section className="relative overflow-hidden py-20 lg:py-28">
            <div className="container mx-auto max-w-6xl px-4 text-center">
              <div className="mx-auto flex max-w-3xl flex-col items-center gap-8">
                <Badge
                  variant="outline"
                  className="border-green-400/40 bg-green-500/10 text-green-300 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                >
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fcd3534c1caa0497abfd44224040c6059?format=webp&width=800"
                    alt="GameForge"
                    className="h-5 w-5 mr-2"
                  />
                  GameForge
                </Badge>

                <h1 className="text-4xl font-black tracking-tight text-green-300 sm:text-5xl lg:text-6xl">
                  The Heart of AeThex
                </h1>

                <p className="text-lg text-green-100/90 sm:text-xl">
                  Month-to-month shipping cycles. Rapid iteration. Continuous
                  delivery. We don't just build games—we build experiences with
                  unstoppable momentum.
                </p>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button
                    size="lg"
                    className="bg-green-400 text-black shadow-[0_0_30px_rgba(34,197,94,0.35)] transition hover:bg-green-300"
                    onClick={() => navigate("/gameforge/start-building")}
                  >
                    <Gamepad2 className="mr-2 h-5 w-5" />
                    Start Building
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-green-400/60 text-green-300 hover:bg-green-500/10"
                    onClick={() => navigate("/gameforge/view-portfolio")}
                  >
                    View Portfolio
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="border-y border-green-400/10 bg-black/80 py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-green-950/20 border-green-400/30 hover:border-green-400/60 transition-colors">
                  <CardHeader>
                    <Zap className="h-8 w-8 text-green-400 mb-2" />
                    <CardTitle className="text-green-300">
                      Monthly Releases
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-green-200/70">
                      Predictable shipping cycles. Every month, new features and
                      improvements live.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-green-950/20 border-green-400/30 hover:border-green-400/60 transition-colors">
                  <CardHeader>
                    <Target className="h-8 w-8 text-green-400 mb-2" />
                    <CardTitle className="text-green-300">
                      Rapid Iteration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-green-200/70">
                      Fast feedback loops. We listen, iterate, and ship what
                      matters.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-green-950/20 border-green-400/30 hover:border-green-400/60 transition-colors">
                  <CardHeader>
                    <Trophy className="h-8 w-8 text-green-400 mb-2" />
                    <CardTitle className="text-green-300">
                      Quality Driven
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-green-200/70">
                      High standards. Polished experiences. Every release is
                      battle-tested.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-green-950/20 border-green-400/30 hover:border-green-400/60 transition-colors">
                  <CardHeader>
                    <Gamepad2 className="h-8 w-8 text-green-400 mb-2" />
                    <CardTitle className="text-green-300">
                      Player First
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-green-200/70">
                      Always focused on player experience. We build what gets
                      played.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 lg:py-28">
            <div className="container mx-auto max-w-4xl px-4 text-center">
              <h2 className="text-4xl font-bold text-green-300 mb-4">
                Ship With Momentum
              </h2>
              <p className="text-lg text-green-100/80 mb-8">
                Join the fastest shipping team in the industry. We're looking
                for creators, developers, and visionaries.
              </p>
              <Button
                size="lg"
                className="bg-green-400 text-black shadow-[0_0_30px_rgba(34,197,94,0.35)] hover:bg-green-300"
              >
                Join GameForge
              </Button>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
