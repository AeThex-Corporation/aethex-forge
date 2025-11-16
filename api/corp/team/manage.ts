import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAdminClient } from "../../_supabase.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const admin = getAdminClient();

  // Only authenticated requests
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
    if (req.method === "GET") {
      // List team members
      const { data: members, error: membersError } = await admin
        .from("corp_team_members")
        .select("*")
        .eq("company_id", user.id)
        .order("created_at", { ascending: false });

      if (membersError) {
        return res.status(500).json({ error: membersError.message });
      }

      return res.status(200).json({ members: members || [] });
    }

    if (req.method === "POST") {
      // Invite team member
      const { email, full_name, job_title, role } = req.body;

      if (!email || !role) {
        return res.status(400).json({
          error: "Missing required fields: email, role",
        });
      }

      if (!["owner", "admin", "member", "viewer"].includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
      }

      // Check if user exists
      const { data: invitedUser } = await admin
        .from("user_profiles")
        .select("id")
        .eq("email", email)
        .single();

      const { data: member, error: memberError } = await admin
        .from("corp_team_members")
        .insert({
          company_id: user.id,
          user_id: invitedUser?.id || null,
          email,
          full_name: full_name || null,
          job_title: job_title || null,
          role,
          status: invitedUser ? "active" : "pending_invite",
          invited_at: new Date().toISOString(),
          joined_at: invitedUser ? new Date().toISOString() : null,
        })
        .select()
        .single();

      if (memberError) {
        return res.status(500).json({ error: memberError.message });
      }

      // Log activity
      await admin.from("corp_activity_log").insert({
        company_id: user.id,
        actor_id: user.id,
        action: "invited_team_member",
        resource_type: "team_member",
        resource_id: member.id,
        metadata: { email, role },
      });

      return res.status(201).json(member);
    }

    if (req.method === "PUT") {
      // Update team member
      const { memberId, role, status } = req.body;

      if (!memberId) {
        return res.status(400).json({ error: "memberId is required" });
      }

      // Verify ownership
      const { data: member, error: verifyError } = await admin
        .from("corp_team_members")
        .select("id")
        .eq("id", memberId)
        .eq("company_id", user.id)
        .single();

      if (verifyError || !member) {
        return res
          .status(403)
          .json({ error: "Member not found or unauthorized" });
      }

      const updateData: any = {};
      if (role) updateData.role = role;
      if (status) updateData.status = status;

      const { data: updated, error: updateError } = await admin
        .from("corp_team_members")
        .update(updateData)
        .eq("id", memberId)
        .select()
        .single();

      if (updateError) {
        return res.status(500).json({ error: updateError.message });
      }

      // Log activity
      await admin.from("corp_activity_log").insert({
        company_id: user.id,
        actor_id: user.id,
        action: "updated_team_member",
        resource_type: "team_member",
        resource_id: memberId,
        metadata: { role, status },
      });

      return res.status(200).json(updated);
    }

    if (req.method === "DELETE") {
      // Remove team member
      const { memberId } = req.body;

      if (!memberId) {
        return res.status(400).json({ error: "memberId is required" });
      }

      // Verify ownership
      const { data: member } = await admin
        .from("corp_team_members")
        .select("id")
        .eq("id", memberId)
        .eq("company_id", user.id)
        .single();

      if (!member) {
        return res
          .status(403)
          .json({ error: "Member not found or unauthorized" });
      }

      const { error: deleteError } = await admin
        .from("corp_team_members")
        .delete()
        .eq("id", memberId);

      if (deleteError) {
        return res.status(500).json({ error: deleteError.message });
      }

      // Log activity
      await admin.from("corp_activity_log").insert({
        company_id: user.id,
        actor_id: user.id,
        action: "removed_team_member",
        resource_type: "team_member",
        resource_id: memberId,
      });

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Server error" });
  }
}
