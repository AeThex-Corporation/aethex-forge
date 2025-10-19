import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { aethexCollabService } from "@/lib/aethex-collab-service";
import LoadingScreen from "@/components/LoadingScreen";
import SEO from "@/components/SEO";
import { supabase } from "@/lib/supabase";

const columns: {
  key: "todo" | "doing" | "done" | "blocked";
  title: string;
  hint: string;
}[] = [
  { key: "todo", title: "To do", hint: "Planned" },
  { key: "doing", title: "In progress", hint: "Active" },
  { key: "done", title: "Done", hint: "Completed" },
  { key: "blocked", title: "Blocked", hint: "Needs attention" },
];

export default function ProjectBoard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);
  const [projectName, setProjectName] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [assigneeId, setAssigneeId] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [q, setQ] = useState<string>("");
  const [filterAssignee, setFilterAssignee] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  useEffect(() => {
    if (!loading && !user) navigate("/login", { replace: true });
  }, [loading, user, navigate]);

  const loadProject = async () => {
    if (!projectId) return;
    try {
      const { data } = await supabase
        .from("projects")
        .select("id,name,slug")
        .eq("id", projectId)
        .maybeSingle();
      setProjectName((data as any)?.name || "");
    } catch {}
  };

  const load = async () => {
    if (!projectId) return;
    setIsLoading(true);
    try {
      const rows = await aethexCollabService.listProjectTasks(projectId);
      setTasks(rows);
      const m = await aethexCollabService.listProjectMembers(projectId);
      setMembers(m);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
    load();
  }, [projectId]);

  const grouped = useMemo(() => {
    const map: Record<string, any[]> = {
      todo: [],
      doing: [],
      done: [],
      blocked: [],
    };
    const normalized = tasks.filter((t) => {
      if (
        q &&
        !String(t.title || "")
          .toLowerCase()
          .includes(q.toLowerCase()) &&
        !String(t.description || "")
          .toLowerCase()
          .includes(q.toLowerCase())
      ) {
        return false;
      }
      if (filterAssignee && String(t.assignee_id || "") !== filterAssignee)
        return false;
      if (filterStatus && String(t.status || "") !== filterStatus) return false;
      return true;
    });
    for (const t of normalized) {
      map[t.status || "todo"].push(t);
    }
    return map;
  }, [tasks, q, filterAssignee, filterStatus]);

  const handleCreate = async () => {
    if (!user?.id || !projectId) return;
    if (!title.trim()) return;
    setCreating(true);
    try {
      await aethexCollabService.createTask(
        projectId,
        title.trim(),
        description.trim() || null,
        assigneeId || null,
        dueDate || null,
      );
      setTitle("");
      setDescription("");
      setAssigneeId("");
      setDueDate("");
      await load();
    } finally {
      setCreating(false);
    }
  };

  const move = async (
    taskId: string,
    status: "todo" | "doing" | "done" | "blocked",
  ) => {
    await aethexCollabService.updateTaskStatus(taskId, status);
    await load();
  };

  if (loading || isLoading)
    return (
      <LoadingScreen message="Loading project..." showProgress duration={800} />
    );
  if (!user) return null;

  return (
    <>
      <SEO
        pageTitle={
          projectName ? `${projectName} • Project Board` : "Project Board"
        }
        description="Kanban task tracking for your AeThex project: statuses, assignees, and due dates."
        canonical={
          typeof window !== "undefined"
            ? window.location.href
            : (undefined as any)
        }
      />
      <Layout>
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(110,141,255,0.12),transparent_60%)] py-10">
          <div className="mx-auto w-full max-w-6xl px-4 lg:px-6 space-y-6">
            <section className="rounded-3xl border border-border/40 bg-background/80 p-6 shadow-2xl backdrop-blur">
              <Breadcrumb className="mb-2">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/projects">Projects</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {projectName ? (
                      <BreadcrumbLink asChild>
                        <Link to={`/projects/${projectId}`}>{projectName}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to="#">Project</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Board</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <h1 className="text-3xl font-semibold text-foreground">
                {projectName || "Project Board"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Track tasks by status. Filters, assignees, and due dates
                enabled.
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-4">
                <Input
                  placeholder="Search tasks…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
                <Select
                  value={filterAssignee}
                  onValueChange={(v) =>
                    setFilterAssignee(v === "__all__" ? "" : v)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All assignees</SelectItem>
                    {members.map((m) => (
                      <SelectItem key={m.user_id} value={m.user_id}>
                        {m.user?.full_name || m.user?.username || m.user_id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={filterStatus}
                  onValueChange={(v) =>
                    setFilterStatus(v === "__all__" ? "" : v)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All statuses</SelectItem>
                    <SelectItem value="todo">To do</SelectItem>
                    <SelectItem value="doing">In progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setQ("");
                      setFilterAssignee("");
                      setFilterStatus("");
                    }}
                  >
                    Reset filters
                  </Button>
                </div>
              </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
              {columns.map((col) => (
                <Card
                  key={col.key}
                  className="rounded-3xl border-border/40 bg-background/70 shadow-xl backdrop-blur-lg"
                >
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      {col.title}
                      <Badge
                        variant="outline"
                        className="border-border/50 text-xs"
                      >
                        {grouped[col.key].length}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{col.hint}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {grouped[col.key].length === 0 ? (
                      <p className="text-sm text-muted-foreground">No tasks.</p>
                    ) : (
                      grouped[col.key].map((t) => (
                        <div
                          key={t.id}
                          className="rounded-2xl border border-border/30 bg-background/60 p-3"
                        >
                          <div className="font-medium text-foreground">
                            {t.title}
                          </div>
                          {t.description ? (
                            <p className="text-xs text-muted-foreground mt-1">
                              {t.description}
                            </p>
                          ) : null}
                          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                              {t.assignee ? (
                                <span className="inline-flex items-center gap-1">
                                  <span
                                    className="inline-block h-4 w-4 rounded-full bg-cover bg-center"
                                    style={{
                                      backgroundImage: `url(${t.assignee.avatar_url || ""})`,
                                    }}
                                  />
                                  {t.assignee.full_name ||
                                    t.assignee.username ||
                                    "Assignee"}
                                </span>
                              ) : (
                                <span>Unassigned</span>
                              )}
                              {t.due_date ? (
                                <span>
                                  • Due{" "}
                                  {new Date(t.due_date).toLocaleDateString()}
                                </span>
                              ) : null}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {columns.map((k) => (
                                <Button
                                  key={`${t.id}-${k.key}`}
                                  size="xs"
                                  variant="outline"
                                  onClick={() => move(t.id, k.key)}
                                >
                                  {k.title}
                                </Button>
                              ))}
                              <Button
                                size="xs"
                                variant="ghost"
                                onClick={async () => {
                                  if (!user?.id) return;
                                  await aethexCollabService.updateTask(t.id, {
                                    assignee_id: user.id,
                                  });
                                  await load();
                                }}
                              >
                                Assign me
                              </Button>
                              <Button
                                size="xs"
                                variant="destructive"
                                onClick={async () => {
                                  await aethexCollabService.deleteTask(t.id);
                                  await load();
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="rounded-3xl border-border/40 bg-background/70 shadow-xl backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-lg">Add task</CardTitle>
                <CardDescription>
                  Keep titles concise; details optional.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  placeholder="Task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <div className="grid gap-3 md:grid-cols-3">
                  <Select
                    value={assigneeId}
                    onValueChange={(v) =>
                      setAssigneeId(v === "__none__" ? "" : v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Assign to…" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">Unassigned</SelectItem>
                      {members.map((m) => (
                        <SelectItem key={m.user_id} value={m.user_id}>
                          {m.user?.full_name || m.user?.username || m.user_id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleCreate}
                      disabled={creating || !title.trim()}
                      className="rounded-full bg-gradient-to-r from-aethex-500 to-neon-blue text-white"
                    >
                      {creating ? "Creating..." : "Create task"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    </>
  );
}
