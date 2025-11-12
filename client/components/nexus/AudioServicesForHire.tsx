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
import {
  Search,
  Star,
  Clock,
  DollarSign,
  CheckCircle,
  Music,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ArtistService {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  skills: string[];
  verified: boolean;
  rating: number;
  for_hire: boolean;
  price_list: {
    track_custom?: number;
    sfx_pack?: number;
    full_score?: number;
    day_rate?: number;
    contact_for_quote?: boolean;
  };
  turnaround_days?: number;
}

const SERVICE_TYPES = [
  { value: "track_custom", label: "Custom Track" },
  { value: "sfx_pack", label: "SFX Pack" },
  { value: "full_score", label: "Full Game Score" },
  { value: "day_rate", label: "Day Rate Consulting" },
];

export default function AudioServicesForHire() {
  const navigate = useNavigate();
  const [artists, setArtists] = useState<ArtistService[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [minRating, setMinRating] = useState<number>(0);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true);
        // Fetch artists who are for_hire
        const response = await fetch(
          `/api/ethos/artists?forHire=true&limit=50`,
        );
        if (response.ok) {
          const result = await response.json();
          const artistsData = result.data || result || [];

          // Map the response to expected format
          const mappedArtists = artistsData.map((artist: any) => ({
            id: artist.user_id,
            user_id: artist.user_id,
            full_name: artist.user_profiles?.full_name || "Unknown Artist",
            avatar_url: artist.user_profiles?.avatar_url,
            bio: artist.bio,
            skills: artist.skills || [],
            verified: artist.verified || false,
            rating: 5.0, // Default rating - could be fetched from a ratings table
            for_hire: artist.for_hire,
            price_list: artist.price_list || {
              track_custom: artist.sample_price_track,
              sfx_pack: artist.sample_price_sfx,
              full_score: artist.sample_price_score,
            },
            turnaround_days: artist.turnaround_days,
          }));

          setArtists(mappedArtists);
        }
      } catch (error) {
        console.error("Failed to fetch artists:", error);
        setArtists([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchArtists, 300);
    return () => clearTimeout(timer);
  }, []);

  // Filter and sort artists
  const filteredArtists = artists.filter((artist) => {
    const matchesSearch =
      !searchQuery ||
      artist.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.bio?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSkill =
      !selectedSkill ||
      artist.skills.some((skill) =>
        skill.toLowerCase().includes(selectedSkill.toLowerCase()),
      );

    const matchesService =
      !selectedService ||
      (artist.price_list as Record<string, any>)[selectedService] !== null;

    const matchesRating = artist.rating >= minRating;

    return matchesSearch && matchesSkill && matchesService && matchesRating;
  });

  // Get all unique skills from artists
  const allSkills = Array.from(
    new Set(artists.flatMap((artist) => artist.skills)),
  ).sort();

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search by artist name or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <Select
            value={selectedSkill || "all-skills"}
            onValueChange={(val) => setSelectedSkill(val === "all-skills" ? null : val)}
          >
            <SelectTrigger className="bg-slate-800 border-slate-700">
              <SelectValue placeholder="Skill" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-skills">All Skills</SelectItem>
              {allSkills.map((skill) => (
                <SelectItem key={skill} value={skill}>
                  {skill}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedService || "all-services"}
            onValueChange={(val) => setSelectedService(val === "all-services" ? null : val)}
          >
            <SelectTrigger className="bg-slate-800 border-slate-700">
              <SelectValue placeholder="Service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-services">All Services</SelectItem>
              {SERVICE_TYPES.map((service) => (
                <SelectItem key={service.value} value={service.value}>
                  {service.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={minRating.toString()}
            onValueChange={(val) => setMinRating(Number(val))}
          >
            <SelectTrigger className="bg-slate-800 border-slate-700">
              <SelectValue placeholder="Min Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">All Ratings</SelectItem>
              <SelectItem value="4">4+ Stars</SelectItem>
              <SelectItem value="4.5">4.5+ Stars</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setSelectedSkill(null);
              setSelectedService(null);
              setMinRating(0);
            }}
            className="border-slate-700"
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-slate-400">
        {loading
          ? "Loading..."
          : `${filteredArtists.length} artist${filteredArtists.length !== 1 ? "s" : ""} available`}
      </div>

      {/* Artists Grid */}
      {loading ? (
        <div className="text-center py-12 text-slate-400">
          Loading artists...
        </div>
      ) : filteredArtists.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          No artists found matching your criteria. Try adjusting your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArtists.map((artist) => (
            <Card
              key={artist.user_id}
              className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors"
            >
              <CardHeader>
                <div className="flex items-start gap-3 mb-2">
                  {artist.avatar_url && (
                    <img
                      src={artist.avatar_url}
                      alt={artist.full_name}
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      {artist.full_name}
                      {artist.verified && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-slate-300">
                        {artist.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Bio */}
                {artist.bio && (
                  <p className="text-sm text-slate-300 line-clamp-2">
                    {artist.bio}
                  </p>
                )}

                {/* Skills */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-slate-400">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {artist.skills.slice(0, 3).map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {artist.skills.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{artist.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Service Pricing */}
                <div className="space-y-2 bg-slate-900/50 rounded p-3">
                  <p className="text-xs font-medium text-slate-400">Services</p>
                  <div className="space-y-1">
                    {artist.price_list.track_custom && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">Custom Track</span>
                        <span className="font-semibold text-pink-400">
                          ${artist.price_list.track_custom}
                        </span>
                      </div>
                    )}
                    {artist.price_list.sfx_pack && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">SFX Pack</span>
                        <span className="font-semibold text-pink-400">
                          ${artist.price_list.sfx_pack}
                        </span>
                      </div>
                    )}
                    {artist.price_list.full_score && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">Full Score</span>
                        <span className="font-semibold text-pink-400">
                          ${artist.price_list.full_score}
                        </span>
                      </div>
                    )}
                    {artist.price_list.day_rate && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">Day Rate</span>
                        <span className="font-semibold text-pink-400">
                          ${artist.price_list.day_rate}/day
                        </span>
                      </div>
                    )}
                    {artist.price_list.contact_for_quote && (
                      <div className="text-sm text-yellow-400">
                        Enterprise rates available - contact for quote
                      </div>
                    )}
                  </div>
                </div>

                {/* Turnaround */}
                {artist.turnaround_days && (
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Clock className="h-4 w-4" />
                    <span>{artist.turnaround_days} day turnaround</span>
                  </div>
                )}

                {/* CTA Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                    size="sm"
                    onClick={() => navigate(`/creators/${artist.user_id}`)}
                  >
                    View Profile
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-slate-700"
                    onClick={() => navigate(`/ethos/settings`)}
                  >
                    Request Service
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
