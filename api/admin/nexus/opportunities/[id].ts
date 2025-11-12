import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!,
);

export default async function handler(req: any, res: any) {
  const { id } = req.query;

  if (req.method === "PUT") {
    try {
      const { status, is_featured } = req.body;
      const updateData: any = {};

      if (status) {
        if (
          !["open", "in_progress", "filled", "closed", "cancelled"].includes(
            status,
          )
        ) {
          return res.status(400).json({ error: "Invalid status" });
        }
        updateData.status = status;
        if (status === "closed" || status === "filled") {
          updateData.closed_at = new Date().toISOString();
        }
      }

      if (typeof is_featured === "boolean") {
        updateData.is_featured = is_featured;
      }

      const { data, error } = await supabase
        .from("nexus_opportunities")
        .update(updateData)
        .eq("id", id)
        .select();

      if (error) throw error;

      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({
        error: error.message || "Failed to update opportunity",
      });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
