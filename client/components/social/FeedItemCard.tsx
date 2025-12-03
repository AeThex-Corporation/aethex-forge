import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { communityService } from "@/lib/supabase-service";
import { Heart, MessageCircle, Share2, Volume2, VolumeX, MessageSquare } from "lucide-react";
import type { FeedItem } from "@/pages/Feed";

const DiscordIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

const ARM_COLORS: Record<
  string,
  { bg: string; border: string; badge: string; text: string }
> = {
  labs: {
    bg: "bg-yellow-500/10",
    border: "border-l-4 border-l-yellow-400",
    badge: "bg-yellow-500/20 text-yellow-200",
    text: "text-yellow-400",
  },
  gameforge: {
    bg: "bg-green-500/10",
    border: "border-l-4 border-l-green-400",
    badge: "bg-green-500/20 text-green-200",
    text: "text-green-400",
  },
  corp: {
    bg: "bg-blue-500/10",
    border: "border-l-4 border-l-blue-400",
    badge: "bg-blue-500/20 text-blue-200",
    text: "text-blue-400",
  },
  foundation: {
    bg: "bg-red-500/10",
    border: "border-l-4 border-l-red-400",
    badge: "bg-red-500/20 text-red-200",
    text: "text-red-400",
  },
  devlink: {
    bg: "bg-cyan-500/10",
    border: "border-l-4 border-l-cyan-400",
    badge: "bg-cyan-500/20 text-cyan-200",
    text: "text-cyan-400",
  },
  nexus: {
    bg: "bg-purple-500/10",
    border: "border-l-4 border-l-purple-400",
    badge: "bg-purple-500/20 text-purple-200",
    text: "text-purple-400",
  },
  staff: {
    bg: "bg-indigo-500/10",
    border: "border-l-4 border-l-indigo-400",
    badge: "bg-indigo-500/20 text-indigo-200",
    text: "text-indigo-400",
  },
};

const ARM_LABELS: Record<string, string> = {
  labs: "LABS",
  gameforge: "GAMEFORGE",
  corp: "CORP",
  foundation: "FOUNDATION",
  devlink: "DEV-LINK",
  nexus: "NEXUS",
  staff: "STAFF",
};

interface FeedItemCardProps {
  item: FeedItem;
  isFollowing: boolean;
  onToggleFollow: (authorId: string) => void;
  onShare: (postId: string) => void;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
}

