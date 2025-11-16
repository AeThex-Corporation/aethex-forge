import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAdminClient } from "../../_supabase.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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
    const opportunityId = req.query.opportunity_id as string | undefined;
    const status = req.query.status as string | undefined;
    const limit = parseInt((req.query.limit as string) || "50", 10);
    const offset = parseInt((req.query.offset as string) || "0", 10);

    if (!opportunityId) {
      return res.status(400).json({ error: "opportunity_id required" });
    }

    // Verify client owns this opportunity
    const { data: opportunity, error: oppError } = await admin
      .from("nexus_opportunities")
      .select("id, posted_by")
      .eq("id", opportunityId)
      .single();

    if (oppError || !opportunity) {
      return res.status(404).json({ error: "Opportunity not found" });
    }

    if (opportunity.posted_by !== user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Get applicants
    let query = admin
      .from("nexus_applications")
      .select(
        `
        *,
        creator:user_profiles(
          id,
          full_name,
          avatar_url,
          email
        ),
        creator_profile:nexus_creator_profiles(
          skills,
          experience_level,
          hourly_rate,
          rating,
          review_count
        )
      `,
      )
      .eq("opportunity_id", opportunityId)
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data: applications, error: appError } = await query.range(
      offset,
      offset + limit - 1,
    );

    if (appError) {
      return res.status(500).json({ error: appError.message });
    }

    return res.status(200).json({
      applications: applications || [],
      limit,
      offset,
      total: applications?.length || 0,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Server error" });
  }
}
