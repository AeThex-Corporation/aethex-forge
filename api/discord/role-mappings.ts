import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE || "",
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method, query, body } = req;

  try {
    // GET /api/discord/role-mappings - Fetch all role mappings
    if (method === "GET") {
      const { data: mappings, error } = await supabase
        .from("discord_role_mappings")
        .select("*")
        .order("arm", { ascending: true });

      if (error) {
        return res.status(500).json({
          error: "Failed to fetch role mappings",
          details: error.message,
        });
      }

      return res.json(mappings || []);
    }

    // POST /api/discord/role-mappings - Create new role mapping
    if (method === "POST") {
      const { arm, user_type, discord_role, server_id } = body;

      if (!arm || !discord_role) {
        return res.status(400).json({
          error: "Missing required fields: arm, discord_role",
        });
      }

      const { data: mapping, error } = await supabase
        .from("discord_role_mappings")
        .insert({
          arm,
          user_type: user_type || null,
          discord_role,
          server_id: server_id || null,
        })
        .select()
        .single();

      if (error) {
        return res.status(500).json({
          error: "Failed to create role mapping",
          details: error.message,
        });
      }

      return res.status(201).json(mapping);
    }

    // PUT /api/discord/role-mappings/:id - Update role mapping
    if (method === "PUT") {
      const { id } = query;
      const { arm, user_type, discord_role, server_id } = body;

      if (!id) {
        return res.status(400).json({ error: "Mapping ID is required" });
      }

      const { data: mapping, error } = await supabase
        .from("discord_role_mappings")
        .update({
          arm,
          user_type: user_type || null,
          discord_role,
          server_id: server_id || null,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return res.status(500).json({
          error: "Failed to update role mapping",
          details: error.message,
        });
      }

      return res.json(mapping);
    }

    // DELETE /api/discord/role-mappings/:id - Delete role mapping
    if (method === "DELETE") {
      const { id } = query;

      if (!id) {
        return res.status(400).json({ error: "Mapping ID is required" });
      }

      const { error } = await supabase
        .from("discord_role_mappings")
        .delete()
        .eq("id", id);

      if (error) {
        return res.status(500).json({
          error: "Failed to delete role mapping",
          details: error.message,
        });
      }

      return res.json({ success: true, message: "Role mapping deleted" });
    }

    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Discord role mappings API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
