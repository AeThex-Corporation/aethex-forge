import Layout from "@/components/Layout";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "@/components/LoadingScreen";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { aethexSocialService } from "@/lib/aethex-social-service";
import { UserPlus, UserCheck } from "lucide-react";

export default function Network() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [endorsements, setEndorsements] = useState<any[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteSending, setInviteSending] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true });
      return;
    }
    if (!user) return;

    const load = async () => {
      setIsLoading(true);
      try {
        const recs = await aethexSocialService.listRecommended(user.id, 12);
        setRecommended(recs);
        const flw = await aethexSocialService.getFollowing(user.id);
        setFollowing(flw);
        const conns = await aethexSocialService.getConnections(user.id);
        setConnections(conns);
        const ends = await aethexSocialService.getEndorsements(user.id);
        setEndorsements(ends);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user, loading, navigate]);

  const isFollowing = (id: string) => following.includes(id);

  const toggleFollow = async (targetId: string) => {
    if (!user) return;
    if (isFollowing(targetId)) {
      await aethexSocialService.unfollowUser(user.id, targetId);
      setFollowing((s) => s.filter((x) => x !== targetId));
    } else {
      await aethexSocialService.followUser(user.id, targetId);
      setFollowing((s) => Array.from(new Set([...s, targetId])));
    }
  };

  const handleInvite = async () => {
    if (!user) return;
    const email = inviteEmail.trim();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      toast({ variant: "destructive", title: "Invalid email" });
      return;
    }
    setInviteSending(true);
    try {
      await aethexSocialService.sendInvite(user.id, email, null);
      toast({ description: "Invitation sent" });
      setInviteEmail("");
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Failed to send invite",
        description: e?.message || "Try again later",
      });
    } finally {
      setInviteSending(false);
    }
  };

  const handleEndorse = async (targetId: string, skill: string) => {
    if (!user) return;
    try {
      await aethexSocialService.endorseSkill(user.id, targetId, skill);
      toast({ description: `Endorsed for ${skill}` });
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Failed to endorse",
        description: e?.message || "Try again later",
      });
    }
  };

  if (loading || isLoading) {
    return (
      <LoadingScreen
        message="Loading your network..."
        showProgress
        duration={1000}
      />
    );
  }

  if (!user) return null;

  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient py-8">
        <div className="container mx-auto px-4 max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Public Profile */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback>
                      {profile?.full_name?.[0] ||
                        user.email?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold">
                      {profile?.full_name || user.email?.split("@")[0]}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {profile?.role || "Member"}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <Badge
                        variant="outline"
                        className="border-aethex-400/50 text-aethex-400"
                      >
                        Level {profile?.level || 1}
                      </Badge>
                      <Badge variant="outline">
                        {(profile as any)?.experience_level || "beginner"}
                      </Badge>
                    </div>
                  </div>
                </div>
                {profile?.bio && (
                  <p className="text-sm text-muted-foreground">{profile.bio}</p>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/dashboard")}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/onboarding")}
                  >
                    Improve Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Invite collaborator</CardTitle>
                <CardDescription>Grow your network</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="name@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                  <Button onClick={handleInvite} disabled={inviteSending}>
                    Send
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Accepted invites boost your loyalty, XP, and reputation.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>
                  People who align with your interests
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommended.slice(0, 3).map((r) => (
                  <div key={r.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={r.avatar_url} />
                        <AvatarFallback>
                          {(r.full_name || r.username || "U")[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {r.full_name || r.username}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {r.bio?.slice(0, 40) || "Member"}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={isFollowing(r.id) ? "outline" : "default"}
                      onClick={() => toggleFollow(r.id)}
                    >
                      {isFollowing(r.id) ? (
                        <span className="flex items-center gap-1">
                          <UserCheck className="h-4 w-4" /> Following
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <UserPlus className="h-4 w-4" /> Follow
                        </span>
                      )}
                    </Button>
                  </div>
                ))}
                {recommended.length === 0 && (
                  <div className="text-sm text-muted-foreground">
                    No recommendations yet.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Connections + Discover + Endorsements */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>My connections</CardTitle>
                <CardDescription>People you’re connected with</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {connections.map((c) => {
                  const p = (c as any).user_profiles || {};
                  const display = p.full_name || p.username || c.connection_id;
                  return (
                    <div
                      key={c.connection_id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border/50"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={p.avatar_url || undefined} />
                          <AvatarFallback>{(display || "U")[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{display}</div>
                          <div className="text-xs text-muted-foreground">
                            Connected
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Message
                      </Button>
                    </div>
                  );
                })}
                {connections.length === 0 && (
                  <div className="text-sm text-muted-foreground">
                    No connections yet.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Discover People</CardTitle>
                <CardDescription>
                  Connect with creators, clients, and members
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommended.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-aethex-400/50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={r.avatar_url} />
                        <AvatarFallback>
                          {(r.full_name || r.username || "U")[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">
                          {r.full_name || r.username}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {r.bio?.slice(0, 80) || "Member"}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={isFollowing(r.id) ? "outline" : "default"}
                      onClick={() => toggleFollow(r.id)}
                    >
                      {isFollowing(r.id) ? (
                        <span className="flex items-center gap-1">
                          <UserCheck className="h-4 w-4" /> Following
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <UserPlus className="h-4 w-4" /> Follow
                        </span>
                      )}
                    </Button>
                  </div>
                ))}
                {recommended.length === 0 && (
                  <div className="text-sm text-muted-foreground">
                    No people found yet.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Endorsements</CardTitle>
                <CardDescription>
                  Recognize skills of your peers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {connections.slice(0, 6).map((c) => {
                  const p = (c as any).user_profiles || {};
                  const display = p.full_name || p.username || c.connection_id;
                  return (
                    <div
                      key={`endorse-${c.connection_id}`}
                      className="flex items-center justify-between p-3 rounded-lg border border-border/50"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={p.avatar_url || undefined} />
                          <AvatarFallback>{(display || "U")[0]}</AvatarFallback>
                        </Avatar>
                        <div className="text-sm">{display}</div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {(
                          [
                            "Leadership",
                            "Systems",
                            "Frontend",
                            "Backend",
                          ] as const
                        ).map((skill) => (
                          <Button
                            key={skill}
                            size="xs"
                            variant="outline"
                            onClick={() =>
                              handleEndorse(c.connection_id, skill)
                            }
                          >
                            {skill}
                          </Button>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {endorsements.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    You have received {endorsements.length} endorsements.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
