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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import { aethexToast } from "@/lib/aethex-toast";

export default function Staff() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const toastShownRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!toastShownRef.current) {
        aethexToast.system("Staff operations portal initialized");
        toastShownRef.current = true;
      }
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
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
    },
    {
      icon: BookOpen,
      title: "Knowledge Base",
      description: "Internal documentation, guides, and best practices",
      link: "/staff/knowledge-base",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: MessageSquare,
      title: "Team Handbook",
      description: "Policies, procedures, and team guidelines",
      link: "/staff/team-handbook",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Trophy,
      title: "Performance Reviews",
      description: "Career development and performance tracking",
      link: "/staff/performance-reviews",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: Target,
      title: "Project Tracking",
      description: "Team projects and task management",
      link: "/staff/project-tracking",
      color: "from-violet-500 to-indigo-500",
    },
    {
      icon: Users,
      title: "Directory",
      description: "Staff directory and team contacts",
      link: "/staff/knowledge-base",
      color: "from-teal-500 to-cyan-500",
    },
  ];

  const statsCards = [
    { label: "Active Team Members", value: "142", color: "text-purple-400" },
    { label: "Departments", value: "8", color: "text-purple-400" },
    { label: "Ongoing Projects", value: "47", color: "text-purple-400" },
    { label: "Completed Q1", value: "23", color: "text-purple-400" },
  ];

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-1/3 left-10 w-72 h-72 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute bottom-40 left-1/2 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10">
          {/* Hero Section */}
          <section className="container mx-auto max-w-6xl px-4 py-20 md:py-32">
            <div className="text-center mb-12 animate-fade-in">
              <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30">
                <Shield className="w-3 h-3 mr-1" />
                Secure Staff Portal
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-300 via-violet-300 to-purple-400 bg-clip-text text-transparent">
                Staff Operations Hub
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                Centralized portal for internal communications, resources, and team collaboration
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate("/staff/announcements")}
                  className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white font-semibold group"
                >
                  Access Portal
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
              {statsCards.map((stat) => (
                <Card
                  key={stat.label}
                  className="bg-purple-950/40 border-purple-500/20 hover:border-purple-500/40 transition-colors"
                >
                  <CardContent className="p-6 text-center">
                    <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                      {stat.value}
                    </div>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Staff Resources Grid */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-center">
                Quick Access Resources
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {staffResources.map((resource) => {
                  const Icon = resource.icon;
                  return (
                    <Card
                      key={resource.title}
                      className="group bg-purple-950/40 border-purple-500/20 hover:border-purple-400/40 transition-all hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer overflow-hidden"
                      onClick={() => navigate(resource.link)}
                    >
                      <CardHeader>
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${resource.color} p-2.5 mb-3 group-hover:scale-110 transition-transform`}>
                          <Icon className="w-full h-full text-white" />
                        </div>
                        <CardTitle className="group-hover:text-purple-300 transition-colors">
                          {resource.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                          {resource.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Features Section */}
            <section className="bg-purple-950/30 border border-purple-500/20 rounded-xl p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-8">
                Staff Portal Features
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-semibold text-purple-300">Communication</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-start">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400 mr-3 mt-1.5 flex-shrink-0" />
                      <span>Company-wide announcements and updates</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400 mr-3 mt-1.5 flex-shrink-0" />
                      <span>Department notifications</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400 mr-3 mt-1.5 flex-shrink-0" />
                      <span>Team collaboration tools</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-purple-300">Resources</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-start">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400 mr-3 mt-1.5 flex-shrink-0" />
                      <span>Internal documentation and guides</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400 mr-3 mt-1.5 flex-shrink-0" />
                      <span>Policies and procedures</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400 mr-3 mt-1.5 flex-shrink-0" />
                      <span>Learning and development materials</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </section>
        </div>
      </div>
    </Layout>
  );
}
