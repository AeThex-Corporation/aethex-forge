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
      const {
        title,
        content,
        arm_affiliation,
        creator_id,
        collaborator_ids,
        tags,
        category,
      } = req.body;

      // Validate required fields
      if (!title || !content || !arm_affiliation || !creator_id) {
        return res.status(400).json({
          error:
            "Missing required fields: title, content, arm_affiliation, creator_id",
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

      // Validate creator exists
      const { data: creator, error: creatorError } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("id", creator_id)
        .single();

      if (creatorError || !creator) {
        return res.status(401).json({ error: "Creator not found" });
      }

      // Insert the collaboration post
      const { data: postData, error: postError } = await supabase
        .from("collaboration_posts")
        .insert({
          title: title.trim(),
          content: content.trim(),
          arm_affiliation,
          created_by: creator_id,
          tags: tags || [],
          category: category || null,
          is_published: true,
          likes_count: 0,
          comments_count: 0,
        })
        .select("id");

      if (postError) {
        console.error("[Collaboration Posts API] Insert error:", postError);
        return res.status(500).json({ error: postError.message });
      }

      const postId = postData?.[0]?.id;
      if (!postId) {
        return res.status(500).json({ error: "Failed to create post" });
      }

      // Add creator as author
      await supabase.from("collaboration_posts_authors").insert({
        collaboration_post_id: postId,
        user_id: creator_id,
        role: "creator",
      });

      // Add collaborators if provided
      if (
        collaborator_ids &&
        Array.isArray(collaborator_ids) &&
        collaborator_ids.length > 0
      ) {
        const collaboratorInserts = collaborator_ids
          .filter((id: string) => id !== creator_id) // Exclude creator from collaborators
          .map((id: string) => ({
            collaboration_post_id: postId,
            user_id: id,
            role: "contributor",
          }));

        if (collaboratorInserts.length > 0) {
          await supabase
            .from("collaboration_posts_authors")
            .insert(collaboratorInserts);
        }
      }

      // Fetch the complete post with authors
      const { data, error: fetchError } = await supabase
        .from("collaboration_posts")
        .select(
          `
          id,
          title,
          content,
          arm_affiliation,
          created_by,
          created_at,
          updated_at,
          is_published,
          likes_count,
          comments_count,
          tags,
          category,
          user_profiles!collaboration_posts_created_by_fkey (
            id,
            username,
            full_name,
            avatar_url
          ),
          collaboration_posts_authors (
            user_id,
            role,
            user_profiles!collaboration_posts_authors_user_id_fkey (
              id,
              username,
              full_name,
              avatar_url
            )
          )
        `,
        )
        .eq("id", postId)
        .single();

      if (fetchError) {
        console.error("[Collaboration Posts API] Fetch error:", fetchError);
        return res.status(500).json({ error: fetchError.message });
      }

      return res.status(201).json({
        post: data,
      });
    } catch (error: any) {
      console.error("[Collaboration Posts API POST] Unexpected error:", error);
      return res
        .status(500)
        .json({ error: error.message || "Internal server error" });
    }
  }

  if (req.method === "GET") {
    try {
      const { arm_filter, limit = 20, offset = 0 } = req.query;

      // Build query
      let query = supabase
        .from("collaboration_posts")
        .select(
          `
          id,
          title,
          content,
          arm_affiliation,
          created_by,
          created_at,
          updated_at,
          is_published,
          likes_count,
          comments_count,
          tags,
          category,
          user_profiles!collaboration_posts_created_by_fkey (
            id,
            username,
            full_name,
            avatar_url
          ),
          collaboration_posts_authors (
            user_id,
            role,
            user_profiles!collaboration_posts_authors_user_id_fkey (
              id,
              username,
              full_name,
              avatar_url
            )
          )
        `,
          { count: "exact" },
        )
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      // Apply arm filter if specified
      if (arm_filter) {
        const armIds = Array.isArray(arm_filter) ? arm_filter : [arm_filter];
        query = query.in("arm_affiliation", armIds);
      }

      // Apply pagination
      query = query.range(
        parseInt(offset),
        parseInt(offset) + parseInt(limit) - 1,
      );

      const { data, error, count } = await query;

      if (error) {
        console.error("[Collaboration Posts API] Query error:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({
        posts: data || [],
        total: count || 0,
        limit: parseInt(limit),
        offset: parseInt(offset),
      });
    } catch (error: any) {
      console.error("[Collaboration Posts API GET] Unexpected error:", error);
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
        .from("collaboration_posts")
        .select("created_by")
        .eq("id", id)
        .single();

      if (fetchError) {
        console.error("[Collaboration Posts API] Fetch error:", fetchError);
        return res.status(404).json({ error: "Post not found" });
      }

      if (post.created_by !== user_id) {
        return res
          .status(403)
          .json({ error: "You can only edit posts you created" });
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
        .from("collaboration_posts")
        .update(updateData)
        .eq("id", id)
        .select(
          `
          id,
          title,
          content,
          arm_affiliation,
          created_by,
          created_at,
          updated_at,
          is_published,
          likes_count,
          comments_count,
          tags,
          category,
          user_profiles!collaboration_posts_created_by_fkey (
            id,
            username,
            full_name,
            avatar_url
          ),
          collaboration_posts_authors (
            user_id,
            role,
            user_profiles!collaboration_posts_authors_user_id_fkey (
              id,
              username,
              full_name,
              avatar_url
            )
          )
        `,
        );

      if (error) {
        console.error("[Collaboration Posts API] Update error:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({
        post: data?.[0],
      });
    } catch (error: any) {
      console.error("[Collaboration Posts API PUT] Unexpected error:", error);
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
        .from("collaboration_posts")
        .select("created_by")
        .eq("id", id)
        .single();

      if (fetchError) {
        console.error("[Collaboration Posts API] Fetch error:", fetchError);
        return res.status(404).json({ error: "Post not found" });
      }

      if (post.created_by !== user_id) {
        return res
          .status(403)
          .json({ error: "You can only delete posts you created" });
      }

      // Delete the post (cascade will delete likes, comments, and authors)
      const { error } = await supabase
        .from("collaboration_posts")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("[Collaboration Posts API] Delete error:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({
        success: true,
        message: "Post deleted successfully",
      });
    } catch (error: any) {
      console.error(
        "[Collaboration Posts API DELETE] Unexpected error:",
        error,
      );
      return res
        .status(500)
        .json({ error: error.message || "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
