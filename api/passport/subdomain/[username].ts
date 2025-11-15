import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAdminClient } from "../../_supabase";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username } = req.query;

  if (!username || typeof username !== "string") {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const admin = getAdminClient();

    // Look up user by username
    const { data: user, error: userError } = await admin
      .from("user_profiles")
      .select(
        `
        id,
        username,
        full_name,
        email,
        bio,
        avatar_url,
        banner_url,
        location,
        website_url,
        github_url,
        linkedin_url,
        twitter_url,
        role,
        level,
        total_xp,
        user_type,
        experience_level,
        current_streak,
        longest_streak,
        created_at,
        updated_at
      `,
      )
      .eq("username", username)
      .single();

    if (userError) {
      if (userError.code === "PGRST116") {
        // No rows found
        return res.status(404).json({ error: "User not found" });
      }
      throw userError;
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get user's achievements
    const { data: achievements = [] } = await admin
      .from("user_achievements")
      .select(
        `
        achievement_id,
        achievements(
          id,
          name,
          description,
          icon,
          category
        )
      `,
      )
      .eq("user_id", user.id);

    // Get user's interests
    const { data: userInterests = [] } = await admin
      .from("user_interests")
      .select(
        `
        interest_id,
        interests(
          id,
          name,
          category
        )
      `,
      )
      .eq("user_id", user.id);

    // Get linked auth providers
    const { data: linkedProviders = [] } = await admin
      .from("user_auth_identities")
      .select("provider, linked_at, last_sign_in_at")
      .eq("user_id", user.id)
      .not("deleted_at", "is", null);

    return res.status(200).json({
      type: "creator",
      user: {
        ...user,
        achievements: achievements
          .map((a: any) => a.achievements)
          .filter(Boolean),
        interests: userInterests.map((i: any) => i.interests).filter(Boolean),
        linkedProviders,
      },
      domain: req.headers.host || "",
    });
  } catch (error: any) {
    console.error("[Passport Subdomain Error]", error);

    if (/SUPABASE_/.test(String(error?.message || ""))) {
      return res.status(500).json({
        error: `Server misconfigured: ${error.message}`,
      });
    }

    return res.status(500).json({
      error: error?.message || "Failed to load passport",
    });
  }
}
