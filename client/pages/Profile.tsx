import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import LoadingScreen from "@/components/LoadingScreen";
import { useAuth } from "@/contexts/AuthContext";
import {
  aethexAchievementService,
  type AethexAchievement,
} from "@/lib/aethex-database-adapter";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
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
import {
  CalendarClock,
  Compass,
  Edit,
  MapPin,
  Rocket,
  Shield,
  Trophy,
  UserCircle,
} from "lucide-react";

interface ProfileStat {
  label: string;
  value: string;
  helper?: string;
  Icon: typeof UserCircle;
}

const safeRelativeDate = (value?: string | null) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const diff = Date.now() - date.getTime();
  const minutes = Math.round(diff / (1000 * 60));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  const weeks = Math.round(days / 7);
  if (weeks < 5) return `${weeks} wk${weeks === 1 ? "" : "s"} ago`;
  const months = Math.round(days / 30.4375);
  if (months < 12) return `${months} mo${months === 1 ? "" : "s"} ago`;
  const years = Math.round(days / 365.25);
  return `${years} yr${years === 1 ? "" : "s"} ago`;
};

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const [achievements, setAchievements] = useState<AethexAchievement[]>([]);
  const [loadingAchievements, setLoadingAchievements] = useState(false);

  const username = profile?.username || user?.email?.split("@")[0] || "creator";
  const passportHref = `/passport/${encodeURIComponent(username)}`;
  const dashboardSettingsHref = "/dashboard?tab=profile#settings";

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { replace: true });
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    const loadAchievements = async () => {
      if (!user?.id) return;
      setLoadingAchievements(true);
      try {
        const data = await aethexAchievementService.getUserAchievements(user.id);
        setAchievements(data.slice(0, 6));
      } catch (error) {
        console.warn("Failed to load achievements for profile overview", error);
        setAchievements([]);
      } finally {
        setLoadingAchievements(false);
      }
    };

    loadAchievements().catch(() => undefined);
  }, [user?.id]);

  const stats = useMemo<ProfileStat[]>(() => {
    const level = Math.max(1, Number(profile?.level ?? 1));
    const totalXp = Math.max(0, Number(profile?.total_xp ?? 0));
    const loyalty = Math.max(0, Number((profile as any)?.loyalty_points ?? 0));
    const streak = Math.max(0, Number(profile?.current_streak ?? 0));

    return [
      {
        label: "Level",
        value: `Lv ${level}`,
        helper: "Progress toward next milestone",
        Icon: Shield,
      },
      {
        label: "Total XP",
        value: `${totalXp.toLocaleString()} XP`,
        helper: "Earned across AeThex activities",
        Icon: Rocket,
      },
      {
        label: "Loyalty",
        value: loyalty.toLocaleString(),
        helper: "Reward points available",
        Icon: Trophy,
      },
      {
        label: "Streak",
        value: `${streak} day${streak === 1 ? "" : "s"}`,
        helper: "Keep shipping to extend your streak",
        Icon: CalendarClock,
      },
    ];
  }, [profile]);

  const socialLinks = useMemo(() => {
    const entries: { label: string; url: string; domain: string }[] = [];
    const maybePush = (label: string, value?: string | null) => {
      if (!value) return;
      const trimmed = value.trim();
      if (!trimmed) return;
      const url = /^https?:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
      try {
        const u = new URL(url);
        entries.push({ label, url: u.toString(), domain: u.host });
      } catch (error) {
        console.warn(`Skipping invalid ${label} link`, value, error);
      }
    };

    maybePush("Website", (profile as any)?.website_url);
    maybePush("GitHub", profile?.github_url);
    maybePush("LinkedIn", profile?.linkedin_url);
    maybePush("Twitter", profile?.twitter_url);

    return entries;
  }, [profile]);

  if (authLoading || !user || !profile) {
    return <LoadingScreen message="Loading your profile" showProgress />;
  }

  const lastUpdated = safeRelativeDate(profile.updated_at);
  const memberSince = safeRelativeDate(profile.created_at);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-16 text-foreground">
        <div className="container mx-auto max-w-6xl px-4 space-y-10">
          <section className="grid gap-8 lg:grid-cols-[320px_1fr]">
            <Card className="border-border/40 bg-background/60 backdrop-blur">
              <CardHeader className="items-center text-center">
                <Avatar className="h-28 w-28 border border-border/40 shadow-lg shadow-aethex-500/20">
                  <AvatarImage src={profile.avatar_url || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-aethex-500 to-neon-blue text-white text-3xl">
                    {(profile.full_name || username)
                      .split(" ")
                      .map((name) => name[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <CardTitle className="text-2xl font-semibold text-white">
                    {profile.full_name || username}
                  </CardTitle>
                  <CardDescription className="flex flex-wrap items-center justify-center gap-2 text-sm">
                    {profile.user_type ? (
                      <Badge variant="outline" className="capitalize border-aethex-400/60 text-aethex-200">
                        {profile.user_type.replace(/_/g, " ")}
                      </Badge>
                    ) : null}
                    {profile.experience_level ? (
                      <Badge variant="outline" className="capitalize border-purple-400/50 text-purple-200">
                        {profile.experience_level}
                      </Badge>
                    ) : null}
                    {profile.location ? (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {profile.location}
                      </span>
                    ) : null}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                {profile.bio ? (
                  <p className="rounded-lg border border-border/30 bg-background/60 p-4 text-left leading-relaxed text-foreground/90">
                    {profile.bio}
                  </p>
                ) : (
                  <p className="rounded-lg border border-dashed border-border/40 bg-background/40 p-4 text-left">
                    Share your story by updating your profile bio.
                  </p>
                )}
                <div className="space-y-1">
                  {memberSince ? (
                    <p className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Compass className="h-4 w-4" /> Joined {memberSince}
                    </p>
                  ) : null}
                  {lastUpdated ? (
                    <p className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Edit className="h-4 w-4" /> Updated {lastUpdated}
                    </p>
                  ) : null}
                </div>
                <Separator className="bg-border/40" />
                <div className="flex flex-col gap-3">
                  <Button asChild className="bg-gradient-to-r from-aethex-500 to-neon-blue">
                    <Link to={dashboardSettingsHref}>Edit profile in Dashboard</Link>
                  </Button>
                  <Button asChild variant="outline" className="border-border/50">
                    <Link to={passportHref}>View AeThex Passport</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border-border/40 bg-background/60 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Shield className="h-5 w-5 text-aethex-300" />
                    Progress snapshot
                  </CardTitle>
                  <CardDescription>Where you stand across AeThex programs.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {stats.map(({ label, value, helper, Icon }) => (
                      <div
                        key={label}
                        className="flex flex-col gap-2 rounded-lg border border-border/40 bg-background/50 p-4 transition hover:border-aethex-400/60"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">{label}</p>
                          <Icon className="h-5 w-5 text-aethex-300" />
                        </div>
                        <p className="text-xl font-semibold text-white">{value}</p>
                        {helper ? (
                          <p className="text-xs text-muted-foreground">{helper}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-background/60 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <UserCircle className="h-5 w-5 text-aethex-300" />
                    About {profile.full_name || username}
                  </CardTitle>
                  <CardDescription>
                    Community presence, specialties, and how to collaborate with you.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-border/40 bg-background/50 p-4">
                      <p className="text-sm font-medium text-foreground/80">Role focus</p>
                      <p className="text-sm text-muted-foreground">
                        {profile.user_type
                          ? profile.user_type.replace(/_/g, " ")
                          : "Tell the community what you love building."}
                      </p>
                    </div>
                    <div className="rounded-lg border border-border/40 bg-background/50 p-4">
                      <p className="text-sm font-medium text-foreground/80">Experience level</p>
                      <p className="text-sm text-muted-foreground">
                        {profile.experience_level || "Let collaborators know your seniority."}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-foreground/80">Links & presence</h3>
                    {socialLinks.length ? (
                      <div className="flex flex-wrap gap-2">
                        {socialLinks.map((link) => (
                          <a
                            key={`${link.label}-${link.url}`}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="group inline-flex items-center gap-2 rounded-full border border-border/40 bg-background/50 px-4 py-2 text-sm text-muted-foreground transition hover:border-aethex-400/60 hover:text-aethex-200"
                          >
                            <span className="font-medium text-foreground/80 group-hover:text-aethex-200">
                              {link.label}
                            </span>
                            <span className="text-xs text-muted-foreground group-hover:text-aethex-200">
                              {link.domain}
                            </span>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="rounded border border-dashed border-border/40 bg-background/40 p-3 text-sm text-muted-foreground">
                        Add your links to help collaborators discover your work.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-background/60 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Trophy className="h-5 w-5 text-yellow-300" />
                    Recent achievements
                  </CardTitle>
                  <CardDescription>
                    Milestones you&apos;ve unlocked across AeThex games and programs.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingAchievements ? (
                    <div className="flex items-center gap-3 rounded-lg border border-border/40 bg-background/50 p-4 text-sm text-muted-foreground">
                      <div className="h-3 w-3 animate-ping rounded-full bg-aethex-400/80" />
                      Syncing achievements…
                    </div>
                  ) : achievements.length ? (
                    <div className="grid gap-3 md:grid-cols-2">
                      {achievements.map((achievement) => (
                        <div
                          key={achievement.id}
                          className="flex flex-col gap-2 rounded-lg border border-border/40 bg-background/50 p-4"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-medium text-foreground">
                              {achievement.name}
                            </p>
                            <Badge variant="outline" className="border-amber-400/60 text-amber-200">
                              +{achievement.xp_reward} XP
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {achievement.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="rounded border border-dashed border-border/40 bg-background/40 p-4 text-sm text-muted-foreground">
                      Start contributing to unlock your first AeThex achievement.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
