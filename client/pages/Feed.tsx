import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import ArmPostCard, { ArmType } from "@/components/feed/ArmPostCard";
import CommentsModal from "@/components/feed/CommentsModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { aethexToast } from "@/lib/aethex-toast";
import LoadingScreen from "@/components/LoadingScreen";
import {
  Zap,
  Gamepad2,
  Briefcase,
  BookOpen,
  Network,
  Sparkles,
  Shield,
  Plus,
  Filter,
  X,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "";

const ARMS: { id: ArmType; label: string; icon: any; color: string }[] = [
  { id: "labs", label: "Labs", icon: Zap, color: "text-yellow-400" },
  { id: "gameforge", label: "GameForge", icon: Gamepad2, color: "text-green-400" },
  { id: "corp", label: "Corp", icon: Briefcase, color: "text-blue-400" },
  { id: "foundation", label: "Foundation", icon: BookOpen, color: "text-red-400" },
  { id: "devlink", label: "Dev-Link", icon: Network, color: "text-cyan-400" },
  { id: "nexus", label: "Nexus", icon: Sparkles, color: "text-purple-400" },
  { id: "staff", label: "Staff", icon: Shield, color: "text-purple-400" },
];

interface Post {
  id: string;
  title: string;
  content: string;
  arm_affiliation: ArmType;
  author_id: string;
  created_at: string;
  likes_count?: number;
  comments_count?: number;
  tags?: string[];
  category?: string;
  user_profiles?: {
    id: string;
    username?: string;
    full_name?: string;
    avatar_url?: string;
  };
}

export default function Feed() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArms, setSelectedArms] = useState<ArmType[]>([]);
  const [userFollowedArms, setUserFollowedArms] = useState<ArmType[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | ArmType>("all");
  const [selectedPostForComments, setSelectedPostForComments] = useState<string | null>(null);
  const [userLikedPosts, setUserLikedPosts] = useState<Set<string>>(new Set());

  // Load user's followed arms
  useEffect(() => {
    const loadFollowedArms = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch(
          `${API_BASE}/api/user/followed-arms?user_id=${user.id}`
        );
        if (response.ok) {
          const data = await response.json();
          setUserFollowedArms(data.followedArms || []);
          // Initialize selected arms with followed arms
          if (data.followedArms.length > 0) {
            setSelectedArms(data.followedArms);
          } else {
            // If no followed arms, default to all
            setSelectedArms(ARMS.map((a) => a.id));
          }
        }
      } catch (error) {
        console.error("Failed to load followed arms:", error);
      }
    };

    loadFollowedArms();
  }, [user?.id]);

  // Load user's liked posts
  const loadUserLikes = async (postIds: string[]) => {
    if (!user?.id || postIds.length === 0) return;

    try {
      const likedPosts = new Set<string>();
      await Promise.allSettled(
        postIds.map(async (postId) => {
          const response = await fetch(
            `${API_BASE}/api/community/post-likes?post_id=${postId}&user_id=${user.id}`
          );
          if (response.ok) {
            const data = await response.json();
            if (data.userLiked) {
              likedPosts.add(postId);
            }
          }
        })
      );
      setUserLikedPosts(likedPosts);
    } catch (error) {
      console.error("Failed to load user likes:", error);
    }
  };

  // Load feed posts
  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      try {
        const armFilter =
          activeTab === "all" && selectedArms.length > 0
            ? selectedArms
            : activeTab !== "all"
              ? [activeTab]
              : [];

        const params = new URLSearchParams({
          limit: "50",
          offset: "0",
        });

        if (armFilter.length > 0) {
          armFilter.forEach((arm) => {
            params.append("arm_filter", arm);
          });
        }

        if (user?.id) {
          params.append("user_id", user.id);
        }

        const response = await fetch(`${API_BASE}/api/feed?${params.toString()}`);

        if (response.ok) {
          const data = await response.json();
          setPosts(data.posts || []);
        } else {
          console.error("Failed to load feed");
          aethexToast.error({
            title: "Failed to load feed",
            description: "Please try again later",
          });
        }
      } catch (error) {
        console.error("Error loading feed:", error);
        aethexToast.error({
          title: "Error loading feed",
          description: error instanceof Error ? error.message : "Unknown error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, [activeTab, selectedArms, user?.id]);

  const handleArmToggle = (armId: ArmType) => {
    setSelectedArms((prev) =>
      prev.includes(armId) ? prev.filter((a) => a !== armId) : [...prev, armId]
    );
  };

  const handleFollowArm = async (armId: ArmType) => {
    if (!user?.id) {
      aethexToast.error({
        title: "Not signed in",
        description: "Please sign in to follow arms",
      });
      return;
    }

    try {
      const isFollowing = userFollowedArms.includes(armId);
      const response = await fetch(`${API_BASE}/api/user/followed-arms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          arm_id: armId,
          action: isFollowing ? "unfollow" : "follow",
        }),
      });

      if (response.ok) {
        if (isFollowing) {
          setUserFollowedArms((prev) => prev.filter((a) => a !== armId));
          aethexToast.info({
            title: "Unfollowed",
            description: `You unfollowed ${armId}`,
          });
        } else {
          setUserFollowedArms((prev) => [...prev, armId]);
          aethexToast.success({
            title: "Following",
            description: `You're now following ${armId}`,
          });
        }
      }
    } catch (error) {
      console.error("Error toggling arm follow:", error);
      aethexToast.error({
        title: "Error",
        description: "Failed to update follow status",
      });
    }
  };

  const filteredPosts = useMemo(() => {
    if (activeTab === "all") {
      return posts.filter((post) => selectedArms.includes(post.arm_affiliation));
    }
    return posts.filter((post) => post.arm_affiliation === activeTab);
  }, [posts, activeTab, selectedArms]);

  if (isLoading) {
    return <LoadingScreen message="Loading community feed..." />;
  }

  return (
    <Layout>
      <SEO
        title="Community Feed | AeThex"
        description="Discover posts and updates from all AeThex arms"
      />

      <div className="min-h-screen bg-aethex-gradient py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="mb-8 animate-slide-down">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-aethex-300 via-neon-blue to-aethex-400 bg-clip-text text-transparent">
                    Community Feed
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    The AeThex Town Square • See what all arms are building
                  </p>
                </div>
                <Button className="h-12 bg-gradient-to-r from-aethex-600 to-neon-blue hover:from-aethex-700 hover:to-neon-blue/90 text-white font-semibold hover-lift">
                  <Plus className="h-5 w-5 mr-2" />
                  Create Post
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Filters & Followed Arms */}
            <div className="lg:col-span-1 space-y-4">
              {/* Filter Toggle (Mobile) */}
              <Button
                variant="outline"
                className="w-full lg:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                {showFilters ? "Hide" : "Show"} Filters
              </Button>

              {/* Filters Card */}
              {(showFilters || true) && (
                <Card className="bg-card/50 border-border/40 sticky top-24 hidden lg:block">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Filter className="h-5 w-5 text-aethex-400" />
                      Filter by Arm
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {ARMS.map((arm) => (
                      <div
                        key={arm.id}
                        className="flex items-center space-x-3 group cursor-pointer"
                      >
                        <Checkbox
                          id={`arm-${arm.id}`}
                          checked={selectedArms.includes(arm.id)}
                          onCheckedChange={() => handleArmToggle(arm.id)}
                          className="transition-all"
                        />
                        <Label
                          htmlFor={`arm-${arm.id}`}
                          className="flex items-center gap-2 cursor-pointer flex-1"
                        >
                          <arm.icon className={`h-4 w-4 ${arm.color}`} />
                          <span className="font-medium">{arm.label}</span>
                        </Label>
                        <Badge
                          variant="outline"
                          className="text-xs opacity-60 group-hover:opacity-100 transition-opacity"
                        >
                          {posts.filter((p) => p.arm_affiliation === arm.id).length}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Followed Arms Card */}
              <Card className="bg-card/50 border-border/40 hidden lg:block">
                <CardHeader>
                  <CardTitle className="text-lg">My Arms</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {userFollowedArms.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No arms followed yet. Start following to personalize your feed.
                    </p>
                  ) : (
                    userFollowedArms.map((armId) => {
                      const arm = ARMS.find((a) => a.id === armId);
                      if (!arm) return null;
                      return (
                        <div
                          key={armId}
                          className="flex items-center justify-between p-2 rounded bg-background/40 hover:bg-background/60 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <arm.icon className={`h-4 w-4 ${arm.color}`} />
                            <span className="text-sm font-medium">{arm.label}</span>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => handleFollowArm(armId)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Main Feed Content */}
            <div className="lg:col-span-3 space-y-4">
              {/* Tabs */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={activeTab === "all" ? "default" : "outline"}
                  className={activeTab === "all" ? "bg-aethex-600" : ""}
                  onClick={() => setActiveTab("all")}
                >
                  All
                </Button>
                {ARMS.map((arm) => (
                  <Button
                    key={arm.id}
                    variant={activeTab === arm.id ? "default" : "outline"}
                    className={activeTab === arm.id ? "bg-aethex-600" : ""}
                    onClick={() => setActiveTab(arm.id)}
                  >
                    <arm.icon className="h-4 w-4 mr-1" />
                    {arm.label}
                  </Button>
                ))}
              </div>

              {/* Posts */}
              <div className="space-y-4">
                {filteredPosts.length === 0 ? (
                  <Card className="bg-card/50 border-border/40">
                    <CardContent className="p-12 text-center">
                      <p className="text-muted-foreground mb-4">
                        No posts found in{" "}
                        {activeTab === "all" ? "your feed" : activeTab}
                      </p>
                      <Button variant="outline">
                        Follow more arms to see posts
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  filteredPosts.map((post, index) => (
                    <div
                      key={post.id}
                      style={{ animationDelay: `${index * 50}ms` }}
                      className="animate-fade-in"
                    >
                      <ArmPostCard post={post} />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
