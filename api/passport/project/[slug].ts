import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAdminClient } from "../../_supabase.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { slug } = req.query;

  if (!slug || typeof slug !== "string") {
    return res.status(400).json({ error: "Project slug is required" });
  }

  try {
    const admin = getAdminClient();

    const projectFields = `
      id,
      title,
      slug,
      description,
      user_id,
      status,
      image_url,
      website,
      technologies,
      created_at,
      updated_at
    `;

    // Try to look up project by slug first (case-insensitive)
    let project: any = null;

    try {
      const result = await admin
        .from("aethex_projects")
        .select(projectFields)
        .ilike("slug", `%${slug}%`)
        .limit(1)
        .single();
      project = result.data;
    } catch (e) {
      // Continue to ID lookup
    }

    // If not found by slug, try by exact ID match
    if (!project) {
      try {
        const result = await admin
          .from("aethex_projects")
          .select(projectFields)
          .eq("id", slug)
          .single();
        project = result.data;
      } catch (e) {
        // Continue to error handling
      }
    }

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Get project owner
    let owner: any = null;
    try {
      const result = await admin
        .from("user_profiles")
        .select("id, username, full_name, avatar_url")
        .eq("id", project.user_id)
        .single();
      owner = result.data;
    } catch (e) {
      // Owner may not exist or may be deleted
      console.warn("[Passport Project] Could not find project owner:", e);
    }

    return res.status(200).json({
      type: "project",
      project,
      owner: owner || null,
      domain: req.headers.host || "",
    });
  } catch (error: any) {
    console.error("[Passport Project Error]", error);

    if (/SUPABASE_/.test(String(error?.message || ""))) {
      return res.status(500).json({
        error: `Server misconfigured: ${error.message}`,
      });
    }

    return res.status(500).json({
      error: error?.message || "Failed to load project",
    });
  }
}
