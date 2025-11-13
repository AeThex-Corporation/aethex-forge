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
      const { user_id, limit = 20, offset = 0, unread_only } = req.query;

      if (!user_id) {
        return res.status(400).json({ error: "Missing user_id" });
      }

      // Build query
      let query = supabase
        .from("community_notifications")
        .select(
          `
          id,
          user_id,
          actor_id,
          post_id,
          collaboration_post_id,
          notification_type,
          title,
          description,
          read,
          created_at,
          user_profiles!community_notifications_actor_id_fkey (
            id,
            username,
            full_name,
            avatar_url
          )
        `,
          { count: "exact" },
        )
        .eq("user_id", user_id);

      // Filter by unread if specified
      if (unread_only === "true") {
        query = query.eq("read", false);
      }

      // Order and paginate
      query = query
        .order("created_at", { ascending: false })
        .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

      const { data, error, count } = await query;

      if (error) {
        console.error("[Notifications API] Query error:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({
        notifications: data || [],
        total: count || 0,
        limit: parseInt(limit),
        offset: parseInt(offset),
      });
    } catch (error: any) {
      console.error("[Notifications API GET] Unexpected error:", error);
      return res
        .status(500)
        .json({ error: error.message || "Internal server error" });
    }
  }

  if (req.method === "POST") {
    try {
      const {
        user_id,
        actor_id,
        post_id,
        collaboration_post_id,
        notification_type,
        title,
        description,
      } = req.body;

      if (!user_id || !actor_id || !notification_type || !title) {
        return res.status(400).json({
          error:
            "Missing required fields: user_id, actor_id, notification_type, title",
        });
      }

      if (!post_id && !collaboration_post_id) {
        return res.status(400).json({
          error: "Must provide either post_id or collaboration_post_id",
        });
      }

      // Don't notify user about their own actions
      if (user_id === actor_id) {
        return res.status(200).json({
          success: true,
          message: "Notification not created (user_id matches actor_id)",
        });
      }

      // Insert notification
      const { data, error } = await supabase
        .from("community_notifications")
        .insert({
          user_id,
          actor_id,
          post_id: post_id || null,
          collaboration_post_id: collaboration_post_id || null,
          notification_type,
          title,
          description: description || null,
        })
        .select(
          `
          id,
          user_id,
          actor_id,
          post_id,
          collaboration_post_id,
          notification_type,
          title,
          description,
          read,
          created_at,
          user_profiles!community_notifications_actor_id_fkey (
            id,
            username,
            full_name,
            avatar_url
          )
        `,
        );

      if (error) {
        console.error("[Notifications API] Insert error:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json({
        notification: data?.[0],
      });
    } catch (error: any) {
      console.error("[Notifications API POST] Unexpected error:", error);
      return res
        .status(500)
        .json({ error: error.message || "Internal server error" });
    }
  }

  if (req.method === "PUT") {
    try {
      const { id, user_id, read } = req.body;

      if (!id || !user_id) {
        return res.status(400).json({ error: "Missing id or user_id" });
      }

      // Verify ownership
      const { data: notification, error: fetchError } = await supabase
        .from("community_notifications")
        .select("user_id")
        .eq("id", id)
        .single();

      if (fetchError || !notification) {
        return res.status(404).json({ error: "Notification not found" });
      }

      if (notification.user_id !== user_id) {
        return res
          .status(403)
          .json({ error: "You can only manage your own notifications" });
      }

      // Update notification
      const { data, error } = await supabase
        .from("community_notifications")
        .update({ read })
        .eq("id", id)
        .select(
          `
          id,
          user_id,
          actor_id,
          post_id,
          collaboration_post_id,
          notification_type,
          title,
          description,
          read,
          created_at,
          user_profiles!community_notifications_actor_id_fkey (
            id,
            username,
            full_name,
            avatar_url
          )
        `,
        );

      if (error) {
        console.error("[Notifications API] Update error:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({
        notification: data?.[0],
      });
    } catch (error: any) {
      console.error("[Notifications API PUT] Unexpected error:", error);
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

      // Verify ownership
      const { data: notification, error: fetchError } = await supabase
        .from("community_notifications")
        .select("user_id")
        .eq("id", id)
        .single();

      if (fetchError || !notification) {
        return res.status(404).json({ error: "Notification not found" });
      }

      if (notification.user_id !== user_id) {
        return res
          .status(403)
          .json({ error: "You can only delete your own notifications" });
      }

      // Delete notification
      const { error } = await supabase
        .from("community_notifications")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("[Notifications API] Delete error:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({
        success: true,
        message: "Notification deleted successfully",
      });
    } catch (error: any) {
      console.error("[Notifications API DELETE] Unexpected error:", error);
      return res
        .status(500)
        .json({ error: error.message || "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
