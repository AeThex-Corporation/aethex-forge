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

  const monthlyReleases = [
    {
      month: "January 2025",
      title: "Pixel Quest: Reckoning",
      genre: "Action-Adventure",
      team: "Green Squadron",
      status: "Shipping Now",
      highlights: "New combat system, 50 levels, multiplayer beta",
    },
    {
      month: "February 2025",
      title: "Logic Master Pro",
      genre: "Puzzle",
      team: "Logic Lab",
      status: "Pre-Production",
      highlights: "Daily challenges, leaderboards, cross-platform",
    },
    {
      month: "March 2025",
      title: "Mystic Realms: Awakening",
      genre: "RPG",
      team: "Adventure Wing",
      status: "Development",
      highlights: "Story driven, 100+ hours, procedural dungeons",
    },
  ];

  const pastReleases = [
    {
      title: "Battle Royale X",
      genre: "Action",
      releaseDate: "Dec 2024",
      players: "50K+",
      rating: 4.7,
    },
    {
      title: "Casual Match",
      genre: "Puzzle",
      releaseDate: "Nov 2024",
      players: "100K+",
      rating: 4.5,
    },
    {
      title: "Speedrun Challenge",
      genre: "Action",
      releaseDate: "Oct 2024",
      players: "35K+",
      rating: 4.8,
    },
  ];

  const productionStats = [
    { label: "Games Shipped", value: "15+" },
    { label: "Monthly Cycle", value: "32 days" },
    { label: "Total Players", value: "200K+" },
    { label: "Team Size", value: "25 devs" },
  ];

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#22c55e_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(34,197,94,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(34,197,94,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(34,197,94,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-green-600/10 rounded-full blur-3xl animate-blob animation-delay-2000" />

        <main className="relative z-10">
          {/* Hero Section */}
          <section className="py-16 lg:py-24">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="mb-8 flex justify-center">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fcd3534c1caa0497abfd44224040c6059?format=webp&width=800"
                  alt="GameForge Logo"
                  className="h-24 w-24 object-contain drop-shadow-lg"
                />
              </div>
              <Badge className="border-green-400/40 bg-green-500/10 text-green-300 shadow-[0_0_20px_rgba(34,197,94,0.2)] mb-6">
                <Gamepad2 className="h-4 w-4 mr-2" />
                GameForge Production
              </Badge>

              <div className="space-y-6 mb-12">
                <h1 className={`text-4xl lg:text-6xl font-black text-green-300 leading-tight ${theme.fontClass}`}>
                  Shipping Games Monthly
                </h1>
                <p className="text-xl text-green-100/70 max-w-3xl">
                  AeThex GameForge is our internal production studio that
                  demonstrates disciplined, efficient development. We ship a new
                  game every month using proprietary development pipelines and
                  tools from Labs, proving our technology's real-world impact
                  while maintaining controlled burn rates.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
                <Button
                  className="bg-green-400 text-black hover:bg-green-300"
                  onClick={() => navigate("/gameforge/view-portfolio")}
                >
                  View Recent Releases
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="border-green-400/40 text-green-300 hover:bg-green-500/10"
                  onClick={() => navigate("/gameforge/join-gameforge")}
                >
                  Meet the Team
                </Button>
                <Button
                  variant="outline"
                  className="border-green-400/40 text-green-300 hover:bg-green-500/10"
                  onClick={() => navigate("/creators?arm=gameforge")}
                >
                  Browse GameForge Creators
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="border-green-400/40 text-green-300 hover:bg-green-500/10"
                  onClick={() => navigate("/opportunities?arm=gameforge")}
                >
                  Find GameDev Jobs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </section>

          {/* Production Stats */}
          <section className="py-12 border-t border-green-400/10 bg-black/40">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="grid md:grid-cols-4 gap-6">
                {productionStats.map((stat, idx) => (
                  <Card
                    key={idx}
                    className="bg-green-950/30 border-green-400/40"
                  >
                    <CardContent className="pt-6 text-center">
                      <p className="text-3xl font-black text-green-400 mb-2">
                        {stat.value}
                      </p>
                      <p className="text-sm text-green-200/70">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Upcoming Releases */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-green-300 mb-12 flex items-center gap-2">
                <Calendar className="h-8 w-8" />
                Upcoming Releases
              </h2>
              <div className="space-y-6">
                {monthlyReleases.map((release, idx) => (
                  <Card
                    key={idx}
                    className="bg-green-950/20 border-green-400/30 hover:border-green-400/60 transition-all"
                  >
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Badge className="bg-green-500/20 text-green-300 border border-green-400/40 mb-3">
                            {release.month}
                          </Badge>
                          <h3 className="text-xl font-bold text-green-300 mb-2">
                            {release.title}
                          </h3>
                          <p className="text-sm text-green-200/70 mb-3">
                            {release.genre}
                          </p>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-green-400" />
                            <span className="text-sm text-green-200/70">
                              {release.team}
                            </span>
                          </div>
                        </div>
                        <div>
                          <Badge className="bg-green-500/30 text-green-200 border border-green-400/60 mb-3">
                            {release.status}
                          </Badge>
                          <p className="text-sm text-green-200/80">
                            {release.highlights}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Past Releases */}
          <section className="py-16 border-t border-green-400/10 bg-black/40">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-green-300 mb-12">
                Shipped This Year
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {pastReleases.map((game, idx) => (
                  <Card
                    key={idx}
                    className="bg-green-950/20 border-green-400/30"
                  >
                    <CardContent className="pt-6 space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-green-300 mb-1">
                          {game.title}
                        </h3>
                        <Badge className="bg-green-500/20 text-green-300 border border-green-400/40 text-xs">
                          {game.genre}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm text-green-200/70">
                        <p>Released: {game.releaseDate}</p>
                        <p>{game.players} active players</p>
                        <div className="flex items-center gap-2">
                          <span>⭐ {game.rating}/5</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Production Process */}
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-3xl font-bold text-green-300 mb-12">
                Our Process
              </h2>
              <div className="space-y-4">
                {[
                  {
                    phase: "Ideation",
                    duration: "1 week",
                    description: "Brainstorm and validate game concepts",
                  },
                  {
                    phase: "Prototyping",
                    duration: "1 week",
                    description:
                      "Build playable prototype to test core mechanics",
                  },
                  {
                    phase: "Development",
                    duration: "3 weeks",
                    description:
                      "Full production with parallel art, code, and design",
                  },
                  {
                    phase: "Polish & QA",
                    duration: "1 week",
                    description: "Bug fixes, optimization, and player testing",
                  },
                  {
                    phase: "Launch",
                    duration: "1 day",
                    description:
                      "Ship to production and monitor for first 24 hours",
                  },
                ].map((item, idx) => (
                  <Card
                    key={idx}
                    className="bg-green-950/20 border-green-400/30"
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-6">
                        <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-green-300 mb-1">
                            {item.phase}
                          </h3>
                          <p className="text-sm text-green-200/70">
                            {item.description}
                          </p>
                        </div>
                        <Badge className="bg-green-500/20 text-green-300 border border-green-400/40">
                          {item.duration}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Team CTA */}
          <section className="py-16 border-t border-green-400/10">
            <div className="container mx-auto max-w-4xl px-4 text-center">
              <h2 className="text-3xl font-bold text-green-300 mb-4">
                Part of Our Shipping Culture
              </h2>
              <p className="text-lg text-green-100/80 mb-8">
                Our team represents the best of game development talent. Meet
                the people who make monthly shipping possible.
              </p>
              <Button
                className="bg-green-400 text-black shadow-[0_0_30px_rgba(34,197,94,0.35)] hover:bg-green-300"
                onClick={() => navigate("/gameforge/join-gameforge")}
              >
                Meet the Team
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
