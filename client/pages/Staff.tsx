import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Briefcase,
  BookOpen,
  MessageSquare,
  Trophy,
  Target,
  ArrowRight,
  Shield,
  Clock,
  TrendingUp,
  Zap,
  Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";
import { useArmToast } from "@/hooks/use-arm-toast";

export default function Staff() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const armToast = useArmToast();
  const [isLoading, setIsLoading] = useState(true);
  const toastShownRef = useRef(false);

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!loading && !user) {
      navigate("/staff/login", { replace: true });
      return;
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!toastShownRef.current) {
        armToast.system("Staff operations portal initialized");
        toastShownRef.current = true;
      }
    }, 900);

    return () => clearTimeout(timer);
  }, [armToast]);

  // Show loading screen while checking authentication
  if (isLoading || loading) {
    return (
      <LoadingScreen
        message="Securing Staff Portal..."
        showProgress={true}
        duration={900}
        accentColor="from-purple-500 to-purple-400"
        armLogo="https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fc0414efd7af54ef4b821a05d469150d0?format=webp&width=800"
      />
    );
  }

  const staffResources = [
    {
      icon: Briefcase,
      title: "Announcements",
      description: "Company updates, news, and important information",
      link: "/staff/announcements",
      color: "from-rose-500 to-pink-500",
      lightBg: "bg-rose-500/10",
    },
    {
      icon: BookOpen,
      title: "Knowledge Base",
      description: "Internal documentation, guides, and best practices",
      link: "/staff/knowledge-base",
      color: "from-blue-500 to-cyan-500",
      lightBg: "bg-blue-500/10",
    },
    {
      icon: MessageSquare,
      title: "Team Handbook",
      description: "Policies, procedures, and team guidelines",
      link: "/staff/team-handbook",
      color: "from-green-500 to-emerald-500",
      lightBg: "bg-green-500/10",
    },
    {
      icon: Trophy,
      title: "Performance Reviews",
      description: "Career development and performance tracking",
      link: "/staff/performance-reviews",
      color: "from-amber-500 to-orange-500",
      lightBg: "bg-amber-500/10",
    },
    {
      icon: Target,
      title: "Project Tracking",
      description: "Team projects and task management",
      link: "/staff/project-tracking",
      color: "from-violet-500 to-indigo-500",
      lightBg: "bg-violet-500/10",
    },
    {
      icon: Users,
      title: "Directory",
      description: "Staff directory and team contacts",
      link: "/staff/knowledge-base",
      color: "from-teal-500 to-cyan-500",
      lightBg: "bg-teal-500/10",
    },
  ];

  const workspaceStats = [
    {
      icon: Users,
      label: "Team Members",
      value: "142",
      trend: "+8 this quarter",
      color: "text-purple-300",
    },
    {
      icon: Clock,
      label: "Ongoing Projects",
      value: "47",
      trend: "+12 this month",
      color: "text-purple-300",
    },
    {
      icon: TrendingUp,
      label: "Productivity Score",
      value: "94%",
      trend: "↑ 5% from last month",
      color: "text-purple-300",
    },
    {
      icon: Zap,
      label: "Active Teams",
      value: "8",
      trend: "All operational",
      color: "text-purple-300",
    },
  ];

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

          {/* Grid background */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div className="relative z-10">
          {/* Hero Section */}
          <section className="container mx-auto max-w-6xl px-4 py-16 md:py-24">
            {/* Animated Logo */}
            <div className="flex justify-center mb-12 animate-fade-in">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full blur-2xl opacity-30 animate-pulse" />
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fc0414efd7af54ef4b821a05d469150d0?format=webp&width=400"
                  alt="Staff Portal"
                  className="relative h-40 w-40 object-contain drop-shadow-2xl"
                />
              </div>
            </div>

            {/* Badge */}
            <div className="flex justify-center mb-8 animate-fade-in animation-delay-100">
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30 px-4 py-2 text-sm">
                <Shield className="w-3 h-3 mr-2" />
                Internal Operations Portal
              </Badge>
            </div>

            {/* Main Heading */}
            <div className="text-center mb-8 animate-fade-in animation-delay-200">
              <h1 className="text-6xl md:text-7xl font-bold mb-6 text-purple-100">
                The Staff Command Center
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Unified workspace for internal communications, team
                collaboration, and operational excellence. Manage projects,
                track performance, and connect with your team—all in one secure
                platform.
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center mb-16 animate-fade-in animation-delay-300">
              <Button
                onClick={() => navigate("/staff/dashboard")}
                className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white font-semibold px-8 py-3 text-lg group hover-lift"
              >
                Access Portal
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Stats Section */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 animate-fade-in animation-delay-400">
              {workspaceStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card
                    key={stat.label}
                    className="bg-gradient-to-br from-purple-950/50 to-violet-950/50 border-purple-500/20 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-gray-400 text-sm font-medium mb-1">
                            {stat.label}
                          </p>
                          <p className={`text-4xl font-bold ${stat.color}`}>
                            {stat.value}
                          </p>
                        </div>
                        <div className="p-2 rounded-lg bg-purple-500/20">
                          <Icon className="w-5 h-5 text-purple-400" />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">{stat.trend}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Resources Section */}
            <div className="mb-20 animate-fade-in animation-delay-500">
              <div className="mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Quick Access Resources
                </h2>
                <p className="text-gray-400 text-lg">
                  Everything you need to manage operations, collaborate with
                  your team, and stay informed
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {staffResources.map((resource) => {
                  const Icon = resource.icon;
                  return (
                    <Card
                      key={resource.title}
                      onClick={() => navigate(resource.link)}
                      className={`group cursor-pointer ${resource.lightBg} border-purple-500/20 hover:border-purple-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:scale-105 overflow-hidden`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-white group-hover:text-purple-300 transition-colors">
                              {resource.title}
                            </CardTitle>
                          </div>
                          <div
                            className={`p-3 rounded-lg bg-gradient-to-br ${resource.color} group-hover:scale-110 transition-transform duration-300`}
                          >
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                          {resource.description}
                        </p>
                        <div className="mt-4 flex items-center text-purple-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          Explore
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Features Section */}
            <div className="grid md:grid-cols-2 gap-8 mb-20 animate-fade-in animation-delay-600">
              <div className="bg-gradient-to-br from-purple-950/40 to-violet-950/40 border border-purple-500/20 rounded-xl p-8 hover:border-purple-500/40 transition-colors">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <MessageSquare className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold">
                    Communication & Collaboration
                  </h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "Real-time company announcements",
                    "Department-specific updates",
                    "Team collaboration workspace",
                    "Internal messaging system",
                    "Event notifications",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start text-gray-300 group"
                    >
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400 mr-3 mt-2 flex-shrink-0 group-hover:scale-125 transition-transform" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-purple-950/40 to-violet-950/40 border border-purple-500/20 rounded-xl p-8 hover:border-purple-500/40 transition-colors">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <Lock className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold">Resources & Governance</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "Comprehensive internal documentation",
                    "Policies and procedures library",
                    "Team handbook & guidelines",
                    "Performance tracking tools",
                    "Secure information sharing",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start text-gray-300 group"
                    >
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400 mr-3 mt-2 flex-shrink-0 group-hover:scale-125 transition-transform" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-gradient-to-r from-purple-950/60 to-violet-950/60 border border-purple-500/30 rounded-xl p-8 animate-fade-in animation-delay-700">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-purple-500/20 flex-shrink-0 mt-1">
                  <Lock className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-purple-200 mb-2">
                    Enterprise Security & Privacy
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    All staff information is protected with enterprise-grade
                    security. Access is restricted to authenticated team members
                    only. Your data is encrypted, audited, and compliant with
                    privacy regulations.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
