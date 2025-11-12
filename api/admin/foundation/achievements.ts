import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!,
);

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    try {
      const { data: achievements, error } = await supabase
        .from("foundation_achievements")
        .select("*")
        .order("tier", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;

      res.status(200).json(achievements || []);
    } catch (error: any) {
      res.status(500).json({
        error: error.message || "Failed to fetch achievements",
      });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
