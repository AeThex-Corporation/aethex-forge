export const config = {
  runtime: "nodejs",
};

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE;

if (!supabaseUrl || !supabaseServiceRole) {
  throw new Error("Missing Supabase configuration");
}

const supabase = createClient(supabaseUrl, supabaseServiceRole);

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { user_id, arm_filter, limit = 20, offset = 0 } = req.query;

    // Build query
    let query = supabase
      .from("community_posts")
      .select(
        `
        id,
        title,
        content,
        arm_affiliation,
        author_id,
        created_at,
        updated_at,
        is_published,
        likes_count,
        comments_count,
        tags,
        category,
        user_profiles!community_posts_author_id_fkey (
          id,
          username,
          full_name,
          avatar_url
        )
      `,
        { count: "exact" }
      )
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    // Apply arm filter if specified
    if (arm_filter) {
      const armIds = Array.isArray(arm_filter)
        ? arm_filter
        : [arm_filter];
      query = query.in("arm_affiliation", armIds);
    }

    // Apply pagination
    query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error("[Feed API] Query error:", error);
      return res.status(500).json({ error: error.message });
    }

    // If user_id provided, check which arms they follow and get their followed arms
    let userFollowedArms: string[] = [];
    if (user_id) {
      const { data: followedData, error: followError } = await supabase
        .from("user_followed_arms")
        .select("arm_id")
        .eq("user_id", user_id);

      if (!followError && followedData) {
        userFollowedArms = followedData.map((row: any) => row.arm_id);
      }
    }

    return res.status(200).json({
      posts: data || [],
      total: count || 0,
      limit: parseInt(limit),
      offset: parseInt(offset),
      userFollowedArms,
    });
  } catch (error: any) {
    console.error("[Feed API] Unexpected error:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}
