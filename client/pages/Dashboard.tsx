import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { aethexToast } from "@/lib/aethex-toast";
import { supabase } from "@/lib/supabase";
import {
  aethexProjectService,
  aethexAchievementService,
} from "@/lib/aethex-database-adapter";
import { communityService } from "@/lib/supabase-service";
import { aethexCollabService } from "@/lib/aethex-collab-service";
import { aethexSocialService } from "@/lib/aethex-social-service";
import PostComposer from "@/components/social/PostComposer";
import OAuthConnections, {
  ProviderDescriptor,
  ProviderKey,
} from "@/components/settings/OAuthConnections";
import RealmSwitcher, { RealmKey } from "@/components/settings/RealmSwitcher";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import LoadingScreen from "@/components/LoadingScreen";
import { Link } from "react-router-dom";
import {
  User,
  Settings,
  Activity,
  TrendingUp,
  Zap,
  Target,
  Users,
  Calendar,
  Bell,
  Star,
  Trophy,
  Rocket,
  Code,
  Database,
  Shield,
  ChevronRight,
  MoreHorizontal,
  Play,
  Pause,
  BarChart3,
  Github,
  Globe,
  MessageCircle,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    user,
    profile,
    loading: authLoading,
    updateProfile,
    profileComplete,
    linkedProviders,
    linkProvider,
    unlinkProvider,
  } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [twitter, setTwitter] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [invites, setInvites] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]); // earned achievements
  const [allAchievements, setAllAchievements] = useState<any[]>([]);
  const [achievementFilter, setAchievementFilter] = useState<
    "all" | "earned" | "locked"
  >("earned");
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  const [followerIds, setFollowerIds] = useState<string[]>([]);
  const [connectionsList, setConnectionsList] = useState<any[]>([]);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [stats, setStats] = useState({
    activeProjects: 0,
    completedTasks: 0,
    teamMembers: 0,
    performanceScore: "0%",
  });
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [connectionAction, setConnectionAction] = useState<string | null>(null);
  const [userRealm, setUserRealm] = useState<RealmKey | null>(null);
  const [experienceLevel, setExperienceLevel] = useState("beginner");
  const [savingRealm, setSavingRealm] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    () => searchParams.get("tab") ?? "profile",
  );

  const currentStreak = profile?.current_streak ?? 0;
  const longestStreak = profile?.longest_streak ?? currentStreak;
  const streakLabel = `${currentStreak} day${currentStreak === 1 ? "" : "s"} streak`;

  const linkedProviderMap = useMemo(() => {
    const map: Record<string, (typeof linkedProviders)[number]> = {};
    linkedProviders.forEach((lp) => {
      map[lp.provider] = lp;
    });
    return map;
  }, [linkedProviders]);

  useEffect(() => {
    const paramTab = searchParams.get("tab") ?? "profile";
    if (paramTab !== activeTab) {
      setActiveTab(paramTab);
    }
  }, [searchParams, activeTab]);

  // Accept ?realm=<id> to switch dashboards via Realms page
  useEffect(() => {
    const paramRealm = (searchParams.get("realm") || "").trim() as RealmKey;
    const validRealms: RealmKey[] = [
      "game_developer",
      "client",
      "community_member",
      "customer",
      "staff",
    ];
    const current = ((profile as any)?.user_type as RealmKey) ?? null;
    if (
      paramRealm &&
      validRealms.includes(paramRealm) &&
      paramRealm !== current
    ) {
      (async () => {
        try {
          await updateProfile({ user_type: paramRealm } as any);
          setUserRealm(paramRealm);
        } catch {}
        // remove query param after applying
        const next = new URLSearchParams(searchParams.toString());
        next.delete("realm");
        setSearchParams(next, { replace: true });
      })();
    } else if (paramRealm) {
      const next = new URLSearchParams(searchParams.toString());
      next.delete("realm");
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, profile?.user_type, updateProfile, setSearchParams]);

  useEffect(() => {
    if (typeof window === "undefined" || !user) {
      return;
    }
    const sanitized = new URLSearchParams(window.location.search);
    const keysToStrip = [
      "code",
      "state",
      "scope",
      "auth_error",
      "error_description",
      "access_token",
      "refresh_token",
      "token_type",
      "provider",
      "type",
    ];
    let mutated = false;
    keysToStrip.forEach((key) => {
      if (sanitized.has(key)) {
        sanitized.delete(key);
        mutated = true;
      }
    });

    if (mutated) {
      setSearchParams(sanitized, { replace: true });
    }
  }, [user?.id, setSearchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const next = new URLSearchParams(searchParams.toString());
    if (value === "profile") {
      if (next.has("tab")) {
        next.delete("tab");
        setSearchParams(next, { replace: true });
      }
      return;
    }

    if (next.get("tab") !== value) {
      next.set("tab", value);
      setSearchParams(next, { replace: true });
    }
  };

  const handleRealmSave = async () => {
    if (!user) {
      aethexToast.error({
        title: "Not signed in",
        description: "Sign in to update your realm preferences.",
      });
      return;
    }

    if (!userRealm) {
      aethexToast.error({
        title: "Select a realm",
        description: "Choose a realm before saving your preferences.",
      });
      return;
    }

    setSavingRealm(true);
    const payload = {
      user_type: userRealm,
      experience_level: experienceLevel || "beginner",
    } as any;

    try {
      await updateProfile(payload);
      computeProfileCompletion({
        ...(profile as any),
        ...payload,
      });
      aethexToast.success({
        title: "Realm updated",
        description: "Your AeThex experience has been refreshed.",
      });
    } catch (error: any) {
      console.error("Failed to save realm:", error);
      aethexToast.error({
        title: "Unable to save realm",
        description: error?.message || "Please try again or refresh the page.",
      });
    } finally {
      setSavingRealm(false);
    }
  };

  const oauthConnections = useMemo<readonly ProviderDescriptor[]>(
    () => [
      {
        provider: "google",
        name: "Google",
        description: "Link your Google account for one-click access.",
        Icon: Globe,
        gradient: "from-red-500 to-yellow-500",
      },
      {
        provider: "github",
        name: "GitHub",
        description: "Connect your GitHub account to sync contributions.",
        Icon: Github,
        gradient: "from-gray-600 to-gray-900",
      },
      {
        provider: "discord",
        name: "Discord",
        description: "Link your Discord account to join the AeThex community.",
        Icon: MessageCircle,
        gradient: "from-indigo-600 to-purple-900",
      },
    ],
    [],
  );

  useEffect(() => {
    console.log("Dashboard useEffect:", {
      user: !!user,
      profile: !!profile,
      authLoading,
    });

    // While auth is still resolving, keep showing loading state
    if (authLoading) {
      setIsLoading(true);
      return;
    }

    // Auth resolved - check user state
    if (!user) {
      console.log("No user, showing login prompt (not redirecting)");
      setIsLoading(false);
      return;
    }

    // User exists - load dashboard data
    if (user && profile) {
      console.log("User and profile exist, loading dashboard data");
      loadDashboardData();
    } else if (user && !profile) {
      console.log(
        "User exists but no profile, showing message (not redirecting)",
      );
      setIsLoading(false);
    }
  }, [user, profile, authLoading]);

  // Sync local settings form with profile
  useEffect(() => {
    setDisplayName(profile?.full_name || "");
    setLocationInput(profile?.location || "");
    setBio(profile?.bio || "");
    setWebsite((profile as any)?.website_url || "");
    setLinkedin(profile?.linkedin_url || "");
    setGithub(profile?.github_url || "");
    setTwitter(profile?.twitter_url || "");
    setUserRealm(((profile as any)?.user_type as RealmKey) ?? null);
    setExperienceLevel((profile as any)?.experience_level || "beginner");
    if (profile) computeProfileCompletion(profile);
  }, [profile]);

  const saveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    try {
      await updateProfile({
        full_name: displayName,
        location: locationInput,
        bio,
        website_url: website as any,
        linkedin_url: linkedin,
        github_url: github,
        twitter_url: twitter,
      } as any);
    } finally {
      setSavingProfile(false);
    }
  };

  const computeProfileCompletion = (p: any) => {
    const checks = [
      !!p?.full_name,
      !!p?.bio,
      !!p?.location,
      !!p?.avatar_url,
      !!p?.banner_url,
      !!(p?.website_url || p?.github_url || p?.linkedin_url || p?.twitter_url),
    ];
    const pct = Math.round(
      (checks.filter(Boolean).length / checks.length) * 100,
    );
    setProfileCompletion(pct);
  };

  const hasRealmChanges = useMemo(() => {
    const currentRealm = ((profile as any)?.user_type as RealmKey) ?? null;
    const currentExperience =
      ((profile as any)?.experience_level as string) || "beginner";
    const selectedRealmValue = userRealm ?? null;
    const selectedExperienceValue = experienceLevel || "beginner";
    return (
      selectedRealmValue !== currentRealm ||
      selectedExperienceValue !== currentExperience
    );
  }, [profile, userRealm, experienceLevel]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      const userId = user!.id;

      // Parallelize all independent data fetches
      const [
        projectsResult,
        teamsResult,
        postsResult,
        invitesResult,
        networkResult,
        applicationsResult,
        achievementsResult,
        followerCountResult,
      ] = await Promise.allSettled([
        // Projects
        aethexProjectService.getUserProjects(userId).catch(() => []),
        // Teams
        aethexCollabService.listMyTeams(userId).catch(() => []),
        // Posts
        communityService
          .getUserPosts(userId)
          .then((p) => p?.slice(0, 5) || [])
          .catch(() => []),
        // Invites
        aethexSocialService
          .listInvites(userId)
          .then((i) => (Array.isArray(i) ? i : []))
          .catch(() => []),
        // Network (following, followers, connections)
        Promise.all([
          aethexSocialService.getFollowing(userId).catch(() => []),
          aethexSocialService.getFollowers(userId).catch(() => []),
          aethexSocialService.getConnections(userId).catch(() => []),
        ]),
        // Applications
        supabase
          .from("project_applications")
          .select(`*, projects!inner(id, title, user_id)`)
          .eq("projects.user_id", userId)
          .order("created_at", { ascending: false })
          .limit(10)
          .then(({ data }) => (Array.isArray(data) ? data : []))
          .catch(() => []),
        // Achievements (don't block on checkAndAwardProjectAchievements - do it in background)
        Promise.all([
          aethexAchievementService.getUserAchievements(userId).catch(() => []),
          aethexAchievementService.getAllAchievements().catch(() => []),
        ]).then(([earned, all]) => ({ earned: earned || [], all: all || [] })),
        // Follower count
        supabase
          .from("user_follows")
          .select("id", { count: "exact", head: true })
          .eq("following_id", userId)
          .then(({ count }) => (typeof count === "number" ? count : 0))
          .catch(() => 0),
      ]);

      // Extract results from settled promises
      const userProjects =
        projectsResult.status === "fulfilled" ? projectsResult.value : [];
      setProjects(userProjects);

      const myTeams =
        teamsResult.status === "fulfilled" ? teamsResult.value : [];
      setTeams(myTeams);

      const userPosts =
        postsResult.status === "fulfilled" ? postsResult.value : [];
      setUserPosts(userPosts);

      const myInvites =
        invitesResult.status === "fulfilled" ? invitesResult.value : [];
      setInvites(myInvites);

      if (networkResult.status === "fulfilled") {
        const [flw, fol, conns] = networkResult.value;
        setFollowingIds(Array.isArray(flw) ? flw : []);
        setFollowerIds(Array.isArray(fol) ? fol : []);
        setConnectionsList(Array.isArray(conns) ? conns : []);
      } else {
        setFollowingIds([]);
        setFollowerIds([]);
        setConnectionsList([]);
      }

      const appData =
        applicationsResult.status === "fulfilled"
          ? applicationsResult.value
          : [];
      setApplications(appData);

      let userAchievements: any[] = [];
      let catalog: any[] = [];
      if (achievementsResult.status === "fulfilled") {
        userAchievements = achievementsResult.value.earned;
        catalog = achievementsResult.value.all;
      }
      setAchievements(userAchievements);
      setAllAchievements(catalog);

      const followerCount =
        followerCountResult.status === "fulfilled"
          ? followerCountResult.value
          : 0;

      // Calculate stats
      const activeCount = userProjects.filter(
        (p) => p.status === "in_progress" || p.status === "planning",
      ).length;
      const completedCount = userProjects.filter(
        (p) => p.status === "completed",
      ).length;

      const totalXp =
        typeof (profile as any)?.total_xp === "number"
          ? (profile as any).total_xp
          : 0;
      const performanceBase =
        60 + activeCount * 5 + completedCount * 8 + userAchievements.length * 3;
      const performanceScore = Math.min(
        100,
        Math.round(performanceBase + totalXp / 150),
      );

      setStats({
        activeProjects: activeCount,
        completedTasks: completedCount,
        teamMembers: followerCount,
        performanceScore: `${performanceScore}%`,
      });

      // Background task: Check and award achievements (don't block)
      aethexAchievementService
        .checkAndAwardProjectAchievements(userId)
        .catch((e) => {
          console.warn("checkAndAwardProjectAchievements failed:", e);
        });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      aethexToast.error({
        title: "Failed to load dashboard",
        description: "Please try refreshing the page",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkProvider = async (provider: ProviderKey) => {
    setConnectionAction(`${provider}-link`);
    try {
      await linkProvider(provider);
    } finally {
      setConnectionAction(null);
    }
  };

  const handleUnlinkProvider = async (provider: ProviderKey) => {
    setConnectionAction(`${provider}-unlink`);
    try {
      await unlinkProvider(provider);
    } finally {
      setConnectionAction(null);
    }
  };

  const handleQuickAction = async (actionTitle: string) => {
    switch (actionTitle) {
      case "Start New Project":
        navigate("/projects/new");
        break;
      case "Create Team":
        navigate("/teams");
        break;
      case "Access Labs":
        navigate("/research");
        break;
      case "View Analytics":
        aethexToast.info({
          title: "Analytics",
          description: "Analytics dashboard coming soon!",
        });
        break;
      default:
        aethexToast.info({
          title: actionTitle,
          description: "Feature coming soon!",
        });
    }
  };

  // Show loading while auth is resolving
  if (authLoading || isLoading) {
    return (
      <LoadingScreen
        message="Loading your dashboard..."
        showProgress={true}
        duration={1200}
      />
    );
  }

  // If no user and auth is resolved, show login prompt (don't auto-redirect)
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="max-w-md text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            Welcome to AeThex
          </h1>
          <p className="text-gray-400 mb-8">
            You need to be signed in to access the dashboard
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // If user but no profile, show incomplete profile message
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="max-w-md text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            Complete Your Profile
          </h1>
          <p className="text-gray-400 mb-8">
            Let's set up your profile to get started with AeThex
          </p>
          <button
            onClick={() => navigate("/onboarding")}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Complete Profile
          </button>
        </div>
      </div>
    );
  }

  // Hide setup banner once onboarding is complete
  const showProfileSetup = !profileComplete;

  const statsDisplay = [
    {
      label: "Active Projects",
      value: stats.activeProjects,
      icon: Rocket,
      color: "from-blue-500 to-purple-600",
    },
    {
      label: "Completed Tasks",
      value: stats.completedTasks,
      icon: Trophy,
      color: "from-green-500 to-blue-600",
    },
    {
      label: "Team Members",
      value: stats.teamMembers,
      icon: Users,
      color: "from-purple-500 to-pink-600",
    },
    {
      label: "Performance Score",
      value: stats.performanceScore,
      icon: TrendingUp,
      color: "from-orange-500 to-red-600",
    },
  ];

  const getProgressPercentage = (project: any) => {
    switch (project.status) {
      case "planning":
        return 20;
      case "in_progress":
        return 60;
      case "completed":
        return 100;
      default:
        return 0;
    }
  };

  const getPriorityFromTech = (technologies: string[]) => {
    if (
      technologies.some(
        (tech) =>
          tech.toLowerCase().includes("ai") ||
          tech.toLowerCase().includes("blockchain"),
      )
    ) {
      return "High";
    }
    return "Medium";
  };

  const getAchievementIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case "code":
        return Code;
      case "users":
        return Users;
      case "rocket":
        return Rocket;
      case "database":
        return Database;
      case "shield":
        return Shield;
      case "trophy":
        return Trophy;
      default:
        return Star;
    }
  };

  const quickActions = [
    {
      title: "Start New Project",
      icon: Rocket,
      color: "from-blue-500 to-purple-600",
    },
    { title: "Create Team", icon: Users, color: "from-green-500 to-blue-600" },
    { title: "Access Labs", icon: Zap, color: "from-yellow-500 to-orange-600" },
    {
      title: "View Analytics",
      icon: BarChart3,
      color: "from-purple-500 to-pink-600",
    },
  ];

  // Determine active realm for dashboard personalization
  const activeRealm: RealmKey = (userRealm ||
    ((profile as any)?.user_type as RealmKey) ||
    "community_member") as RealmKey;

  // Show loading screen while auth is resolving or if user is not authenticated
  if (authLoading || !user) {
    return <LoadingScreen />;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Profile Setup Banner */}
          {showProfileSetup && (
            <div className="mb-6">
              <Card className="bg-orange-500/10 border-orange-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-orange-400" />
                      <div>
                        <h3 className="text-white font-semibold">
                          Complete Your Profile
                        </h3>
                        <p className="text-orange-200 text-sm">
                          Set up your profile to unlock all features
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          document
                            .getElementById("settings")
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        Setup Profile
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate("/onboarding")}
                        className="border-orange-500 text-orange-400 hover:bg-orange-500/10"
                      >
                        Full Onboarding
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Header */}
          <div className="mb-8 animate-slide-down">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gradient-purple">
                  {activeRealm === "game_developer" &&
                    "Game Development Dashboard"}
                  {activeRealm === "client" && "Consulting Dashboard"}
                  {activeRealm === "community_member" && "Community Dashboard"}
                  {activeRealm === "customer" && "Get Started Dashboard"}
                  {activeRealm === "staff" && "Staff Dashboard"}
                </h1>
                <p className="text-muted-foreground">
                  Welcome back,{" "}
                  {profile?.full_name || user.email?.split("@")[0]} •{" "}
                  {streakLabel}
                </p>
                {longestStreak > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="border-aethex-400/40 text-aethex-200"
                    >
                      Realm: {activeRealm.replace("_", " ")}
                    </Badge>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-muted-foreground">
                  Profile {profileCompletion}% complete
                </div>
                <Button variant="outline" size="sm" className="hover-lift">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover-lift"
                  onClick={() =>
                    document
                      .getElementById("settings")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar - User Profile */}
            <div className="lg:col-span-3 space-y-6">
              {/* Profile Card */}
              <Card className="bg-card/50 border-border/50 hover:border-aethex-400/50 transition-all duration-300 animate-scale-in">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="relative">
                      <img
                        src={
                          profile?.avatar_url ||
                          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
                        }
                        alt="User Avatar"
                        className="w-20 h-20 rounded-full mx-auto ring-4 ring-aethex-400/20 hover:ring-aethex-400/50 transition-all duration-300"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-background animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gradient">
                        {profile?.full_name || user.email?.split("@")[0]}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {profile?.role || "Member"}
                      </p>
                      <Badge
                        variant="outline"
                        className="mt-2 border-aethex-400/50 text-aethex-400"
                      >
                        Level {profile?.level || 1}
                      </Badge>
                      {profileComplete && (
                        <Badge className="mt-2 ml-2 bg-green-600 text-white border-green-500">
                          Profile Complete
                        </Badge>
                      )}
                    </div>

                    {/* XP Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>XP Progress</span>
                        <span>
                          {profile?.total_xp || 0} /{" "}
                          {(profile?.level || 1) * 1000}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-aethex-500 to-neon-blue h-2 rounded-full transition-all duration-500 glow-blue"
                          style={{
                            width: `${Math.min(100, ((profile?.total_xp || 0) % 1000) / 10)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-card/50 border-border/50 animate-slide-left">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start hover-lift interactive-scale"
                        style={{ animationDelay: `${index * 0.1}s` }}
                        onClick={() => handleQuickAction(action.title)}
                      >
                        <div
                          className={`p-1 rounded bg-gradient-to-r ${action.color} mr-3`}
                        >
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        {action.title}
                      </Button>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9 space-y-6">
              {/* Stats Grid (adapts per realm by labels) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
                {statsDisplay.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card
                      key={index}
                      className="bg-card/50 border-border/50 hover:border-aethex-400/50 transition-all duration-300 hover-lift animate-scale-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {stat.label}
                            </p>
                            <p className="text-2xl font-bold text-gradient">
                              {stat.value}
                            </p>
                          </div>
                          <div
                            className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}
                          >
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Realm spotlight */}
              {activeRealm === "game_developer" && (
                <Card className="bg-card/50 border-border/50 animate-fade-in">
                  <CardHeader>
                    <CardTitle className="text-gradient">
                      Create a Post
                    </CardTitle>
                    <CardDescription>
                      Share updates, images, or videos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PostComposer onPosted={loadDashboardData} />
                  </CardContent>
                </Card>
              )}

              {activeRealm === "community_member" && (
                <Card className="bg-card/50 border-border/50 animate-fade-in">
                  <CardHeader>
                    <CardTitle className="text-gradient">
                      Community actions
                    </CardTitle>
                    <CardDescription>
                      Post to the feed and explore trending topics
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <PostComposer onPosted={() => {}} />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => navigate("/feed")}
                      >
                        Open Feed
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigate("/community/mentorship")}
                      >
                        Mentorship
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeRealm === "client" && (
                <Card className="bg-card/50 border-border/50 animate-fade-in">
                  <CardHeader>
                    <CardTitle className="text-gradient">
                      Project workspace
                    </CardTitle>
                    <CardDescription>
                      Kick off engagements and track delivery
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    <Button onClick={() => navigate("/projects/new")}>
                      Start New Project
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate("/teams")}
                    >
                      Create Team
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate("/consulting")}
                    >
                      Consulting Overview
                    </Button>
                  </CardContent>
                </Card>
              )}

              {activeRealm === "customer" && (
                <Card className="bg-card/50 border-border/50 animate-fade-in">
                  <CardHeader>
                    <CardTitle className="text-gradient">Get started</CardTitle>
                    <CardDescription>
                      Explore products and manage access
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    <Button onClick={() => navigate("/get-started")}>
                      Product onboarding
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate("/support")}
                    >
                      Support
                    </Button>
                  </CardContent>
                </Card>
              )}

              {activeRealm === "staff" && (
                <Card className="bg-card/50 border-border/50 animate-fade-in">
                  <CardHeader>
                    <CardTitle className="text-gradient">Operations</CardTitle>
                    <CardDescription>
                      Moderation and internal tools
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    <Button onClick={() => navigate("/staff")}>
                      Open Staff Console
                    </Button>
                    <Button variant="outline" onClick={() => navigate("/feed")}>
                      Community Feed
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Settings Section */}
              <Card
                className="bg-card/50 border-border/50 animate-fade-in"
                id="settings"
              >
                <CardHeader>
                  <CardTitle className="text-gradient">
                    Account Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your profile, notifications, and privacy
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={handleTabChange}>
                    <TabsList className="mb-4 flex flex-wrap gap-2">
                      <TabsTrigger value="profile">Profile</TabsTrigger>
                      <TabsTrigger value="connections">Connections</TabsTrigger>
                      <TabsTrigger value="notifications">
                        Notifications
                      </TabsTrigger>
                      <TabsTrigger value="privacy">Privacy</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="displayName">Display Name</Label>
                          <Input
                            id="displayName"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={locationInput}
                            onChange={(e) => setLocationInput(e.target.value)}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="avatar">Profile Image</Label>
                          <Input
                            id="avatar"
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const ensureBuckets = async () => {
                                try {
                                  await fetch("/api/storage/ensure-buckets", {
                                    method: "POST",
                                  });
                                } catch {}
                              };
                              const file = e.target.files?.[0];
                              if (!file || !user) return;
                              const storeDataUrl = () =>
                                new Promise<string>((resolve, reject) => {
                                  const reader = new FileReader();
                                  reader.onload = () =>
                                    resolve(reader.result as string);
                                  reader.onerror = () =>
                                    reject(new Error("Failed to read file"));
                                  reader.readAsDataURL(file);
                                });
                              try {
                                await ensureBuckets();
                                const path = `${user.id}/avatar-${Date.now()}-${file.name}`;
                                let { error } = await supabase.storage
                                  .from("avatars")
                                  .upload(path, file, { upsert: true });
                                if (
                                  error &&
                                  /bucket/i.test(error?.message || "")
                                ) {
                                  await ensureBuckets();
                                  ({ error } = await supabase.storage
                                    .from("avatars")
                                    .upload(path, file, { upsert: true }));
                                }
                                if (error) throw error;
                                const { data } = supabase.storage
                                  .from("avatars")
                                  .getPublicUrl(path);
                                await updateProfile({
                                  avatar_url: data.publicUrl,
                                } as any);
                                computeProfileCompletion({
                                  ...(profile as any),
                                  avatar_url: data.publicUrl,
                                });
                                aethexToast.success({
                                  title: "Avatar updated",
                                });
                              } catch (err: any) {
                                try {
                                  const dataUrl = await storeDataUrl();
                                  await updateProfile({
                                    avatar_url: dataUrl,
                                  } as any);
                                  computeProfileCompletion({
                                    ...(profile as any),
                                    avatar_url: dataUrl,
                                  });
                                  aethexToast.success({
                                    title: "Avatar saved (local)",
                                  });
                                } catch (e: any) {
                                  aethexToast.error({
                                    title: "Upload failed",
                                    description:
                                      err?.message || "Unable to upload image",
                                  });
                                }
                              }
                            }}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="banner">Banner Image</Label>
                          <Input
                            id="banner"
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const ensureBuckets = async () => {
                                try {
                                  await fetch("/api/storage/ensure-buckets", {
                                    method: "POST",
                                  });
                                } catch {}
                              };
                              const file = e.target.files?.[0];
                              if (!file || !user) return;
                              const storeDataUrl = () =>
                                new Promise<string>((resolve, reject) => {
                                  const reader = new FileReader();
                                  reader.onload = () =>
                                    resolve(reader.result as string);
                                  reader.onerror = () =>
                                    reject(new Error("Failed to read file"));
                                  reader.readAsDataURL(file);
                                });
                              try {
                                await ensureBuckets();
                                const path = `${user.id}/banner-${Date.now()}-${file.name}`;
                                let { error } = await supabase.storage
                                  .from("banners")
                                  .upload(path, file, { upsert: true });
                                if (
                                  error &&
                                  /bucket/i.test(error?.message || "")
                                ) {
                                  await ensureBuckets();
                                  ({ error } = await supabase.storage
                                    .from("banners")
                                    .upload(path, file, { upsert: true }));
                                }
                                if (error) throw error;
                                const { data } = supabase.storage
                                  .from("banners")
                                  .getPublicUrl(path);
                                await updateProfile({
                                  banner_url: data.publicUrl,
                                } as any);
                                computeProfileCompletion({
                                  ...(profile as any),
                                  banner_url: data.publicUrl,
                                });
                                aethexToast.success({
                                  title: "Banner updated",
                                });
                              } catch (err: any) {
                                try {
                                  const dataUrl = await storeDataUrl();
                                  await updateProfile({
                                    banner_url: dataUrl,
                                  } as any);
                                  computeProfileCompletion({
                                    ...(profile as any),
                                    banner_url: dataUrl,
                                  });
                                  aethexToast.success({
                                    title: "Banner saved (local)",
                                  });
                                } catch (e: any) {
                                  aethexToast.error({
                                    title: "Upload failed",
                                    description:
                                      err?.message || "Unable to upload image",
                                  });
                                }
                              }
                            }}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="linkedin">LinkedIn URL</Label>
                          <Input
                            id="linkedin"
                            value={linkedin}
                            onChange={(e) => setLinkedin(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="github">GitHub URL</Label>
                          <Input
                            id="github"
                            value={github}
                            onChange={(e) => setGithub(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="twitter">Twitter URL</Label>
                          <Input
                            id="twitter"
                            value={twitter}
                            onChange={(e) => setTwitter(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          onClick={saveProfile}
                          disabled={savingProfile}
                          className="hover-lift"
                        >
                          {savingProfile ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                      <Separator className="my-6" />
                      <div className="rounded border border-border/40 p-3 flex items-center justify-between">
                        <div>
                          <div className="font-medium">Realm & Path</div>
                          <div className="text-sm text-muted-foreground">
                            Manage your realm preferences on the Realms page.
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => navigate("/realms")}
                        >
                          Open Realms
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="connections" className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          Linked accounts
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Manage third-party login providers connected to your
                          AeThex account.
                        </p>
                      </div>
                      <OAuthConnections
                        providers={oauthConnections}
                        linkedProviderMap={linkedProviderMap}
                        connectionAction={connectionAction}
                        onLink={handleLinkProvider}
                        onUnlink={handleUnlinkProvider}
                      />

                      <Separator className="my-6" />

                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          Your network
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          People you follow, your followers, and direct
                          connections.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-card/50 border-border/50">
                          <CardHeader>
                            <CardTitle className="text-base">
                              Following
                            </CardTitle>
                            <CardDescription>
                              {followingIds.length} people
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            {followingIds.length === 0 ? (
                              <div className="text-sm text-muted-foreground">
                                You're not following anyone yet.
                              </div>
                            ) : (
                              followingIds.slice(0, 6).map((id) => (
                                <div
                                  key={id}
                                  className="flex items-center justify-between p-2 rounded border border-border/40"
                                >
                                  <div className="text-xs text-muted-foreground truncate">
                                    {id}
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={async () => {
                                      if (!user) return;
                                      try {
                                        await aethexSocialService.unfollowUser(
                                          user.id,
                                          id,
                                        );
                                        setFollowingIds((s) =>
                                          s.filter((x) => x !== id),
                                        );
                                      } catch {}
                                    }}
                                  >
                                    Unfollow
                                  </Button>
                                </div>
                              ))
                            )}
                          </CardContent>
                        </Card>

                        <Card className="bg-card/50 border-border/50">
                          <CardHeader>
                            <CardTitle className="text-base">
                              Followers
                            </CardTitle>
                            <CardDescription>
                              {followerIds.length} people
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            {followerIds.length === 0 ? (
                              <div className="text-sm text-muted-foreground">
                                No followers yet.
                              </div>
                            ) : (
                              followerIds.slice(0, 6).map((id) => (
                                <div
                                  key={id}
                                  className="flex items-center justify-between p-2 rounded border border-border/40"
                                >
                                  <div className="text-xs text-muted-foreground truncate">
                                    {id}
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={async () => {
                                      if (!user) return;
                                      try {
                                        await aethexSocialService.followUser(
                                          user.id,
                                          id,
                                        );
                                        setFollowingIds((s) =>
                                          Array.from(new Set([...s, id])),
                                        );
                                      } catch {}
                                    }}
                                  >
                                    Follow back
                                  </Button>
                                </div>
                              ))
                            )}
                          </CardContent>
                        </Card>

                        <Card className="bg-card/50 border-border/50">
                          <CardHeader>
                            <CardTitle className="text-base">
                              Connections
                            </CardTitle>
                            <CardDescription>
                              {connectionsList.length} people
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            {connectionsList.length === 0 ? (
                              <div className="text-sm text-muted-foreground">
                                No direct connections yet.
                              </div>
                            ) : (
                              connectionsList.slice(0, 6).map((row: any) => {
                                const up =
                                  row.user_profiles || row.profile || null;
                                const label =
                                  up?.full_name ||
                                  up?.username ||
                                  row.connection_id ||
                                  "User";
                                const id = row.connection_id || up?.id;
                                const isFollowing = followingIds.includes(id);
                                return (
                                  <div
                                    key={id}
                                    className="flex items-center justify-between p-2 rounded border border-border/40"
                                  >
                                    <div className="text-xs truncate">
                                      <span className="font-medium">
                                        {label}
                                      </span>
                                      <span className="text-muted-foreground ml-2">
                                        {id}
                                      </span>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={async () => {
                                          if (!user || !id) return;
                                          try {
                                            if (isFollowing) {
                                              await aethexSocialService.unfollowUser(
                                                user.id,
                                                id,
                                              );
                                              setFollowingIds((s) =>
                                                s.filter((x) => x !== id),
                                              );
                                            } else {
                                              await aethexSocialService.followUser(
                                                user.id,
                                                id,
                                              );
                                              setFollowingIds((s) =>
                                                Array.from(new Set([...s, id])),
                                              );
                                            }
                                          } catch {}
                                        }}
                                      >
                                        {isFollowing ? "Unfollow" : "Follow"}
                                      </Button>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="notifications" className="space-y-4">
                      <div className="flex items-center justify-between border rounded-lg p-3">
                        <div>
                          <div className="font-medium">Email notifications</div>
                          <div className="text-sm text-muted-foreground">
                            Get updates in your inbox
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between border rounded-lg p-3">
                        <div>
                          <div className="font-medium">Push notifications</div>
                          <div className="text-sm text-muted-foreground">
                            Receive alerts in the app
                          </div>
                        </div>
                        <Switch />
                      </div>
                    </TabsContent>

                    <TabsContent value="privacy" className="space-y-4">
                      <div className="flex items-center justify-between border rounded-lg p-3">
                        <div>
                          <div className="font-medium">Public profile</div>
                          <div className="text-sm text-muted-foreground">
                            Show your profile to everyone
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between border rounded-lg p-3">
                        <div>
                          <div className="font-medium">Show email</div>
                          <div className="text-sm text-muted-foreground">
                            Display email on your profile
                          </div>
                        </div>
                        <Switch />
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Your Recent Posts */}
              <Card className="bg-card/50 border-border/50 animate-fade-in">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-gradient">
                        Your Recent Posts
                      </CardTitle>
                      <CardDescription>Your latest activity</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover-lift"
                      onClick={() => navigate("/feed")}
                    >
                      Go to Feed
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {userPosts.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                      No posts yet. Share something above.
                    </div>
                  ) : (
                    userPosts.map((p: any) => {
                      let text = "";
                      try {
                        const obj = JSON.parse(p.content || "{}");
                        text = obj.text || p.content;
                      } catch {
                        text = p.content;
                      }
                      return (
                        <div
                          key={p.id}
                          className="p-3 rounded border border-border/40 hover:border-aethex-400/50 transition-all"
                        >
                          <div className="text-sm font-medium">{p.title}</div>
                          {text && (
                            <div className="text-xs text-muted-foreground line-clamp-2">
                              {text}
                            </div>
                          )}
                          <div className="text-[11px] text-muted-foreground mt-1">
                            {new Date(p.created_at).toLocaleString()}
                          </div>
                        </div>
                      );
                    })
                  )}
                </CardContent>
              </Card>

              {/* Recent Projects */}
              <Card className="bg-card/50 border-border/50 animate-fade-in">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-gradient">
                        Recent Projects
                      </CardTitle>
                      <CardDescription>
                        Your active development projects
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover-lift"
                      onClick={() => navigate("/projects")}
                    >
                      View All
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {projects.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Rocket className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No projects yet. Start your first project!</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => handleQuickAction("Start New Project")}
                      >
                        Create Project
                      </Button>
                    </div>
                  ) : (
                    projects.slice(0, 3).map((project: any, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg border border-border/30 hover:border-aethex-400/50 transition-all duration-300 hover-lift animate-slide-right"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-aethex-500/20 to-neon-blue/20 flex items-center justify-center">
                            <Rocket className="h-6 w-6 text-aethex-400" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{project.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {project.status?.replace("_", " ").toUpperCase()}{" "}
                              •{" "}
                              {project.technologies?.slice(0, 2).join(", ") ||
                                "No tech specified"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {getProgressPercentage(project)}%
                            </p>
                            <div className="w-20 bg-muted rounded-full h-2 mt-1">
                              <div
                                className="bg-gradient-to-r from-aethex-500 to-neon-blue h-2 rounded-full"
                                style={{
                                  width: `${getProgressPercentage(project)}%`,
                                }}
                              />
                            </div>
                          </div>
                          <Badge
                            variant={
                              getPriorityFromTech(
                                project.technologies || [],
                              ) === "High"
                                ? "destructive"
                                : "secondary"
                            }
                            className="animate-pulse"
                          >
                            {getPriorityFromTech(project.technologies || [])}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              navigate(`/projects/${project.id}/board`)
                            }
                          >
                            Open Board
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Applications to Your Projects */}
              <Card className="bg-card/50 border-border/50 animate-fade-in">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-gradient">
                        Project Applications
                      </CardTitle>
                      <CardDescription>
                        People who applied to your projects
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {applications.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                      No applications yet.
                    </div>
                  ) : (
                    applications.map((a: any) => (
                      <div
                        key={a.id}
                        className="p-3 rounded border border-border/40 hover:border-aethex-400/50 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm">
                              {a.applicant_name ||
                                a.applicant_email ||
                                "Applicant"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Applied to:{" "}
                              {a.projects?.title ||
                                a.project_title ||
                                "Project"}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(a.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        {a.message && (
                          <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {a.message}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card className="bg-card/50 border-border/50 animate-slide-up">
                <CardHeader>
                  <CardTitle className="text-gradient">Achievements</CardTitle>
                  <CardDescription>
                    Your progress and accomplishments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4 gap-3">
                    <div className="text-sm text-muted-foreground">
                      Earned {achievements.length} / {allAchievements.length}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={
                          achievementFilter === "earned" ? "default" : "outline"
                        }
                        onClick={() => setAchievementFilter("earned")}
                      >
                        Earned
                      </Button>
                      <Button
                        size="sm"
                        variant={
                          achievementFilter === "locked" ? "default" : "outline"
                        }
                        onClick={() => setAchievementFilter("locked")}
                      >
                        Locked
                      </Button>
                      <Button
                        size="sm"
                        variant={
                          achievementFilter === "all" ? "default" : "outline"
                        }
                        onClick={() => setAchievementFilter("all")}
                      >
                        All
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(() => {
                      const earnedIds = new Set(
                        (achievements || []).map((a: any) => a.id),
                      );
                      const source = (
                        achievementFilter === "earned"
                          ? achievements || []
                          : achievementFilter === "locked"
                            ? (allAchievements || []).filter(
                                (a: any) => !earnedIds.has(a.id),
                              )
                            : allAchievements || []
                      ).map((a: any) => ({
                        ...a,
                        earned: earnedIds.has(a.id),
                      }));
                      if (!source.length) {
                        return (
                          <div className="col-span-full text-center py-8 text-muted-foreground">
                            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No achievements to display.</p>
                          </div>
                        );
                      }
                      return source
                        .sort(
                          (a: any, b: any) =>
                            Number(b.earned) - Number(a.earned),
                        )
                        .map((achievement: any, index: number) => {
                          const Icon = getAchievementIcon(
                            achievement.icon || "star",
                          );
                          return (
                            <div
                              key={achievement.id || index}
                              className={`p-4 rounded-lg border transition-all duration-300 hover-lift animate-scale-in ${
                                achievement.earned
                                  ? "border-aethex-400/50 bg-aethex-500/10"
                                  : "border-border/30 opacity-60"
                              }`}
                              style={{ animationDelay: `${index * 0.05}s` }}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`p-2 rounded-lg ${
                                      achievement.earned
                                        ? "bg-gradient-to-r from-aethex-500 to-neon-blue"
                                        : "bg-muted"
                                    }`}
                                  >
                                    <Icon
                                      className={`h-5 w-5 ${achievement.earned ? "text-white" : "text-muted-foreground"}`}
                                    />
                                  </div>
                                  <div>
                                    <h4
                                      className={`font-semibold ${achievement.earned ? "text-gradient" : ""}`}
                                    >
                                      {achievement.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                      {achievement.description}
                                    </p>
                                  </div>
                                </div>
                                {achievement.earned && (
                                  <Star className="h-5 w-5 text-yellow-500" />
                                )}
                              </div>
                            </div>
                          );
                        });
                    })()}
                  </div>
                </CardContent>
              </Card>

              {/* Teams & Invitations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card/50 border-border/50 animate-fade-in">
                  <CardHeader>
                    <CardTitle className="text-gradient">My Teams</CardTitle>
                    <CardDescription>Your memberships</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {teams.length === 0 ? (
                      <div className="text-sm text-muted-foreground">
                        No teams yet.
                      </div>
                    ) : (
                      teams.slice(0, 6).map((t: any) => {
                        const team = (t as any).teams || t;
                        return (
                          <div
                            key={team.id}
                            className="flex items-center justify-between p-3 rounded border border-border/40"
                          >
                            <div className="font-medium text-sm">
                              {team.name}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate("/teams")}
                            >
                              Open
                            </Button>
                          </div>
                        );
                      })
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-card/50 border-border/50 animate-fade-in">
                  <CardHeader>
                    <CardTitle className="text-gradient">Invitations</CardTitle>
                    <CardDescription>Recent invites you sent</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {invites.length === 0 ? (
                      <div className="text-sm text-muted-foreground">
                        No invites yet.
                      </div>
                    ) : (
                      invites.slice(0, 6).map((inv: any) => (
                        <div
                          key={inv.id}
                          className="flex items-center justify-between p-3 rounded border border-border/40"
                        >
                          <div className="text-sm">
                            <div className="font-medium">
                              {inv.invitee_email}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {inv.status}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigator.clipboard.writeText(
                                `${location.origin}/login?invite=${inv.token}`,
                              )
                            }
                          >
                            Copy link
                          </Button>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
