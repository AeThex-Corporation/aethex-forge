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
  const [achievements, setAchievements] = useState([]);
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
    ],
    [],
  );

  useEffect(() => {
    console.log("Dashboard useEffect:", {
      user: !!user,
      profile: !!profile,
      authLoading,
    });

    // Only redirect to login when auth is resolved and there's no user
    if (!user && !authLoading) {
      console.log("No user after auth resolved, redirecting to login");
      setIsLoading(false);
      navigate("/login", { replace: true });
      return;
    }

    // While auth is still resolving, keep showing loading state
    if (!user && authLoading) {
      setIsLoading(true);
      return;
    }

    if (user && profile) {
      console.log("User and profile exist, loading dashboard data");
      loadDashboardData();
    } else if (user && !profile && !authLoading) {
      console.log("User exists but no profile, clearing loading");
      setIsLoading(false);
    }
  }, [user, profile, authLoading, navigate]);

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

      // Load user's projects with error handling
      let userProjects = [];
      try {
        userProjects = await aethexProjectService.getUserProjects(user!.id);
        setProjects(userProjects);
      } catch (projectError) {
        console.warn("Could not load projects:", projectError);
        setProjects([]);
      }

      // Load user's recent posts
      try {
        const posts = await communityService.getUserPosts(user!.id);
        setUserPosts(posts.slice(0, 5));
      } catch (e) {
        console.warn("Could not load user posts:", e);
        setUserPosts([]);
      }

      // Load project applications (if table exists)
      try {
        const { data, error } = await supabase
          .from("project_applications")
          .select(`*, projects!inner(id, title, user_id)`)
          .eq("projects.user_id", user!.id)
          .order("created_at", { ascending: false })
          .limit(10);
        if (!error && Array.isArray(data)) setApplications(data);
        else setApplications([]);
      } catch (e) {
        console.warn("Applications fetch skipped or failed:", e);
        setApplications([]);
      }

      // Check and award project-related achievements, then load achievements
      try {
        await aethexAchievementService.checkAndAwardProjectAchievements(
          user!.id,
        );
      } catch (e) {
        console.warn("checkAndAwardProjectAchievements failed:", e);
      }

      // Load user's achievements with error handling
      let userAchievements = [];
      try {
        userAchievements = await aethexAchievementService.getUserAchievements(
          user!.id,
        );
        setAchievements(userAchievements);
      } catch (achievementError) {
        console.warn("Could not load achievements:", achievementError);
        setAchievements([]);
      }

      // Load follower count for real collaboration insight
      let followerCount = 0;
      try {
        const { count, error } = await supabase
          .from("user_follows")
          .select("id", { count: "exact", head: true })
          .eq("following_id", user!.id);
        if (!error && typeof count === "number") {
          followerCount = count;
        }
      } catch (e) {
        console.warn("Could not load follower count:", e);
      }

      // Calculate stats (treat planning and in_progress as active)
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
      case "Join Team":
        navigate("/community");
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

  // If no user and auth is resolved, let the redirect happen without flashing a loader
  if (!user && !authLoading) {
    return null;
  }

  // Show loading only while auth or data is loading
  if (authLoading || isLoading) {
    return (
      <LoadingScreen
        message="Loading your dashboard..."
        showProgress={true}
        duration={1200}
      />
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
      value: 47,
      icon: Trophy,
      color: "from-green-500 to-blue-600",
    },
    {
      label: "Team Members",
      value: 8,
      icon: Users,
      color: "from-purple-500 to-pink-600",
    },
    {
      label: "Performance Score",
      value: "94%",
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
    { title: "Join Team", icon: Users, color: "from-green-500 to-blue-600" },
    { title: "Access Labs", icon: Zap, color: "from-yellow-500 to-orange-600" },
    {
      title: "View Analytics",
      icon: BarChart3,
      color: "from-purple-500 to-pink-600",
    },
  ];

  if (isLoading) {
    return (
      <LoadingScreen
        message="Loading your dashboard..."
        showProgress={true}
        duration={1000}
      />
    );
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
                  Welcome back,{" "}
                  {profile?.full_name || user.email?.split("@")[0]}
                </h1>
                <p className="text-muted-foreground">
                  {profile?.role || "Member"} • Level {profile?.level || 1} • {streakLabel} 🔥
                </p>
                {longestStreak > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="border-aethex-400/40 text-aethex-200"
                    >
                      Longest streak: {longestStreak}d
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
              {/* Stats Grid */}
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

              {/* Central Post Composer */}
              <Card className="bg-card/50 border-border/50 animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-gradient">Create a Post</CardTitle>
                  <CardDescription>
                    Share updates, images, or videos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PostComposer onPosted={loadDashboardData} />
                </CardContent>
              </Card>

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
                                const path = `${user.id}/avatar-${Date.now()}-${file.name}`;
                                const { error } = await supabase.storage
                                  .from("avatars")
                                  .upload(path, file, { upsert: true });
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
                                const path = `${user.id}/banner-${Date.now()}-${file.name}`;
                                const { error } = await supabase.storage
                                  .from("banners")
                                  .upload(path, file, { upsert: true });
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
                      <RealmSwitcher
                        selectedRealm={userRealm}
                        onRealmChange={setUserRealm}
                        selectedExperience={experienceLevel}
                        onExperienceChange={setExperienceLevel}
                        hasChanges={hasRealmChanges}
                        onSave={handleRealmSave}
                        saving={savingRealm}
                      />
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
                    <Button variant="outline" size="sm" className="hover-lift">
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
                            variant="ghost"
                            size="sm"
                            className="hover-lift"
                          >
                            <MoreHorizontal className="h-4 w-4" />
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.length === 0 ? (
                      <div className="col-span-full text-center py-8 text-muted-foreground">
                        <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>
                          No achievements unlocked yet. Complete projects to
                          earn achievements!
                        </p>
                      </div>
                    ) : (
                      achievements.map((achievement: any, index) => {
                        const Icon = getAchievementIcon(
                          achievement.icon || "star",
                        );
                        return (
                          <div
                            key={index}
                            className={`p-4 rounded-lg border transition-all duration-300 hover-lift animate-scale-in ${
                              achievement.earned
                                ? "border-aethex-400/50 bg-aethex-500/10"
                                : "border-border/30 opacity-60"
                            }`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            <div className="flex items-center space-x-3">
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
                              {achievement.earned && (
                                <Star className="h-5 w-5 text-yellow-500 animate-pulse" />
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
