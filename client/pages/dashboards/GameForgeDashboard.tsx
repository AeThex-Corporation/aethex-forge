import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useArmTheme } from "@/contexts/ArmThemeContext";
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
import LoadingScreen from "@/components/LoadingScreen";
import {
  Gamepad2,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Rocket,
  Send,
  Home,
} from "lucide-react";
import { SprintWidgetComponent } from "@/components/SprintWidget";
import { TeamWidget } from "@/components/TeamWidget";
import SprintManager from "@/components/SprintManager";

const API_BASE = import.meta.env.VITE_API_BASE || "";

export default function GameForgeDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { theme } = useArmTheme();
  const [activeTab, setActiveTab] = useState("overview");
  const [sprint, setSprint] = useState<any>(null);
  const [team, setTeam] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [isProjectLead, setIsProjectLead] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      loadDashboardData();
      const interval = setInterval(() => setActiveTab(activeTab), 1000);
      return () => clearInterval(interval);
    }
  }, [user, authLoading]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("No auth token");

      try {
        const sprintRes = await fetch(`${API_BASE}/api/gameforge/sprint`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (
          sprintRes.ok &&
          sprintRes.headers.get("content-type")?.includes("application/json")
        ) {
          const data = await sprintRes.json();
          setSprint(data);
        }
      } catch (err) {
        // Silently ignore API errors
      }

      try {
        const teamRes = await fetch(`${API_BASE}/api/gameforge/team`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (
          teamRes.ok &&
          teamRes.headers.get("content-type")?.includes("application/json")
        ) {
          const data = await teamRes.json();
          setTeam(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        // Silently ignore API errors
      }

      try {
        const tasksRes = await fetch(`${API_BASE}/api/gameforge/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (
          tasksRes.ok &&
          tasksRes.headers.get("content-type")?.includes("application/json")
        ) {
          const data = await tasksRes.json();
          setTasks(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        // Silently ignore API errors
      }

      try {
        const projectsRes = await fetch(`${API_BASE}/api/gameforge/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (
          projectsRes.ok &&
          projectsRes.headers.get("content-type")?.includes("application/json")
        ) {
          const data = await projectsRes.json();
          setProjects(Array.isArray(data) ? data : []);
          // Check if user is a project lead
          if (data && data.some((p: any) => p.lead_id === user?.id)) {
            setIsProjectLead(true);
          }
        }
      } catch (err) {
        // Silently ignore API errors
      }
    } catch (error) {
      // Silently ignore errors
    } finally {
      setLoading(false);
    }
  };

  const timeRemaining = useMemo(() => {
    if (!sprint?.deadline) return null;
    const now = new Date();
    const deadline = new Date(sprint.deadline);
    const diff = deadline.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  }, [sprint]);

  const tasksByStatus = {
    todo: tasks.filter((t) => t.status === "todo"),
    inprogress: tasks.filter((t) => t.status === "in_progress"),
    done: tasks.filter((t) => t.status === "done"),
  };

  if (authLoading || loading) {
    return <LoadingScreen message="Loading GAMEFORGE..." />;
  }

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-black via-green-950/30 to-black flex items-center justify-center px-4">
          <div className="max-w-md text-center space-y-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
              GAMEFORGE Studio
            </h1>
            <p className="text-gray-400">Build, collaborate, ship games</p>
            <Button
              onClick={() => navigate("/login")}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg py-6"
            >
              Sign In
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div
        className={`min-h-screen bg-gradient-to-b from-black to-black py-8 ${theme.fontClass}`}
        style={{ backgroundImage: theme.wallpaperPattern }}
      >
        <div className="container mx-auto px-4 max-w-7xl space-y-8">
          {sprint ? (
            <>
              {/* Active Sprint Header */}
              <div className="space-y-4 animate-slide-down">
                <h1
                  className={`text-5xl md:text-6xl font-bold bg-gradient-to-r ${theme.accentColor} bg-clip-text text-transparent`}
                >
                  Mission Control
                </h1>
                <p className="text-gray-400 text-lg">Project: {sprint.title}</p>

                {/* Countdown Timer */}
                {timeRemaining && (
                  <Card className="bg-gradient-to-br from-green-950/40 to-emerald-950/40 border-green-500/30">
                    <CardContent className="p-6">
                      <div className="text-center space-y-4">
                        <p className="text-gray-400 text-sm">
                          Time Remaining in Sprint
                        </p>
                        <div className="grid grid-cols-4 gap-4">
                          <div className="text-center">
                            <p className="text-3xl font-bold text-green-400">
                              {timeRemaining.days}
                            </p>
                            <p className="text-xs text-gray-400">Days</p>
                          </div>
                          <div className="text-center">
                            <p className="text-3xl font-bold text-green-400">
                              {String(timeRemaining.hours).padStart(2, "0")}
                            </p>
                            <p className="text-xs text-gray-400">Hours</p>
                          </div>
                          <div className="text-center">
                            <p className="text-3xl font-bold text-green-400">
                              {String(timeRemaining.minutes).padStart(2, "0")}
                            </p>
                            <p className="text-xs text-gray-400">Minutes</p>
                          </div>
                          <div className="text-center">
                            <p className="text-3xl font-bold text-green-400">
                              {String(timeRemaining.seconds).padStart(2, "0")}
                            </p>
                            <p className="text-xs text-gray-400">Seconds</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Tabs */}
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList
                  className="grid w-full grid-cols-5 bg-green-950/30 border border-green-500/20 p-1"
                  style={{ fontFamily: theme.fontFamily }}
                >
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="scope">Scope</TabsTrigger>
                  <TabsTrigger value="team">Team</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="sprints">Sprints</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent
                  value="overview"
                  className="space-y-6 animate-fade-in"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-green-950/40 to-green-900/20 border-green-500/20">
                      <CardContent className="p-6 space-y-2">
                        <p className="text-sm text-gray-400">Sprint Phase</p>
                        <p className="text-3xl font-bold text-white">
                          {sprint.phase}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-emerald-950/40 to-emerald-900/20 border-emerald-500/20">
                      <CardContent className="p-6 space-y-2">
                        <p className="text-sm text-gray-400">Team Size</p>
                        <p className="text-3xl font-bold text-white">
                          {team.length}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-teal-950/40 to-teal-900/20 border-teal-500/20">
                      <CardContent className="p-6 space-y-2">
                        <p className="text-sm text-gray-400">Tasks Completed</p>
                        <p className="text-3xl font-bold text-white">
                          {tasksByStatus.done.length}/{tasks.length}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Submit Build CTA */}
                  <Card className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-500/40">
                    <CardContent className="p-8 text-center space-y-4">
                      <h3
                        className="text-2xl font-bold text-white"
                        style={{ fontFamily: theme.fontFamily }}
                      >
                        Ready to Ship?
                      </h3>
                      <p className="text-gray-300">
                        Submit your final build for evaluation
                      </p>
                      <Button
                        onClick={() => navigate("/gameforge/submit-build")}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg px-8"
                        style={{ fontFamily: theme.fontFamily }}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Submit Final Build to aethex.fun
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Scope Tab */}
                <TabsContent
                  value="scope"
                  className="space-y-4 animate-fade-in"
                >
                  <Card className="bg-gradient-to-br from-green-950/40 to-green-900/20 border-green-500/20">
                    <CardHeader>
                      <CardTitle>The Scope Anchor (KND-001)</CardTitle>
                      <CardDescription>
                        Your north star - prevent feature creep
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="p-6 bg-black/30 rounded-lg border border-green-500/20">
                        <p className="text-white leading-relaxed">
                          {sprint.gdd || "Game Design Document not available"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Team Tab */}
                <TabsContent value="team" className="space-y-4 animate-fade-in">
                  <TeamWidget
                    members={team.map((m: any) => ({
                      id: m.id,
                      name: m.full_name,
                      role: m.role_title,
                      type: m.role === "mentor" ? "lead" : "member",
                      avatar: m.avatar_url,
                    }))}
                    title="My Sprint Team"
                    description="Forge Master + Mentees"
                    accentColor="green"
                    onMemberClick={(memberId) => {
                      const member = team.find((m: any) => m.id === memberId);
                      if (member?.username) {
                        navigate(`/passport/${member.username}`);
                      }
                    }}
                  />
                </TabsContent>

                {/* Tasks Tab - Kanban */}
                <TabsContent
                  value="tasks"
                  className="space-y-4 animate-fade-in"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* To Do */}
                    <Card className="bg-gradient-to-br from-red-950/40 to-red-900/20 border-red-500/20">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          To Do ({tasksByStatus.todo.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {tasksByStatus.todo.length === 0 ? (
                          <p className="text-center text-gray-400 text-sm py-4">
                            No tasks
                          </p>
                        ) : (
                          tasksByStatus.todo.map((task: any) => (
                            <div
                              key={task.id}
                              className="p-3 bg-black/30 rounded-lg border border-red-500/20 hover:border-red-500/40 transition"
                            >
                              <p className="font-semibold text-white text-sm">
                                {task.title}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {task.assigned_to?.full_name}
                              </p>
                            </div>
                          ))
                        )}
                      </CardContent>
                    </Card>

                    {/* In Progress */}
                    <Card className="bg-gradient-to-br from-yellow-950/40 to-yellow-900/20 border-yellow-500/20">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          In Progress ({tasksByStatus.inprogress.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {tasksByStatus.inprogress.length === 0 ? (
                          <p className="text-center text-gray-400 text-sm py-4">
                            No tasks
                          </p>
                        ) : (
                          tasksByStatus.inprogress.map((task: any) => (
                            <div
                              key={task.id}
                              className="p-3 bg-black/30 rounded-lg border border-yellow-500/20 hover:border-yellow-500/40 transition"
                            >
                              <p className="font-semibold text-white text-sm">
                                {task.title}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {task.assigned_to?.full_name}
                              </p>
                            </div>
                          ))
                        )}
                      </CardContent>
                    </Card>

                    {/* Done */}
                    <Card className="bg-gradient-to-br from-green-950/40 to-green-900/20 border-green-500/20">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Done ({tasksByStatus.done.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {tasksByStatus.done.length === 0 ? (
                          <p className="text-center text-gray-400 text-sm py-4">
                            No tasks
                          </p>
                        ) : (
                          tasksByStatus.done.map((task: any) => (
                            <div
                              key={task.id}
                              className="p-3 bg-black/30 rounded-lg border border-green-500/20 hover:border-green-500/40 transition"
                            >
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <div className="flex-1">
                                  <p className="font-semibold text-white text-sm line-through">
                                    {task.title}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {task.assigned_to?.full_name}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Sprints Tab */}
                <TabsContent
                  value="sprints"
                  className="space-y-4 animate-fade-in"
                >
                  {sprint && sprint.project_id ? (
                    <SprintManager
                      projectId={sprint.project_id}
                      projectName={sprint.gameforge_projects?.name}
                      isProjectLead={isProjectLead}
                      onSprintJoined={() => loadDashboardData()}
                    />
                  ) : (
                    <Card className="bg-gradient-to-br from-green-950/40 to-green-900/20 border-green-500/20">
                      <CardContent className="p-6 text-center">
                        <p className="text-gray-400">
                          Join a sprint to manage sprints
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <Card className="bg-gradient-to-br from-green-950/40 to-green-900/20 border-green-500/20">
              <CardContent className="p-12 text-center space-y-6">
                <Gamepad2 className="h-12 w-12 mx-auto text-green-500 opacity-50" />
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white">
                    Welcome to GAMEFORGE
                  </h2>
                  <p className="text-gray-400">
                    No active sprint. Join or create one to get started!
                  </p>
                </div>
                <div className="space-y-3">
                  {projects.length > 0 && (
                    <SprintManager
                      projectId={projects[0].id}
                      projectName={projects[0].name}
                      isProjectLead={projects[0].lead_id === user?.id}
                      onSprintJoined={() => loadDashboardData()}
                    />
                  )}
                  <Button onClick={() => navigate("/gameforge")}>
                    Browse GAMEFORGE
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
