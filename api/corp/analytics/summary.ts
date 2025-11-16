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
    // Financial metrics
    const { data: invoices } = await admin
      .from("corp_invoices")
      .select("amount_due, amount_paid, status")
      .eq("client_company_id", user.id);

    const { data: contracts } = await admin
      .from("corp_contracts")
      .select("status, contract_value")
      .eq("client_company_id", user.id);

    const { data: payments } = await admin
      .from("corp_invoice_payments")
      .select("amount_paid, payment_date");

    // Calculate metrics
    const totalInvoiced = (invoices || []).reduce(
      (sum: number, i: any) => sum + (i.amount_due || 0),
      0,
    );

    const totalPaid = (invoices || []).reduce(
      (sum: number, i: any) => sum + (i.amount_paid || 0),
      0,
    );

    const outstanding = totalInvoiced - totalPaid;

    const overdue = (invoices || [])
      .filter((i: any) => i.status === "overdue")
      .reduce(
        (sum: number, i: any) =>
          sum + ((i.amount_due || 0) - (i.amount_paid || 0)),
        0,
      );

    const activeContracts = (contracts || []).filter(
      (c: any) => c.status === "active",
    ).length;

    const completedContracts = (contracts || []).filter(
      (c: any) => c.status === "completed",
    ).length;

    const totalContractValue = (contracts || []).reduce(
      (sum: number, c: any) => sum + (c.contract_value || 0),
      0,
    );

    // Payment trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentPayments = (payments || []).filter((p: any) => {
      return new Date(p.payment_date) >= thirtyDaysAgo;
    });

    const paymentTrend = recentPayments.reduce(
      (sum: number, p: any) => sum + (p.amount_paid || 0),
      0,
    );

    // Calculate average payment days (days to pay invoices)
    const paidInvoices = (invoices || []).filter(
      (i: any) => i.status === "paid" || i.amount_paid > 0,
    );

    const avgPaymentDays =
      paidInvoices.length > 0
        ? Math.round(
            paidInvoices.reduce((sum: number, i: any) => {
              // This would need actual payment dates to calculate properly
              return sum + 15; // Default 15 days
            }, 0) / paidInvoices.length,
          )
        : 0;

    return res.status(200).json({
      financial: {
        total_invoiced: totalInvoiced,
        total_paid: totalPaid,
        outstanding,
        overdue,
        payment_trend_30d: paymentTrend,
        average_payment_days: avgPaymentDays,
      },
      contracts: {
        total_contracts: contracts?.length || 0,
        active_contracts: activeContracts,
        completed_contracts: completedContracts,
        total_contract_value: totalContractValue,
      },
      invoices: {
        total_invoices: invoices?.length || 0,
        paid_invoices: (invoices || []).filter((i: any) => i.status === "paid")
          .length,
        pending_invoices: (invoices || []).filter(
          (i: any) => i.status === "pending" || i.status === "sent",
        ).length,
        overdue_invoices: (invoices || []).filter(
          (i: any) => i.status === "overdue",
        ).length,
      },
      health: {
        payment_rate: Math.round((totalPaid / totalInvoiced) * 100) || 0,
        contract_completion_rate:
          completedContracts / (activeContracts + completedContracts) || 0,
        cash_flow_status:
          outstanding > totalInvoiced * 0.5 ? "at_risk" : "healthy",
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Server error" });
  }
}
