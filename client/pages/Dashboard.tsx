import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
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
  const [isLoading, setIsLoading] = useState(true);
  const [activeProjects, setActiveProjects] = useState(3);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Mock user data
  const user = {
    name: "Alex Thompson",
    role: "Game Developer",
    level: 15,
    xp: 2450,
    nextLevelXp: 3000,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    joinDate: "March 2024",
    streak: 12,
  };

  const stats = [
    {
      label: "Active Projects",
      value: activeProjects,
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

  const recentProjects = [
    {
      name: "Neural Network AI",
      progress: 75,
      status: "In Progress",
      dueDate: "Dec 15",
      team: 4,
      priority: "High",
    },
    {
      name: "Blockchain Integration",
      progress: 60,
      status: "Development",
      dueDate: "Dec 20",
      team: 3,
      priority: "Medium",
    },
    {
      name: "Cloud Infrastructure",
      progress: 90,
      status: "Testing",
      dueDate: "Dec 10",
      team: 6,
      priority: "High",
    },
  ];

  const achievements = [
    {
      title: "Code Master",
      description: "Completed 50+ coding challenges",
      icon: Code,
      earned: true,
    },
    {
      title: "Team Player",
      description: "Collaborated on 10+ projects",
      icon: Users,
      earned: true,
    },
    {
      title: "Innovation Leader",
      description: "Led 5+ innovative projects",
      icon: Rocket,
      earned: false,
    },
    {
      title: "Database Wizard",
      description: "Optimized 20+ databases",
      icon: Database,
      earned: false,
    },
  ];

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
          {/* Header */}
          <div className="mb-8 animate-slide-down">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gradient-purple">
                  Welcome back, {user.name}
                </h1>
                <p className="text-muted-foreground">
                  {user.role} • Level {user.level} • {user.streak} day streak 🔥
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
                        src={user.avatar}
                        alt="User Avatar"
                        className="w-20 h-20 rounded-full mx-auto ring-4 ring-aethex-400/20 hover:ring-aethex-400/50 transition-all duration-300"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-background animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gradient">
                        {user.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {user.role}
                      </p>
                      <Badge
                        variant="outline"
                        className="mt-2 border-aethex-400/50 text-aethex-400"
                      >
                        Level {user.level}
                      </Badge>
                    </div>

                    {/* XP Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>XP Progress</span>
                        <span>
                          {user.xp} / {user.nextLevelXp}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-aethex-500 to-neon-blue h-2 rounded-full transition-all duration-500 glow-blue"
                          style={{
                            width: `${(user.xp / user.nextLevelXp) * 100}%`,
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
                {stats.map((stat, index) => {
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
                  {recentProjects.map((project, index) => (
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
                          <h4 className="font-semibold">{project.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Due {project.dueDate} • {project.team} team members
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {project.progress}%
                          </p>
                          <div className="w-20 bg-muted rounded-full h-2 mt-1">
                            <div
                              className="bg-gradient-to-r from-aethex-500 to-neon-blue h-2 rounded-full"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>
                        <Badge
                          variant={
                            project.priority === "High"
                              ? "destructive"
                              : "secondary"
                          }
                          className="animate-pulse"
                        >
                          {project.priority}
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
                  ))}
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
                    {achievements.map((achievement, index) => {
                      const Icon = achievement.icon;
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
                    })}
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
