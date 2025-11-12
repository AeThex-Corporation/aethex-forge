import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download, Music, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Track {
  id: string;
  title: string;
  artist_name: string;
  artist_id: string;
  genre: string[];
  bpm: number;
  duration_seconds: number;
  license_type: string;
  download_count: number;
  rating: number;
  price?: number;
  description?: string;
}

const GENRE_OPTIONS = [
  "Synthwave",
  "Orchestral",
  "Electronic",
  "Ambient",
  "Jazz",
  "Folk",
  "Hip-Hop",
  "Cinematic",
  "Game Audio",
  "SFX",
];

const LICENSE_OPTIONS = [
  { value: "ecosystem", label: "Ecosystem (Free)" },
  { value: "commercial_sample", label: "Commercial (Paid)" },
];

export default function AudioTracksForSale() {
  const navigate = useNavigate();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedLicense, setSelectedLicense] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("popularity");

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setLoading(true);
        // Build query parameters
        const params = new URLSearchParams();
        if (searchQuery) params.append("search", searchQuery);
        if (selectedGenre) params.append("genre", selectedGenre);
        if (selectedLicense) params.append("licenseType", selectedLicense);

        const response = await fetch(
          `/api/ethos/tracks?${params.toString()}&limit=20`,
        );
        if (response.ok) {
          const { data } = await response.json();
          setTracks(data);
        }
      } catch (error) {
        console.error("Failed to fetch tracks:", error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(fetchTracks, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedGenre, selectedLicense]);

  const sortedTracks = [...tracks].sort((a, b) => {
    switch (sortBy) {
      case "popularity":
        return b.download_count - a.download_count;
      case "newest":
        return 0; // Would need created_at from API
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "price-low":
        return (a.price || 0) - (b.price || 0);
      case "price-high":
        return (b.price || 0) - (a.price || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search by track name or artist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <Select
            value={selectedGenre || "all-genres"}
            onValueChange={(val) => setSelectedGenre(val === "all-genres" ? null : val)}
          >
            <SelectTrigger className="bg-slate-800 border-slate-700">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-genres">All Genres</SelectItem>
              {GENRE_OPTIONS.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedLicense || "all-licenses"}
            onValueChange={(val) => setSelectedLicense(val === "all-licenses" ? null : val)}
          >
            <SelectTrigger className="bg-slate-800 border-slate-700">
              <SelectValue placeholder="License Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-licenses">All Types</SelectItem>
              {LICENSE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="bg-slate-800 border-slate-700">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Most Popular</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setSelectedGenre(null);
              setSelectedLicense(null);
            }}
            className="border-slate-700"
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-slate-400">
        {loading ? "Loading..." : `${sortedTracks.length} tracks found`}
      </div>

      {/* Tracks Grid */}
      {loading ? (
        <div className="text-center py-12 text-slate-400">
          Loading tracks...
        </div>
      ) : sortedTracks.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          No tracks found. Try adjusting your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedTracks.map((track) => (
            <Card
              key={track.id}
              className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors cursor-pointer group"
              onClick={() => navigate(`/ethos/library/${track.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg group-hover:text-pink-400 transition">
                      {track.title}
                    </CardTitle>
                    <p className="text-sm text-slate-400 mt-1">
                      by {track.artist_name}
                    </p>
                  </div>
                  <Music className="h-5 w-5 text-pink-500 flex-shrink-0" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Genre & BPM */}
                <div className="flex flex-wrap gap-2">
                  {track.genre.slice(0, 2).map((g) => (
                    <Badge key={g} variant="secondary" className="text-xs">
                      {g}
                    </Badge>
                  ))}
                  <Badge variant="outline" className="text-xs">
                    {track.bpm} BPM
                  </Badge>
                </div>

                {/* License & Price */}
                <div className="flex items-center justify-between">
                  <Badge
                    className={
                      track.license_type === "ecosystem"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-pink-500/20 text-pink-400"
                    }
                  >
                    {track.license_type === "ecosystem" ? "Free" : "Commercial"}
                  </Badge>
                  {track.price && (
                    <span className="text-lg font-semibold text-white">
                      ${track.price}
                    </span>
                  )}
                </div>

                {/* Rating & Downloads */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-slate-300">
                      {track.rating || 5.0}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Download className="h-4 w-4" />
                    <span>{track.download_count} downloads</span>
                  </div>
                </div>

                {/* Duration */}
                <p className="text-xs text-slate-400">
                  {Math.floor(track.duration_seconds / 60)}:
                  {String(track.duration_seconds % 60).padStart(2, "0")}
                </p>

                {/* CTA Button */}
                <Button
                  className="w-full mt-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/ethos/library/${track.id}`);
                  }}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
