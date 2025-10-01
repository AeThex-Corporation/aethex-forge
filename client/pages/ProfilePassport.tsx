import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import LoadingScreen from "@/components/LoadingScreen";
import PassportSummary from "@/components/passport/PassportSummary";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  aethexUserService,
  aethexAchievementService,
  aethexProjectService,
  type AethexUserProfile,
  type AethexAchievement,
} from "@/lib/aethex-database-adapter";
import { useAuth } from "@/contexts/AuthContext";
import FourOhFourPage from "@/pages/404";
import { Clock, Rocket, Target, ExternalLink, Award } from "lucide-react";

interface ProjectPreview {
  id: string;
  title: string;
  status: string;
  description?: string | null;
  created_at?: string;
}

const formatDate = (value?: string | null) => {
  if (!value) return "Recent";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recent";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(date);
};

const ProfilePassport = () => {
  const params = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { user, linkedProviders, profile: authProfile } = useAuth();

  const [profile, setProfile] = useState<
    (AethexUserProfile & { email?: string | null }) | null
  >(null);
  const [achievements, setAchievements] = useState<AethexAchievement[]>([]);
  const [projects, setProjects] = useState<ProjectPreview[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const targetUserId = useMemo(() => {
    if (params.id === "me" || !params.id) {
      return user?.id ?? null;
    }
    return params.id;
  }, [params.id, user?.id]);

  const isSelf = user?.id && profile?.id ? user.id === profile.id : false;

  useEffect(() => {
    if (!targetUserId) {
      if (!user) {
        navigate("/login");
      }
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        setLoading(true);
        const [profileData, achievementList, interestList, projectList] =
          await Promise.all([
            params.id === "me" && profile && profile.id === targetUserId
              ? Promise.resolve(profile)
              : aethexUserService.getProfileById(targetUserId),
            aethexAchievementService.getUserAchievements(targetUserId),
            aethexUserService.getUserInterests(targetUserId),
            aethexProjectService.getUserProjects(targetUserId).catch(() => []),
          ]);

        let resolvedProfile = profileData as
          | (AethexUserProfile & { email?: string | null })
          | null;

        const isViewingSelf = params.id === "me" && user?.id === targetUserId;

        if (!resolvedProfile && isViewingSelf) {
          resolvedProfile = (authProfile as any) ?? null;
        }

        if (
          !resolvedProfile &&
          isViewingSelf &&
          typeof window !== "undefined"
        ) {
          try {
            const stored = localStorage.getItem(`demo_profile_${targetUserId}`);
            if (stored) {
              resolvedProfile = JSON.parse(stored);
            }
          } catch {}
        }

        if (!resolvedProfile && isViewingSelf && user) {
          resolvedProfile = {
            id: user.id,
            username: user.email?.split("@")[0] || `user_${Date.now()}`,
            full_name:
              (authProfile as any)?.full_name || user.email || "AeThex Creator",
            email: user.email,
            user_type:
              ((authProfile as any)?.user_type as any) ||
              ("community_member" as any),
            experience_level:
              ((authProfile as any)?.experience_level as any) ||
              ("beginner" as any),
            level: (authProfile as any)?.level ?? 1,
            total_xp: (authProfile as any)?.total_xp ?? 0,
            loyalty_points: (authProfile as any)?.loyalty_points ?? 0,
            created_at:
              (authProfile as any)?.created_at || new Date().toISOString(),
            updated_at:
              (authProfile as any)?.updated_at || new Date().toISOString(),
          } as AethexUserProfile;
        }

        if (resolvedProfile && isViewingSelf && typeof window !== "undefined") {
          try {
            localStorage.setItem(
              `demo_profile_${targetUserId}`,
              JSON.stringify(resolvedProfile),
            );
          } catch {}
        }

        if (!resolvedProfile) {
          setNotFound(true);
          return;
        }

        setProfile(resolvedProfile as any);
        setAchievements(achievementList ?? []);
        setInterests(interestList ?? []);
        setProjects(
          (projectList ?? []).slice(0, 4).map((project: any) => ({
            id: project.id,
            title: project.title,
            status: project.status,
            description: project.description,
            created_at: project.created_at,
          })),
        );
        setNotFound(false);
      } catch (error) {
        console.error("Failed to load passport", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
    // We intentionally exclude profile from dependencies to avoid refetch loops when local state updates
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetUserId, params.id]);

  if (loading) {
    return <LoadingScreen message="Loading AeThex passport..." />;
  }

  if (notFound || !profile) {
    return <FourOhFourPage />;
  }

  const passportInterests = interests.length
    ? interests
    : ((profile as any)?.interests as string[]) || [];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12">
        <div className="container mx-auto px-4 max-w-5xl space-y-10">
          <PassportSummary
            profile={profile}
            achievements={achievements}
            interests={passportInterests}
            isSelf={isSelf}
            linkedProviders={isSelf ? linkedProviders : undefined}
          />

          {projects.length > 0 && (
            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Highlighted missions
                  </h2>
                  <p className="text-sm text-slate-300">
                    A snapshot of what this creator has shipped inside AeThex.
                  </p>
                </div>
                {isSelf && (
                  <Button
                    asChild
                    variant="outline"
                    className="border-slate-700/70 text-slate-100"
                  >
                    <Link to="/projects/new">Launch new project</Link>
                  </Button>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {projects.map((project) => (
                  <Card
                    key={project.id}
                    className="border border-slate-800 bg-slate-900/70"
                  >
                    <CardHeader className="flex flex-row items-start justify-between space-y-0">
                      <div className="space-y-1">
                        <CardTitle className="text-lg text-white">
                          {project.title}
                        </CardTitle>
                        <CardDescription className="text-slate-300">
                          {project.description || "AeThex project"}
                        </CardDescription>
                      </div>
                      <Badge
                        variant="outline"
                        className="border-slate-700/70 text-slate-200"
                      >
                        {project.status?.replace("_", " ") ?? "active"}
                      </Badge>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between text-xs text-slate-300">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />{" "}
                        {formatDate(project.created_at)}
                      </span>
                      <Button
                        asChild
                        variant="ghost"
                        className="h-8 px-2 text-xs text-aethex-200"
                      >
                        <Link to="/projects/new">
                          View mission
                          <ExternalLink className="ml-1 h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Achievements
                </h2>
                <p className="text-sm text-slate-300">
                  Passport stamps earned across AeThex experiences.
                </p>
              </div>
              {isSelf && (
                <Badge
                  variant="outline"
                  className="border-aethex-500/50 text-aethex-200"
                >
                  <Award className="mr-1 h-3 w-3" /> {achievements.length}{" "}
                  badges
                </Badge>
              )}
            </div>
            {achievements.length === 0 ? (
              <Card className="border border-slate-800 bg-slate-900/60 p-8 text-center text-slate-300">
                <Target className="mx-auto mb-3 h-8 w-8 text-aethex-300" />
                No achievements yet. Complete onboarding and participate in
                missions to earn AeThex badges.
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {achievements.map((achievement) => (
                  <Card
                    key={achievement.id}
                    className="border border-slate-800 bg-slate-900/70"
                  >
                    <CardContent className="flex h-full flex-col justify-between gap-3 p-5">
                      <div className="flex items-center gap-3 text-white">
                        <span className="text-3xl">
                          {achievement.icon || "🏅"}
                        </span>
                        <div>
                          <h3 className="text-lg font-semibold">
                            {achievement.name}
                          </h3>
                          <p className="text-sm text-slate-300">
                            {achievement.description || "AeThex honor"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>XP Reward • {achievement.xp_reward ?? 0}</span>
                        <span className="flex items-center gap-1 text-aethex-200">
                          <Rocket className="h-3.5 w-3.5" /> Passport stamped
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          <Separator className="border-slate-800" />

          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Stay connected
                </h2>
                <p className="text-sm text-slate-300">
                  Reach out, collaborate, and shape the next AeThex release
                  together.
                </p>
              </div>
              {isSelf ? (
                <Button
                  asChild
                  className="bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90"
                >
                  <Link to="/dashboard?tab=connections">
                    Manage connections
                  </Link>
                </Button>
              ) : (
                <Button
                  asChild
                  variant="outline"
                  className="border-slate-700/70 text-slate-100"
                >
                  <Link to="/dashboard">Invite to collaborate</Link>
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-slate-300">
              {profile.github_url && (
                <Button
                  asChild
                  variant="ghost"
                  className="h-8 px-2 text-xs text-slate-200"
                >
                  <a href={profile.github_url} target="_blank" rel="noreferrer">
                    GitHub
                    <ExternalLink className="ml-1 h-3.5 w-3.5" />
                  </a>
                </Button>
              )}
              {profile.linkedin_url && (
                <Button
                  asChild
                  variant="ghost"
                  className="h-8 px-2 text-xs text-slate-200"
                >
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    LinkedIn
                    <ExternalLink className="ml-1 h-3.5 w-3.5" />
                  </a>
                </Button>
              )}
              {profile.twitter_url && (
                <Button
                  asChild
                  variant="ghost"
                  className="h-8 px-2 text-xs text-slate-200"
                >
                  <a
                    href={profile.twitter_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    X / Twitter
                    <ExternalLink className="ml-1 h-3.5 w-3.5" />
                  </a>
                </Button>
              )}
              {profile.website_url && (
                <Button
                  asChild
                  variant="ghost"
                  className="h-8 px-2 text-xs text-slate-200"
                >
                  <a
                    href={profile.website_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Portfolio
                    <ExternalLink className="ml-1 h-3.5 w-3.5" />
                  </a>
                </Button>
              )}
              {profile.bio && (
                <Badge
                  variant="outline"
                  className="border-slate-700/70 text-slate-200"
                >
                  {profile.bio}
                </Badge>
              )}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePassport;
