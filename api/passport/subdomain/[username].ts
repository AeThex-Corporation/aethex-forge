import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAdminClient } from "../../_supabase.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username } = req.query;

  if (!username || typeof username !== "string") {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    console.log("[Passport] Subdomain request for:", username);
    const admin = getAdminClient();

    const userFields = `
      id,
      username,
      full_name,
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
    `;

    // Try to look up user by username first (exact match)
    let user: any = null;

    try {
      const result = await admin
        .from("user_profiles")
        .select(userFields)
        .eq("username", username)
        .single();
      user = result.data;
    } catch (e) {
      console.log(
        "[Passport] Username exact match failed, trying ilike:",
        e?.message,
      );
      // Try case-insensitive match
      try {
        const result2 = await admin
          .from("user_profiles")
          .select(userFields)
          .ilike("username", username)
          .limit(1)
          .single();
        user = result2.data;
      } catch (e2) {
        // Continue to ID lookup
      }
    }

    // If not found by username, try by exact ID match
    if (!user) {
      try {
        const result = await admin
          .from("user_profiles")
          .select(userFields)
          .eq("id", username)
          .single();
        user = result.data;
      } catch (e) {
        // Continue to error handling
      }
    }

    if (!user) {
      console.log("[Passport] User not found for username:", username);
      return res.status(404).json({ error: "User not found", username });
    }

    console.log("[Passport] Found user:", user.username, user.id);

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
      .select("interest")
      .eq("user_id", user.id);

    // Get linked auth providers
    const { data: linkedProviders = [] } = await admin
      .from("user_auth_identities")
      .select("provider, linked_at, last_sign_in_at")
      .eq("user_id", user.id);

    return res.status(200).json({
      type: "creator",
      user: {
        ...user,
        achievements: achievements
          .map((a: any) => a.achievements)
          .filter(Boolean),
        interests: userInterests.map((i: any) => i.interest).filter(Boolean),
        linkedProviders,
      },
      domain: req.headers.host || "",
    });
  } catch (error: any) {
    console.error("[Passport Subdomain Error]", {
      message: error?.message || String(error),
      code: error?.code,
      status: error?.status,
      details: error?.details || error?.hint,
    });

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
