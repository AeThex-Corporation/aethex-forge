import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!,
);

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    try {
      const { data: opportunities, error } = await supabase
        .from("nexus_opportunities")
        .select(
          `
        id,
        title,
        category,
        budget_min,
        budget_max,
        status,
        application_count,
        is_featured,
        created_at,
        user_profiles!nexus_opportunities_posted_by_fkey (
          id,
          email
        )
      `,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedOpp = (opportunities || []).map((o: any) => ({
        id: o.id,
        title: o.title,
        category: o.category,
        budget_min: o.budget_min,
        budget_max: o.budget_max,
        status: o.status,
        application_count: o.application_count,
        is_featured: o.is_featured,
        created_at: o.created_at,
        posted_by_email: o.user_profiles?.email,
      }));

      res.status(200).json(formattedOpp);
    } catch (error: any) {
      res.status(500).json({
        error: error.message || "Failed to fetch opportunities",
      });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
