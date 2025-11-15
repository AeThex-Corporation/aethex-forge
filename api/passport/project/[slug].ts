import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAdminClient } from "../../_supabase";

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

    // Look up project by slug
    const { data: project, error: projectError } = await admin
      .from("aethex_projects")
      .select(
        `
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
      `,
      )
      .eq("slug", slug)
      .single();

    if (projectError) {
      if (projectError.code === "PGRST116") {
        // No rows found
        return res.status(404).json({ error: "Project not found" });
      }
      throw projectError;
    }

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Get project owner
    const { data: owner } = await admin
      .from("user_profiles")
      .select("id, username, full_name, avatar_url")
      .eq("id", project.user_id)
      .single();

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
