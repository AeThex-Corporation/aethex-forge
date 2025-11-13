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
  if (req.method === "POST") {
    try {
      const { post_id, user_id } = req.body;

      if (!post_id || !user_id) {
        return res.status(400).json({ error: "Missing post_id or user_id" });
      }

      // Check if user has already liked this post
      const { data: existingLike, error: checkError } = await supabase
        .from("community_post_likes")
        .select("post_id")
        .eq("post_id", post_id)
        .eq("user_id", user_id)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        console.error("[Likes API] Check error:", checkError);
        return res.status(500).json({ error: checkError.message });
      }

      if (existingLike) {
        // Unlike: delete the like
        const { error: deleteError } = await supabase
          .from("community_post_likes")
          .delete()
          .eq("post_id", post_id)
          .eq("user_id", user_id);

        if (deleteError) {
          console.error("[Likes API] Delete error:", deleteError);
          return res.status(500).json({ error: deleteError.message });
        }

        // Get updated count
        const { count, error: countError } = await supabase
          .from("community_post_likes")
          .select("*", { count: "exact", head: true })
          .eq("post_id", post_id);

        if (countError) {
          console.error("[Likes API] Count error:", countError);
          return res.status(500).json({ error: countError.message });
        }

        return res.status(200).json({
          liked: false,
          likes_count: count || 0,
        });
      } else {
        // Like: insert new like
        const { error: insertError } = await supabase
          .from("community_post_likes")
          .insert({ post_id, user_id });

        if (insertError) {
          console.error("[Likes API] Insert error:", insertError);
          return res.status(500).json({ error: insertError.message });
        }

        // Get updated count
        const { count, error: countError } = await supabase
          .from("community_post_likes")
          .select("*", { count: "exact", head: true })
          .eq("post_id", post_id);

        if (countError) {
          console.error("[Likes API] Count error:", countError);
          return res.status(500).json({ error: countError.message });
        }

        return res.status(200).json({
          liked: true,
          likes_count: count || 0,
        });
      }
    } catch (error: any) {
      console.error("[Likes API] Unexpected error:", error);
      return res
        .status(500)
        .json({ error: error.message || "Internal server error" });
    }
  }

  if (req.method === "GET") {
    try {
      const { post_id, user_id } = req.query;

      if (!post_id) {
        return res.status(400).json({ error: "Missing post_id" });
      }

      // Get total likes count
      const { count, error: countError } = await supabase
        .from("community_post_likes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post_id);

      if (countError) {
        console.error("[Likes API] Count error:", countError);
        return res.status(500).json({ error: countError.message });
      }

      // Check if specific user has liked
      let userLiked = false;
      if (user_id) {
        const { data, error: likeError } = await supabase
          .from("community_post_likes")
          .select("post_id")
          .eq("post_id", post_id)
          .eq("user_id", user_id)
          .single();

        if (likeError && likeError.code !== "PGRST116") {
          console.error("[Likes API] Like check error:", likeError);
          return res.status(500).json({ error: likeError.message });
        }

        userLiked = !!data;
      }

      return res.status(200).json({
        likes_count: count || 0,
        userLiked,
      });
    } catch (error: any) {
      console.error("[Likes API] Unexpected error:", error);
      return res
        .status(500)
        .json({ error: error.message || "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
