import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!,
);

export default async function handler(req: any, res: any) {
  const { id } = req.query;

  if (req.method === "PUT") {
    try {
      const { approval_status } = req.body;

      if (!["pending", "approved", "rejected"].includes(approval_status)) {
        return res.status(400).json({ error: "Invalid approval status" });
      }

      const { data, error } = await supabase
        .from("foundation_mentors")
        .update({
          approval_status,
          approved_by: req.user?.id, // Assumes middleware sets req.user
          approved_at:
            approval_status === "approved" ? new Date().toISOString() : null,
        })
        .eq("user_id", id)
        .select();

      if (error) throw error;

      res.status(200).json(data);
    } catch (error: any) {
      res
        .status(500)
        .json({ error: error.message || "Failed to update mentor" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
