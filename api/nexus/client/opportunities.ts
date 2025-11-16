import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAdminClient } from "../../_supabase.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const admin = getAdminClient();

  // Only authenticated requests
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user },
    error: authError,
  } = await admin.auth.getUser(token);

  if (authError || !user) {
    return res.status(401).json({ error: "Invalid token" });
  }

  try {
    if (req.method === "GET") {
      // List client's opportunities
      const status = req.query.status as string | undefined;
      const limit = parseInt((req.query.limit as string) || "50", 10);
      const offset = parseInt((req.query.offset as string) || "0", 10);

      let query = admin
        .from("nexus_opportunities")
        .select(
          `
          *,
          applications:nexus_applications(id, status, creator_id)
        `,
        )
        .eq("posted_by", user.id)
        .order("created_at", { ascending: false });

      if (status) {
        query = query.eq("status", status);
      }

      const { data: opportunities, error: oppError } = await query.range(
        offset,
        offset + limit - 1,
      );

      if (oppError) {
        return res.status(500).json({ error: oppError.message });
      }

      return res.status(200).json({
        opportunities: opportunities || [],
        limit,
        offset,
      });
    }

    if (req.method === "POST") {
      // Create new opportunity
      const {
        title,
        description,
        category,
        required_skills,
        budget_type,
        budget_min,
        budget_max,
        timeline_type,
        duration_weeks,
        location_requirement,
        required_experience,
        company_name,
      } = req.body;

      if (!title || !description || !category || !budget_type) {
        return res.status(400).json({
          error:
            "Missing required fields: title, description, category, budget_type",
        });
      }

      const { data: opportunity, error: createError } = await admin
        .from("nexus_opportunities")
        .insert({
          posted_by: user.id,
          title,
          description,
          category,
          required_skills: Array.isArray(required_skills)
            ? required_skills
            : [],
          budget_type,
          budget_min: budget_min || null,
          budget_max: budget_max || null,
          timeline_type: timeline_type || "flexible",
          duration_weeks: duration_weeks || null,
          location_requirement: location_requirement || "remote",
          required_experience: required_experience || "any",
          company_name: company_name || null,
          status: "open",
          published_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError) {
        return res.status(500).json({ error: createError.message });
      }

      return res.status(201).json(opportunity);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Server error" });
  }
}
