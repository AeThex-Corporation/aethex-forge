import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Search,
  Github,
  Briefcase,
  MapPin,
  Trophy,
  MessageSquare,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface DevProfile {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  skills: string[];
  experience_level: "beginner" | "intermediate" | "advanced" | "expert";
  looking_for?: string;
  portfolio_url?: string;
  github_url?: string;
  created_at: string;
}

export default function DevLinkProfiles() {
  const [profiles, setProfiles] = useState<DevProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<DevProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [experienceFilter, setExperienceFilter] = useState<string>("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("deleted_at", null)
          .order("created_at", { ascending: false })
          .limit(50);

        if (error) throw error;

        const devProfiles: DevProfile[] = data
          .map((p: any) => ({
            id: p.id,
            user_id: p.user_id,
            full_name: p.full_name || "Anonymous Developer",
            avatar_url: p.avatar_url,
            bio: p.bio,
            skills: p.interests || [],
            experience_level: p.experience_level || "intermediate",
            looking_for: p.looking_for,
            portfolio_url: p.portfolio_url,
            github_url: p.github_url,
            created_at: p.created_at,
          }))
          .filter((p) => p.full_name !== "Anonymous Developer" || p.bio);

        setProfiles(devProfiles);
        setFilteredProfiles(devProfiles);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  useEffect(() => {
    let filtered = profiles;

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.skills.some((s) =>
            s.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (experienceFilter !== "all") {
      filtered = filtered.filter((p) => p.experience_level === experienceFilter);
    }

    setFilteredProfiles(filtered);
  }, [searchTerm, experienceFilter, profiles]);

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Animated backgrounds */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#06b6d4_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(6,182,212,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(6,182,212,0.1)_1px,transparent_1px)] [background-size:50px_50px] animate-pulse" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl animate-blob" />

        <main className="relative z-10">
          {/* Header Section */}
          <section className="relative overflow-hidden py-12 lg:py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="flex items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-4xl font-black tracking-tight text-cyan-300 sm:text-5xl">
                    Developer Profiles
                  </h1>
                  <p className="text-lg text-cyan-100/80 mt-2">
                    Connect with {profiles.length} talented Roblox developers
                  </p>
                </div>
                <Button
                  onClick={() => navigate("/dev-link")}
                  variant="outline"
                  className="border-cyan-400/60 text-cyan-300 hover:bg-cyan-500/10"
                >
                  Back to Dev-Link
                </Button>
              </div>

              {/* Search and Filter */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-cyan-400/50" />
                  <Input
                    placeholder="Search by name, skills, or bio..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-cyan-950/30 border-cyan-400/30 text-white placeholder:text-cyan-200/40 focus:border-cyan-400"
                  />
                </div>
                <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                  <SelectTrigger className="bg-cyan-950/30 border-cyan-400/30 text-white">
                    <SelectValue placeholder="Filter by experience" />
                  </SelectTrigger>
                  <SelectContent className="bg-cyan-950 border-cyan-400/30">
                    <SelectItem value="all">All Experience Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Profiles Grid */}
          <section className="py-12 lg:py-16">
            <div className="container mx-auto max-w-6xl px-4">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-cyan-200/60">Loading profiles...</p>
                </div>
              ) : filteredProfiles.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-cyan-400/40 mx-auto mb-4" />
                  <p className="text-cyan-200/60 text-lg">
                    No profiles found. Try adjusting your filters.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProfiles.map((profile) => (
                    <Card
                      key={profile.id}
                      className="bg-cyan-950/20 border-cyan-400/30 hover:border-cyan-400/60 hover:bg-cyan-950/30 transition-all cursor-pointer group"
                      onClick={() => navigate(`/dev-link/profiles/${profile.id}`)}
                    >
                      <CardHeader>
                        {profile.avatar_url && (
                          <img
                            src={profile.avatar_url}
                            alt={profile.full_name}
                            className="w-16 h-16 rounded-full mb-4 border-2 border-cyan-400/50 group-hover:border-cyan-400 transition"
                          />
                        )}
                        <CardTitle className="text-cyan-300">
                          {profile.full_name}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className="w-fit mt-2 border-cyan-400/40 bg-cyan-500/10 text-cyan-300 capitalize"
                        >
                          {profile.experience_level}
                        </Badge>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {profile.bio && (
                          <p className="text-sm text-cyan-200/70 line-clamp-2">
                            {profile.bio}
                          </p>
                        )}

                        {profile.skills && profile.skills.length > 0 && (
                          <div>
                            <p className="text-xs text-cyan-400 font-semibold mb-2">
                              Skills
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {profile.skills.slice(0, 3).map((skill) => (
                                <Badge
                                  key={skill}
                                  className="bg-cyan-500/20 text-cyan-300 border-0 text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
                              {profile.skills.length > 3 && (
                                <Badge className="bg-cyan-500/20 text-cyan-300 border-0 text-xs">
                                  +{profile.skills.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {profile.looking_for && (
                          <div className="flex items-start gap-2 text-sm">
                            <Briefcase className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                            <span className="text-cyan-200/70">
                              {profile.looking_for}
                            </span>
                          </div>
                        )}

                        <div className="flex gap-2 pt-2">
                          {profile.github_url && (
                            <a
                              href={profile.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-400 hover:text-cyan-300 transition"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Github className="h-5 w-5" />
                            </a>
                          )}
                          {profile.portfolio_url && (
                            <a
                              href={profile.portfolio_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-400 hover:text-cyan-300 transition"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Trophy className="h-5 w-5" />
                            </a>
                          )}
                          <button
                            className="ml-auto text-cyan-400 hover:text-cyan-300 transition"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/dev-link/profiles/${profile.id}`);
                            }}
                          >
                            <MessageSquare className="h-5 w-5" />
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
