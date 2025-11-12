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
      const { id, status, platform, limit = 50, offset = 0 } = query;

      if (id) {
        // Get single project with full details
        const { data, error } = await supabase
          .from("gameforge_projects")
          .select(
            `
            *,
            user_profiles!lead_id(id, full_name, avatar_url),
            gameforge_team_members(*)
          `,
          )
          .eq("id", id)
          .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: "Project not found" });

        return res.json(data);
      }

      // List all projects with filters
      let dbQuery = supabase.from("gameforge_projects").select(
        `
          id,
          name,
          description,
          status,
          platform,
          genre,
          target_release_date,
          actual_release_date,
          team_size,
          budget,
          current_spend,
          created_at,
          user_profiles!lead_id(id, full_name, avatar_url)
        `,
        { count: "exact" },
      );

      if (status) dbQuery = dbQuery.eq("status", status);
      if (platform) dbQuery = dbQuery.eq("platform", platform);

      const { data, error, count } = await dbQuery
        .order("created_at", { ascending: false })
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
        name,
        description,
        platform,
        genre,
        target_release_date,
        budget,
        repository_url,
        documentation_url,
      } = body;

      if (!name || !platform) {
        return res
          .status(400)
          .json({ error: "Missing required fields: name, platform" });
      }

      const { data, error } = await supabase
        .from("gameforge_projects")
        .insert([
          {
            name,
            description,
            status: "planning",
            lead_id: userId,
            platform,
            genre: genre || [],
            target_release_date,
            budget,
            repository_url,
            documentation_url,
          },
        ])
        .select();

      if (error) throw error;
      return res.status(201).json(data[0]);
    } else if (method === "PUT") {
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const { id } = query;
      const {
        name,
        description,
        status,
        platform,
        genre,
        target_release_date,
        actual_release_date,
        budget,
        current_spend,
        repository_url,
        documentation_url,
      } = body;

      if (!id) {
        return res.status(400).json({ error: "Project ID required" });
      }

      // Verify user is project lead
      const { data: project } = await supabase
        .from("gameforge_projects")
        .select("lead_id")
        .eq("id", id)
        .single();

      if (project?.lead_id !== userId) {
        return res.status(403).json({ error: "Only project lead can update" });
      }

      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (status !== undefined) updateData.status = status;
      if (platform !== undefined) updateData.platform = platform;
      if (genre !== undefined) updateData.genre = genre;
      if (target_release_date !== undefined)
        updateData.target_release_date = target_release_date;
      if (actual_release_date !== undefined)
        updateData.actual_release_date = actual_release_date;
      if (budget !== undefined) updateData.budget = budget;
      if (current_spend !== undefined) updateData.current_spend = current_spend;
      if (repository_url !== undefined)
        updateData.repository_url = repository_url;
      if (documentation_url !== undefined)
        updateData.documentation_url = documentation_url;

      const { data, error } = await supabase
        .from("gameforge_projects")
        .update(updateData)
        .eq("id", id)
        .select();

      if (error) throw error;
      return res.json(data[0]);
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (err: any) {
    console.error("[GameForge Projects]", err);
    res.status(500).json({ error: err.message });
  }
}
