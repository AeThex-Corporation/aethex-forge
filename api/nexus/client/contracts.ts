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
      .from("nexus_contracts")
      .select(
        `
        *,
        creator:user_profiles(
          id,
          full_name,
          avatar_url,
          email
        ),
        milestones:nexus_milestones(*),
        payments:nexus_payments(*)
      `,
      )
      .eq("client_id", user.id)
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data: contracts, error: contractsError } = await query.range(
      offset,
      offset + limit - 1,
    );

    if (contractsError) {
      return res.status(500).json({ error: contractsError.message });
    }

    // Get summary stats
    const { data: allContracts } = await admin
      .from("nexus_contracts")
      .select("total_amount, status")
      .eq("client_id", user.id);

    const totalSpent = (allContracts || []).reduce(
      (sum: number, c: any) => sum + (c.total_amount || 0),
      0,
    );

    const activeContracts = (allContracts || []).filter(
      (c: any) => c.status === "active",
    ).length;

    return res.status(200).json({
      contracts: contracts || [],
      summary: {
        total_spent: totalSpent,
        active_contracts: activeContracts,
      },
      limit,
      offset,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Server error" });
  }
}
