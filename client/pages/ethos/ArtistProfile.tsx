import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// API Base URL for fetch requests
const API_BASE = import.meta.env.VITE_API_BASE || "";
import { Star, Mail, Music, Zap, Clock } from "lucide-react";

interface Artist {
  user_id: string;
  skills: string[];
  for_hire: boolean;
  bio?: string;
  portfolio_url?: string;
  sample_price_track?: number;
  sample_price_sfx?: number;
  sample_price_score?: number;
  turnaround_days?: number;
  verified: boolean;
  total_downloads: number;
  created_at: string;
  user_profiles: {
    id: string;
    full_name: string;
    avatar_url?: string;
    email?: string;
  };
  tracks: Array<{
    id: string;
    title: string;
    genre: string[];
    download_count: number;
  }>;
}

export default function ArtistProfile() {
  const { userId } = useParams<{ userId: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtist = async () => {
      if (!userId) return;

      try {
        const res = await fetch(`${API_BASE}/api/ethos/artists?id=${userId}`);
        const data = await res.json();
        setArtist(data);
      } catch (error) {
        console.error("Failed to fetch artist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [userId]);

  if (loading) {
    return (
      <Layout>
        <div className="py-20 text-center">Loading artist profile...</div>
      </Layout>
    );
  }

  if (!artist) {
    return (
      <Layout>
        <div className="py-20 text-center">Artist not found</div>
      </Layout>
    );
  }

  const memberSince = new Date(artist.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });

  return (
    <>
      <SEO
        pageTitle={`${artist.user_profiles.full_name} - Ethos Guild Artist`}
        description={artist.bio || "Ethos Guild artist profile"}
      />
      <Layout>
        <div className="bg-slate-950 text-foreground min-h-screen">
          {/* Profile Header */}
          <section className="border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <Avatar className="h-24 w-24 rounded-lg">
                  <AvatarImage src={artist.user_profiles.avatar_url} />
                  <AvatarFallback className="bg-slate-800 text-xl">
                    {artist.user_profiles.full_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-white">
                      {artist.user_profiles.full_name}
                    </h1>
                    {artist.verified && (
                      <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600">
                        ✓ Verified Artist
                      </Badge>
                    )}
                  </div>

                  {artist.bio && (
                    <p className="text-slate-300 mb-4">{artist.bio}</p>
                  )}

                  <div className="flex flex-wrap gap-6 mb-6 text-sm">
                    <div>
                      <p className="text-slate-500">Total Downloads</p>
                      <p className="text-xl font-bold text-white">
                        {artist.total_downloads}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Tracks Published</p>
                      <p className="text-xl font-bold text-white">
                        {artist.tracks.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Member Since</p>
                      <p className="text-xl font-bold text-white">
                        {memberSince}
                      </p>
                    </div>
                  </div>

                  {artist.for_hire && (
                    <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact for Commission
                    </Button>
                  )}
                </div>
              </div>

              {/* Skills & Services */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {artist.skills.length > 0 && (
                  <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Skills
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {artist.skills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="bg-slate-800"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {artist.for_hire && (
                  <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Music className="h-5 w-5" />
                        Services
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {artist.sample_price_track && (
                        <div className="flex justify-between">
                          <span className="text-slate-300">Custom Track</span>
                          <span className="text-white font-semibold">
                            ${artist.sample_price_track}
                          </span>
                        </div>
                      )}
                      {artist.sample_price_sfx && (
                        <div className="flex justify-between">
                          <span className="text-slate-300">SFX Pack</span>
                          <span className="text-white font-semibold">
                            ${artist.sample_price_sfx}
                          </span>
                        </div>
                      )}
                      {artist.sample_price_score && (
                        <div className="flex justify-between">
                          <span className="text-slate-300">Full Score</span>
                          <span className="text-white font-semibold">
                            ${artist.sample_price_score}
                          </span>
                        </div>
                      )}
                      {artist.turnaround_days && (
                        <div className="pt-2 border-t border-slate-800 flex items-center gap-2 text-sm text-slate-400">
                          <Clock className="h-4 w-4" />
                          {artist.turnaround_days} day turnaround
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </section>

          {/* Portfolio */}
          <section className="py-12">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-2xl font-bold text-white mb-6">Portfolio</h2>

              {artist.tracks.length === 0 ? (
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardContent className="py-12 text-center text-slate-400">
                    No tracks published yet
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {artist.tracks.map((track) => (
                    <Card
                      key={track.id}
                      className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition"
                    >
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold">
                            {track.title}
                          </h3>
                          <div className="flex gap-2 mt-1">
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
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                          <Music className="h-4 w-4" />
                          {track.download_count} downloads
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
