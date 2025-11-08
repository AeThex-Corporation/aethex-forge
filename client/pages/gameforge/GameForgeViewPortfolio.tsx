import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Download, Calendar, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function GameForgeViewPortfolio() {
  const navigate = useNavigate();

  const games = [
    {
      title: "Battle Royale X",
      releaseDate: "December 2024",
      genre: "Action",
      players: "50K+",
      rating: 4.7,
      downloads: "145K",
      revenue: "$85K",
      team: "10 devs, 2 designers",
    },
    {
      title: "Casual Match",
      releaseDate: "November 2024",
      genre: "Puzzle",
      players: "100K+",
      rating: 4.5,
      downloads: "320K",
      revenue: "$125K",
      team: "6 devs, 1 designer",
    },
    {
      title: "Speedrun Challenge",
      releaseDate: "October 2024",
      genre: "Action",
      players: "35K+",
      rating: 4.8,
      downloads: "98K",
      revenue: "$52K",
      team: "8 devs, 1 designer",
    },
    {
      title: "Story Adventure",
      releaseDate: "September 2024",
      genre: "Adventure",
      players: "28K+",
      rating: 4.6,
      downloads: "76K",
      revenue: "$38K",
      team: "12 devs, 3 designers",
    },
  ];

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#22c55e_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(34,197,94,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(34,197,94,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(34,197,94,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-green-600/10 rounded-full blur-3xl animate-blob animation-delay-2000" />

        <main className="relative z-10">
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <Button
                variant="ghost"
                className="text-green-300 hover:bg-green-500/10 mb-8"
                onClick={() => navigate("/gameforge")}
              >
                ← Back to GameForge
              </Button>

              <h1 className="text-4xl lg:text-5xl font-black text-green-300 mb-4">
                Released Games
              </h1>
              <p className="text-lg text-green-100/80 max-w-3xl">
                Games shipped by GameForge. See player stats, revenue, and team
                sizes from our monthly releases.
              </p>
            </div>
          </section>

          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="space-y-6">
                {games.map((game, idx) => (
                  <Card
                    key={idx}
                    className="bg-green-950/20 border-green-400/30 hover:border-green-400/60 transition-all"
                  >
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-green-300 mb-1">
                            {game.title}
                          </h3>
                          <Badge className="bg-green-500/20 text-green-300 border border-green-400/40 text-xs">
                            {game.genre}
                          </Badge>
                          <p className="text-xs text-green-200/60 mt-2">
                            {game.releaseDate}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-green-400">
                            PLAYERS
                          </p>
                          <p className="text-lg font-bold text-green-300">
                            {game.players}
                          </p>
                          <p className="text-xs text-green-200/60">active</p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-green-400">
                            RATING
                          </p>
                          <p className="text-lg font-bold text-green-300 flex items-center gap-1">
                            {game.rating}{" "}
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          </p>
                          <p className="text-xs text-green-200/60">
                            {game.downloads} downloads
                          </p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-green-400">
                            REVENUE
                          </p>
                          <p className="text-lg font-bold text-green-300">
                            {game.revenue}
                          </p>
                          <p className="text-xs text-green-200/60">
                            {game.team}
                          </p>
                        </div>

                        <div className="flex items-end justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-300 hover:bg-green-500/10"
                          >
                            Details →
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 border-t border-green-400/10">
            <div className="container mx-auto max-w-4xl px-4 text-center">
              <h2 className="text-3xl font-bold text-green-300 mb-4">
                Games in Development
              </h2>
              <p className="text-lg text-green-100/80 mb-8">
                View the current production pipeline and upcoming releases.
              </p>
              <Button
                className="bg-green-400 text-black hover:bg-green-300"
                onClick={() => navigate("/gameforge/start-building")}
              >
                View Pipeline
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