export function FeedItemCard({
  item,
  isFollowing,
  onToggleFollow,
  onShare,
  onLike,
  onComment,
}: FeedItemCardProps) {
  const [muted, setMuted] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const hasMedia = item.mediaType !== "none" && Boolean(item.mediaUrl);

  useEffect(() => {
    if (!showComments) return;
    let cancelled = false;
    (async () => {
      setLoadingComments(true);
      try {
        const data = await communityService.listComments(item.id);
        if (!cancelled) setComments(Array.isArray(data) ? data : []);
      } finally {
        if (!cancelled) setLoadingComments(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [showComments, item.id]);

  const submitComment = async () => {
    if (!user?.id) {
      toast({ description: "Please sign in to comment." });
      return;
    }
    const content = commentText.trim();
    if (!content) return;
    setSubmittingComment(true);
    try {
      const created = await communityService.addComment(
        item.id,
        user.id,
        content,
      );
      if (created) {
        setComments((prev) => [...prev, created]);
        setCommentText("");
        onComment?.(item.id);
      }
    } catch (e) {
      toast({ variant: "destructive", description: "Failed to add comment" });
    } finally {
      setSubmittingComment(false);
    }
  };

  const armColor = ARM_COLORS[item.arm || "labs"] || ARM_COLORS.labs;
  const armLabel = ARM_LABELS[item.arm || "labs"] || "LABS";

  return (
    <Card
      className={cn(
        "overflow-hidden border-border/40 shadow-2xl backdrop-blur-lg",
        armColor.border,
        armColor.bg,
        "bg-background/70",
      )}
    >
      <CardHeader className="pb-0 p-4 sm:p-5 lg:p-6 !flex !flex-row items-start justify-between gap-3 space-y-0">
        <div className="flex flex-1 items-start gap-3">
          <Avatar className="h-12 w-12 ring-2 ring-aethex-500/30">
            <AvatarImage
              src={item.authorAvatar || undefined}
              alt={item.authorName}
            />
            <AvatarFallback className="bg-aethex-500/10 text-aethex-300">
              {item.authorName?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-lg font-semibold text-foreground">
                {item.authorName}
              </CardTitle>
              <Badge
                className={cn("text-xs font-bold uppercase", armColor.badge)}
              >
                {armLabel}
              </Badge>
              {item.source === "discord" && (
                <Badge
                  className="bg-[#5865F2]/20 text-[#5865F2] border-[#5865F2]/30 text-xs font-medium flex items-center gap-1"
                >
                  <DiscordIcon />
                  {item.discordChannelName ? `#${item.discordChannelName}` : "Discord"}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <Button
          size="sm"
          variant={isFollowing ? "outline" : "default"}
          onClick={() => onToggleFollow(item.authorId)}
          className={cn(
            "rounded-full border-border/60",
            isFollowing
              ? "bg-background/80 text-foreground"
              : "bg-gradient-to-r from-aethex-500 to-neon-blue text-white",
          )}
        >
          {isFollowing ? "Following" : "Follow"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-5 lg:space-y-6 p-4 sm:p-5 lg:p-6">
        {hasMedia && (
          <div className="relative w-full overflow-hidden rounded-xl sm:rounded-2xl border border-border/40 bg-black/70 aspect-video max-h-96">
            {item.mediaType === "video" ? (
              <>
                <video
                  src={item.mediaUrl ?? undefined}
                  muted={muted}
                  loop
                  playsInline
                  controls={!muted}
                  className="w-full h-full object-cover"
                />
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => setMuted((prev) => !prev)}
                  className="absolute right-3 top-3 rounded-full bg-white/20 text-white hover:bg-white/30"
                >
                  {muted ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </Button>
              </>
            ) : (
              <img
                src={item.mediaUrl ?? undefined}
                alt={item.caption || item.authorName}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        )}

        {item.caption && (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {item.caption}
          </p>
        )}

        <div className="rounded-2xl border border-border/40 bg-background/80 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 pl-2 pr-3"
                onClick={() => onLike(item.id)}
              >
                <Heart className="h-4 w-4 text-aethex-400" />
                <span className="font-medium text-foreground">
                  {item.likes.toLocaleString()}
                </span>
                <span className="hidden sm:inline">Like</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 pl-2 pr-3"
                onClick={() => setShowComments((s) => !s)}
              >
                <MessageCircle className="h-4 w-4 text-aethex-400" />
                <span className="font-medium text-foreground">
                  {item.comments.toLocaleString()}
                </span>
                <span className="hidden sm:inline">Comment</span>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-border/60 bg-background/60 text-xs uppercase tracking-wide"
              >
                {item.mediaType === "video"
                  ? "Video"
                  : item.mediaType === "image"
                    ? "Image"
                    : "Update"}
              </Badge>
              <Separator orientation="vertical" className="h-6" />
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 pl-2 pr-3"
                onClick={() => onShare(item.id)}
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {showComments && (
          <div className="rounded-2xl border border-border/40 bg-background/80 p-4 space-y-3">
            <div className="space-y-2 max-h-60 overflow-auto pr-1">
              {loadingComments ? (
                <p className="text-sm text-muted-foreground">
                  Loading comments…
                </p>
              ) : comments.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Be the first to comment.
                </p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={c.user_profiles?.avatar_url || undefined}
                      />
                      <AvatarFallback>
                        {(c.user_profiles?.full_name ||
                          c.user_profiles?.username ||
                          "U")[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">
                        {c.user_profiles?.full_name ||
                          c.user_profiles?.username ||
                          "Member"}
                      </div>
                      <div className="text-sm text-foreground/90 whitespace-pre-wrap">
                        {c.content}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex items-start gap-3">
              <Textarea
                placeholder="Write a comment…"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="min-h-[44px]"
              />
              <Button
                onClick={submitComment}
                disabled={submittingComment || !commentText.trim()}
              >
                {submittingComment ? "Posting…" : "Post"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
