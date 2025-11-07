import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, Heart, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LabsJoinTeam() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Animated grid background */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#fbbf24_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(251,191,36,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(251,191,36,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(251,191,36,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-yellow-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-yellow-600/10 rounded-full blur-3xl animate-blob animation-delay-2000" />

        <main className="relative z-10">
          {/* Hero Section */}
          <section className="relative overflow-hidden py-20 lg:py-28">
            <div className="container mx-auto max-w-6xl px-4 text-center">
              <div className="mx-auto flex max-w-3xl flex-col items-center gap-8">
                <Button
                  variant="ghost"
                  className="text-yellow-300 hover:bg-yellow-500/10"
                  onClick={() => navigate("/labs")}
                >
                  ← Back to Labs
                </Button>

                <Badge
                  variant="outline"
                  className="border-yellow-400/40 bg-yellow-500/10 text-yellow-300 shadow-[0_0_20px_rgba(251,191,36,0.2)]"
                >
                  <Users className="h-5 w-5 mr-2" />
                  Join Our Team
                </Badge>

                <h1 className="text-4xl font-black tracking-tight text-yellow-300 sm:text-5xl lg:text-6xl">
                  We're Hiring Innovators
                </h1>

                <p className="text-lg text-yellow-100/90 sm:text-xl">
                  Join a team of passionate researchers and developers pushing the
                  boundaries of technology. Help us shape the future.
                </p>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button
                    size="lg"
                    className="bg-yellow-400 text-black shadow-[0_0_30px_rgba(251,191,36,0.35)] transition hover:bg-yellow-300"
                  >
                    <Briefcase className="mr-2 h-5 w-5" />
                    View Open Positions
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-yellow-400/60 text-yellow-300 hover:bg-yellow-500/10"
                  >
                    Learn About Culture
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Open Positions Grid */}
          <section className="border-y border-yellow-400/10 bg-black/80 py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-yellow-300 mb-8">
                Open Positions
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-yellow-950/20 border-yellow-400/30 hover:border-yellow-400/60 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-yellow-300">
                      Senior Researcher
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-yellow-200/70">
                      Lead groundbreaking research initiatives and mentor junior
                      researchers.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-yellow-400/60 text-yellow-300 hover:bg-yellow-500/10 w-full"
                    >
                      Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-yellow-950/20 border-yellow-400/30 hover:border-yellow-400/60 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-yellow-300">
                      Full Stack Engineer
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-yellow-200/70">
                      Build tools and platforms that empower our research efforts.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-yellow-400/60 text-yellow-300 hover:bg-yellow-500/10 w-full"
                    >
                      Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-yellow-950/20 border-yellow-400/30 hover:border-yellow-400/60 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-yellow-300">
                      Research Intern
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-yellow-200/70">
                      Start your career in cutting-edge research and development.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-yellow-400/60 text-yellow-300 hover:bg-yellow-500/10 w-full"
                    >
                      Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-yellow-300 mb-8 text-center">
                Why Join Labs
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="bg-yellow-950/20 border-yellow-400/30">
                  <CardHeader>
                    <Heart className="h-8 w-8 text-yellow-400 mb-2" />
                    <CardTitle className="text-yellow-300">
                      Meaningful Work
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-yellow-200/70">
                      Contribute to research that shapes the future of technology
                      and impacts millions.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-yellow-950/20 border-yellow-400/30">
                  <CardHeader>
                    <Users className="h-8 w-8 text-yellow-400 mb-2" />
                    <CardTitle className="text-yellow-300">
                      Amazing Team
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-yellow-200/70">
                      Work alongside brilliant minds passionate about innovation
                      and discovery.
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
