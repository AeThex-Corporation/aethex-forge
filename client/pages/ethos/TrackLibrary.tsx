import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Music, Download, Radio, Search, Filter } from "lucide-react";

// API Base URL for fetch requests
const API_BASE = import.meta.env.VITE_API_BASE || "";

interface Track {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  genre: string[];
  license_type: string;
  duration_seconds?: number;
  download_count: number;
  created_at: string;
  user_profiles?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

const GENRES = [
  "All Genres",
  "Synthwave",
  "Orchestral",
  "SFX",
  "Ambient",
  "Electronic",
  "Cinematic",
  "Jazz",
  "Hip-Hop",
  "Folk",
];

export default function TrackLibrary() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All Genres");
  const [licenseFilter, setLicenseFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const params = new URLSearchParams();
        params.append("limit", "100");

        if (searchQuery) params.append("search", searchQuery);
        if (selectedGenre !== "All Genres")
          params.append("genre", selectedGenre);
        if (licenseFilter !== "all")
          params.append("licenseType", licenseFilter);

        const res = await fetch(`${API_BASE}/api/ethos/tracks?${params}`);
        const { data } = await res.json();

        let sorted = [...data];
        if (sortBy === "newest") {
          sorted.sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          );
        } else if (sortBy === "popular") {
          sorted.sort((a, b) => b.download_count - a.download_count);
        }

        setTracks(sorted);
      } catch (error) {
        console.error("Failed to fetch tracks:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchTracks, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedGenre, licenseFilter, sortBy]);

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "—";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <SEO
        pageTitle="Ethos Track Library"
        description="Browse music and sound effects from Ethos Guild artists"
      />
      <Layout>
        <div className="bg-slate-950 text-foreground min-h-screen">
          {/* Hero Section */}
          <section className="relative border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 py-16">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="space-y-6">
                <div className="space-y-3">
                  <Badge className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600">
                    <Music className="h-3 w-3" />
                    Ethos Track Library
                  </Badge>
                  <h1 className="text-4xl font-bold text-white">
                    Discover Ethos Music & SFX
                  </h1>
                  <p className="text-lg text-slate-400 max-w-2xl">
                    Browse original music and sound effects created by Ethos
                    Guild artists. Use freely in your projects or license
                    commercially.
                  </p>
                </div>

                {/* Search & Filters */}
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-3 h-5 w-5 text-slate-500" />
                    <Input
                      placeholder="Search tracks by title or artist..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 bg-slate-800 border-slate-700 h-11"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs uppercase text-slate-500 mb-2 block">
                        Genre
                      </label>
                      <Select
                        value={selectedGenre}
                        onValueChange={setSelectedGenre}
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {GENRES.map((genre) => (
                            <SelectItem key={genre} value={genre}>
                              {genre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs uppercase text-slate-500 mb-2 block">
                        License Type
                      </label>
                      <Select
                        value={licenseFilter}
                        onValueChange={setLicenseFilter}
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="all">All Licenses</SelectItem>
                          <SelectItem value="ecosystem">
                            Ecosystem Free
                          </SelectItem>
                          <SelectItem value="commercial_sample">
                            Commercial Demo
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs uppercase text-slate-500 mb-2 block">
                        Sort By
                      </label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="bg-slate-800 border-slate-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="newest">Newest</SelectItem>
                          <SelectItem value="popular">Most Popular</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Tracks Grid */}
          <section className="py-12">
            <div className="container mx-auto px-4 max-w-6xl">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin">
                    <Music className="h-8 w-8 text-slate-500" />
                  </div>
                  <p className="text-slate-400 mt-4">Loading tracks...</p>
                </div>
              ) : tracks.length === 0 ? (
                <div className="text-center py-12">
                  <Music className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">
                    No tracks found. Try adjusting your filters.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {tracks.map((track) => (
                    <Card
                      key={track.id}
                      className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-white font-semibold truncate">
                                  {track.title}
                                </h3>
                                {track.user_profiles && (
                                  <Link
                                    to={`/ethos/artists/${track.user_id}`}
                                    className="text-sm text-slate-400 hover:text-slate-300 transition"
                                  >
                                    {track.user_profiles.full_name}
                                  </Link>
                                )}
                              </div>
                              <Badge
                                variant="outline"
                                className={
                                  track.license_type === "ecosystem"
                                    ? "bg-green-500/10 border-green-500/30"
                                    : "bg-blue-500/10 border-blue-500/30"
                                }
                              >
                                {track.license_type === "ecosystem"
                                  ? "Free"
                                  : "Commercial"}
                              </Badge>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              {track.genre.map((g) => (
                                <Badge
                                  key={g}
                                  variant="secondary"
                                  className="bg-slate-800 text-xs"
                                >
                                  {g}
                                </Badge>
                              ))}
                            </div>

                            {track.description && (
                              <p className="text-xs text-slate-400 line-clamp-1">
                                {track.description}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                              <Download className="h-4 w-4" />
                              {track.download_count}
                            </div>
                            {track.duration_seconds && (
                              <div className="flex items-center gap-1">
                                <Radio className="h-4 w-4" />
                                {formatDuration(track.duration_seconds)}
                              </div>
                            )}
                          </div>

                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="border-slate-700 hover:bg-slate-800"
                          >
                            <Link to={`/ethos/tracks/${track.id}`}>
                              Listen & Details
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
}
