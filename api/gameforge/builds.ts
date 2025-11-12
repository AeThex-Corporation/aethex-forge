import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE || "",
);

export default async function handler(req: any, res: any) {
  const { method, query, body, headers } = req;
  const userId = headers["x-user-id"];

  try {
    if (method === "GET") {
      const { id, project_id, build_type, limit = 50, offset = 0 } = query;

      if (id) {
        // Get single build
        const { data, error } = await supabase
          .from("gameforge_builds")
          .select(
            `
            *,
            gameforge_projects(id, name, platform),
            user_profiles!created_by(id, full_name, avatar_url)
          `,
          )
          .eq("id", id)
          .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: "Build not found" });
        return res.json(data);
      }

      if (!project_id) {
        return res
          .status(400)
          .json({ error: "project_id query parameter required" });
      }

      // List builds for a project
      let dbQuery = supabase
        .from("gameforge_builds")
        .select(
          `
          *,
          gameforge_projects(id, name),
          user_profiles!created_by(id, full_name, avatar_url)
        `,
          { count: "exact" },
        )
        .eq("project_id", project_id);

      if (build_type) dbQuery = dbQuery.eq("build_type", build_type);

      const { data, error, count } = await dbQuery
        .order("release_date", { ascending: false })
        .range(Number(offset), Number(offset) + Number(limit) - 1);

      if (error) throw error;

      return res.json({
        data,
        total: count,
        limit: Number(limit),
        offset: Number(offset),
      });
    } else if (method === "POST") {
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const {
        project_id,
        version,
        build_type,
        download_url,
        changelog,
        file_size,
        target_platforms,
      } = body;

      if (!project_id || !version || !build_type) {
        return res.status(400).json({
          error: "Missing required fields: project_id, version, build_type",
        });
      }

      // Verify user is project lead
      const { data: project } = await supabase
        .from("gameforge_projects")
        .select("lead_id")
        .eq("id", project_id)
        .single();

      if (project?.lead_id !== userId) {
        return res
          .status(403)
          .json({ error: "Only project lead can create builds" });
      }

      const { data, error } = await supabase
        .from("gameforge_builds")
        .insert([
          {
            project_id,
            version,
            build_type,
            download_url,
            changelog,
            file_size,
            target_platforms: target_platforms || [],
            created_by: userId,
          },
        ])
        .select();

      if (error) throw error;
      return res.status(201).json(data[0]);
    } else if (method === "PUT") {
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const { id } = query;
      const { version, build_type, download_url, changelog, file_size } = body;

      if (!id) {
        return res.status(400).json({ error: "Build ID required" });
      }

      // Verify user is project lead
      const { data: build } = await supabase
        .from("gameforge_builds")
        .select("project_id, gameforge_projects(lead_id)")
        .eq("id", id)
        .single();

      if (build?.gameforge_projects?.lead_id !== userId) {
        return res
          .status(403)
          .json({ error: "Only project lead can update builds" });
      }

      const updateData: any = {};
      if (version !== undefined) updateData.version = version;
      if (build_type !== undefined) updateData.build_type = build_type;
      if (download_url !== undefined) updateData.download_url = download_url;
      if (changelog !== undefined) updateData.changelog = changelog;
      if (file_size !== undefined) updateData.file_size = file_size;

      const { data: updated, error } = await supabase
        .from("gameforge_builds")
        .update(updateData)
        .eq("id", id)
        .select();

      if (error) throw error;
      return res.json(updated[0]);
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (err: any) {
    console.error("[GameForge Builds]", err);
    res.status(500).json({ error: err.message });
  }
}
