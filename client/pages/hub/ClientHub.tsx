import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  FileText,
  Briefcase,
  Clock,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ClientHub() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <Card className="bg-slate-900 border-slate-700 w-full max-w-md">
            <CardHeader>
              <CardTitle>Client Portal Access Required</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300">
                You must be signed in to access the Client Hub.
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => navigate("/login")}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Sign In
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/corp")}
                  className="flex-1"
                >
                  Back to Corp
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Mock data for demonstration
  const stats = [
    {
      label: "Active Projects",
      value: "3",
      icon: Briefcase,
      color: "bg-blue-500/10 text-blue-400",
    },
    {
      label: "Pending Invoices",
      value: "$24,500",
      icon: FileText,
      color: "bg-amber-500/10 text-amber-400",
    },
    {
      label: "Active Contracts",
      value: "5",
      icon: FileText,
      color: "bg-green-500/10 text-green-400",
    },
    {
      label: "Support Tickets",
      value: "2",
      icon: AlertCircle,
      color: "bg-red-500/10 text-red-400",
    },
  ];

  const recentProjects = [
    {
      id: 1,
      name: "Roblox Game Development",
      status: "In Progress",
      progress: 65,
      dueDate: "2025-02-28",
      team: ["Alex Chen", "Jordan Smith"],
    },
    {
      id: 2,
      name: "AI Integration Project",
      status: "In Progress",
      progress: 45,
      dueDate: "2025-03-15",
      team: ["Taylor Brown", "Casey Johnson"],
    },
    {
      id: 3,
      name: "Mobile App Launch",
      status: "On Hold",
      progress: 30,
      dueDate: "2025-04-01",
      team: ["Morgan Davis"],
    },
  ];

  const menuItems = [
    {
      icon: BarChart3,
      label: "Dashboard",
      path: "/hub/client/dashboard",
      description: "Overview of all projects",
    },
    {
      icon: Briefcase,
      label: "Projects",
      path: "/hub/client/projects",
      description: "View and manage projects",
    },
    {
      icon: FileText,
      label: "Invoices",
      path: "/hub/client/invoices",
      description: "Track invoices and payments",
    },
    {
      icon: FileText,
      label: "Contracts",
      path: "/hub/client/contracts",
      description: "Review contracts and agreements",
    },
    {
      icon: TrendingUp,
      label: "Reports",
      path: "/hub/client/reports",
      description: "Project reports and analytics",
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/hub/client/settings",
      description: "Manage account preferences",
    },
  ];

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden pb-12">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#3b82f6_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(59,130,246,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl animate-blob animation-delay-2000" />

        <main className="relative z-10">
          {/* Header */}
          <section className="border-b border-slate-800 py-8">
            <div className="container mx-auto max-w-7xl px-4">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-4xl font-bold text-blue-300">
                  Client Portal
                </h1>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    signOut();
                    navigate("/");
                  }}
                  className="border-slate-600 text-slate-300"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
              <p className="text-slate-300">
                Welcome, {user?.email || "Client"}. Manage your projects,
                invoices, and agreements.
              </p>
            </div>
          </section>

          {/* Quick Stats */}
          <section className="py-12 border-b border-slate-800">
            <div className="container mx-auto max-w-7xl px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <Card
                      key={stat.label}
                      className="bg-slate-800/30 border-slate-700 hover:border-slate-600 transition"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm text-slate-400 mb-1">
                              {stat.label}
                            </p>
                            <p className="text-2xl font-bold text-white">
                              {stat.value}
                            </p>
                          </div>
                          <div className={`p-3 rounded-lg ${stat.color}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Main Navigation Grid */}
          <section className="py-12">
            <div className="container mx-auto max-w-7xl px-4">
              <h2 className="text-2xl font-bold mb-6">Quick Access</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Card
                      key={item.label}
                      className="bg-slate-800/30 border-slate-700 hover:border-blue-500/50 hover:bg-slate-800/50 transition cursor-pointer"
                      onClick={() => navigate(item.path)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-blue-500/10 rounded-lg">
                            <Icon className="h-6 w-6 text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-white mb-1">
                              {item.label}
                            </h3>
                            <p className="text-sm text-slate-400">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Recent Projects */}
          <section className="py-12">
            <div className="container mx-auto max-w-7xl px-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Recent Projects</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/hub/client/projects")}
                >
                  View All →
                </Button>
              </div>
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <Card
                    key={project.id}
                    className="bg-slate-800/30 border-slate-700 hover:border-slate-600 transition"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-2">
                            {project.name}
                          </h3>
                          <div className="flex items-center gap-3">
                            <Badge
                              className={
                                project.status === "In Progress"
                                  ? "bg-blue-500/20 text-blue-300"
                                  : "bg-amber-500/20 text-amber-300"
                              }
                            >
                              {project.status}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-slate-400">
                              <Clock className="h-4 w-4" />
                              Due {project.dueDate}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-slate-400">
                            Progress
                          </span>
                          <span className="text-sm font-semibold text-white">
                            {project.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-700/50 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Team */}
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {project.team.map((member) => (
                            <div
                              key={member}
                              className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded"
                            >
                              {member}
                            </div>
                          ))}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/hub/client/projects/${project.id}`)}
                        >
                          View Details →
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Support Section */}
          <section className="py-12 border-t border-slate-800">
            <div className="container mx-auto max-w-7xl px-4">
              <Card className="bg-slate-800/30 border-slate-700">
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 mb-4">
                    Contact our support team for assistance with your projects,
                    invoices, or any questions about your contracts.
                  </p>
                  <div className="flex gap-3">
                    <Button variant="outline">Email Support</Button>
                    <Button variant="outline">Schedule Call</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
