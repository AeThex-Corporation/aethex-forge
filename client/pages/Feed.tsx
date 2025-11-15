import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Layout from "@/components/Layout";
import LoadingScreen from "@/components/LoadingScreen";
import PostComposer from "@/components/feed/PostComposer";
import { FeedItemCard } from "@/components/social/FeedItemCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { aethexSocialService } from "@/lib/aethex-social-service";
import { cn } from "@/lib/utils";
import { normalizeErrorMessage } from "@/lib/error-utils";
import { communityService, realtimeService } from "@/lib/supabase-service";
import {
  ArrowUpRight,
  Flame,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
  Gamepad2,
  Briefcase,
  BookOpen,
  Network,
  Shield,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "";

export type ArmType =
  | "labs"
  | "gameforge"
  | "corp"
  | "foundation"
  | "devlink"
  | "nexus"
  | "staff";

const ARMS: { id: ArmType; label: string; icon: any; color: string }[] = [
  { id: "labs", label: "Labs", icon: Zap, color: "text-yellow-400" },
  {
    id: "gameforge",
    label: "GameForge",
    icon: Gamepad2,
    color: "text-green-400",
  },
  { id: "corp", label: "Corp", icon: Briefcase, color: "text-blue-400" },
  {
    id: "foundation",
    label: "Foundation",
    icon: BookOpen,
    color: "text-red-400",
  },
  { id: "devlink", label: "Dev-Link", icon: Network, color: "text-cyan-400" },
  { id: "nexus", label: "Nexus", icon: Sparkles, color: "text-purple-400" },
  { id: "staff", label: "Staff", icon: Shield, color: "text-indigo-400" },
];

export interface FeedItem {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string | null;
  caption?: string;
  mediaUrl?: string | null;
  mediaType: "video" | "image" | "none";
  likes: number;
  comments: number;
  arm?: ArmType;
}

interface TrendingTopic {
  topic: string;
  count: number;
}

interface CreatorSummary {
  id: string;
  name: string;
  avatar?: string | null;
  likes: number;
  posts: number;
}

function parseContent(content: string): {
  text?: string;
  mediaUrl?: string | null;
  mediaType: "video" | "image" | "none";
} {
  try {
    const obj = JSON.parse(content || "{}");
    return {
      text: obj.text || content,
      mediaUrl: obj.mediaUrl || null,
      mediaType:
        obj.mediaType ||
        (obj.mediaUrl
          ? /(mp4|webm|mov)$/i.test(obj.mediaUrl)
            ? "video"
            : "image"
          : "none"),
    };
  } catch {
    return { text: content, mediaUrl: null, mediaType: "none" };
  }
}

export default function Feed() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const composerRef = useRef<HTMLDivElement | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [following, setFollowing] = useState<string[]>([]);
  const [items, setItems] = useState<FeedItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "following" | "trending"
  >("all");
  const [selectedArms, setSelectedArms] = useState<ArmType[]>([]);
  const [showPostComposer, setShowPostComposer] = useState(false);
  const [followedArms, setFollowedArms] = useState<ArmType[]>([]);
  const [showArmFollowManager, setShowArmFollowManager] = useState(false);

  const mapPostsToFeedItems = useCallback(
    (source: any[]): FeedItem[] =>
      (Array.isArray(source) ? source : []).map((p: any) => {
        const meta = parseContent(p.content);
        const author = p.user_profiles || {};
        return {
          id: p.id,
          authorId: p.author_id,
          authorName: author.full_name || author.username || "Community member",
          authorAvatar: author.avatar_url,
          caption: meta.text,
          mediaUrl: meta.mediaUrl,
          mediaType: meta.mediaType,
          likes: p.likes_count ?? 0,
          comments: p.comments_count ?? 0,
          arm: p.arm_affiliation || "labs",
        };
      }),
    [],
  );

  const fetchFeed = useCallback(async () => {
    setIsLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      try {
        const [posts, flw] = await Promise.race([
          Promise.all([
            communityService.getPosts(30),
            user?.id
              ? aethexSocialService.getFollowing(user.id)
              : Promise.resolve([]),
          ]),
          new Promise<any>((_, reject) =>
            setTimeout(
              () => reject(new Error("Feed loading timeout - try refreshing")),
              28000,
            ),
          ),
        ]);

        clearTimeout(timeoutId);
        setFollowing(Array.isArray(flw) ? flw : []);
        let mapped = mapPostsToFeedItems(posts);
        setItems(mapped);
      } catch (timeoutError) {
        clearTimeout(timeoutId);
        throw timeoutError;
      }
    } catch (error) {
      console.error("Failed to load feed", error);
      toast({
        variant: "destructive",
        title: "Failed to load feed",
        description: normalizeErrorMessage(error),
      });
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [mapPostsToFeedItems, toast, user?.id]);

  useEffect(() => {
    // Initialize with all arms if none selected
    if (selectedArms.length === 0) {
      setSelectedArms(ARMS.map((a) => a.id));
    }

    // Load user's followed arms
    if (user?.id) {
      loadFollowedArms();
    }
  }, [user?.id]);

  const loadFollowedArms = async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(`/api/user/arm-follows?user_id=${user.id}`);
      if (response.ok) {
        const { arms } = await response.json();
        setFollowedArms(arms || []);
      }
    } catch (error) {
      console.warn("Failed to load followed arms:", error);
    }
  };

  const toggleFollowArm = async (arm: ArmType) => {
    if (!user?.id) {
      toast({ description: "Please sign in to manage arm follows." });
      return;
    }

    try {
      if (followedArms.includes(arm)) {
        // Unfollow
        await fetch(`/api/user/arm-follows?user_id=${user.id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ arm_affiliation: arm }),
        });
        setFollowedArms((state) => state.filter((a) => a !== arm));
        toast({
          description: `Unfollowed ${ARMS.find((a) => a.id === arm)?.label}`,
        });
      } else {
        // Follow
        await fetch(`/api/user/arm-follows?user_id=${user.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ arm_affiliation: arm }),
        });
        setFollowedArms((state) => Array.from(new Set([...state, arm])));
        toast({
          description: `Following ${ARMS.find((a) => a.id === arm)?.label}!`,
        });
      }
    } catch (error) {
      console.error("Failed to update arm follow:", error);
      toast({
        variant: "destructive",
        description: "Failed to update preference",
      });
    }
  };

  useEffect(() => {
    fetchFeed();

    let cleanup: (() => void) | undefined;
    try {
      const subscription = realtimeService.subscribeToCommunityPosts(() => {
        fetchFeed();
      });
      cleanup = () => {
        try {
          subscription.unsubscribe?.();
        } catch (error) {
          console.warn("Unable to unsubscribe from community posts", error);
        }
      };
    } catch (error) {
      console.warn("Realtime subscription unavailable", error);
    }

    return () => {
      cleanup?.();
    };
  }, [fetchFeed]);

  const isFollowingAuthor = useCallback(
    (id: string) => following.includes(id),
    [following],
  );

  const toggleFollow = useCallback(
    async (targetId: string) => {
      if (!user) {
        toast({ description: "Please sign in to manage follows." });
        return;
      }

      try {
        if (isFollowingAuthor(targetId)) {
          await aethexSocialService.unfollowUser(user.id, targetId);
          setFollowing((state) => state.filter((value) => value !== targetId));
        } else {
          await aethexSocialService.followUser(user.id, targetId);
          setFollowing((state) => Array.from(new Set([...state, targetId])));
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Action failed",
          description: error?.message || "Try again in a moment.",
        });
      }
    },
    [isFollowingAuthor, toast, user],
  );

  const handleShare = useCallback(
    async (id: string) => {
      const url = `${location.origin}/feed#post-${id}`;
      try {
        if ((navigator as any).share) {
          await (navigator as any).share({
            title: "AeThex",
            text: "Check out this post on AeThex",
            url,
          });
        } else if (typeof window !== "undefined") {
          const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            "Check out this post on AeThex",
          )}&url=${encodeURIComponent(url)}`;
          window.open(intent, "_blank", "noopener,noreferrer");
          await navigator.clipboard.writeText(url).catch(() => undefined);
          toast({ description: "Share link opened (copied to clipboard)" });
        }
      } catch (error) {
        console.warn("Share cancelled", error);
      }
    },
    [toast],
  );

  const handleLike = useCallback(
    async (postId: string) => {
      if (!user?.id) {
        toast({ description: "Please sign in to like posts." });
        return;
      }
      try {
        const newCount = await communityService.likePost(postId, user.id);
        setItems((prev) =>
          prev.map((it) =>
            it.id === postId && typeof newCount === "number"
              ? { ...it, likes: newCount }
              : it,
          ),
        );
      } catch (e) {
        console.warn("Like failed", e);
      }
    },
    [toast, user?.id],
  );

  const handleComment = useCallback((postId: string) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === postId ? { ...it, comments: it.comments + 1 } : it,
      ),
    );
  }, []);

  const handlePostSuccess = useCallback(() => {
    setShowPostComposer(false);
    fetchFeed();
  }, [fetchFeed]);

  const filteredItems = useMemo(() => {
    let filtered = items.filter((item) =>
      selectedArms.includes(item.arm || "labs"),
    );

    if (activeFilter === "following") {
      filtered = filtered.filter(
        (item) =>
          isFollowingAuthor(item.authorId) || item.authorId === user?.id,
      );
    }
    if (activeFilter === "trending") {
      filtered = [...filtered].sort(
        (a, b) => b.likes + b.comments - (a.likes + a.comments),
      );
    }
    return filtered;
  }, [activeFilter, isFollowingAuthor, items, selectedArms, user?.id]);

  const trendingTopics = useMemo<TrendingTopic[]>(() => {
    const counts = new Map<string, number>();
    items.forEach((item) => {
      const matches = item.caption?.match(/#[\p{L}0-9_]+/gu) ?? [];
      matches.forEach((tag) => {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      });
    });
    return Array.from(counts.entries())
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [items]);

  const topCreators = useMemo<CreatorSummary[]>(() => {
    const map = new Map<string, CreatorSummary>();
    items.forEach((item) => {
      const existing = map.get(item.authorId) ?? {
        id: item.authorId,
        name: item.authorName,
        avatar: item.authorAvatar,
        likes: 0,
        posts: 0,
      };
      existing.likes += item.likes;
      existing.posts += 1;
      if (!existing.avatar) {
        existing.avatar = item.authorAvatar;
      }
      map.set(item.authorId, existing);
    });
    return Array.from(map.values())
      .sort((a, b) => {
        if (b.likes === a.likes) return b.posts - a.posts;
        return b.likes - a.likes;
      })
      .slice(0, 5);
  }, [items]);

  const suggestedCreators = useMemo(() => {
    return topCreators.filter(
      (creator) => creator.id !== user?.id && !isFollowingAuthor(creator.id),
    );
  }, [isFollowingAuthor, topCreators, user?.id]);

  const totalEngagement = useMemo(
    () =>
      items.reduce(
        (acc, item) =>
          acc + (Number(item.likes) || 0) + (Number(item.comments) || 0),
        0,
      ),
    [items],
  );

  const averageEngagement = useMemo(() => {
    if (!items.length) return 0;
    return Math.round(totalEngagement / items.length);
  }, [items.length, totalEngagement]);

  const handleScrollToComposer = useCallback(() => {
    composerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, []);

  const handleManualRefresh = useCallback(() => {
    fetchFeed();
  }, [fetchFeed]);

  if (loading || (isLoading && items.length === 0)) {
    return (
      <LoadingScreen
        message="Loading your feed..."
        showProgress
        duration={1000}
      />
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(110,141,255,0.12),transparent_60%)]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 sm:gap-6 lg:gap-8 px-3 sm:px-4 pb-16 pt-6 sm:pt-10 lg:px-6">
          <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border/40 bg-background/80 p-4 sm:p-6 lg:p-8 shadow-2xl backdrop-blur">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(96,189,255,0.18),transparent_60%)]" />
            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground">
                    Community Pulse
                  </h1>
                  <p className="mt-1 sm:mt-2 max-w-2xl text-xs sm:text-sm lg:text-base text-muted-foreground">
                    Discover new creations, amplify your voice, and engage with
                    the AeThex community in real time.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <Badge
                    variant="outline"
                    className="border-aethex-400/60 bg-aethex-400/10 text-aethex-100 text-xs sm:text-sm"
                  >
                    Live updates enabled
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleManualRefresh}
                    className="gap-1 sm:gap-2 rounded-full border-border/60 bg-background/80 backdrop-blur text-xs sm:text-sm"
                  >
                    <RotateCcw className="h-3 sm:h-4 w-3 sm:w-4" />{" "}
                    <span className="hidden sm:inline">Refresh</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {[
                    {
                      key: "all" as const,
                      label: "All stories",
                      icon: Sparkles,
                      description: "Latest community activity",
                    },
                    {
                      key: "following" as const,
                      label: "Following",
                      icon: Users,
                      description: "People you follow",
                    },
                    {
                      key: "trending" as const,
                      label: "Trending",
                      icon: Flame,
                      description: "Most engagement",
                    },
                  ].map(({ key, label, icon: Icon, description }) => (
                    <Button
                      key={key}
                      variant={activeFilter === key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveFilter(key)}
                      className={cn(
                        "flex items-center gap-1 sm:gap-2 rounded-full border-border/50 px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm",
                        activeFilter === key
                          ? "bg-gradient-to-r from-aethex-500 to-neon-blue text-white shadow-lg"
                          : "bg-background/80 text-muted-foreground backdrop-blur",
                      )}
                    >
                      <Icon className="h-3 sm:h-4 w-3 sm:w-4" />
                      <span className="font-medium">{label}</span>
                      <span className="hidden text-xs sm:inline">
                        {description}
                      </span>
                    </Button>
                  ))}
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="uppercase text-muted-foreground font-semibold">
                      Filter by Arms
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setShowArmFollowManager(!showArmFollowManager)
                      }
                      className="text-xs text-aethex-200 hover:text-aethex-100 h-auto p-1"
                    >
                      {showArmFollowManager ? "Hide" : "Manage"}
                    </Button>
                  </div>

                  <div className="overflow-x-auto scrollbar-hide">
                    <div className="flex items-center gap-1.5 sm:gap-2 pb-2 min-w-min">
                      {ARMS.map((arm) => (
                        <Button
                          key={arm.id}
                          variant={
                            selectedArms.includes(arm.id)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            setSelectedArms((prev) =>
                              prev.includes(arm.id)
                                ? prev.filter((a) => a !== arm.id)
                                : [...prev, arm.id],
                            )
                          }
                          className={cn(
                            "flex items-center gap-0.5 sm:gap-1.5 rounded-full border-border/50 px-2 sm:px-3 py-1.5 text-xs whitespace-nowrap flex-shrink-0",
                            selectedArms.includes(arm.id)
                              ? "bg-gradient-to-r from-aethex-600 to-neon-blue text-white shadow-md"
                              : "bg-background/60 text-muted-foreground backdrop-blur hover:border-border",
                          )}
                        >
                          <arm.icon
                            className={cn(
                              "h-3 sm:h-3.5 w-3 sm:w-3.5",
                              arm.color,
                            )}
                          />
                          <span className="font-medium hidden sm:inline">
                            {arm.label}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {showArmFollowManager && user?.id && (
                    <div className="rounded-xl sm:rounded-2xl border border-border/40 bg-background/60 p-3 sm:p-4 space-y-2 sm:space-y-3">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        ✨ Follow arms to personalize your feed. Only posts from
                        followed arms will appear in your "Following" tab.
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
                        {ARMS.map((arm) => (
                          <Button
                            key={arm.id}
                            size="sm"
                            variant={
                              followedArms.includes(arm.id)
                                ? "default"
                                : "outline"
                            }
                            onClick={() => toggleFollowArm(arm.id)}
                            className={cn(
                              "rounded-full text-xs font-medium gap-1",
                              followedArms.includes(arm.id)
                                ? "bg-gradient-to-r from-aethex-500 to-neon-blue text-white"
                                : "bg-background/60 text-muted-foreground hover:border-border",
                            )}
                          >
                            {followedArms.includes(arm.id) ? "✓" : "+"}{" "}
                            {arm.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-4 sm:gap-6 lg:grid-cols-[minmax(0,2.2fr)_minmax(280px,1fr)]">
            <div className="space-y-4 sm:space-y-6">
              <div
                ref={composerRef}
                id="feed-composer"
                className="space-y-2 sm:space-y-3 rounded-2xl sm:rounded-3xl border border-border/40 bg-background/70 p-3 sm:p-4 shadow-xl backdrop-blur-lg lg:sticky lg:top-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
                  <div className="flex-1">
                    <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-foreground">
                      Share something new
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Post updates or spark a conversation
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowPostComposer(true)}
                    className="rounded-full bg-aethex-500/20 text-aethex-100 hover:bg-aethex-500/30 text-xs sm:text-sm whitespace-nowrap"
                  >
                    Compose
                  </Button>
                </div>
                <PostComposer
                  open={showPostComposer}
                  onOpenChange={setShowPostComposer}
                  currentUserId={user?.id}
                  currentUserProfile={
                    user
                      ? {
                          id: user.id,
                          username: user.user_metadata?.username,
                          full_name: user.user_metadata?.full_name,
                          avatar_url: user.user_metadata?.avatar_url,
                        }
                      : undefined
                  }
                  onSuccess={handlePostSuccess}
                />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border border-border/30 bg-background/60 p-2.5 sm:p-3 lg:p-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Sparkles className="h-3 sm:h-3.5 lg:h-4 w-3 sm:w-3.5 lg:w-4 text-aethex-300 flex-shrink-0" />
                    <span className="hidden sm:inline">
                      Your post is shared instantly with followers and the
                      broader community.
                    </span>
                    <span className="sm:hidden">Posts shared instantly</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveFilter("trending")}
                    className="flex items-center gap-1 text-xs font-medium text-aethex-200 hover:text-aethex-100 whitespace-nowrap"
                  >
                    Trending <ArrowUpRight className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Mobile Stats Card - Only visible on mobile */}
              <div className="lg:hidden">
                <Card className="rounded-2xl border-border/40 bg-background/60 shadow-lg backdrop-blur">
                  <CardContent className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-center">
                        <p className="text-xs uppercase text-muted-foreground">
                          Stories
                        </p>
                        <p className="mt-1 text-xl font-semibold text-foreground">
                          {items.length}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs uppercase text-muted-foreground">
                          Following
                        </p>
                        <p className="mt-1 text-xl font-semibold text-foreground">
                          {following.length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {filteredItems.length === 0 ? (
                <Card className="rounded-3xl border-border/40 bg-background/70 shadow-xl backdrop-blur-lg">
                  <CardHeader>
                    <CardTitle className="text-xl">No stories found</CardTitle>
                    <CardDescription>
                      Try switching filters or follow more creators to
                      personalize your feed.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button
                      variant="default"
                      className="mt-4 rounded-full bg-gradient-to-r from-aethex-500 to-neon-blue text-white"
                      onClick={() => setActiveFilter("all")}
                    >
                      Reset filters
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {filteredItems.map((item) => (
                    <FeedItemCard
                      key={item.id}
                      item={item}
                      isFollowing={isFollowingAuthor(item.authorId)}
                      onToggleFollow={toggleFollow}
                      onShare={handleShare}
                      onLike={handleLike}
                      onComment={handleComment}
                    />
                  ))}
                </div>
              )}
            </div>

            <aside className="space-y-6 hidden lg:block">
              <Card className="rounded-3xl border-border/40 bg-background/70 shadow-xl backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Your community snapshot
                  </CardTitle>
                  <CardDescription>
                    Track how your network is evolving at a glance.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl border border-border/30 bg-background/60 p-4">
                      <p className="text-xs uppercase text-muted-foreground">
                        Stories today
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-foreground">
                        {items.length.toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border/30 bg-background/60 p-4">
                      <p className="text-xs uppercase text-muted-foreground">
                        Creators you follow
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-foreground">
                        {following.length.toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border/30 bg-background/60 p-4">
                      <p className="text-xs uppercase text-muted-foreground">
                        Community reactions
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-foreground">
                        {totalEngagement.toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border/30 bg-background/60 p-4">
                      <p className="text-xs uppercase text-muted-foreground">
                        Avg. engagement
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-foreground">
                        {averageEngagement.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Separator className="border-border/40" />
                  <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-aethex-300" />
                      {activeFilter === "trending"
                        ? "Showing creators with the highest engagement right now."
                        : "Switch to Trending to surface the most active stories."}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-aethex-300" />
                      Invite collaborators to strengthen your network.
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-border/40 bg-background/70 shadow-xl backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Trending topics</CardTitle>
                  <CardDescription>
                    Popular conversations emerging across the community.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {trendingTopics.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Start a conversation by adding hashtags like #gamedev or
                      #design to your next post.
                    </p>
                  ) : (
                    trendingTopics.map((topic, index) => (
                      <div
                        key={topic.topic}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-border/30 bg-background/60 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-aethex-500/20 text-sm font-semibold text-aethex-100">
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-medium text-foreground">
                              {topic.topic}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {topic.count.toLocaleString()} mentions today
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-full text-aethex-200 hover:text-aethex-100"
                          onClick={() => setActiveFilter("trending")}
                        >
                          Explore
                        </Button>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-border/40 bg-background/70 shadow-xl backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Creators to watch</CardTitle>
                  <CardDescription>
                    Follow high-signal builders to enrich your feed.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {suggestedCreators.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      You are up to date with the creators you follow. Engage
                      with new posts to unlock more suggestions.
                    </p>
                  ) : (
                    suggestedCreators.map((creator) => (
                      <div
                        key={creator.id}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-border/30 bg-background/60 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={creator.avatar || undefined}
                              alt={creator.name}
                            />
                            <AvatarFallback>
                              {creator.name?.[0]?.toUpperCase() || "C"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">
                              {creator.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {creator.posts.toLocaleString()} posts ·{" "}
                              {creator.likes.toLocaleString()} reactions
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full border-border/50"
                          onClick={() => toggleFollow(creator.id)}
                        >
                          Follow
                        </Button>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  );
}
