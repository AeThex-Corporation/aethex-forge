import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { aethexToast } from "@/lib/aethex-toast";
import {
  aethexProjectService,
  aethexAchievementService,
} from "@/lib/aethex-database-adapter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState({
    activeProjects: 0,
    completedTasks: 0,
    teamMembers: 0,
    performanceScore: "0%",
  });

  useEffect(() => {
    console.log("Dashboard useEffect:", { user: !!user, profile: !!profile, authLoading });

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

      // Load user's achievements with error handling
      let userAchievements = [];
      try {
        userAchievements = await aethexAchievementService.getUserAchievements(user!.id);
        setAchievements(userAchievements);
      } catch (achievementError) {
        console.warn("Could not load achievements:", achievementError);
        setAchievements([]);
      }

      // Calculate stats
      const activeCount = userProjects.filter(
        (p) => p.status === "in_progress",
      ).length;
      const completedCount = userProjects.filter(
        (p) => p.status === "completed",
      ).length;

      setStats({
        activeProjects: activeCount,
        completedTasks: completedCount,
        teamMembers: 8, // Mock for now
        performanceScore: `${Math.min(95, 70 + completedCount * 5)}%`,
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

  const handleQuickAction = async (actionTitle: string) => {
    switch (actionTitle) {
      case "Start New Project":
        navigate("/projects/new");
        break;
      case "Join Team":
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

  // While auth is resolving or data is loading, show loading screen
  if (authLoading || isLoading || !user) {
    return (
      <LoadingScreen
        message="Loading your dashboard..."
        showProgress={true}
        duration={1500}
      />
    );
  }

  // Show profile setup if no profile exists, but allow dashboard to continue
  const showProfileSetup = !profile;

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
                        <h3 className="text-white font-semibold">Complete Your Profile</h3>
                        <p className="text-orange-200 text-sm">Set up your profile to unlock all features</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => navigate("/profile")}
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
                  Welcome back, {profile?.full_name || user.email?.split('@')[0]}
                </h1>
                <p className="text-muted-foreground">
                  {profile?.role || 'Member'} • Level {profile?.level || 1} • 7 day streak 🔥
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" className="hover-lift">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
                <Button variant="outline" size="sm" className="hover-lift">
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
                        src={profile?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'}
                        alt="User Avatar"
                        className="w-20 h-20 rounded-full mx-auto ring-4 ring-aethex-400/20 hover:ring-aethex-400/50 transition-all duration-300"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-background animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gradient">
                        {profile?.full_name || user.email?.split('@')[0]}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {profile?.role || 'Member'}
                      </p>
                      <Badge
                        variant="outline"
                        className="mt-2 border-aethex-400/50 text-aethex-400"
                      >
                        Level {profile?.level || 1}
                      </Badge>
                    </div>

                    {/* XP Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>XP Progress</span>
                        <span>
                          {profile?.total_xp || 0} / {((profile?.level || 1) * 1000)}
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
                            {project.status?.replace("_", " ").toUpperCase()} •{" "}
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
                            getPriorityFromTech(project.technologies || []) ===
                            "High"
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
                        <p>No achievements unlocked yet. Complete projects to earn achievements!</p>
                      </div>
                    ) : (
                      achievements.map((achievement: any, index) => {
                      const Icon = getAchievementIcon(achievement.icon || 'star');
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
