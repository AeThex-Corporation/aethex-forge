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
    const status = req.query.status as string | undefined;
    const limit = parseInt((req.query.limit as string) || "50", 10);
    const offset = parseInt((req.query.offset as string) || "0", 10);

    let query = admin
      .from("nexus_applications")
      .select(
        `
        *,
        opportunity:nexus_opportunities(
          id,
          title,
          description,
          category,
          budget_type,
          budget_min,
          budget_max,
          timeline_type,
          status,
          posted_by,
          created_at
        )
      `,
      )
      .eq("creator_id", user.id)
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const {
      data: applications,
      error: applicationsError,
      count,
    } = await query
      .range(offset, offset + limit - 1)
      .then((result) => ({ ...result, count: result.data?.length || 0 }));

    if (applicationsError) {
      return res.status(500).json({ error: applicationsError.message });
    }

    return res.status(200).json({
      applications: applications || [],
      total: count,
      limit,
      offset,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Server error" });
  }
}
