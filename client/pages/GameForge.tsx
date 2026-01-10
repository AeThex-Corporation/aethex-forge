import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useArmTheme } from "@/contexts/ArmThemeContext";
import {
  Gamepad2,
  Calendar,
  Users,
  TrendingUp,
  Rocket,
  ArrowRight,
  ExternalLink,
  Zap,
  Target,
  Code,
  Palette,
  Music,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import { useArmToast } from "@/hooks/use-arm-toast";

export default function GameForge() {
  const navigate = useNavigate();
  const { theme } = useArmTheme();
  const armToast = useArmToast();
  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const toastShownRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!toastShownRef.current) {
        armToast.system("GameForge engine initialized");
        toastShownRef.current = true;
      }
    }, 900);

    return () => clearTimeout(timer);
  }, [armToast]);

  // Auto-redirect countdown
  useEffect(() => {
    if (isLoading) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      window.location.href = 'https://aethex.foundation/gameforge';
    }
  }, [countdown, isLoading]);

  if (isLoading) {
    return (
      <LoadingScreen
        message="Booting GameForge Engine..."
        showProgress={true}
        duration={900}
        accentColor="from-green-500 to-green-400"
        armLogo="https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fcd3534c1caa0497abfd44224040c6059?format=webp&width=800"
      />
    );
  }

  const productionStats = [
    { label: "Games Shipped", value: "15+", icon: Rocket },
    { label: "Active Players", value: "200K+", icon: Users },
    { label: "Team Members", value: "25", icon: Users },
    { label: "Avg Development", value: "32 days", icon: Calendar },
  ];

  const features = [
    {
      icon: Zap,
      title: "30-Day Production Cycle",
      description: "Ship complete games from concept to live in under a month using proven development pipelines.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Users,
      title: "Collaborative Teams",
      description: "Work alongside designers, developers, artists, and musicians in cross-functional squads.",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      icon: Target,
      title: "Real Portfolio Projects",
      description: "Build your aethex.me passport with shipped games that prove your ability to execute.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: TrendingUp,
      title: "Proven Technology",
      description: "Use cutting-edge tools and frameworks developed by AeThex Labs for rapid game development.",
      gradient: "from-orange-500 to-red-500"
    },
  ];

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Informational Banner with Countdown */}
        <div className="bg-green-500/10 border-b border-green-400/30 py-3 sticky top-0 z-50 backdrop-blur-sm">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <ExternalLink className="h-5 w-5 text-green-400 animate-pulse" />
                <p className="text-sm text-green-200">
                  <strong>Redirecting in {countdown}s...</strong> GameForge is hosted at{" "}
                  <a href="https://aethex.foundation/gameforge" className="underline font-semibold hover:text-green-300">
                    aethex.foundation/gameforge
                  </a>
                </p>
              </div>
              <Button
                size="sm"
                className="bg-green-400 text-black hover:bg-green-300"
                onClick={() => window.location.href = 'https://aethex.foundation/gameforge'}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Go Now
              </Button>
            </div>
          </div>
        </div>

        {/* Background Effects */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.15] [background-image:radial-gradient(circle_at_top,#22c55e_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(34,197,94,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute top-20 left-10 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl animate-blob animation-delay-2000" />

        <main className="relative z-10">
          {/* Hero Section */}
          <section className="py-20 lg:py-32">
            <div className="container mx-auto max-w-7xl px-4">
              <div className="text-center space-y-8">
                <div className="flex justify-center mb-6">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fcd3534c1caa0497abfd44224040c6059?format=webp&width=800"
                    alt="GameForge Logo"
                    className="h-32 w-32 object-contain drop-shadow-[0_0_40px_rgba(34,197,94,0.5)]"
                  />
                </div>

                <div className="space-y-6 max-w-5xl mx-auto">
                  <Badge className="border-green-400/50 bg-green-500/10 text-green-300 text-base px-4 py-1.5">
                    <Gamepad2 className="h-5 w-5 mr-2" />
                    Foundation's Game Production Studio
                  </Badge>

                  <h1 className={`text-5xl md:text-6xl lg:text-7xl font-black text-green-300 leading-tight ${theme.fontClass}`}>
                    Ship Games Every Month
                  </h1>

                  <p className="text-xl md:text-2xl text-green-100/80 max-w-3xl mx-auto leading-relaxed">
                    AeThex GameForge is a master-apprentice mentorship program where teams of 5 developers ship real games in 30-day sprints.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                  <Button
                    size="lg"
                    className="bg-green-400 text-black hover:bg-green-300 shadow-[0_0_40px_rgba(34,197,94,0.3)] h-14 px-8 text-lg"
                    onClick={() => window.location.href = 'https://aethex.foundation/gameforge'}
                  >
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Visit GameForge Platform
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-green-400/50 text-green-300 hover:bg-green-500/10 h-14 px-8 text-lg"
                    onClick={() => window.location.href = 'https://aethex.foundation'}
                  >
                    About Foundation
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-16 border-y border-green-400/10 bg-black/40 backdrop-blur-sm">
            <div className="container mx-auto max-w-7xl px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {productionStats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={idx}
                      className="text-center space-y-3 p-6 rounded-lg bg-green-950/30 border border-green-400/20 hover:border-green-400/40 transition-all hover:scale-105"
                    >
                      <Icon className="h-8 w-8 text-green-400 mx-auto" />
                      <p className="text-4xl md:text-5xl font-black text-green-400">
                        {stat.value}
                      </p>
                      <p className="text-sm text-green-200/70">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="py-20 lg:py-28">
            <div className="container mx-auto max-w-7xl px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black text-green-300 mb-4">
                  Why Join GameForge?
                </h2>
                <p className="text-xl text-green-100/70 max-w-3xl mx-auto">
                  The fastest way to build a real game development portfolio and prove you can ship.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {features.map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <Card
                      key={idx}
                      className="bg-green-950/20 border-green-400/30 hover:border-green-400/60 transition-all hover:scale-105 group"
                    >
                      <CardHeader>
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                        <CardTitle className="text-2xl text-green-300">
                          {feature.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-green-200/80 leading-relaxed">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="py-20 lg:py-28 border-t border-green-400/10 bg-black/40">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black text-green-300 mb-4">
                  The 30-Day Sprint
                </h2>
                <p className="text-xl text-green-100/70">
                  From concept to shipped game in one month
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    week: "Week 1",
                    title: "Ideation & Prototyping",
                    description: "Define game concept, create GDD, build playable prototype",
                    tasks: ["Team formation", "Concept validation", "Core mechanics test"]
                  },
                  {
                    week: "Week 2",
                    title: "Development Sprint",
                    description: "Parallel production: code, art, sound, narrative",
                    tasks: ["Feature implementation", "Asset creation", "Level design"]
                  },
                  {
                    week: "Week 3",
                    title: "Polish & Integration",
                    description: "Integrate assets, refine gameplay, balance mechanics",
                    tasks: ["Bug fixing", "Playtesting", "Performance optimization"]
                  },
                  {
                    week: "Week 4",
                    title: "QA & Launch",
                    description: "Final testing, deployment, and post-launch monitoring",
                    tasks: ["Final QA", "Ship to aethex.fun", "Community showcase"]
                  },
                ].map((phase, idx) => (
                  <Card
                    key={idx}
                    className="bg-green-950/20 border-green-400/30 hover:border-green-400/50 transition-all"
                  >
                    <CardContent className="p-8">
                      <div className="flex gap-6 items-start">
                        <div className="flex-shrink-0">
                          <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-2xl font-black text-white shadow-lg">
                            {idx + 1}
                          </div>
                        </div>
                        <div className="flex-1 space-y-3">
                          <div>
                            <Badge className="bg-green-500/20 text-green-300 border border-green-400/40 mb-2">
                              {phase.week}
                            </Badge>
                            <h3 className="text-2xl font-bold text-green-300 mb-2">
                              {phase.title}
                            </h3>
                            <p className="text-green-200/80 text-lg">
                              {phase.description}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {phase.tasks.map((task, taskIdx) => (
                              <Badge key={taskIdx} variant="outline" className="border-green-400/30 text-green-300 text-sm">
                                {task}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Team Roles */}
          <section className="py-20 lg:py-28">
            <div className="container mx-auto max-w-7xl px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black text-green-300 mb-4">
                  Squad Structure
                </h2>
                <p className="text-xl text-green-100/70">
                  Every team has 5 members with specialized roles
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {[
                  { role: "Forge Master", icon: Target, description: "Mentor & Lead", color: "from-green-500 to-emerald-500" },
                  { role: "Scripter", icon: Code, description: "Programming", color: "from-blue-500 to-cyan-500" },
                  { role: "Builder", icon: Palette, description: "Art & Design", color: "from-purple-500 to-pink-500" },
                  { role: "Sound Designer", icon: Music, description: "Audio & Music", color: "from-orange-500 to-red-500" },
                  { role: "Narrative", icon: Users, description: "Story & UX", color: "from-yellow-500 to-amber-500" },
                ].map((member, idx) => {
                  const Icon = member.icon;
                  return (
                    <Card
                      key={idx}
                      className="bg-green-950/20 border-green-400/30 hover:border-green-400/60 transition-all hover:scale-105 text-center"
                    >
                      <CardContent className="pt-8 pb-6 space-y-4">
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${member.color} flex items-center justify-center mx-auto shadow-lg`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-green-300 mb-1">
                            {member.role}
                          </h3>
                          <p className="text-sm text-green-200/70">
                            {member.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 lg:py-32 border-t border-green-400/10">
            <div className="container mx-auto max-w-5xl px-4">
              <Card className="bg-gradient-to-r from-green-600/20 via-emerald-600/10 to-green-600/20 border-green-500/50 overflow-hidden relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.1)_0%,transparent_70%)]" />
                <CardContent className="p-12 lg:p-16 text-center space-y-8 relative z-10">
                  <div className="space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black text-white">
                      Ready to Ship Your First Game?
                    </h2>
                    <p className="text-xl text-green-100 max-w-2xl mx-auto">
                      Join the next GameForge cohort and build your portfolio with real, shipped games.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      size="lg"
                      className="bg-green-400 text-black hover:bg-green-300 shadow-[0_0_40px_rgba(34,197,94,0.4)] h-14 px-8 text-lg"
                      onClick={() => window.location.href = 'https://aethex.foundation/gameforge'}
                    >
                      <Rocket className="mr-2 h-5 w-5" />
                      Join GameForge Now
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-green-400/50 text-green-300 hover:bg-green-500/10 h-14 px-8 text-lg"
                      onClick={() => window.location.href = 'https://aethex.foundation'}
                    >
                      Learn About Foundation
                    </Button>
                  </div>

                  <p className="text-sm text-green-300/60 pt-4">
                    Part of the AeThex Foundation 501(c)(3) non-profit
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
