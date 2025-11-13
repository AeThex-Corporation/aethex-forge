import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2 } from "lucide-react";

export type ArmType =
  | "labs"
  | "gameforge"
  | "corp"
  | "foundation"
  | "devlink"
  | "nexus"
  | "staff";

const ARM_CONFIG: Record<ArmType, any> = {
  labs: {
    label: "LABS",
    color: "#FBBF24",
    bgClass: "bg-yellow-500/10",
    borderClass: "border-l-4 border-l-yellow-500",
    textClass: "text-yellow-400",
    badgeClass: "bg-yellow-600 text-white border-yellow-500/50",
  },
  gameforge: {
    label: "GAMEFORGE",
    color: "#22C55E",
    bgClass: "bg-green-500/10",
    borderClass: "border-l-4 border-l-green-500",
    textClass: "text-green-400",
    badgeClass: "bg-green-600 text-white border-green-500/50",
  },
  corp: {
    label: "CORP",
    color: "#3B82F6",
    bgClass: "bg-blue-500/10",
    borderClass: "border-l-4 border-l-blue-500",
    textClass: "text-blue-400",
    badgeClass: "bg-blue-600 text-white border-blue-500/50",
  },
  foundation: {
    label: "FOUNDATION",
    color: "#EF4444",
    bgClass: "bg-red-500/10",
    borderClass: "border-l-4 border-l-red-500",
    textClass: "text-red-400",
    badgeClass: "bg-red-600 text-white border-red-500/50",
  },
  devlink: {
    label: "DEV-LINK",
    color: "#06B6D4",
    bgClass: "bg-cyan-500/10",
    borderClass: "border-l-4 border-l-cyan-500",
    textClass: "text-cyan-400",
    badgeClass: "bg-cyan-600 text-white border-cyan-500/50",
  },
  nexus: {
    label: "NEXUS",
    color: "#A855F7",
    bgClass: "bg-purple-500/10",
    borderClass: "border-l-4 border-l-purple-500",
    textClass: "text-purple-400",
    badgeClass: "bg-purple-600 text-white border-purple-500/50",
  },
  staff: {
    label: "STAFF",
    color: "#7C3AED",
    bgClass: "bg-purple-500/10",
    borderClass: "border-l-4 border-l-purple-500",
    textClass: "text-purple-400",
    badgeClass: "bg-purple-600 text-white border-purple-500/50",
  },
};

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

interface ArmPostCardProps {
  post: Post;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  isLiked?: boolean;
}

export default function ArmPostCard({
  post,
  onLike,
  onComment,
  onShare,
  isLiked,
}: ArmPostCardProps) {
  const config = ARM_CONFIG[post.arm_affiliation];
  const author = post.user_profiles;
  const formattedDate = new Date(post.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card
      className={`${config.borderClass} ${config.bgClass} border border-border/40 backdrop-blur-sm hover:border-border/60 transition-all duration-300 hover-lift animate-fade-in`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <Badge
                className={`${config.badgeClass} border font-bold uppercase tracking-wider text-xs`}
              >
                [ {config.label} ]
              </Badge>
            </div>
            <CardTitle className="text-xl leading-tight">
              {post.title}
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Author Info */}
        <div className="flex items-center gap-3">
          {author?.avatar_url && (
            <img
              src={author.avatar_url}
              alt={author.full_name || "Author"}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-border/40"
            />
          )}
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">
              {author?.full_name || author?.username || "Anonymous"}
            </p>
            <p className="text-xs text-muted-foreground">{formattedDate}</p>
          </div>
        </div>

        {/* Post Content */}
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {post.content}
          </p>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs border-border/40 text-muted-foreground hover:border-foreground/40 transition-colors"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border/20">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              {post.likes_count || 0}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              {post.comments_count || 0}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className={`h-8 w-8 p-0 hover:bg-foreground/5 transition-colors ${
                isLiked ? "text-red-500 hover:text-red-600" : ""
              }`}
              onClick={onLike}
            >
              <Heart
                className="h-4 w-4"
                fill={isLiked ? "currentColor" : "none"}
              />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-foreground/5"
              onClick={onComment}
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-foreground/5"
              onClick={onShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
