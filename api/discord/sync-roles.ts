import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE || "",
);

interface RoleSyncRequest {
  discord_id: string;
  server_id?: string;
}

interface DiscordRole {
  role_name: string;
  role_id?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Verify request is from Discord bot (simple verification)
  const authorization = req.headers.authorization;
  if (
    !authorization ||
    authorization !== `Bearer ${process.env.DISCORD_BOT_TOKEN}`
  ) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { discord_id, server_id } = req.body as RoleSyncRequest;

    if (!discord_id) {
      return res.status(400).json({ error: "discord_id is required" });
    }

    // Find the linked AeThex user
    const { data: link, error: linkError } = await supabase
      .from("discord_links")
      .select("user_id, primary_arm")
      .eq("discord_id", discord_id)
      .single();

    if (linkError || !link) {
      return res.status(404).json({ error: "Discord account not linked" });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("user_type")
      .eq("id", link.user_id)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: "User profile not found" });
    }

    // Get role mappings for this user's realm and type
    const { data: mappings, error: mappingsError } = await supabase
      .from("discord_role_mappings")
      .select("discord_role_name, discord_role_id")
      .eq("arm", link.primary_arm)
      .eq("user_type", profile.user_type || "community_member")
      .is("server_id", null); // Global mappings (not server-specific)

    if (mappingsError) {
      return res.status(500).json({ error: "Failed to fetch role mappings" });
    }

    if (!mappings || mappings.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No role mappings found for this user",
        roles_to_assign: [],
      });
    }

    // Build list of roles to assign
    const rolesToAssign: DiscordRole[] = mappings.map((mapping) => ({
      role_name: mapping.discord_role_name,
      role_id: mapping.discord_role_id || undefined,
    }));

    // Store role assignments in database (for tracking)
    if (server_id) {
      const { error: storeError } = await supabase
        .from("discord_user_roles")
        .upsert(
          rolesToAssign.map((role) => ({
            discord_id,
            server_id,
            role_name: role.role_name,
            role_id: role.role_id,
            assigned_at: new Date().toISOString(),
            last_verified: new Date().toISOString(),
          })),
          {
            onConflict: "discord_id,server_id,role_id",
          },
        );

      if (storeError) {
        console.warn("Failed to store role assignments:", storeError);
        // Don't fail the sync, just warn
      }
    }

    return res.status(200).json({
      success: true,
      message: "Role sync calculated successfully",
      discord_id,
      primary_arm: link.primary_arm,
      user_type: profile.user_type,
      roles_to_assign: rolesToAssign,
      note: "Discord bot should now assign these roles to the user",
    });
  } catch (error: any) {
    console.error("Discord sync-roles error:", error);
    return res.status(500).json({
      error: error?.message || "Failed to sync roles",
    });
  }
}
