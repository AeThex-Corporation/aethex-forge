import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  ArrowLeft,
  ExternalLink,
  MessageSquare,
  Award,
  Briefcase,
  Code,
  Music,
} from "lucide-react";
import { getCreatorByUsername } from "@/api/creators";
import { ArmBadge } from "@/components/creator-network/ArmBadge";
import type { Creator } from "@/api/creators";

export default function CreatorProfile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCreator = async () => {
      if (!username) return;
      setIsLoading(true);
      try {
        const data = await getCreatorByUsername(username);
        setCreator(data);
      } catch (error) {
        console.error("Failed to fetch creator:", error);
        setCreator(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreator();
  }, [username]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
        </div>
      </Layout>
    );
  }

  if (!creator) {
    return (
      <Layout>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Creator Not Found</h1>
            <p className="text-gray-400 mb-6">
              The creator you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate("/creators")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Creators
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#8b5cf6_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(139,92,246,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />

        <main className="relative z-10">
          <div className="container mx-auto max-w-4xl px-4 py-12">
            {/* Header */}
            <div className="mb-8">
              <Button
                onClick={() => navigate("/creators")}
                variant="ghost"
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Creators
              </Button>
            </div>

            {/* Profile Card */}
            <Card className="bg-slate-800/50 border-slate-700 mb-8">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={creator.avatar_url}
                      alt={creator.username}
                    />
                    <AvatarFallback>
                      {creator.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold">
                        @{creator.username}
                      </h1>
                      {creator.devconnect_linked && (
                        <Badge className="bg-cyan-500/10 text-cyan-300 border-cyan-500/20">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          On DevConnect
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-300 text-lg mb-4">{creator.bio}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {creator.primary_arm && (
                        <ArmBadge arm={creator.primary_arm} />
                      )}
                      {creator.arm_affiliations &&
                        creator.arm_affiliations
                          .filter((arm) => arm !== creator.primary_arm)
                          .map((arm) => <ArmBadge key={arm} arm={arm} />)}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={() => navigate("/opportunities/post")}
                        className="bg-purple-500 text-white hover:bg-purple-600"
                      >
                        <Briefcase className="h-4 w-4 mr-2" />
                        Hire This Creator
                      </Button>
                      {creator.devconnect_link && (
                        <Button asChild>
                          <a
                            href={
                              creator.devconnect_link.devconnect_profile_url
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View on DevConnect
                          </a>
                        </Button>
                      )}
                      {creator.spotify_profile_url && (
                        <Button asChild variant="outline">
                          <a
                            href={creator.spotify_profile_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Music className="h-4 w-4 mr-2" />
                            Listen on Spotify
                          </a>
                        </Button>
                      )}
                      <Button variant="outline">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills & Endorsements Section */}
            {creator.skills && creator.skills.length > 0 && (
              <Card className="bg-slate-800/50 border-slate-700 mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Skills & Expertise
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {creator.skills.map((skill) => {
                      const endorsement =
                        creator.aethex_skill_endorsements?.find(
                          (e) => e.skill === skill,
                        );
                      return (
                        <Badge
                          key={skill}
                          className="bg-slate-700/50 text-gray-300 border-0 px-3 py-1.5 text-sm hover:bg-slate-700 transition"
                          title={
                            endorsement
                              ? `Endorsed by ${endorsement.count} creator${endorsement.count !== 1 ? "s" : ""}`
                              : undefined
                          }
                        >
                          {skill}
                          {endorsement && (
                            <>
                              {" "}
                              <Award className="h-3 w-3 ml-1 inline" />
                              {endorsement.count > 0 && (
                                <span className="ml-1 text-xs">
                                  +{endorsement.count}
                                </span>
                              )}
                            </>
                          )}
                        </Badge>
                      );
                    })}
                  </div>
                  {creator.aethex_skill_endorsements &&
                    creator.aethex_skill_endorsements.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-700">
                        <p className="text-sm text-gray-400 mb-2">
                          Skills validated by community
                        </p>
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-amber-500" />
                          <span className="text-sm font-medium text-amber-300">
                            {creator.aethex_skill_endorsements.reduce(
                              (sum, e) => sum + e.count,
                              0,
                            )}{" "}
                            total endorsements
                          </span>
                        </div>
                      </div>
                    )}
                </CardContent>
              </Card>
            )}

            {/* Projects Section */}
            {creator.aethex_projects && creator.aethex_projects.length > 0 && (
              <Card className="bg-slate-800/50 border-slate-700 mb-8">
                <CardHeader>
                  <CardTitle>Portfolio Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {creator.aethex_projects.map((project) => (
                      <Card
                        key={project.id}
                        className="bg-slate-700/30 border-slate-600"
                      >
                        <CardContent className="p-4">
                          {project.image_url && (
                            <img
                              src={project.image_url}
                              alt={project.title}
                              className="w-full h-40 object-cover rounded-lg mb-3"
                            />
                          )}
                          <h3 className="font-bold text-white mb-1">
                            {project.title}
                          </h3>
                          <p className="text-sm text-gray-400 mb-3">
                            {project.description}
                          </p>
                          {project.url && (
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View Project
                                <ExternalLink className="h-3 w-3 ml-2" />
                              </a>
                            </Button>
                          )}
                          {project.tags && project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {project.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs bg-slate-600/50 text-gray-300 px-2 py-1 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Experience Level */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Experience Level</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className="bg-slate-700/50 text-gray-300 border-0 px-3 py-1.5 text-sm">
                  {creator.experience_level || "Not specified"}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </Layout>
  );
}
