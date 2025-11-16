import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAdminClient } from "../../_supabase.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { groupname } = req.query;

  if (!groupname || typeof groupname !== "string") {
    return res.status(400).json({ error: "Group name is required" });
  }

  try {
    console.log("[Group Passport] Initializing admin client...");
    const admin = getAdminClient();
    console.log("[Group Passport] Admin client initialized successfully");

    // Try to find group by name (case-insensitive)
    let group: any = null;

    try {
      const result = await admin
        .from("squads")
        .select(
          `
          id,
          name,
          description,
          logo_url,
          banner_url,
          website,
          github_url,
          created_at,
          updated_at,
          member_count,
          created_by
        `,
        )
        .ilike("name", `%${groupname}%`)
        .limit(1)
        .single();
      group = result.data;
    } catch (e) {
      // Continue to ID lookup
    }

    // If not found by name, try by exact ID match
    if (!group) {
      try {
        const result = await admin
          .from("squads")
          .select(
            `
          id,
          name,
          description,
          logo_url,
          banner_url,
          website,
          github_url,
          created_at,
          updated_at,
          member_count,
          created_by
        `,
          )
          .eq("id", groupname)
          .single();
        group = result.data;
      } catch (e) {
        // Continue to error handling
      }
    }

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Get group members
    const { data: members = [] } = await admin
      .from("squad_members")
      .select(
        `
        user_id,
        role,
        joined_at,
        user_profiles(
          id,
          username,
          full_name,
          avatar_url
        )
      `,
      )
      .eq("squad_id", group.id);

    // Get group projects
    const { data: projects = [] } = await admin
      .from("projects")
      .select(
        `
        id,
        title,
        slug,
        description,
        image_url,
        created_at
      `,
      )
      .eq("squad_id", group.id)
      .limit(10);

    // Get creator/owner info
    let owner = null;
    if (group.created_by) {
      const { data: ownerData } = await admin
        .from("user_profiles")
        .select("id, username, full_name, avatar_url")
        .eq("id", group.created_by)
        .single();
      owner = ownerData;
    }

    return res.status(200).json({
      type: "group",
      group: {
        ...group,
        memberCount: members.length,
        members: members.map((m: any) => ({
          userId: m.user_id,
          role: m.role,
          joinedAt: m.joined_at,
          user: m.user_profiles,
        })),
      },
      projects: projects || [],
      owner,
      domain: req.headers.host || "",
    });
  } catch (error: any) {
    console.error("[Group Passport Error]", {
      message: error?.message || String(error),
      code: error?.code,
      status: error?.status,
      details: error?.details || error?.hint,
    });

    if (/SUPABASE_/.test(String(error?.message || ""))) {
      return res.status(500).json({
        error: `Server misconfigured: ${error.message}`,
      });
    }

    return res.status(500).json({
      error: error?.message || "Failed to load group passport",
    });
  }
}
