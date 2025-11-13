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
  if (req.method === "GET") {
    try {
      const { post_id, limit = 20, offset = 0 } = req.query;

      if (!post_id) {
        return res.status(400).json({ error: "Missing post_id" });
      }

      // Fetch comments with author details
      const { data, error, count } = await supabase
        .from("community_comments")
        .select(
          `
          id,
          content,
          created_at,
          user_id,
          user_profiles!community_comments_user_id_fkey (
            id,
            username,
            full_name,
            avatar_url
          )
        `,
          { count: "exact" },
        )
        .eq("post_id", post_id)
        .order("created_at", { ascending: false })
        .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

      if (error) {
        console.error("[Comments API] Query error:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({
        comments: data || [],
        total: count || 0,
        limit: parseInt(limit),
        offset: parseInt(offset),
      });
    } catch (error: any) {
      console.error("[Comments API] Unexpected error:", error);
      return res
        .status(500)
        .json({ error: error.message || "Internal server error" });
    }
  }

  if (req.method === "POST") {
    try {
      const { post_id, user_id, content } = req.body;

      if (!post_id || !user_id || !content) {
        return res
          .status(400)
          .json({ error: "Missing post_id, user_id, or content" });
      }

      if (content.trim().length === 0) {
        return res
          .status(400)
          .json({ error: "Comment content cannot be empty" });
      }

      if (content.length > 1000) {
        return res
          .status(400)
          .json({ error: "Comment content exceeds 1000 characters" });
      }

      // Insert comment
      const { data, error } = await supabase
        .from("community_comments")
        .insert({
          post_id,
          user_id,
          content,
        })
        .select(
          `
          id,
          content,
          created_at,
          user_id,
          user_profiles!community_comments_user_id_fkey (
            id,
            username,
            full_name,
            avatar_url
          )
        `,
        );

      if (error) {
        console.error("[Comments API] Insert error:", error);
        return res.status(500).json({ error: error.message });
      }

      // Get updated count
      const { count, error: countError } = await supabase
        .from("community_comments")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post_id);

      if (countError) {
        console.error("[Comments API] Count error:", countError);
        return res.status(500).json({ error: countError.message });
      }

      return res.status(201).json({
        comment: data?.[0],
        comments_count: count || 0,
      });
    } catch (error: any) {
      console.error("[Comments API] Unexpected error:", error);
      return res
        .status(500)
        .json({ error: error.message || "Internal server error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { comment_id, user_id } = req.body;

      if (!comment_id || !user_id) {
        return res.status(400).json({ error: "Missing comment_id or user_id" });
      }

      // Get comment to verify ownership
      const { data: comment, error: fetchError } = await supabase
        .from("community_comments")
        .select("user_id, post_id")
        .eq("id", comment_id)
        .single();

      if (fetchError) {
        console.error("[Comments API] Fetch error:", fetchError);
        return res.status(404).json({ error: "Comment not found" });
      }

      if (comment.user_id !== user_id) {
        return res
          .status(403)
          .json({ error: "You can only delete your own comments" });
      }

      // Delete comment
      const { error: deleteError } = await supabase
        .from("community_comments")
        .delete()
        .eq("id", comment_id);

      if (deleteError) {
        console.error("[Comments API] Delete error:", deleteError);
        return res.status(500).json({ error: deleteError.message });
      }

      // Get updated count
      const { count, error: countError } = await supabase
        .from("community_comments")
        .select("*", { count: "exact", head: true })
        .eq("post_id", comment.post_id);

      if (countError) {
        console.error("[Comments API] Count error:", countError);
        return res.status(500).json({ error: countError.message });
      }

      return res.status(200).json({
        success: true,
        comments_count: count || 0,
      });
    } catch (error: any) {
      console.error("[Comments API] Unexpected error:", error);
      return res
        .status(500)
        .json({ error: error.message || "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
