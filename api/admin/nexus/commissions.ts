import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!,
);

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    try {
      const { data: commissions, error } = await supabase
        .from("nexus_commission_ledger")
        .select("*")
        .order("period_start", { ascending: false });

      if (error) throw error;

      res.status(200).json(commissions || []);
    } catch (error: any) {
      res
        .status(500)
        .json({ error: error.message || "Failed to fetch commissions" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
