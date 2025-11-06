import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Github,
  Globe,
  Mail,
  ArrowLeft,
  ExternalLink,
  MessageSquare,
  Share2,
  MapPin,
  Trophy,
  Briefcase,
} from "lucide-react";
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
  email?: string;
  city?: string;
  country?: string;
  created_at: string;
}

export default function DevLinkProfile() {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<DevProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!profileId) {
        setError("Profile not found");
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", profileId)
          .single();

        if (fetchError) throw fetchError;

        const devProfile: DevProfile = {
          id: data.id,
          user_id: data.user_id,
          full_name: data.full_name || "Anonymous Developer",
          avatar_url: data.avatar_url,
          bio: data.bio,
          skills: data.interests || [],
          experience_level: data.experience_level || "intermediate",
          looking_for: data.looking_for,
          portfolio_url: data.portfolio_url,
          github_url: data.github_url,
          email: data.email,
          city: data.city,
          country: data.country,
          created_at: data.created_at,
        };

        setProfile(devProfile);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileId]);

  const getExperienceColor = (level: string) => {
    const colors: Record<string, string> = {
      beginner: "bg-blue-500/20 text-blue-300 border-blue-400/40",
      intermediate: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40",
      advanced: "bg-violet-500/20 text-violet-300 border-violet-400/40",
      expert: "bg-amber-500/20 text-amber-300 border-amber-400/40",
    };
    return colors[level] || colors.intermediate;
  };

  if (loading) {
    return (
      <Layout>
        <div className="relative min-h-screen bg-black text-white overflow-hidden flex items-center justify-center">
          <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#06b6d4_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
          <p className="relative z-10 text-cyan-200/60">Loading profile...</p>
        </div>
      </Layout>
    );
  }

  if (error || !profile) {
    return (
      <Layout>
        <div className="relative min-h-screen bg-black text-white overflow-hidden flex items-center justify-center">
          <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#06b6d4_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
          <div className="relative z-10 text-center">
            <p className="text-cyan-200/60 text-lg mb-4">
              {error || "Profile not found"}
            </p>
            <Button
              onClick={() => navigate("/dev-link/profiles")}
              className="bg-cyan-400 text-black hover:bg-cyan-300"
            >
              Back to Profiles
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

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
          {/* Header */}
          <section className="relative overflow-hidden py-8 lg:py-12">
            <div className="container mx-auto max-w-4xl px-4">
              <div className="flex items-center gap-3 mb-8">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F9a96b43cbd7b49bb9d5434580319c793?format=webp&width=800"
                  alt="Dev-Link"
                  className="h-8 w-8"
                />
                <Button
                  onClick={() => navigate("/dev-link/profiles")}
                  variant="ghost"
                  className="text-cyan-300 hover:bg-cyan-500/10"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Profiles
                </Button>
              </div>

              {/* Profile Card */}
              <Card className="bg-cyan-950/30 border-cyan-400/30">
                <CardHeader className="pb-0">
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    {profile.avatar_url && (
                      <img
                        src={profile.avatar_url}
                        alt={profile.full_name}
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-cyan-400/50"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                        <div>
                          <CardTitle className="text-3xl sm:text-4xl text-cyan-300 mb-2">
                            {profile.full_name}
                          </CardTitle>
                          <Badge
                            variant="outline"
                            className={`capitalize ${getExperienceColor(
                              profile.experience_level,
                            )}`}
                          >
                            {profile.experience_level} Developer
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="border-cyan-400/60 text-cyan-300 hover:bg-cyan-500/10"
                          >
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                          <Button className="bg-cyan-400 text-black hover:bg-cyan-300">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                        </div>
                      </div>

                      {(profile.city || profile.country) && (
                        <div className="flex items-center gap-2 text-cyan-200/70 mb-4">
                          <MapPin className="h-4 w-4" />
                          <span>
                            {profile.city && profile.country
                              ? `${profile.city}, ${profile.country}`
                              : profile.city || profile.country}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-8">
                  {/* Bio */}
                  {profile.bio && (
                    <div>
                      <h3 className="text-lg font-semibold text-cyan-300 mb-2">
                        About
                      </h3>
                      <p className="text-cyan-200/80 leading-relaxed">
                        {profile.bio}
                      </p>
                    </div>
                  )}

                  {/* Looking For */}
                  {profile.looking_for && (
                    <div>
                      <h3 className="text-lg font-semibold text-cyan-300 mb-2">
                        Currently Looking For
                      </h3>
                      <p className="text-cyan-200/80 flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-cyan-400" />
                        {profile.looking_for}
                      </p>
                    </div>
                  )}

                  {/* Skills */}
                  {profile.skills && profile.skills.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-cyan-300 mb-4">
                        Skills
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {profile.skills.map((skill) => (
                          <Badge
                            key={skill}
                            className="bg-cyan-500/20 text-cyan-300 border-cyan-400/40 border px-4 py-2"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Links */}
                  {(profile.github_url ||
                    profile.portfolio_url ||
                    profile.email) && (
                    <div>
                      <h3 className="text-lg font-semibold text-cyan-300 mb-4">
                        Connect
                      </h3>
                      <div className="flex flex-wrap gap-4">
                        {profile.github_url && (
                          <a
                            href={profile.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 hover:border-cyan-400/60 hover:bg-cyan-500/20 transition"
                          >
                            <Github className="h-5 w-5" />
                            GitHub
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        {profile.portfolio_url && (
                          <a
                            href={profile.portfolio_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 hover:border-cyan-400/60 hover:bg-cyan-500/20 transition"
                          >
                            <Trophy className="h-5 w-5" />
                            Portfolio
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        {profile.email && (
                          <a
                            href={`mailto:${profile.email}`}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 hover:border-cyan-400/60 hover:bg-cyan-500/20 transition"
                          >
                            <Mail className="h-5 w-5" />
                            Email
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Member Since */}
                  <div className="pt-4 border-t border-cyan-400/20">
                    <p className="text-sm text-cyan-200/60">
                      Member since{" "}
                      {new Date(profile.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
