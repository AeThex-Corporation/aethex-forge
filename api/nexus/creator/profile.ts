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
      // Get creator profile
      const { data: profile, error: profileError } = await admin
        .from("nexus_creator_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        return res.status(500).json({ error: profileError.message });
      }

      // If no profile exists, return defaults
      if (!profile) {
        return res.status(200).json({
          user_id: user.id,
          headline: "",
          bio: "",
          profile_image_url: null,
          skills: [],
          experience_level: "intermediate",
          hourly_rate: null,
          portfolio_url: null,
          availability_status: "available",
          availability_hours_per_week: null,
          verified: false,
          total_earnings: 0,
          rating: null,
          review_count: 0,
          created_at: null,
          updated_at: null,
        });
      }

      return res.status(200).json(profile);
    }

    if (req.method === "POST") {
      // Create or update creator profile
      const {
        headline,
        bio,
        profile_image_url,
        skills,
        experience_level,
        hourly_rate,
        portfolio_url,
        availability_status,
        availability_hours_per_week,
      } = req.body;

      const { data: profile, error: upsertError } = await admin
        .from("nexus_creator_profiles")
        .upsert(
          {
            user_id: user.id,
            headline: headline || null,
            bio: bio || null,
            profile_image_url: profile_image_url || null,
            skills: Array.isArray(skills) ? skills : [],
            experience_level: experience_level || "intermediate",
            hourly_rate: hourly_rate || null,
            portfolio_url: portfolio_url || null,
            availability_status: availability_status || "available",
            availability_hours_per_week: availability_hours_per_week || null,
          },
          { onConflict: "user_id" },
        )
        .select()
        .single();

      if (upsertError) {
        return res.status(500).json({ error: upsertError.message });
      }

      return res.status(200).json(profile);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Server error" });
  }
}
