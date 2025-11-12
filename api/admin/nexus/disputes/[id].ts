import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!,
);

export default async function handler(req: any, res: any) {
  const { id } = req.query;

  if (req.method === "PUT") {
    try {
      const { status, resolution_notes } = req.body;

      if (!["open", "reviewing", "resolved", "escalated"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const updateData: any = {
        status,
        resolution_notes,
        resolved_by: req.user?.id, // Assumes middleware sets req.user
      };

      if (status === "resolved" || status === "escalated") {
        updateData.resolved_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from("nexus_disputes")
        .update(updateData)
        .eq("id", id)
        .select();

      if (error) throw error;

      res.status(200).json(data);
    } catch (error: any) {
      res
        .status(500)
        .json({ error: error.message || "Failed to update dispute" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
