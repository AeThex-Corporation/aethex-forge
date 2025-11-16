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

const VALID_ARMS = [
  "labs",
  "gameforge",
  "corp",
  "foundation",
  "devlink",
  "nexus",
  "staff",
];

export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    try {
      const { title, content, arm_affiliation, author_id, tags, category } =
        req.body;

      // Validate required fields
      if (!title || !content || !arm_affiliation || !author_id) {
        return res.status(400).json({
          error:
            "Missing required fields: title, content, arm_affiliation, author_id",
        });
      }

      // Validate arm_affiliation
      if (!VALID_ARMS.includes(arm_affiliation)) {
        return res.status(400).json({
          error: `Invalid arm_affiliation. Must be one of: ${VALID_ARMS.join(", ")}`,
        });
      }

      // Validate content length
      if (title.trim().length === 0 || title.length > 500) {
        return res
          .status(400)
          .json({ error: "Title must be between 1 and 500 characters" });
      }

      if (content.trim().length === 0 || content.length > 5000) {
        return res
          .status(400)
          .json({ error: "Content must be between 1 and 5000 characters" });
      }

      // Validate author exists
      const { data: author, error: authorError } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("id", author_id)
        .single();

      if (authorError || !author) {
        return res.status(401).json({ error: "User not found" });
      }

      // Insert the post (published by default for users)
      const { data, error } = await supabase
        .from("community_posts")
        .insert({
          title: title.trim(),
          content: content.trim(),
          arm_affiliation,
          author_id,
          tags: tags || [],
          category: category || null,
          is_published: true,
          likes_count: 0,
          comments_count: 0,
        })
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
        );

      if (error) {
        console.error("[Community Posts API] Insert error:", error);
        return res.status(500).json({ error: error.message });
      }

      const createdPost = data?.[0] as any;

      // Sync post to Discord feed webhook
      try {
        const apiBase = process.env.API_BASE || "/api";
        await fetch(`${apiBase}/discord/feed-sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: createdPost?.id,
            title: createdPost?.title,
            content: createdPost?.content,
            author_name:
              createdPost?.user_profiles?.full_name ||
              createdPost?.user_profiles?.username ||
              "Community member",
            author_avatar: createdPost?.user_profiles?.avatar_url,
            arm_affiliation: createdPost?.arm_affiliation,
            likes_count: createdPost?.likes_count,
            comments_count: createdPost?.comments_count,
            created_at: createdPost?.created_at,
          }),
        }).catch((err) =>
          console.error("[Posts API] Discord sync error:", err),
        );
      } catch (error) {
        console.error("[Posts API] Failed to sync to Discord:", error);
      }

      // Publish activity event for post creation
      try {
        const apiBase = process.env.API_BASE || "/api";
        await fetch(`${apiBase}/activity/publish`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            actor_id: author_id,
            verb: "created",
            object_type: "post",
            object_id: createdPost?.id,
            metadata: {
              summary: `Posted to ${arm_affiliation}`,
              title: title.substring(0, 100),
            },
          }),
        }).catch((err) =>
          console.error("[Posts API] Activity publish error:", err),
        );
      } catch (error) {
        console.error("[Posts API] Failed to publish activity:", error);
      }

      // Apply rewards for post creation
      try {
        const apiBase = process.env.API_BASE || "/api";
        await fetch(`${apiBase}/rewards/apply`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: author_id,
            action: "post_created",
            amount: 25,
          }),
        }).catch((err) =>
          console.error("[Posts API] Rewards apply error:", err),
        );
      } catch (error) {
        console.error("[Posts API] Failed to apply rewards:", error);
      }

      return res.status(201).json({
        post: createdPost,
      });
    } catch (error: any) {
      console.error("[Community Posts API POST] Unexpected error:", error);
      return res
        .status(500)
        .json({ error: error.message || "Internal server error" });
    }
  }

  if (req.method === "PUT") {
    try {
      const { id, title, content, arm_affiliation, category, tags, user_id } =
        req.body;

      if (!id || !user_id) {
        return res.status(400).json({ error: "Missing id or user_id" });
      }

      // Get the post to verify ownership
      const { data: post, error: fetchError } = await supabase
        .from("community_posts")
        .select("author_id")
        .eq("id", id)
        .single();

      if (fetchError) {
        console.error("[Community Posts API] Fetch error:", fetchError);
        return res.status(404).json({ error: "Post not found" });
      }

      if (post.author_id !== user_id) {
        return res
          .status(403)
          .json({ error: "You can only edit your own posts" });
      }

      // Validate updates
      if (title && (title.trim().length === 0 || title.length > 500)) {
        return res
          .status(400)
          .json({ error: "Title must be between 1 and 500 characters" });
      }

      if (content && (content.trim().length === 0 || content.length > 5000)) {
        return res
          .status(400)
          .json({ error: "Content must be between 1 and 5000 characters" });
      }

      if (arm_affiliation && !VALID_ARMS.includes(arm_affiliation)) {
        return res.status(400).json({
          error: `Invalid arm_affiliation. Must be one of: ${VALID_ARMS.join(", ")}`,
        });
      }

      // Build update object
      const updateData: any = {};
      if (title) updateData.title = title.trim();
      if (content) updateData.content = content.trim();
      if (arm_affiliation) updateData.arm_affiliation = arm_affiliation;
      if (category !== undefined) updateData.category = category;
      if (tags) updateData.tags = tags;

      const { data, error } = await supabase
        .from("community_posts")
        .update(updateData)
        .eq("id", id)
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
        );

      if (error) {
        console.error("[Community Posts API] Update error:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({
        post: data?.[0],
      });
    } catch (error: any) {
      console.error("[Community Posts API PUT] Unexpected error:", error);
      return res
        .status(500)
        .json({ error: error.message || "Internal server error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { id, user_id } = req.body;

      if (!id || !user_id) {
        return res.status(400).json({ error: "Missing id or user_id" });
      }

      // Get the post to verify ownership
      const { data: post, error: fetchError } = await supabase
        .from("community_posts")
        .select("author_id")
        .eq("id", id)
        .single();

      if (fetchError) {
        console.error("[Community Posts API] Fetch error:", fetchError);
        return res.status(404).json({ error: "Post not found" });
      }

      if (post.author_id !== user_id) {
        return res
          .status(403)
          .json({ error: "You can only delete your own posts" });
      }

      // Delete the post (cascade will delete likes and comments)
      const { error } = await supabase
        .from("community_posts")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("[Community Posts API] Delete error:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({
        success: true,
        message: "Post deleted successfully",
      });
    } catch (error: any) {
      console.error("[Community Posts API DELETE] Unexpected error:", error);
      return res
        .status(500)
        .json({ error: error.message || "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
