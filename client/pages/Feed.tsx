import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import LoadingScreen from "@/components/LoadingScreen";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { aethexSocialService } from "@/lib/aethex-social-service";
import { Heart, MessageCircle, Share2, UserPlus, UserCheck, Volume2, VolumeX } from "lucide-react";

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
}

export default function Feed() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [following, setFollowing] = useState<string[]>([]);
  const [items, setItems] = useState<FeedItem[]>([]);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (!loading && !user) return;
    if (!user) return;
    const load = async () => {
      setIsLoading(true);
      try {
        const recs = await aethexSocialService.listRecommended(user.id, 12);
        const flw = await aethexSocialService.getFollowing(user.id);
        setFollowing(flw);
        const mapped: FeedItem[] = recs.map((r, idx) => ({
          id: r.id,
          authorId: r.id,
          authorName: r.full_name || r.username || "User",
          authorAvatar: r.avatar_url,
          caption: r.bio || "",
          mediaUrl: r.banner_url || r.avatar_url || null,
          mediaType: r.banner_url?.match(/\.(mp4|webm|mov)(\?.*)?$/i) ? "video" : r.banner_url || r.avatar_url ? "image" : "none",
          likes: Math.floor(Math.random() * 200) + 5,
          comments: Math.floor(Math.random() * 30),
        }));
        setItems(mapped);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user, loading]);

  const isFollowingAuthor = (id: string) => following.includes(id);
  const toggleFollow = async (targetId: string) => {
    if (!user) return;
    if (isFollowingAuthor(targetId)) {
      await aethexSocialService.unfollowUser(user.id, targetId);
      setFollowing((s) => s.filter((x) => x !== targetId));
    } else {
      await aethexSocialService.followUser(user.id, targetId);
      setFollowing((s) => Array.from(new Set([...s, targetId])));
    }
  };

  if (!user && !loading) return <Navigate to="/login" replace />;
  if (loading || isLoading) {
    return (
      <LoadingScreen message="Loading your feed..." showProgress duration={1000} />
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient">
        <div className="h-[calc(100vh-64px)] overflow-y-auto snap-y snap-mandatory no-scrollbar">
          {items.length === 0 && (
            <div className="flex items-center justify-center h-full text-muted-foreground">No posts yet. Follow people to populate your feed.</div>
          )}
          {items.map((item) => (
            <section key={item.id} className="snap-start h-[calc(100vh-64px)] relative flex items-center justify-center">
              <Card className="w-full h-full bg-black/60 border-border/30 overflow-hidden">
                <CardContent className="w-full h-full p-0 relative">
                  {/* Media */}
                  {item.mediaType === "video" && item.mediaUrl ? (
                    <video src={item.mediaUrl} className="w-full h-full object-cover" autoPlay loop muted={muted} playsInline />
                  ) : item.mediaType === "image" && item.mediaUrl ? (
                    <img src={item.mediaUrl} alt={item.caption || item.authorName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-aethex-500/20 to-neon-blue/20" />
                  )}

                  {/* Overlay UI */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

                  {/* Right rail actions */}
                  <div className="absolute right-4 bottom-24 flex flex-col items-center gap-4">
                    <Button size="icon" variant="secondary" className="rounded-full bg-white/20 hover:bg-white/30" onClick={() => setMuted((m) => !m)}>
                      {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </Button>
                    <Button size="icon" variant="secondary" className="rounded-full bg-white/20 hover:bg-white/30">
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Button size="icon" variant="secondary" className="rounded-full bg-white/20 hover:bg-white/30">
                      <MessageCircle className="h-5 w-5" />
                    </Button>
                    <Button size="icon" variant="secondary" className="rounded-full bg-white/20 hover:bg-white/30">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Bottom author bar */}
                  <div className="absolute left-0 right-0 bottom-0 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={item.authorAvatar || undefined} />
                        <AvatarFallback>{item.authorName[0] || "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-white">{item.authorName}</div>
                        {item.caption && <div className="text-xs text-white/80 max-w-[60vw] line-clamp-2">{item.caption}</div>}
                      </div>
                    </div>
                    <Button size="sm" variant={isFollowingAuthor(item.authorId) ? "outline" : "default"} onClick={() => toggleFollow(item.authorId)}>
                      {isFollowingAuthor(item.authorId) ? (<span className="flex items-center gap-1"><UserCheck className="h-4 w-4" /> Following</span>) : (<span className="flex items-center gap-1"><UserPlus className="h-4 w-4" /> Follow</span>)}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>
          ))}
        </div>
      </div>
    </Layout>
  );
}
