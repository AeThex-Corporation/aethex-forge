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
      const { user_id, project_id, role, limit = 50, offset = 0 } = query;

      let dbQuery = supabase.from("gameforge_team_members").select(
        `
          *,
          user_profiles(id, full_name, avatar_url, email)
        `,
        { count: "exact" },
      );

      if (user_id) dbQuery = dbQuery.eq("user_id", user_id).single() as any;
      if (project_id) dbQuery = dbQuery.contains("project_ids", [project_id]);
      if (role) dbQuery = dbQuery.eq("role", role);
      if (!user_id) dbQuery = dbQuery.eq("is_active", true);

      const { data, error, count } = await dbQuery
        .order("joined_date", { ascending: false })
        .range(Number(offset), Number(offset) + Number(limit) - 1);

      if (error) throw error;
      return res.json({
        data: user_id ? data : data,
        total: count,
        limit: Number(limit),
        offset: Number(offset),
      });
    } else if (method === "POST") {
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const {
        user_id,
        role,
        position,
        contract_type,
        hourly_rate,
        skills,
        bio,
        project_ids,
      } = body;

      if (!user_id || !role) {
        return res
          .status(400)
          .json({ error: "Missing required fields: user_id, role" });
      }

      const { data, error } = await supabase
        .from("gameforge_team_members")
        .insert([
          {
            user_id,
            role,
            position,
            contract_type: contract_type || "contractor",
            hourly_rate,
            skills: skills || [],
            bio,
            project_ids: project_ids || [],
            is_active: true,
          },
        ])
        .select();

      if (error) throw error;
      return res.status(201).json(data[0]);
    } else if (method === "PUT") {
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const { id } = query;
      const {
        role,
        position,
        contract_type,
        hourly_rate,
        skills,
        bio,
        project_ids,
        is_active,
      } = body;

      if (!id) {
        return res.status(400).json({ error: "Team member ID required" });
      }

      const updateData: any = {};
      if (role !== undefined) updateData.role = role;
      if (position !== undefined) updateData.position = position;
      if (contract_type !== undefined) updateData.contract_type = contract_type;
      if (hourly_rate !== undefined) updateData.hourly_rate = hourly_rate;
      if (skills !== undefined) updateData.skills = skills;
      if (bio !== undefined) updateData.bio = bio;
      if (project_ids !== undefined) updateData.project_ids = project_ids;
      if (is_active !== undefined) updateData.is_active = is_active;
      if (is_active === false && !updateData.left_date)
        updateData.left_date = new Date().toISOString();

      const { data, error } = await supabase
        .from("gameforge_team_members")
        .update(updateData)
        .eq("id", id)
        .select();

      if (error) throw error;
      return res.json(data[0]);
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (err: any) {
    console.error("[GameForge Team]", err);
    res.status(500).json({ error: err.message });
  }
}
