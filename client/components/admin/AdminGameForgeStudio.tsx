import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Zap,
  Users,
  Gamepad2,
  TrendingUp,
  Package,
  Target,
  Clock,
} from "lucide-react";

interface GameForgeProject {
  id: string;
  name: string;
  status: string;
  platform: string;
  team_size: number;
  budget: number;
  current_spend: number;
  target_release_date: string;
  actual_release_date: string;
}

interface TeamMember {
  id: string;
  user_id: string;
  role: string;
  position: string;
  contract_type: string;
  is_active: boolean;
}

interface GameForgeBuild {
  id: string;
  project_id: string;
  version: string;
  build_type: string;
  release_date: string;
  download_count: number;
}

interface MetricPoint {
  metric_date: string;
  velocity: number;
  team_size_avg: number;
  bugs_fixed: number;
  days_from_planned_to_release: number;
}

export default function AdminGameForgeStudio() {
  const [projects, setProjects] = useState<GameForgeProject[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [builds, setBuilds] = useState<GameForgeBuild[]>([]);
  const [metrics, setMetrics] = useState<MetricPoint[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGameForgeData();
  }, [selectedProject]);

  const fetchGameForgeData = async () => {
    try {
      setLoading(true);

      // Fetch projects
      const projectsRes = await fetch(`${API_BASE}/api/gameforge/projects`);
      if (projectsRes.ok) {
        const { data } = await projectsRes.json();
        setProjects(data || []);
        if (data && data.length > 0 && !selectedProject) {
          setSelectedProject(data[0].id);
        }
      }

      // Fetch team members
      const teamRes = await fetch(`${API_BASE}/api/gameforge/team`);
      if (teamRes.ok) {
        const { data } = await teamRes.json();
        setTeamMembers(data || []);
      }

      // Fetch builds and metrics if project selected
      if (selectedProject) {
        const buildsRes = await fetch(
          `/api/gameforge/builds?project_id=${selectedProject}`,
        );
        if (buildsRes.ok) {
          const { data } = await buildsRes.json();
          setBuilds(data || []);
        }

        const metricsRes = await fetch(
          `/api/gameforge/metrics?project_id=${selectedProject}`,
        );
        if (metricsRes.ok) {
          const { data } = await metricsRes.json();
          setMetrics(data || []);
        }
      }
    } catch (error) {
      console.error("Failed to fetch GameForge data:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentProject = projects.find((p) => p.id === selectedProject);

  // Calculate KPIs
  const totalTeamSize = teamMembers.filter((m) => m.is_active).length;
  const activeProjects = projects.filter(
    (p) => p.status === "in_development",
  ).length;
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const totalSpent = projects.reduce(
    (sum, p) => sum + (p.current_spend || 0),
    0,
  );
  const budgetRemaining = totalBudget - totalSpent;

  // Calculate shipping velocity
  const avgShippingVelocity =
    metrics.length > 0
      ? Math.round(
          metrics.reduce(
            (sum, m) => sum + (m.days_from_planned_to_release || 0),
            0,
          ) / metrics.length,
        )
      : 0;

  const onScheduleCount = projects.filter((p) => {
    if (!p.target_release_date || !p.actual_release_date) return false;
    const target = new Date(p.target_release_date);
    const actual = new Date(p.actual_release_date);
    return actual <= target;
  }).length;

  const statusColors: Record<string, string> = {
    planning: "bg-blue-500/20 text-blue-400",
    in_development: "bg-yellow-500/20 text-yellow-400",
    qa: "bg-orange-500/20 text-orange-400",
    released: "bg-green-500/20 text-green-400",
    hiatus: "bg-gray-500/20 text-gray-400",
    cancelled: "bg-red-500/20 text-red-400",
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-400">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              <Gamepad2 className="h-5 w-5 text-green-400" />
              Active Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {activeProjects}
            </div>
            <p className="text-sm text-slate-400 mt-1">in development</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-400" />
              Team Size
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{totalTeamSize}</div>
            <p className="text-sm text-slate-400 mt-1">active members</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-400" />
              Budget Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {Math.round((budgetRemaining / totalBudget) * 100)}%
            </div>
            <p className="text-sm text-slate-400 mt-1">remaining</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-400" />
              Ship Velocity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {avgShippingVelocity}d
            </div>
            <p className="text-sm text-slate-400 mt-1">from target</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-slate-800">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Budget Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-300">Total Budget</span>
                    <span className="text-white font-semibold">
                      ${totalBudget.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded h-2">
                    <div
                      className="bg-green-500 h-2 rounded transition-all"
                      style={{
                        width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-sm text-slate-400">
                    <span>Spent: ${totalSpent.toLocaleString()}</span>
                    <span>Remaining: ${budgetRemaining.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Release Schedule</CardTitle>
              <CardDescription className="text-slate-400">
                {onScheduleCount} of {projects.length} projects on schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {projects.slice(0, 5).map((project) => {
                  const isOnSchedule =
                    project.actual_release_date &&
                    new Date(project.actual_release_date) <=
                      new Date(project.target_release_date);

                  return (
                    <div key={project.id} className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="text-white font-medium">{project.name}</p>
                        <p className="text-xs text-slate-400">
                          {project.status}
                        </p>
                      </div>
                      <Badge
                        className={
                          isOnSchedule
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }
                      >
                        {isOnSchedule ? "On Time" : "Delayed"}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Game Projects</CardTitle>
              <CardDescription className="text-slate-400">
                {projects.length} total projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="p-3 bg-slate-800/50 rounded border border-slate-700 hover:border-slate-600 transition cursor-pointer"
                    onClick={() => setSelectedProject(project.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white">
                        {project.name}
                      </h3>
                      <Badge className={statusColors[project.status]}>
                        {project.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">Platform</p>
                        <p className="text-white font-medium">
                          {project.platform}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400">Team</p>
                        <p className="text-white font-medium">
                          {project.team_size} members
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400">Budget</p>
                        <p className="text-white font-medium">
                          ${project.budget?.toLocaleString() || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Studio Team</CardTitle>
              <CardDescription className="text-slate-400">
                {teamMembers.filter((m) => m.is_active).length} active members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-3 bg-slate-800/50 rounded border border-slate-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white">
                        {member.position || member.role}
                      </h3>
                      {!member.is_active && (
                        <Badge variant="secondary" className="bg-slate-700">
                          Inactive
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Badge className="bg-blue-500/20 text-blue-400">
                        {member.role}
                      </Badge>
                      <Badge className="bg-slate-700 text-slate-300">
                        {member.contract_type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Metrics Tab */}
        <TabsContent value="metrics" className="space-y-4">
          {selectedProject && metrics.length > 0 && (
            <>
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">
                    Shipping Velocity Trend
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Days from planned to actual release
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={metrics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="metric_date" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #475569",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="days_from_planned_to_release"
                        stroke="#f97316"
                        dot={{ fill: "#f97316" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">Team Velocity</CardTitle>
                  <CardDescription className="text-slate-400">
                    Points/tasks completed per period
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={metrics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="metric_date" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #475569",
                        }}
                      />
                      <Bar
                        dataKey="velocity"
                        fill="#8b5cf6"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}

          {selectedProject && metrics.length === 0 && (
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="py-12 text-center text-slate-400">
                No metrics recorded yet for this project
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
