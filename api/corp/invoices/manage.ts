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
    if (req.method === "POST") {
      // Create new invoice
      const { description, issue_date, due_date, items, notes, currency } =
        req.body;

      if (!due_date || !items || items.length === 0) {
        return res.status(400).json({
          error: "Missing required fields: due_date, items",
        });
      }

      // Calculate total from items
      const amountDue = items.reduce(
        (sum: number, item: any) => sum + (item.amount || 0),
        0,
      );

      // Generate invoice number
      const { count } = await admin
        .from("corp_invoices")
        .select("id", { count: "exact", head: true })
        .eq("client_company_id", user.id);

      const invoiceNumber = `INV-${new Date().getFullYear()}-${String((count || 0) + 1).padStart(5, "0")}`;

      // Create invoice
      const { data: invoice, error: invoiceError } = await admin
        .from("corp_invoices")
        .insert({
          client_company_id: user.id,
          invoice_number: invoiceNumber,
          description: description || null,
          issue_date: issue_date || new Date().toISOString().split("T")[0],
          due_date,
          amount_due: amountDue,
          notes: notes || null,
          currency: currency || "USD",
          status: "draft",
        })
        .select()
        .single();

      if (invoiceError) {
        return res.status(500).json({ error: invoiceError.message });
      }

      // Create invoice items
      const itemsToInsert = items.map((item: any) => ({
        invoice_id: invoice.id,
        description: item.description,
        quantity: item.quantity || 1,
        unit_price: item.unit_price || item.amount,
        amount: item.amount,
        category: item.category || "service",
      }));

      const { error: itemsError } = await admin
        .from("corp_invoice_items")
        .insert(itemsToInsert);

      if (itemsError) {
        return res.status(500).json({ error: itemsError.message });
      }

      // Log activity
      await admin.from("corp_activity_log").insert({
        company_id: user.id,
        actor_id: user.id,
        action: "created_invoice",
        resource_type: "invoice",
        resource_id: invoice.id,
        metadata: { invoice_number: invoiceNumber, amount: amountDue },
      });

      return res.status(201).json(invoice);
    }

    if (req.method === "PUT") {
      // Update invoice
      const { invoiceId, status, notes } = req.body;

      if (!invoiceId) {
        return res.status(400).json({ error: "invoiceId is required" });
      }

      // Verify ownership
      const { data: invoice, error: verifyError } = await admin
        .from("corp_invoices")
        .select("id, status")
        .eq("id", invoiceId)
        .eq("client_company_id", user.id)
        .single();

      if (verifyError || !invoice) {
        return res
          .status(403)
          .json({ error: "Invoice not found or unauthorized" });
      }

      const updateData: any = {};
      if (status) updateData.status = status;
      if (notes) updateData.notes = notes;

      const { data: updated, error: updateError } = await admin
        .from("corp_invoices")
        .update(updateData)
        .eq("id", invoiceId)
        .select()
        .single();

      if (updateError) {
        return res.status(500).json({ error: updateError.message });
      }

      // Log activity
      await admin.from("corp_activity_log").insert({
        company_id: user.id,
        actor_id: user.id,
        action: `updated_invoice_status_to_${status}`,
        resource_type: "invoice",
        resource_id: invoiceId,
        metadata: { old_status: invoice.status, new_status: status },
      });

      return res.status(200).json(updated);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Server error" });
  }
}
