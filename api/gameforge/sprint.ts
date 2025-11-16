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
    // GET: List sprints for user's projects or sprints user is a member of
    if (req.method === "GET") {
      const { projectId, status } = req.query;

      let query = admin.from("gameforge_sprints").select(
        `
          id,
          project_id,
          sprint_number,
          title,
          description,
          phase,
          status,
          goal,
          start_date,
          end_date,
          planned_velocity,
          actual_velocity,
          created_by,
          created_at,
          updated_at,
          gameforge_projects(name),
          gameforge_sprint_members(user_id)
        `,
      );

      if (projectId) {
        query = query.eq("project_id", projectId);
      } else {
        // Get sprints for projects user is on
        query = query.in(
          "project_id",
          `
          select id from gameforge_projects
          where lead_id = '${user.id}'
          or id in (
            select distinct project_id from gameforge_team_members
            where user_id = '${user.id}'
          )
        ` as any,
        );
      }

      if (status) {
        query = query.eq("status", status);
      }

      const { data: sprints, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(sprints || []);
    }

    // POST: Create a sprint
    if (req.method === "POST") {
      const {
        projectId,
        title,
        description,
        goal,
        startDate,
        endDate,
        plannedVelocity,
      } = req.body;

      // Verify user is project lead
      const { data: project, error: projectError } = await admin
        .from("gameforge_projects")
        .select("id")
        .eq("id", projectId)
        .eq("lead_id", user.id)
        .single();

      if (projectError || !project) {
        return res.status(403).json({ error: "Not project lead" });
      }

      // Get next sprint number
      const { data: lastSprint, error: lastSprintError } = await admin
        .from("gameforge_sprints")
        .select("sprint_number")
        .eq("project_id", projectId)
        .order("sprint_number", { ascending: false })
        .limit(1)
        .single();

      const nextSprintNumber = (lastSprint?.sprint_number || 0) + 1;

      const { data: sprint, error: createError } = await admin
        .from("gameforge_sprints")
        .insert([
          {
            project_id: projectId,
            sprint_number: nextSprintNumber,
            title,
            description,
            goal,
            start_date: startDate,
            end_date: endDate,
            planned_velocity: plannedVelocity,
            created_by: user.id,
            phase: "planning",
            status: "pending",
          },
        ])
        .select()
        .single();

      if (createError) {
        return res.status(500).json({ error: createError.message });
      }

      // Auto-add creator as sprint lead
      await admin.from("gameforge_sprint_members").insert([
        {
          sprint_id: sprint.id,
          user_id: user.id,
          role: "lead",
        },
      ]);

      return res.status(201).json(sprint);
    }

    // PUT: Update a sprint
    if (req.method === "PUT") {
      const { sprintId } = req.query;
      const { title, description, goal, startDate, endDate, phase, status } =
        req.body;

      // Verify user is project lead
      const { data: sprint, error: sprintError } = await admin
        .from("gameforge_sprints")
        .select("project_id")
        .eq("id", sprintId)
        .single();

      if (sprintError || !sprint) {
        return res.status(404).json({ error: "Sprint not found" });
      }

      const { data: project, error: projectError } = await admin
        .from("gameforge_projects")
        .select("id")
        .eq("id", sprint.project_id)
        .eq("lead_id", user.id)
        .single();

      if (projectError || !project) {
        return res.status(403).json({ error: "Not project lead" });
      }

      const { data: updated, error: updateError } = await admin
        .from("gameforge_sprints")
        .update({
          title,
          description,
          goal,
          start_date: startDate,
          end_date: endDate,
          phase,
          status,
        })
        .eq("id", sprintId)
        .select()
        .single();

      if (updateError) {
        return res.status(500).json({ error: updateError.message });
      }

      return res.status(200).json(updated);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    console.error("[GameForge Sprint]", error);
    return res.status(500).json({ error: error?.message || "Server error" });
  }
}
