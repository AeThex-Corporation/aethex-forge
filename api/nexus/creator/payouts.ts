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

    // Get payments for creator's contracts
    let query = admin
      .from("nexus_payments")
      .select(
        `
        *,
        contract:nexus_contracts(
          id,
          title,
          total_amount,
          status,
          client_id,
          created_at
        ),
        milestone:nexus_milestones(id, description, amount, status)
      `,
      )
      .eq("contract.creator_id", user.id)
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("payment_status", status);
    }

    const { data: payments, error: paymentsError } = await query.range(
      offset,
      offset + limit - 1,
    );

    if (paymentsError) {
      return res.status(500).json({ error: paymentsError.message });
    }

    // Calculate summary stats
    const { data: contracts } = await admin
      .from("nexus_contracts")
      .select("total_amount, creator_payout_amount, status")
      .eq("creator_id", user.id);

    const totalEarnings = (contracts || []).reduce(
      (sum: number, c: any) => sum + (c.creator_payout_amount || 0),
      0,
    );

    const completedContracts = (contracts || []).filter(
      (c: any) => c.status === "completed",
    ).length;

    const pendingPayouts = (payments || [])
      .filter((p: any) => p.payment_status === "pending")
      .reduce((sum: number, p: any) => sum + (p.creator_payout || 0), 0);

    return res.status(200).json({
      payments: payments || [],
      summary: {
        total_earnings: totalEarnings,
        pending_payouts: pendingPayouts,
        completed_contracts: completedContracts,
      },
      limit,
      offset,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Server error" });
  }
}
