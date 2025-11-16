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

    // Verify user has access to this company
    const { data: teamMember } = await admin
      .from("corp_team_members")
      .select("role")
      .eq("company_id", user.id)
      .eq("user_id", user.id)
      .single();

    if (!teamMember && user.id !== req.query.company_id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const companyId = (req.query.company_id as string) || user.id;

    let query = admin
      .from("corp_invoices")
      .select(
        `
        *,
        items:corp_invoice_items(*)
      `,
      )
      .eq("client_company_id", companyId)
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data: invoices, error: invoicesError } = await query.range(
      offset,
      offset + limit - 1,
    );

    if (invoicesError) {
      return res.status(500).json({ error: invoicesError.message });
    }

    // Calculate summary stats
    const { data: allInvoices } = await admin
      .from("corp_invoices")
      .select("amount_due, amount_paid, status")
      .eq("client_company_id", companyId);

    const totalInvoiced = (allInvoices || []).reduce(
      (sum: number, i: any) => sum + (i.amount_due || 0),
      0,
    );

    const totalPaid = (allInvoices || []).reduce(
      (sum: number, i: any) => sum + (i.amount_paid || 0),
      0,
    );

    const overdue = (allInvoices || [])
      .filter((i: any) => i.status === "overdue")
      .reduce((sum: number, i: any) => sum + (i.amount_due - i.amount_paid), 0);

    return res.status(200).json({
      invoices: invoices || [],
      summary: {
        total_invoiced: totalInvoiced,
        total_paid: totalPaid,
        outstanding: totalInvoiced - totalPaid,
        overdue,
      },
      limit,
      offset,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Server error" });
  }
}
