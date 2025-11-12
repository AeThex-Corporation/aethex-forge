import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!,
);

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    try {
      // Fetch all mentors with user details
      const { data: mentors, error } = await supabase
        .from("foundation_mentors")
        .select(
          `
        user_id,
        bio,
        expertise,
        available,
        max_mentees,
        current_mentees,
        approval_status,
        user_profiles!foundation_mentors_user_id_fkey (
          id,
          full_name,
          email
        )
      `,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Format response
      const formattedMentors = (mentors || []).map((m: any) => ({
        user_id: m.user_id,
        bio: m.bio,
        expertise: m.expertise,
        available: m.available,
        max_mentees: m.max_mentees,
        current_mentees: m.current_mentees,
        approval_status: m.approval_status,
        user_name: m.user_profiles?.full_name,
        user_email: m.user_profiles?.email,
      }));

      res.status(200).json(formattedMentors);
    } catch (error: any) {
      res
        .status(500)
        .json({ error: error.message || "Failed to fetch mentors" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
