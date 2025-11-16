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
    // POST: Join a sprint
    if (req.method === "POST") {
      const { sprintId } = req.body;

      if (!sprintId) {
        return res.status(400).json({ error: "Sprint ID required" });
      }

      // Verify sprint exists and user has access to project
      const { data: sprint, error: sprintError } = await admin
        .from("gameforge_sprints")
        .select("project_id")
        .eq("id", sprintId)
        .single();

      if (sprintError || !sprint) {
        return res.status(404).json({ error: "Sprint not found" });
      }

      // Check if user is part of the project
      const { data: projectAccess } = await admin
        .from("gameforge_projects")
        .select("id")
        .eq("id", sprint.project_id)
        .or(
          `lead_id.eq.${user.id},id.in.(select project_id from gameforge_team_members where user_id='${user.id}')`,
        )
        .single();

      if (!projectAccess) {
        return res.status(403).json({
          error: "You do not have access to this sprint's project",
        });
      }

      // Check if already a member
      const { data: existing } = await admin
        .from("gameforge_sprint_members")
        .select("id")
        .eq("sprint_id", sprintId)
        .eq("user_id", user.id)
        .single();

      if (existing) {
        return res.status(400).json({ error: "Already a sprint member" });
      }

      // Add user to sprint
      const { data: member, error: joinError } = await admin
        .from("gameforge_sprint_members")
        .insert([
          {
            sprint_id: sprintId,
            user_id: user.id,
            role: "contributor",
          },
        ])
        .select()
        .single();

      if (joinError) {
        return res.status(500).json({ error: joinError.message });
      }

      return res.status(201).json({
        message: "Successfully joined sprint",
        member,
      });
    }

    // DELETE: Leave a sprint
    if (req.method === "DELETE") {
      const { sprintId } = req.query;

      if (!sprintId) {
        return res.status(400).json({ error: "Sprint ID required" });
      }

      // Verify user is a member
      const { data: member, error: memberError } = await admin
        .from("gameforge_sprint_members")
        .select("role")
        .eq("sprint_id", sprintId)
        .eq("user_id", user.id)
        .single();

      if (memberError || !member) {
        return res.status(404).json({ error: "Not a member of this sprint" });
      }

      // Don't allow lead to leave if they're the only lead
      if (member.role === "lead") {
        const { data: otherLeads } = await admin
          .from("gameforge_sprint_members")
          .select("id")
          .eq("sprint_id", sprintId)
          .eq("role", "lead")
          .neq("user_id", user.id);

        if (!otherLeads || otherLeads.length === 0) {
          return res.status(400).json({
            error: "Cannot leave sprint: You are the only lead",
          });
        }
      }

      const { error: deleteError } = await admin
        .from("gameforge_sprint_members")
        .delete()
        .eq("sprint_id", sprintId)
        .eq("user_id", user.id);

      if (deleteError) {
        return res.status(500).json({ error: deleteError.message });
      }

      return res.status(200).json({
        message: "Successfully left sprint",
      });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    console.error("[GameForge Sprint Join]", error);
    return res.status(500).json({ error: error?.message || "Server error" });
  }
}
