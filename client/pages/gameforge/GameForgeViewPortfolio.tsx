import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Gamepad2, Filter, Star, Users, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Game {
  id: number;
  title: string;
  creator: string;
  genre: "Action" | "Puzzle" | "Adventure" | "RPG" | "Casual";
  image: string;
  plays: number;
  rating: number;
  releaseDate: string;
}

const FEATURED_GAMES: Game[] = [
  {
    id: 1,
    title: "Pixel Quest Adventure",
    creator: "Alex Dev Studios",
    genre: "Adventure",
    image: "https://via.placeholder.com/300x200/22c55e/000000?text=Pixel+Quest",
    plays: 15400,
    rating: 4.8,
    releaseDate: "2024-01",
  },
  {
    id: 2,
    title: "Logic Maze Pro",
    creator: "Puzzle Labs",
    genre: "Puzzle",
    image: "https://via.placeholder.com/300x200/22c55e/000000?text=Logic+Maze",
    plays: 12300,
    rating: 4.6,
    releaseDate: "2024-01",
  },
  {
    id: 3,
    title: "Battle Royale X",
    creator: "Epic Creators",
    genre: "Action",
    image: "https://via.placeholder.com/300x200/22c55e/000000?text=Battle+Royale",
    plays: 28900,
    rating: 4.9,
    releaseDate: "2023-12",
  },
  {
    id: 4,
    title: "Mystic Realms RPG",
    creator: "Story Crafters",
    genre: "RPG",
    image: "https://via.placeholder.com/300x200/22c55e/000000?text=Mystic+Realms",
    plays: 9200,
    rating: 4.7,
    releaseDate: "2023-12",
  },
  {
    id: 5,
    title: "Casual Match",
    creator: "Fun Games Co",
    genre: "Casual",
    image: "https://via.placeholder.com/300x200/22c55e/000000?text=Casual+Match",
    plays: 45600,
    rating: 4.5,
    releaseDate: "2023-11",
  },
  {
    id: 6,
    title: "Speedrun Challenge",
    creator: "Speed Demons",
    genre: "Action",
    image: "https://via.placeholder.com/300x200/22c55e/000000?text=Speedrun",
    plays: 18700,
    rating: 4.8,
    releaseDate: "2023-11",
  },
];

const GENRES = ["All", "Action", "Puzzle", "Adventure", "RPG", "Casual"];
const SORT_OPTIONS = ["Trending", "Most Played", "Highest Rated", "Newest"];

export default function GameForgeViewPortfolio() {
  const navigate = useNavigate();
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortBy, setSortBy] = useState("Trending");

  const filteredGames = FEATURED_GAMES.filter(
    (game) => selectedGenre === "All" || game.genre === selectedGenre
  );

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#22c55e_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(34,197,94,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(34,197,94,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(34,197,94,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-green-600/10 rounded-full blur-3xl animate-blob animation-delay-2000" />

        <main className="relative z-10">
          {/* Header */}
          <section className="relative py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <Button
                variant="ghost"
                className="text-green-300 hover:bg-green-500/10 mb-8"
                onClick={() => navigate("/gameforge")}
              >
                ← Back to GameForge
              </Button>

              <div className="mb-12">
                <Badge className="border-green-400/40 bg-green-500/10 text-green-300 shadow-[0_0_20px_rgba(34,197,94,0.2)] mb-4">
                  <Gamepad2 className="h-4 w-4 mr-2" />
                  Game Gallery
                </Badge>
                <h1 className="text-4xl font-black text-green-300 mb-4 lg:text-5xl">
                  Discover Amazing Games
                </h1>
                <p className="text-lg text-green-100/80">
                  Explore games built by our community using GameForge
                </p>
              </div>

              {/* Filters & Sorting */}
              <div className="flex flex-col md:flex-row gap-6 items-stretch">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Filter className="h-4 w-4 text-green-400" />
                    <span className="text-sm font-medium text-green-300">
                      Genre
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {GENRES.map((genre) => (
                      <Button
                        key={genre}
                        variant={
                          selectedGenre === genre ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setSelectedGenre(genre)}
                        className={
                          selectedGenre === genre
                            ? "bg-green-400 text-black hover:bg-green-300"
                            : "border-green-400/40 text-green-300 hover:bg-green-500/10"
                        }
                      >
                        {genre}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="md:w-48">
                  <label className="text-sm font-medium text-green-300 block mb-2">
                    Sort by
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 bg-green-950/40 border border-green-400/30 rounded text-green-300 text-sm focus:outline-none focus:border-green-400/60"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Games Grid */}
          <section className="py-12">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGames.map((game) => (
                  <div
                    key={game.id}
                    className="group bg-green-950/20 border border-green-400/30 rounded-lg overflow-hidden hover:border-green-400/60 transition-all hover:shadow-lg hover:shadow-green-500/20"
                  >
                    <div className="relative overflow-hidden h-48 bg-gradient-to-b from-green-500/20 to-transparent">
                      <img
                        src={game.image}
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-green-400/80 text-black">
                          {game.genre}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="text-lg font-bold text-green-300 mb-1">
                          {game.title}
                        </h3>
                        <p className="text-sm text-green-200/60">
                          by {game.creator}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-green-300/70 pt-2 border-t border-green-400/10">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Gamepad2 className="h-3 w-3" />
                            {(game.plays / 1000).toFixed(1)}K
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-green-400 text-green-400" />
                            {game.rating}
                          </span>
                        </div>
                      </div>

                      <Button
                        className="w-full bg-green-400 text-black hover:bg-green-300"
                        size="sm"
                      >
                        Play Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Submit CTA */}
          <section className="py-16 border-t border-green-400/10">
            <div className="container mx-auto max-w-4xl px-4 text-center">
              <h2 className="text-3xl font-bold text-green-300 mb-4">
                Built Something Amazing?
              </h2>
              <p className="text-lg text-green-100/80 mb-8">
                Submit your game to our gallery and showcase your work to
                thousands of players.
              </p>
              <Button className="bg-green-400 text-black shadow-[0_0_30px_rgba(34,197,94,0.35)] hover:bg-green-300">
                Submit Your Game
              </Button>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
