import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!,
);

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    try {
      const { data: disputes, error } = await supabase
        .from("nexus_disputes")
        .select(
          `
        id,
        contract_id,
        reason,
        status,
        created_at,
        resolution_notes,
        user_profiles!nexus_disputes_reported_by_fkey (
          id,
          email
        )
      `,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedDisputes = (disputes || []).map((d: any) => ({
        id: d.id,
        contract_id: d.contract_id,
        reason: d.reason,
        status: d.status,
        created_at: d.created_at,
        resolution_notes: d.resolution_notes,
        reported_by_email: d.user_profiles?.email,
      }));

      res.status(200).json(formattedDisputes);
    } catch (error: any) {
      res
        .status(500)
        .json({ error: error.message || "Failed to fetch disputes" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
