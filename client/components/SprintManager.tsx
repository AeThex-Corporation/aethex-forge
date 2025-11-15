import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { aethexToast } from "@/lib/aethex-toast";
import { supabase } from "@/lib/supabase";
import { Plus, Users, Calendar, CheckCircle } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "";

interface Sprint {
  id: string;
  project_id: string;
  sprint_number: number;
  title: string;
  description?: string;
  goal?: string;
  phase: "planning" | "active" | "completed" | "cancelled";
  status: "pending" | "active" | "on_hold" | "completed";
  start_date?: string;
  end_date?: string;
  planned_velocity?: number;
  actual_velocity?: number;
  gameforge_projects?: { name: string };
  gameforge_sprint_members?: Array<{ user_id: string }>;
}

interface SprintManagerProps {
  projectId: string;
  projectName?: string;
  isProjectLead?: boolean;
  onSprintJoined?: (sprint: Sprint) => void;
}

export default function SprintManager({
  projectId,
  projectName,
  isProjectLead = false,
  onSprintJoined,
}: SprintManagerProps) {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [userSprints, setUserSprints] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal: "",
    startDate: "",
    endDate: "",
    plannedVelocity: "",
  });

  useEffect(() => {
    loadSprints();
  }, [projectId]);

  const loadSprints = async () => {
    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("No auth token");

      const res = await fetch(
        `${API_BASE}/api/gameforge/sprint?projectId=${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.ok) {
        const data = await res.json();
        setSprints(Array.isArray(data) ? data : []);

        // Track which sprints user is already in
        const userSprintIds = new Set(
          data
            .filter((sprint: Sprint) =>
              sprint.gameforge_sprint_members?.some(
                (m: any) => m.user_id === session?.user?.id,
              ),
            )
            .map((s: Sprint) => s.id),
        );
        setUserSprints(userSprintIds);
      }
    } catch (error) {
      console.error("Failed to load sprints:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSprint = async () => {
    if (!formData.title.trim()) {
      aethexToast.error({
        title: "Error",
        description: "Sprint title is required",
      });
      return;
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("No auth token");

      const res = await fetch(`${API_BASE}/api/gameforge/sprint`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          title: formData.title,
          description: formData.description,
          goal: formData.goal,
          startDate: formData.startDate,
          endDate: formData.endDate,
          plannedVelocity: formData.plannedVelocity
            ? parseInt(formData.plannedVelocity)
            : null,
        }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const newSprint = await res.json();
      setSprints([newSprint, ...sprints]);
      setCreateOpen(false);
      setFormData({
        title: "",
        description: "",
        goal: "",
        startDate: "",
        endDate: "",
        plannedVelocity: "",
      });

      aethexToast.success({
        title: "Sprint created",
        description: `Sprint ${newSprint.sprint_number}: ${newSprint.title}`,
      });
    } catch (error: any) {
      aethexToast.error({
        title: "Failed to create sprint",
        description: error.message,
      });
    }
  };

  const handleJoinSprint = async (sprintId: string) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("No auth token");

      const res = await fetch(`${API_BASE}/api/gameforge/sprint-join`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sprintId }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to join sprint");
      }

      // Add to user sprints set and reload
      setUserSprints((prev) => new Set([...prev, sprintId]));

      const sprint = sprints.find((s) => s.id === sprintId);
      if (sprint && onSprintJoined) {
        onSprintJoined(sprint);
      }

      aethexToast.success({
        title: "Joined sprint",
        description: "You've been added to the sprint",
      });
    } catch (error: any) {
      aethexToast.error({
        title: "Failed to join sprint",
        description: error.message,
      });
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "planning":
        return "bg-blue-500/20 text-blue-200 border-blue-500/40";
      case "active":
        return "bg-green-500/20 text-green-200 border-green-500/40";
      case "completed":
        return "bg-purple-500/20 text-purple-200 border-purple-500/40";
      default:
        return "bg-gray-500/20 text-gray-200 border-gray-500/40";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-600";
      case "completed":
        return "bg-blue-600";
      case "on_hold":
        return "bg-orange-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Sprint Button (Project Leads Only) */}
      {isProjectLead && (
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Plus className="h-4 w-4" />
              Create Sprint
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-950 border-purple-500/20">
            <DialogHeader>
              <DialogTitle>Create New Sprint</DialogTitle>
              <DialogDescription>
                Create a new sprint for {projectName || "this project"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="sprint-title">Sprint Title</Label>
                <Input
                  id="sprint-title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Sprint 1: Core Mechanics"
                  className="bg-slate-900 border-slate-700"
                />
              </div>

              <div>
                <Label htmlFor="sprint-goal">Goal (Optional)</Label>
                <Input
                  id="sprint-goal"
                  value={formData.goal}
                  onChange={(e) =>
                    setFormData({ ...formData, goal: e.target.value })
                  }
                  placeholder="e.g., Implement character movement and combat"
                  className="bg-slate-900 border-slate-700"
                />
              </div>

              <div>
                <Label htmlFor="sprint-description">Description</Label>
                <Textarea
                  id="sprint-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Sprint details and focus areas..."
                  className="bg-slate-900 border-slate-700 resize-none h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="bg-slate-900 border-slate-700"
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="bg-slate-900 border-slate-700"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="velocity">Planned Velocity (Optional)</Label>
                <Input
                  id="velocity"
                  type="number"
                  value={formData.plannedVelocity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      plannedVelocity: e.target.value,
                    })
                  }
                  placeholder="Story points or tasks"
                  className="bg-slate-900 border-slate-700"
                />
              </div>

              <Button
                onClick={handleCreateSprint}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Create Sprint
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Sprints List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8 text-slate-400">
            Loading sprints...
          </div>
        ) : sprints.length === 0 ? (
          <Card className="border-slate-700/50 bg-slate-900/30">
            <CardContent className="pt-6">
              <p className="text-slate-300 text-center">
                {isProjectLead
                  ? "No sprints yet. Create one to get started!"
                  : "No sprints available to join yet."}
              </p>
            </CardContent>
          </Card>
        ) : (
          sprints.map((sprint) => {
            const isMember = userSprints.has(sprint.id);
            const isActive = sprint.status === "active";

            return (
              <Card
                key={sprint.id}
                className="border-slate-700/50 bg-slate-900/50 hover:border-purple-500/40 transition"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          Sprint {sprint.sprint_number}: {sprint.title}
                        </h3>
                        <Badge className={`${getPhaseColor(sprint.phase)}`}>
                          {sprint.phase}
                        </Badge>
                        {isActive && (
                          <Badge className={getStatusColor(sprint.status)}>
                            {sprint.status}
                          </Badge>
                        )}
                      </div>

                      {sprint.goal && (
                        <p className="text-sm text-slate-400 mb-3">
                          Goal: {sprint.goal}
                        </p>
                      )}

                      {sprint.description && (
                        <p className="text-sm text-slate-300 mb-3">
                          {sprint.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                        {sprint.start_date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(sprint.start_date).toLocaleDateString()}
                          </div>
                        )}
                        {sprint.end_date && (
                          <div className="flex items-center gap-1">
                            → {new Date(sprint.end_date).toLocaleDateString()}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {sprint.gameforge_sprint_members?.length || 0} members
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {isMember ? (
                        <Badge className="bg-green-600 text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Joined
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleJoinSprint(sprint.id)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Join
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
