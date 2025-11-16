import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAdminClient } from "../_supabase.js";

const admin = getAdminClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user },
    error: authError,
  } = await admin.auth.getUser(token);

  if (authError || !user) {
    return res.status(401).json({ error: "Invalid token" });
  }

  try {
    // GET: List tasks for sprint or project
    if (req.method === "GET") {
      const { sprintId, projectId, status, assignedTo } = req.query;

      let query = admin.from("gameforge_tasks").select(
        `
          id,
          sprint_id,
          project_id,
          title,
          description,
          status,
          priority,
          estimated_hours,
          actual_hours,
          assigned_to,
          created_by,
          due_date,
          completed_at,
          created_at,
          updated_at,
          user_profiles:assigned_to(id, full_name, avatar_url),
          creator:created_by_id(id, full_name)
        `,
      );

      if (sprintId) {
        query = query.eq("sprint_id", sprintId);
      }

      if (projectId) {
        query = query.eq("project_id", projectId);
      }

      if (status) {
        query = query.eq("status", status);
      }

      if (assignedTo) {
        query = query.eq("assigned_to", assignedTo);
      }

      const { data: tasks, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(tasks || []);
    }

    // POST: Create a task
    if (req.method === "POST") {
      const {
        sprintId,
        projectId,
        title,
        description,
        priority,
        estimatedHours,
        assignedTo,
        dueDate,
      } = req.body;

      if (!projectId || !title) {
        return res.status(400).json({ error: "Project ID and title required" });
      }

      // Verify user has access to project (lead or team member)
      const { data: project, error: projectError } = await admin
        .from("gameforge_projects")
        .select("id")
        .eq("id", projectId)
        .or(
          `lead_id.eq.${user.id},id.in.(select project_id from gameforge_team_members where user_id='${user.id}')`,
        )
        .single();

      if (projectError || !project) {
        return res.status(403).json({ error: "No access to project" });
      }

      // If assigning to someone, verify they're on the project
      if (assignedTo && assignedTo !== user.id) {
        const { data: assignee } = await admin
          .from("gameforge_team_members")
          .select("id")
          .eq("user_id", assignedTo)
          .contains("project_ids", [projectId])
          .single();

        if (!assignee) {
          return res.status(400).json({
            error: "Assignee is not on this project",
          });
        }
      }

      const { data: task, error: createError } = await admin
        .from("gameforge_tasks")
        .insert([
          {
            sprint_id: sprintId || null,
            project_id: projectId,
            title,
            description,
            priority: priority || "medium",
            estimated_hours: estimatedHours,
            assigned_to: assignedTo || null,
            created_by: user.id,
            due_date: dueDate || null,
            status: "todo",
          },
        ])
        .select()
        .single();

      if (createError) {
        return res.status(500).json({ error: createError.message });
      }

      return res.status(201).json(task);
    }

    // PUT: Update a task
    if (req.method === "PUT") {
      const { taskId } = req.query;
      const { status, priority, estimatedHours, actualHours, assignedTo } =
        req.body;

      if (!taskId) {
        return res.status(400).json({ error: "Task ID required" });
      }

      // Verify user can edit (assigned or project lead)
      const { data: task, error: taskError } = await admin
        .from("gameforge_tasks")
        .select("project_id, assigned_to, created_by")
        .eq("id", taskId)
        .single();

      if (taskError || !task) {
        return res.status(404).json({ error: "Task not found" });
      }

      const { data: project } = await admin
        .from("gameforge_projects")
        .select("id")
        .eq("id", task.project_id)
        .eq("lead_id", user.id)
        .single();

      if (
        !project &&
        task.assigned_to !== user.id &&
        task.created_by !== user.id
      ) {
        return res.status(403).json({ error: "No permission to edit task" });
      }

      const { data: updated, error: updateError } = await admin
        .from("gameforge_tasks")
        .update({
          status,
          priority,
          estimated_hours: estimatedHours,
          actual_hours: actualHours,
          assigned_to: assignedTo,
          completed_at: status === "done" ? new Date().toISOString() : null,
        })
        .eq("id", taskId)
        .select()
        .single();

      if (updateError) {
        return res.status(500).json({ error: updateError.message });
      }

      return res.status(200).json(updated);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    console.error("[GameForge Tasks]", error);
    return res.status(500).json({ error: error?.message || "Server error" });
  }
}
