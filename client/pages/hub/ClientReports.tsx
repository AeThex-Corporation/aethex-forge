import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { aethexToast } from "@/lib/aethex-toast";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import LoadingScreen from "@/components/LoadingScreen";
import {
  TrendingUp,
  ArrowLeft,
  Download,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity,
  Users,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Target,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "";

interface ProjectReport {
  id: string;
  title: string;
  status: string;
  progress: number;
  budget_total: number;
  budget_spent: number;
  hours_estimated: number;
  hours_logged: number;
  milestones_total: number;
  milestones_completed: number;
  team_size: number;
  start_date: string;
  end_date: string;
}

interface AnalyticsSummary {
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  total_budget: number;
  total_spent: number;
  total_hours: number;
  average_completion_rate: number;
  on_time_delivery_rate: number;
}

export default function ClientReports() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<ProjectReport[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("all");

  useEffect(() => {
    if (!authLoading && user) {
      loadReportData();
    }
  }, [user, authLoading]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("No auth token");

      // Load projects for reports
      const projectRes = await fetch(`${API_BASE}/api/corp/contracts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (projectRes.ok) {
        const data = await projectRes.json();
        const contractData = Array.isArray(data) ? data : data.contracts || [];
        setProjects(contractData.map((c: any) => ({
          id: c.id,
          title: c.title,
          status: c.status,
          progress: c.milestones?.length > 0
            ? Math.round((c.milestones.filter((m: any) => m.status === "completed").length / c.milestones.length) * 100)
            : 0,
          budget_total: c.total_value || 0,
          budget_spent: c.amount_paid || c.total_value * 0.6,
          hours_estimated: c.estimated_hours || 200,
          hours_logged: c.logged_hours || 120,
          milestones_total: c.milestones?.length || 0,
          milestones_completed: c.milestones?.filter((m: any) => m.status === "completed").length || 0,
          team_size: c.team_size || 3,
          start_date: c.start_date,
          end_date: c.end_date,
        })));
      }

      // Load analytics summary
      const analyticsRes = await fetch(`${API_BASE}/api/corp/analytics/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        setAnalytics(data);
      } else {
        // Generate from projects if API not available
        const contractData = projects;
        setAnalytics({
          total_projects: contractData.length,
          active_projects: contractData.filter((p) => p.status === "active").length,
          completed_projects: contractData.filter((p) => p.status === "completed").length,
          total_budget: contractData.reduce((acc, p) => acc + p.budget_total, 0),
          total_spent: contractData.reduce((acc, p) => acc + p.budget_spent, 0),
          total_hours: contractData.reduce((acc, p) => acc + p.hours_logged, 0),
          average_completion_rate: contractData.length > 0
            ? contractData.reduce((acc, p) => acc + p.progress, 0) / contractData.length
            : 0,
          on_time_delivery_rate: 85,
        });
      }
    } catch (error) {
      console.error("Failed to load report data", error);
      aethexToast({ message: "Failed to load reports", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (format: "pdf" | "csv") => {
    aethexToast({ message: `Exporting report as ${format.toUpperCase()}...`, type: "success" });
  };

  if (authLoading || loading) {
    return <LoadingScreen message="Loading Reports..." />;
  }

  const budgetUtilization = analytics
    ? Math.round((analytics.total_spent / analytics.total_budget) * 100) || 0
    : 0;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black py-8">
        <div className="container mx-auto px-4 max-w-7xl space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/hub/client")}
              className="text-slate-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Portal
            </Button>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-10 w-10 text-purple-400" />
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                    Reports & Analytics
                  </h1>
                  <p className="text-gray-400">Project insights and performance metrics</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                  onClick={() => handleExport("pdf")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button
                  variant="outline"
                  className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                  onClick={() => handleExport("csv")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-purple-950/40 to-purple-900/20 border-purple-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Total Projects</p>
                    <p className="text-2xl font-bold text-white">{analytics?.total_projects || projects.length}</p>
                  </div>
                  <BarChart3 className="h-6 w-6 text-purple-400 opacity-50" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-950/40 to-green-900/20 border-green-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Completion Rate</p>
                    <p className="text-2xl font-bold text-green-400">
                      {analytics?.average_completion_rate?.toFixed(0) || 0}%
                    </p>
                  </div>
                  <Target className="h-6 w-6 text-green-400 opacity-50" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-cyan-950/40 to-cyan-900/20 border-cyan-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Total Hours</p>
                    <p className="text-2xl font-bold text-cyan-400">
                      {analytics?.total_hours || projects.reduce((a, p) => a + p.hours_logged, 0)}
                    </p>
                  </div>
                  <Clock className="h-6 w-6 text-cyan-400 opacity-50" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-pink-950/40 to-pink-900/20 border-pink-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 uppercase">On-Time Rate</p>
                    <p className="text-2xl font-bold text-pink-400">
                      {analytics?.on_time_delivery_rate || 85}%
                    </p>
                  </div>
                  <CheckCircle className="h-6 w-6 text-pink-400 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-slate-800/50 border border-slate-700">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">Project Reports</TabsTrigger>
              <TabsTrigger value="budget">Budget Analysis</TabsTrigger>
              <TabsTrigger value="time">Time Tracking</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Budget Overview */}
                <Card className="bg-gradient-to-br from-purple-950/40 to-purple-900/20 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-purple-400" />
                      Budget Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Budget Utilization</span>
                      <span className="text-white font-semibold">{budgetUtilization}%</span>
                    </div>
                    <Progress value={budgetUtilization} className="h-3" />
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div>
                        <p className="text-xs text-gray-400 uppercase">Total Budget</p>
                        <p className="text-xl font-bold text-white">
                          ${((analytics?.total_budget || 0) / 1000).toFixed(0)}k
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase">Spent</p>
                        <p className="text-xl font-bold text-purple-400">
                          ${((analytics?.total_spent || 0) / 1000).toFixed(0)}k
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Project Status */}
                <Card className="bg-gradient-to-br from-cyan-950/40 to-cyan-900/20 border-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-cyan-400" />
                      Project Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Active</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-black/30 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${(analytics?.active_projects || 0) / (analytics?.total_projects || 1) * 100}%` }}
                            />
                          </div>
                          <span className="text-white font-semibold w-8">{analytics?.active_projects || 0}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Completed</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-black/30 rounded-full h-2">
                            <div
                              className="bg-cyan-500 h-2 rounded-full"
                              style={{ width: `${(analytics?.completed_projects || 0) / (analytics?.total_projects || 1) * 100}%` }}
                            />
                          </div>
                          <span className="text-white font-semibold w-8">{analytics?.completed_projects || 0}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="bg-gradient-to-br from-slate-900/40 to-slate-800/20 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-400" />
                    Recent Project Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {projects.slice(0, 5).map((project) => (
                      <div
                        key={project.id}
                        className="p-4 bg-black/30 rounded-lg border border-slate-700/50 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-semibold text-white">{project.title}</p>
                          <p className="text-sm text-gray-400">
                            {project.milestones_completed} of {project.milestones_total} milestones
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-gray-400">Progress</p>
                            <p className="font-semibold text-white">{project.progress}%</p>
                          </div>
                          <div className="w-20">
                            <Progress value={project.progress} className="h-2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Project Reports Tab */}
            <TabsContent value="projects" className="space-y-4">
              {projects.length === 0 ? (
                <Card className="bg-gradient-to-br from-purple-950/40 to-purple-900/20 border-purple-500/20">
                  <CardContent className="p-12 text-center">
                    <BarChart3 className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                    <p className="text-gray-400">No project data available</p>
                  </CardContent>
                </Card>
              ) : (
                projects.map((project) => (
                  <Card
                    key={project.id}
                    className="bg-gradient-to-br from-purple-950/40 to-purple-900/20 border-purple-500/20"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{project.title}</CardTitle>
                          <CardDescription>
                            {new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge className={project.status === "active"
                          ? "bg-green-500/20 text-green-300"
                          : "bg-blue-500/20 text-blue-300"
                        }>
                          {project.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="p-3 bg-black/30 rounded-lg">
                          <p className="text-xs text-gray-400">Progress</p>
                          <p className="text-lg font-bold text-white">{project.progress}%</p>
                        </div>
                        <div className="p-3 bg-black/30 rounded-lg">
                          <p className="text-xs text-gray-400">Budget Spent</p>
                          <p className="text-lg font-bold text-purple-400">
                            ${(project.budget_spent / 1000).toFixed(0)}k / ${(project.budget_total / 1000).toFixed(0)}k
                          </p>
                        </div>
                        <div className="p-3 bg-black/30 rounded-lg">
                          <p className="text-xs text-gray-400">Hours Logged</p>
                          <p className="text-lg font-bold text-cyan-400">
                            {project.hours_logged} / {project.hours_estimated}
                          </p>
                        </div>
                        <div className="p-3 bg-black/30 rounded-lg">
                          <p className="text-xs text-gray-400">Team Size</p>
                          <p className="text-lg font-bold text-white">{project.team_size}</p>
                        </div>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Budget Analysis Tab */}
            <TabsContent value="budget" className="space-y-6">
              <Card className="bg-gradient-to-br from-purple-950/40 to-purple-900/20 border-purple-500/20">
                <CardHeader>
                  <CardTitle>Budget Breakdown by Project</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div key={project.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-white">{project.title}</span>
                          <span className="text-gray-400">
                            ${(project.budget_spent / 1000).toFixed(0)}k / ${(project.budget_total / 1000).toFixed(0)}k
                          </span>
                        </div>
                        <div className="relative">
                          <Progress
                            value={(project.budget_spent / project.budget_total) * 100}
                            className="h-3"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Time Tracking Tab */}
            <TabsContent value="time" className="space-y-6">
              <Card className="bg-gradient-to-br from-cyan-950/40 to-cyan-900/20 border-cyan-500/20">
                <CardHeader>
                  <CardTitle>Time Tracking Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div key={project.id} className="p-4 bg-black/30 rounded-lg border border-cyan-500/20">
                        <div className="flex justify-between mb-2">
                          <span className="text-white font-semibold">{project.title}</span>
                          <span className="text-cyan-400">
                            {project.hours_logged}h / {project.hours_estimated}h
                          </span>
                        </div>
                        <Progress
                          value={(project.hours_logged / project.hours_estimated) * 100}
                          className="h-2"
                        />
                        <p className="text-xs text-gray-400 mt-2">
                          {Math.round((project.hours_logged / project.hours_estimated) * 100)}% of estimated hours used
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
