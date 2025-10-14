import { useState } from "react";
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
import { cn } from "@/lib/utils";
import {
  Heart,
  MessageCircle,
  Share2,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { FeedItem } from "@/pages/Feed";

interface FeedItemCardProps {
  item: FeedItem;
  isFollowing: boolean;
  onToggleFollow: (authorId: string) => void;
  onShare: (postId: string) => void;
}

export function FeedItemCard({
  item,
  isFollowing,
  onToggleFollow,
  onShare,
}: FeedItemCardProps) {
  const [muted, setMuted] = useState(true);
  const hasMedia = item.mediaType !== "none" && Boolean(item.mediaUrl);

  return (
    <Card className="overflow-hidden border-border/40 bg-background/70 shadow-2xl backdrop-blur-lg">
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12 ring-2 ring-aethex-500/30">
              <AvatarImage src={item.authorAvatar || undefined} alt={item.authorName} />
              <AvatarFallback className="bg-aethex-500/10 text-aethex-300">
                {item.authorName?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold text-foreground">
                {item.authorName}
              </CardTitle>
              <CardDescription>
                {item.caption ? item.caption.slice(0, 120) : "Shared an update"}
              </CardDescription>
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
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {hasMedia && (
          <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-black/70">
            {item.mediaType === "video" ? (
              <>
                <video
                  src={item.mediaUrl ?? undefined}
                  muted={muted}
                  loop
                  playsInline
                  controls={!muted}
                  className="h-full w-full object-cover"
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
                className="h-full w-full object-cover"
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
              <Button variant="ghost" size="sm" className="gap-2 pl-2 pr-3">
                <Heart className="h-4 w-4 text-aethex-400" />
                <span className="font-medium text-foreground">
                  {item.likes.toLocaleString()}
                </span>
                <span className="hidden sm:inline">Likes</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2 pl-2 pr-3">
                <MessageCircle className="h-4 w-4 text-aethex-400" />
                <span className="font-medium text-foreground">
                  {item.comments.toLocaleString()}
                </span>
                <span className="hidden xs:inline">Comments</span>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-border/60 bg-background/60 text-xs uppercase tracking-wide">
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
      </CardContent>
    </Card>
  );
}
