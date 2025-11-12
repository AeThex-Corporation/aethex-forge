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
      const { project_id, metric_type, limit = 12, offset = 0 } = query;

      if (!project_id) {
        return res
          .status(400)
          .json({ error: "project_id query parameter required" });
      }

      let dbQuery = supabase
        .from("gameforge_metrics")
        .select("*", { count: "exact" })
        .eq("project_id", project_id);

      if (metric_type) dbQuery = dbQuery.eq("metric_type", metric_type);

      const { data, error, count } = await dbQuery
        .order("metric_date", { ascending: false })
        .range(Number(offset), Number(offset) + Number(limit) - 1);

      if (error) throw error;

      // Calculate aggregates for the project
      const { data: allMetrics } = await supabase
        .from("gameforge_metrics")
        .select("*")
        .eq("project_id", project_id);

      const aggregates = allMetrics
        ? {
            avg_velocity:
              allMetrics.length > 0
                ? Math.round(
                    allMetrics.reduce((sum, m) => sum + (m.velocity || 0), 0) /
                      allMetrics.length,
                  )
                : 0,
            total_bugs_found: allMetrics.reduce(
              (sum, m) => sum + (m.bugs_found || 0),
              0,
            ),
            total_bugs_fixed: allMetrics.reduce(
              (sum, m) => sum + (m.bugs_fixed || 0),
              0,
            ),
            on_schedule_percentage:
              allMetrics.length > 0
                ? Math.round(
                    (allMetrics.filter((m) => m.on_schedule).length /
                      allMetrics.length) *
                      100,
                  )
                : 0,
            avg_days_from_plan:
              allMetrics.length > 0
                ? Math.round(
                    allMetrics.reduce(
                      (sum, m) => sum + (m.days_from_planned_to_release || 0),
                      0,
                    ) / allMetrics.length,
                  )
                : 0,
          }
        : {};

      return res.json({
        data,
        aggregates,
        total: count,
        limit: Number(limit),
        offset: Number(offset),
      });
    } else if (method === "POST") {
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const {
        project_id,
        metric_type,
        velocity,
        hours_logged,
        team_size_avg,
        bugs_found,
        bugs_fixed,
        build_count,
        days_from_planned_to_release,
        on_schedule,
        budget_allocated,
        budget_spent,
      } = body;

      if (!project_id || !metric_type) {
        return res.status(400).json({
          error: "Missing required fields: project_id, metric_type",
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
          .json({ error: "Only project lead can add metrics" });
      }

      const { data, error } = await supabase
        .from("gameforge_metrics")
        .insert([
          {
            project_id,
            metric_type,
            metric_date: new Date().toISOString(),
            velocity,
            hours_logged,
            team_size_avg,
            bugs_found,
            bugs_fixed,
            build_count,
            days_from_planned_to_release,
            on_schedule,
            budget_allocated,
            budget_spent,
          },
        ])
        .select();

      if (error) throw error;
      return res.status(201).json(data[0]);
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (err: any) {
    console.error("[GameForge Metrics]", err);
    res.status(500).json({ error: err.message });
  }
}
