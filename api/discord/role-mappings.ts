import { Router } from "express";
import { createClient } from "@supabase/supabase-js";

const router = Router();

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE || "",
);

// GET /api/discord/role-mappings - Fetch all role mappings
router.get("/role-mappings", async (req, res) => {
  try {
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

    res.json(mappings || []);
  } catch (error) {
    console.error("Error fetching role mappings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/discord/role-mappings - Create new role mapping
router.post("/role-mappings", async (req, res) => {
  try {
    const { arm, user_type, discord_role, server_id } = req.body;

    // Validate required fields
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

    res.status(201).json(mapping);
  } catch (error) {
    console.error("Error creating role mapping:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/discord/role-mappings/:id - Update role mapping
router.put("/role-mappings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { arm, user_type, discord_role, server_id } = req.body;

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

    res.json(mapping);
  } catch (error) {
    console.error("Error updating role mapping:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/discord/role-mappings/:id - Delete role mapping
router.delete("/role-mappings/:id", async (req, res) => {
  try {
    const { id } = req.params;

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

    res.json({ success: true, message: "Role mapping deleted" });
  } catch (error) {
    console.error("Error deleting role mapping:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/discord/bot-status - Get bot status
router.get("/bot-status", async (req, res) => {
  try {
    // Fetch stats from discord_links and discord_user_roles
    const { data: linkedAccounts, error: linkError } = await supabase
      .from("discord_links")
      .select("count");

    const { data: assignedRoles, error: roleError } = await supabase
      .from("discord_user_roles")
      .select("count");

    const linkedCount = linkedAccounts?.[0]?.count || 0;
    const rolesCount = assignedRoles?.[0]?.count || 0;

    res.json({
      bot_status: "online",
      linked_accounts: linkedCount,
      assigned_roles: rolesCount,
      servers_connected: process.env.DISCORD_GUILD_COUNT || "6",
    });
  } catch (error) {
    console.error("Error fetching bot status:", error);
    res.status(500).json({
      bot_status: "unknown",
      linked_accounts: 0,
      assigned_roles: 0,
      servers_connected: "0",
    });
  }
});

export default router;
