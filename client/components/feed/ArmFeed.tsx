import { useCallback, useEffect, useMemo, useState } from "react";
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
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { aethexSocialService } from "@/lib/aethex-social-service";
import { cn } from "@/lib/utils";
import { normalizeErrorMessage } from "@/lib/error-utils";
import { communityService, realtimeService } from "@/lib/supabase-service";
import {
  ArrowUpRight,
  RotateCcw,
  TrendingUp,
  Users,
  Zap,
  Gamepad2,
  Briefcase,
  BookOpen,
  Network,
  Shield,
  Sparkles,
} from "lucide-react";

export type ArmType =
  | "labs"
  | "gameforge"
  | "corp"
  | "foundation"
  | "devlink"
  | "nexus"
  | "staff";

const ARMS: {
  id: ArmType;
  label: string;
  icon: any;
  color: string;
  description: string;
}[] = [
  {
    id: "labs",
    label: "Labs",
    icon: Zap,
    color: "text-yellow-400",
    description: "Innovation and experimentation",
  },
  {
    id: "gameforge",
    label: "GameForge",
    icon: Gamepad2,
    color: "text-green-400",
    description: "Game development excellence",
  },
  {
    id: "corp",
    label: "Corp",
    icon: Briefcase,
    color: "text-blue-400",
    description: "Commercial partnerships",
  },
  {
    id: "foundation",
    label: "Foundation",
    icon: BookOpen,
    color: "text-red-400",
    description: "Education and mentorship",
  },
  {
    id: "devlink",
    label: "Dev-Link",
    icon: Network,
    color: "text-cyan-400",
    description: "Developer networking",
  },
  {
    id: "nexus",
    label: "Nexus",
    icon: Sparkles,
    color: "text-purple-400",
    description: "Talent marketplace",
  },
  {
    id: "staff",
    label: "Staff",
    icon: Shield,
    color: "text-indigo-400",
    description: "Internal operations",
  },
];

interface FeedItem {
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
  source?: "discord" | "web" | null;
  discordChannelName?: string | null;
  discordAuthorTag?: string | null;
}

function parseContent(content: string) {
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
      source: obj.source || null,
      discordChannelName: obj.discord_channel_name || obj.discord_channel || null,
      discordAuthorTag: obj.discord_author_tag || null,
    };
  } catch {
    return { text: content, mediaUrl: null, mediaType: "none", source: null };
  }
}

interface ArmFeedProps {
  arm: ArmType;
}

export default function ArmFeed({ arm }: ArmFeedProps) {
  const { user, loading } = useAuth();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [following, setFollowing] = useState<string[]>([]);
  const [items, setItems] = useState<FeedItem[]>([]);
  const [showPostComposer, setShowPostComposer] = useState(false);

  const mapPostsToFeedItems = useCallback(
    (source: any[]) =>
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
          source: meta.source,
          discordChannelName: meta.discordChannelName,
          discordAuthorTag: meta.discordAuthorTag,
        };
      }),
    [],
  );

  const fetchFeed = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch posts for this specific arm
      const posts = await communityService.getPosts(30);
      const armPosts = posts.filter((p: any) => p.arm_affiliation === arm);

      const flw = user?.id
        ? await aethexSocialService.getFollowing(user.id)
        : [];

      setFollowing(Array.isArray(flw) ? flw : []);
      setItems(mapPostsToFeedItems(armPosts));
    } catch (error) {
      console.error("Failed to load arm feed:", error);
      toast?.({
        variant: "destructive",
        title: "Failed to load feed",
        description: normalizeErrorMessage(error),
      });
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [mapPostsToFeedItems, user?.id, toast, arm]);

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
        toast?.({ description: "Please sign in to manage follows." });
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
        toast?.({
          variant: "destructive",
          title: "Action failed",
          description: error?.message || "Try again in a moment.",
        });
      }
    },
    [isFollowingAuthor, user, toast],
  );

  const handleShare = useCallback(
    async (id: string) => {
      const url = `${location.origin}/${arm}#post-${id}`;
      try {
        if ((navigator as any).share) {
          await (navigator as any).share({
            title: "AeThex",
            text: `Check out this ${ARMS.find((a) => a.id === arm)?.label} post`,
            url,
          });
        }
      } catch (error) {
        console.warn("Share cancelled", error);
      }
    },
    [arm],
  );

  const handleLike = useCallback(
    async (postId: string) => {
      if (!user?.id) {
        toast?.({ description: "Please sign in to like posts." });
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
    [user?.id, toast],
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

  const armData = ARMS.find((a) => a.id === arm)!;

  if (loading || (isLoading && items.length === 0)) {
    return (
      <LoadingScreen
        message={`Loading ${armData.label} feed...`}
        showProgress
        duration={1000}
      />
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(110,141,255,0.12),transparent_60%)]">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 pb-16 pt-10 lg:px-6">
          {/* Arm Header */}
          <section className="relative overflow-hidden rounded-3xl border border-border/40 bg-background/80 p-8 shadow-2xl backdrop-blur">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(96,189,255,0.18),transparent_60%)]" />
            <div className="relative z-10 flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={cn("p-3 rounded-2xl bg-background/60")}>
                  <armData.icon className={cn("h-8 w-8", armData.color)} />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-foreground">
                    {armData.label}
                  </h1>
                  <p className="mt-1 text-muted-foreground">
                    {armData.description}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchFeed()}
                className="gap-2 rounded-full border-border/60 bg-background/80 backdrop-blur"
              >
                <RotateCcw className="h-4 w-4" /> Refresh
              </Button>
            </div>
          </section>

          {/* Composer */}
          <div className="rounded-3xl border border-border/40 bg-background/70 p-4 shadow-xl backdrop-blur-lg">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Share something new
                </h2>
                <p className="text-xs text-muted-foreground">
                  Post updates for the {armData.label} community
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowPostComposer(true)}
                className="rounded-full bg-aethex-500/20 text-aethex-100 hover:bg-aethex-500/30 text-xs"
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
          </div>

          {/* Feed */}
          {items.length === 0 ? (
            <Card className="rounded-3xl border-border/40 bg-background/70 shadow-xl backdrop-blur-lg">
              <CardHeader>
                <CardTitle>No posts yet</CardTitle>
                <CardDescription>
                  Be the first to post in {armData.label}!
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
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
      </div>
    </Layout>
  );
}
