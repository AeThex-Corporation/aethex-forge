import { supabase } from "@/lib/supabase";

export type TeamVisibility = "public" | "private";
export type MembershipRole = "owner" | "admin" | "member";
export type ProjectRole = "owner" | "manager" | "contributor" | "viewer";
export type TaskStatus = "todo" | "doing" | "done" | "blocked";

export const aethexCollabService = {
  // Teams
  async listMyTeams(userId: string) {
    const { data, error } = await supabase
      .from("team_memberships")
      .select("team_id, teams:team_id ( id, name, slug, description, visibility, created_at )")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) return [] as any[];
    return (data || []) as any[];
  },

  async createTeam(ownerId: string, name: string, description?: string | null, visibility: TeamVisibility = "private") {
    const { data, error } = await supabase
      .from("teams")
      .insert({ owner_id: ownerId, name, description: description || null, visibility })
      .select()
      .single();
    if (error) throw new Error(error.message || "Unable to create team");

    const team = data as any;
    await supabase
      .from("team_memberships")
      .insert({ team_id: team.id, user_id: ownerId, role: "owner" as const });
    return team;
  },

  async addTeamMember(teamId: string, userId: string, role: MembershipRole = "member") {
    const { error } = await supabase
      .from("team_memberships")
      .insert({ team_id: teamId, user_id: userId, role });
    if (error) throw new Error(error.message || "Unable to add member");
  },

  // Projects
  async addProjectMember(projectId: string, userId: string, role: ProjectRole = "contributor") {
    const { error } = await supabase
      .from("project_members")
      .insert({ project_id: projectId, user_id: userId, role });
    if (error) throw new Error(error.message || "Unable to add project member");
  },

  async listProjectMembers(projectId: string) {
    const { data, error } = await supabase
      .from("project_members")
      .select("user_id, role, user:user_id ( id, full_name, username, avatar_url )")
      .eq("project_id", projectId);
    if (error) return [] as any[];
    return (data || []) as any[];
  },

  // Tasks
  async listProjectTasks(projectId: string) {
    const { data, error } = await supabase
      .from("project_tasks")
      .select("*, assignee:assignee_id ( id, full_name, username, avatar_url )")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });
    if (error) return [] as any[];
    return (data || []) as any[];
  },

  async createTask(projectId: string, title: string, description?: string | null, assigneeId?: string | null, dueDate?: string | null) {
    const { data, error } = await supabase
      .from("project_tasks")
      .insert({ project_id: projectId, title, description: description || null, assignee_id: assigneeId || null, due_date: dueDate || null })
      .select()
      .single();
    if (error) throw new Error(error.message || "Unable to create task");
    return data as any;
  },

  async updateTaskStatus(taskId: string, status: TaskStatus) {
    const { error } = await supabase
      .from("project_tasks")
      .update({ status })
      .eq("id", taskId);
    if (error) throw new Error(error.message || "Unable to update task");
  },

  // Activity bus publish
  async publishActivity(params: {
    actor_id: string;
    verb: string;
    object_type: string;
    object_id?: string | null;
    target_user_ids?: string[] | null;
    target_team_id?: string | null;
    target_project_id?: string | null;
    metadata?: any;
  }) {
    const resp = await fetch("/api/activity/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (!resp.ok) throw new Error(await resp.text());
    return await resp.json();
  },
};
