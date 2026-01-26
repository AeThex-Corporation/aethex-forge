import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  TrendingUp,
  CheckCircle,
  Loader2,
  Plus,
  Calendar,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { aethexToast } from "@/components/ui/aethex-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  due_date?: string;
  completed_at?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  start_date: string;
  end_date?: string;
  lead?: {
    full_name: string;
    avatar_url?: string;
  };
  tasks: Task[];
  task_stats: {
    total: number;
    done: number;
  };
}

interface Stats {
  total: number;
  active: number;
  completed: number;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-500/20 text-green-300 border-green-500/30";
    case "completed":
      return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    case "on_hold":
      return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    default:
      return "bg-slate-500/20 text-slate-300 border-slate-500/30";
  }
};

const getTaskStatusColor = (status: string) => {
  switch (status) {
    case "done":
      return "bg-green-500/20 text-green-300";
    case "in_progress":
      return "bg-blue-500/20 text-blue-300";
    case "todo":
      return "bg-slate-500/20 text-slate-300";
    default:
      return "bg-slate-500/20 text-slate-300";
  }
};

export default function StaffProjectTracking() {
  const { session } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, completed: 0 });
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [taskDialog, setTaskDialog] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "medium", due_date: "" });

  useEffect(() => {
    if (session?.access_token) {
      fetchProjects();
    }
  }, [session?.access_token]);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/staff/projects", {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setProjects(data.projects || []);
        setStats(data.stats || { total: 0, active: 0, completed: 0 });
      }
    } catch (err) {
      aethexToast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: string, status: string) => {
    try {
      const res = await fetch("/api/staff/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ action: "update_task", task_id: taskId, status }),
      });
      if (res.ok) {
        aethexToast.success("Task updated");
        fetchProjects();
      }
    } catch (err) {
      aethexToast.error("Failed to update task");
    }
  };

  const createTask = async () => {
    if (!taskDialog || !newTask.title) return;
    try {
      const res = await fetch("/api/staff/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          action: "create_task",
          project_id: taskDialog,
          ...newTask,
        }),
      });
      if (res.ok) {
        aethexToast.success("Task created");
        setTaskDialog(null);
        setNewTask({ title: "", description: "", priority: "medium", due_date: "" });
        fetchProjects();
      }
    } catch (err) {
      aethexToast.error("Failed to create task");
    }
  };

  const avgProgress = projects.length > 0
    ? Math.round(
        projects.reduce((sum, p) => sum + (p.task_stats.total > 0 ? (p.task_stats.done / p.task_stats.total) * 100 : 0), 0) / projects.length
      )
    : 0;

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title="Project Tracking"
        description="AeThex projects, tasks, and roadmap"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="container mx-auto max-w-6xl px-4 py-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-indigo-500/20 border border-indigo-500/30">
                <Target className="h-6 w-6 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-indigo-100">
                  Project Tracking
                </h1>
                <p className="text-indigo-200/70">
                  Your projects, tasks, and progress
                </p>
              </div>
            </div>

            {/* Summary */}
            <div className="grid md:grid-cols-3 gap-4 mb-12">
              <Card className="bg-indigo-950/30 border-indigo-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-indigo-200/70">My Projects</p>
                      <p className="text-3xl font-bold text-indigo-100">
                        {stats.total}
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-indigo-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-indigo-950/30 border-indigo-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-indigo-200/70">Avg Progress</p>
                      <p className="text-3xl font-bold text-indigo-100">
                        {avgProgress}%
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-indigo-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-indigo-950/30 border-indigo-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-indigo-200/70">Active</p>
                      <p className="text-3xl font-bold text-indigo-100">
                        {stats.active}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-indigo-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Projects */}
            <div className="space-y-6">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="bg-slate-800/50 border-slate-700/50 hover:border-indigo-500/50 transition-all"
                >
                  <CardHeader
                    className="cursor-pointer"
                    onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-indigo-100">
                          {project.name}
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                          {project.description}
                        </CardDescription>
                      </div>
                      <Badge className={`border ${getStatusColor(project.status)}`}>
                        {project.status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Tasks Progress</span>
                        <span className="text-indigo-300 font-semibold">
                          {project.task_stats.done}/{project.task_stats.total}
                        </span>
                      </div>
                      <Progress
                        value={project.task_stats.total > 0 ? (project.task_stats.done / project.task_stats.total) * 100 : 0}
                        className="h-2"
                      />
                    </div>
                    <div className="flex gap-4 flex-wrap text-sm">
                      {project.lead && (
                        <div>
                          <p className="text-xs text-slate-500">Lead</p>
                          <p className="text-indigo-300">{project.lead.full_name}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-slate-500">Start Date</p>
                        <p className="text-indigo-300">{new Date(project.start_date).toLocaleDateString()}</p>
                      </div>
                      {project.end_date && (
                        <div>
                          <p className="text-xs text-slate-500">End Date</p>
                          <p className="text-indigo-300">{new Date(project.end_date).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>

                    {selectedProject === project.id && (
                      <div className="pt-4 border-t border-slate-700">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-indigo-100">Tasks</h4>
                          <Button
                            size="sm"
                            className="bg-indigo-600 hover:bg-indigo-700"
                            onClick={() => setTaskDialog(project.id)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Task
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {project.tasks.map((task) => (
                            <div
                              key={task.id}
                              className="flex items-center justify-between p-3 bg-slate-700/30 rounded"
                            >
                              <div className="flex-1">
                                <p className="text-slate-200">{task.title}</p>
                                {task.due_date && (
                                  <p className="text-xs text-slate-500 flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Due: {new Date(task.due_date).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                              <Select
                                value={task.status}
                                onValueChange={(value) => updateTaskStatus(task.id, value)}
                              >
                                <SelectTrigger className={`w-32 ${getTaskStatusColor(task.status)}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="todo">To Do</SelectItem>
                                  <SelectItem value="in_progress">In Progress</SelectItem>
                                  <SelectItem value="done">Done</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          ))}
                          {project.tasks.length === 0 && (
                            <p className="text-slate-500 text-sm text-center py-4">No tasks yet</p>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {projects.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-400">No projects found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Task Dialog */}
      <Dialog open={!!taskDialog} onOpenChange={() => setTaskDialog(null)}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-indigo-100">Add New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="bg-slate-700 border-slate-600 text-slate-100"
            />
            <Textarea
              placeholder="Description (optional)"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="bg-slate-700 border-slate-600 text-slate-100"
            />
            <div className="grid grid-cols-2 gap-4">
              <Select
                value={newTask.priority}
                onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={newTask.due_date}
                onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                className="bg-slate-700 border-slate-600 text-slate-100"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setTaskDialog(null)}>
                Cancel
              </Button>
              <Button
                className="bg-indigo-600 hover:bg-indigo-700"
                onClick={createTask}
              >
                Create Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
