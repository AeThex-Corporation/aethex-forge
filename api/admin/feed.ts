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
    // Get all posts for admin (including unpublished)
    try {
      const { limit = 50, offset = 0 } = req.query;

      const { data, error, count } = await supabase
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
        .order("created_at", { ascending: false })
        .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

      if (error) {
        console.error("[Admin Feed API] Query error:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({
        posts: data || [],
        total: count || 0,
        limit: parseInt(limit),
        offset: parseInt(offset),
      });
    } catch (error: any) {
      console.error("[Admin Feed API GET] Unexpected error:", error);
      return res.status(500).json({ error: error.message || "Internal server error" });
    }
  } else if (req.method === "POST") {
    // Create a new post
    try {
      const { title, content, arm_affiliation, author_id, tags, category, is_published } = req.body;

      // Validate required fields
      if (!title || !content || !arm_affiliation || !author_id) {
        return res.status(400).json({
          error: "Missing required fields: title, content, arm_affiliation, author_id",
        });
      }

      // Validate arm_affiliation
      const validArms = ["labs", "gameforge", "corp", "foundation", "devlink", "nexus", "staff"];
      if (!validArms.includes(arm_affiliation)) {
        return res.status(400).json({
          error: `Invalid arm_affiliation. Must be one of: ${validArms.join(", ")}`,
        });
      }

      const { data, error } = await supabase
        .from("community_posts")
        .insert({
          title,
          content,
          arm_affiliation,
          author_id,
          tags: tags || [],
          category: category || null,
          is_published: is_published !== false, // Default to true
        })
        .select()
        .single();

      if (error) {
        console.error("[Admin Feed API POST] Insert error:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json({
        post: data,
        message: "Post created successfully",
      });
    } catch (error: any) {
      console.error("[Admin Feed API POST] Unexpected error:", error);
      return res.status(500).json({ error: error.message || "Internal server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
