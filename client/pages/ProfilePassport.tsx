import { useEffect, useRef, useState } from "react";
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
import { aethexSocialService } from "@/lib/aethex-social-service";

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

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );

const ProfilePassport = () => {
  const params = useParams<{ username?: string }>();
  const navigate = useNavigate();
  const { user, linkedProviders, profile: authProfile } = useAuth();
  const requestedUsername = params.username?.trim();
  const isSelfRoute = !requestedUsername || requestedUsername === "me";

  const [profile, setProfile] = useState<
    (AethexUserProfile & { email?: string | null }) | null
  >(null);
  const [achievements, setAchievements] = useState<AethexAchievement[]>([]);
  const [followStats, setFollowStats] = useState<{ followers: number; following: number }>({ followers: 0, following: 0 });
  const [degree, setDegree] = useState<string>("");
  const [projects, setProjects] = useState<ProjectPreview[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const lastLoadedKeyRef = useRef<string | null>(null);
  const activationAttemptedRef = useRef(false);

  useEffect(() => {
    if (isSelfRoute && !user) {
      setLoading(false);
      setNotFound(false);
      navigate("/login");
      return;
    }

    const normalizedUsername = requestedUsername?.toLowerCase() ?? null;
    const targetKey = isSelfRoute
      ? user?.id
        ? `id:${user.id}`
        : authProfile?.username
          ? `username:${authProfile.username.toLowerCase()}`
          : "self"
      : normalizedUsername
        ? `username:${normalizedUsername}`
        : null;

    if (targetKey && lastLoadedKeyRef.current === targetKey) {
      setLoading(false);
      setNotFound(false);
      return;
    }

    if (targetKey && lastLoadedKeyRef.current !== targetKey) {
      activationAttemptedRef.current = false;
    }

    let cancelled = false;

    if (!targetKey || lastLoadedKeyRef.current !== targetKey) {
      setLoading(true);
    }

    const loadPassport = async () => {
      try {
        let resolvedProfile:
          | (AethexUserProfile & { email?: string | null })
          | null = null;
        let resolvedId: string | null = null;

        if (isSelfRoute) {
          const currentUser = await aethexUserService.getCurrentUser();

          if (currentUser?.username) {
            if (!requestedUsername || requestedUsername === "me") {
              navigate(`/passport/${currentUser.username}`, { replace: true });
              return;
            }

            if (
              normalizedUsername &&
              currentUser.username.toLowerCase() === normalizedUsername &&
              currentUser.username !== requestedUsername
            ) {
              navigate(`/passport/${currentUser.username}`, { replace: true });
              return;
            }
          }

          if (currentUser) {
            resolvedProfile = {
              ...currentUser,
              email:
                (currentUser as any)?.email ??
                user?.email ??
                authProfile?.email ??
                null,
            } as AethexUserProfile & { email?: string | null };
            resolvedId = currentUser.id ?? user?.id ?? null;
          }
        } else if (requestedUsername) {
          const fetchedProfile =
            (await aethexUserService.getProfileByUsername(requestedUsername)) ??
            (isUuid(requestedUsername)
              ? await aethexUserService.getProfileById(requestedUsername)
              : null);

          if (
            fetchedProfile?.username &&
            fetchedProfile.username.toLowerCase() === normalizedUsername &&
            fetchedProfile.username !== requestedUsername
          ) {
            navigate(`/passport/${fetchedProfile.username}`, { replace: true });
            return;
          }

          if (fetchedProfile) {
            resolvedProfile = {
              ...fetchedProfile,
              email: (fetchedProfile as any)?.email ?? null,
            } as AethexUserProfile & { email?: string | null };
            resolvedId = fetchedProfile.id ?? null;
          }
        }

        if (!resolvedProfile || !resolvedId) {
          if (!cancelled) {
            setProfile(null);
            setAchievements([]);
            setInterests([]);
            setProjects([]);
            setNotFound(true);
            lastLoadedKeyRef.current = null;
          }
          return;
        }

        if (
          resolvedProfile.username &&
          resolvedProfile.username.toLowerCase() === "mrpiglr"
        ) {
          if (!activationAttemptedRef.current) {
            activationAttemptedRef.current = true;
            try {
              await aethexAchievementService.activateCommunityRewards({
                email:
                  resolvedProfile.email ??
                  user?.email ??
                  authProfile?.email ??
                  undefined,
                username: resolvedProfile.username,
              });

              const refreshedProfile =
                (await aethexUserService.getProfileByUsername(
                  resolvedProfile.username,
                )) ??
                (resolvedId
                  ? await aethexUserService.getProfileById(resolvedId)
                  : null);

              if (refreshedProfile) {
                resolvedProfile = {
                  ...refreshedProfile,
                  email:
                    (refreshedProfile as any)?.email ??
                    resolvedProfile.email ??
                    null,
                } as AethexUserProfile & { email?: string | null };
                resolvedId = refreshedProfile.id ?? resolvedId;
              }
            } catch {
              activationAttemptedRef.current = false;
            }
          }
        } else {
          activationAttemptedRef.current = false;
        }

        const viewingSelf =
          isSelfRoute ||
          (!!user?.id && resolvedId === user.id) ||
          (!!authProfile?.username &&
            !!resolvedProfile.username &&
            authProfile.username.toLowerCase() ===
              resolvedProfile.username.toLowerCase());

        const [achievementList, interestList, projectList] = await Promise.all([
          aethexAchievementService
            .getUserAchievements(resolvedId)
            .catch(() => [] as AethexAchievement[]),
          aethexUserService
            .getUserInterests(resolvedId)
            .catch(() => [] as string[]),
          aethexProjectService
            .getUserProjects(resolvedId)
            .catch(() => [] as ProjectPreview[]),
        ]);

        if (cancelled) {
          return;
        }

        setProfile({
          ...resolvedProfile,
          email:
            resolvedProfile.email ??
            (viewingSelf ? (user?.email ?? authProfile?.email ?? null) : null),
        });
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

        try {
          const [followingIds, followerIds] = await Promise.all([
            aethexSocialService.getFollowing(resolvedId),
            aethexSocialService.getFollowers(resolvedId),
          ]);
          if (!cancelled) setFollowStats({ following: followingIds.length, followers: followerIds.length });
        } catch {}
        try {
          const me = user?.id || null;
          if (me && resolvedId && me !== resolvedId) {
            const myConns = await aethexSocialService.getConnections(me);
            const first = new Set(myConns.map((c: any) => c.connection_id));
            if (first.has(resolvedId)) setDegree("1st");
            else {
              const secondLists = await Promise.all(
                Array.from(first).slice(0, 50).map((id) => aethexSocialService.getConnections(id)),
              );
              const second = new Set(secondLists.flat().map((c: any) => c.connection_id));
              setDegree(second.has(resolvedId) ? "2nd" : "3rd+");
            }
          } else if (me && resolvedId && me === resolvedId) {
            setDegree("1st");
          } else {
            setDegree("");
          }
        } catch {}

        lastLoadedKeyRef.current =
          targetKey ??
          (resolvedProfile.username
            ? `username:${resolvedProfile.username.toLowerCase()}`
            : resolvedId
              ? `id:${resolvedId}`
              : null);
      } catch {
        if (!cancelled) {
          lastLoadedKeyRef.current = null;
          setProfile(null);
          setAchievements([]);
          setInterests([]);
          setProjects([]);
          setNotFound(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadPassport();

    return () => {
      cancelled = true;
    };
  }, [
    authProfile?.email,
    authProfile?.username,
    isSelfRoute,
    navigate,
    requestedUsername,
    user?.email,
    user?.id,
  ]);

  const isSelf = Boolean(
    profile &&
      ((user?.id && profile.id && user.id === profile.id) ||
        (authProfile?.username &&
          profile.username &&
          authProfile.username.toLowerCase() ===
            profile.username.toLowerCase())),
  );

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
                          {((): string => {
                            const key = String(
                              achievement.icon || achievement.name || "",
                            ).toLowerCase();
                            if (/founding|founder/.test(key)) return "🎖️";
                            if (/trophy|award|medal|badge/.test(key))
                              return "🏆";
                            if (/welcome/.test(key)) return "🎉";
                            if (/star/.test(key)) return "⭐";
                            if (/rocket|launch/.test(key)) return "🚀";
                            return typeof achievement.icon === "string" &&
                              achievement.icon.length <= 3
                              ? (achievement.icon as string)
                              : "🏅";
                          })()}
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
              ) : profile.email ? (
                <Button
                  asChild
                  variant="outline"
                  className="border-slate-700/70 text-slate-100"
                >
                  <a
                    href={`mailto:${profile.email}?subject=${encodeURIComponent("Collaboration invite")}&body=${encodeURIComponent("Hi, I'd like to collaborate on a project.")}`}
                  >
                    Invite to collaborate
                  </a>
                </Button>
              ) : (
                <Button
                  asChild
                  variant="outline"
                  className="border-slate-700/70 text-slate-100"
                >
                  <Link
                    to={`/contact?topic=collaboration&about=${encodeURIComponent(profile.username || profile.full_name || "member")}`}
                  >
                    Invite to collaborate
                  </Link>
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-slate-300">
              <Badge variant="outline" className="border-slate-700/70 bg-slate-900/40">
                Followers: {followStats.followers}
              </Badge>
              <Badge variant="outline" className="border-slate-700/70 bg-slate-900/40">
                Following: {followStats.following}
              </Badge>
              {degree && (
                <Badge className="bg-aethex-500/20 text-aethex-100">{degree} degree</Badge>
              )}
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
