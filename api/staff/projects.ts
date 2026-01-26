import { supabase } from "../_supabase.js";

export default async (req: Request) => {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }

  const { data: userData } = await supabase.auth.getUser(token);
  if (!userData.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }

  const userId = userData.user.id;

  try {
    if (req.method === "GET") {
      // Get projects where user is lead or team member
      const { data: projects, error } = await supabase
        .from("staff_projects")
        .select(`
          *,
          lead:profiles!staff_projects_lead_id_fkey(full_name, avatar_url)
        `)
        .or(`lead_id.eq.${userId},team_members.cs.{${userId}}`)
        .order("updated_at", { ascending: false });

      if (error) throw error;

      // Get tasks for each project
      const projectIds = projects?.map(p => p.id) || [];
      const { data: tasks } = await supabase
        .from("staff_project_tasks")
        .select("*")
        .in("project_id", projectIds);

      // Attach tasks to projects
      const projectsWithTasks = projects?.map(project => ({
        ...project,
        tasks: tasks?.filter(t => t.project_id === project.id) || [],
        task_stats: {
          total: tasks?.filter(t => t.project_id === project.id).length || 0,
          done: tasks?.filter(t => t.project_id === project.id && t.status === "done").length || 0
        }
      }));

      const stats = {
        total: projects?.length || 0,
        active: projects?.filter(p => p.status === "active").length || 0,
        completed: projects?.filter(p => p.status === "completed").length || 0
      };

      return new Response(JSON.stringify({ projects: projectsWithTasks || [], stats }), { headers: { "Content-Type": "application/json" } });
    }

    if (req.method === "POST") {
      const body = await req.json();

      // Update task status
      if (body.action === "update_task") {
        const { task_id, status } = body;
        const { data, error } = await supabase
          .from("staff_project_tasks")
          .update({
            status,
            completed_at: status === "done" ? new Date().toISOString() : null
          })
          .eq("id", task_id)
          .select()
          .single();

        if (error) throw error;
        return new Response(JSON.stringify({ task: data }), { headers: { "Content-Type": "application/json" } });
      }

      // Create task
      if (body.action === "create_task") {
        const { project_id, title, description, due_date, priority } = body;
        const { data, error } = await supabase
          .from("staff_project_tasks")
          .insert({
            project_id,
            title,
            description,
            due_date,
            priority,
            assignee_id: userId,
            status: "todo"
          })
          .select()
          .single();

        if (error) throw error;
        return new Response(JSON.stringify({ task: data }), { status: 201, headers: { "Content-Type": "application/json" } });
      }
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};
