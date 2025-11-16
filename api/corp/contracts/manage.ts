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
      // List contracts
      const status = req.query.status as string | undefined;
      const limit = parseInt((req.query.limit as string) || "50", 10);
      const offset = parseInt((req.query.offset as string) || "0", 10);

      let query = admin
        .from("corp_contracts")
        .select(
          `
          *,
          vendor:vendor_id(id, full_name, email),
          milestones:corp_contract_milestones(*)
        `,
        )
        .eq("client_company_id", user.id)
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

      // Calculate summary
      const { data: allContracts } = await admin
        .from("corp_contracts")
        .select("status, contract_value")
        .eq("client_company_id", user.id);

      const totalValue = (allContracts || []).reduce(
        (sum: number, c: any) => sum + (c.contract_value || 0),
        0,
      );

      const activeContracts = (allContracts || []).filter(
        (c: any) => c.status === "active",
      ).length;

      return res.status(200).json({
        contracts: contracts || [],
        summary: {
          total_value: totalValue,
          active_contracts: activeContracts,
          total_contracts: allContracts?.length || 0,
        },
        limit,
        offset,
      });
    }

    if (req.method === "POST") {
      // Create new contract
      const {
        contract_name,
        contract_type,
        vendor_id,
        description,
        start_date,
        end_date,
        contract_value,
      } = req.body;

      if (!contract_name || !contract_type || !vendor_id) {
        return res.status(400).json({
          error:
            "Missing required fields: contract_name, contract_type, vendor_id",
        });
      }

      const { data: contract, error: contractError } = await admin
        .from("corp_contracts")
        .insert({
          client_company_id: user.id,
          vendor_id,
          contract_name,
          contract_type,
          description: description || null,
          start_date: start_date || null,
          end_date: end_date || null,
          contract_value: contract_value || null,
          status: "draft",
        })
        .select()
        .single();

      if (contractError) {
        return res.status(500).json({ error: contractError.message });
      }

      // Log activity
      await admin.from("corp_activity_log").insert({
        company_id: user.id,
        actor_id: user.id,
        action: "created_contract",
        resource_type: "contract",
        resource_id: contract.id,
        metadata: { contract_name, vendor_id },
      });

      return res.status(201).json(contract);
    }

    if (req.method === "PUT") {
      // Update contract
      const { contractId, status, document_url, signed_at } = req.body;

      if (!contractId) {
        return res.status(400).json({ error: "contractId is required" });
      }

      // Verify ownership
      const { data: contract } = await admin
        .from("corp_contracts")
        .select("id, status")
        .eq("id", contractId)
        .eq("client_company_id", user.id)
        .single();

      if (!contract) {
        return res
          .status(403)
          .json({ error: "Contract not found or unauthorized" });
      }

      const updateData: any = {};
      if (status) updateData.status = status;
      if (document_url) updateData.document_url = document_url;
      if (signed_at) updateData.signed_at = signed_at;

      const { data: updated, error: updateError } = await admin
        .from("corp_contracts")
        .update(updateData)
        .eq("id", contractId)
        .select()
        .single();

      if (updateError) {
        return res.status(500).json({ error: updateError.message });
      }

      // Log activity
      await admin.from("corp_activity_log").insert({
        company_id: user.id,
        actor_id: user.id,
        action: `updated_contract_status_to_${status}`,
        resource_type: "contract",
        resource_id: contractId,
        metadata: { old_status: contract.status, new_status: status },
      });

      return res.status(200).json(updated);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Server error" });
  }
}
