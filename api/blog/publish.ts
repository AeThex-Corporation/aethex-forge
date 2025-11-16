import { createClient } from "@supabase/supabase-js";
import {
  publishPostToGhost,
  updatePostInGhost,
} from "../../server/ghost-admin-api";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE || "";

const supabase =
  supabaseUrl && supabaseServiceRole
    ? createClient(supabaseUrl, supabaseServiceRole)
    : null;

async function isUserAdminOrStaff(userId: string): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .in("role", ["admin", "staff"])
      .single();

    return !error && !!data;
  } catch {
    return false;
  }
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get user from session or auth header
    const userId = req.user?.id || req.query.user_id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if user is admin or staff
    const isAuthorized = await isUserAdminOrStaff(userId);
    if (!isAuthorized) {
      return res
        .status(403)
        .json({ error: "Forbidden: Admin/Staff access required" });
    }

    const {
      title,
      excerpt,
      html,
      slug,
      feature_image,
      published_at,
      status = "published",
      tags,
      meta_description,
      meta_title,
      post_id, // for updates
    } = req.body;

    // Validate required fields
    if (!title || !html) {
      return res.status(400).json({ error: "Title and body are required" });
    }

    // Publish or update post
    let result;
    if (post_id) {
      result = await updatePostInGhost(post_id, {
        title,
        excerpt,
        html,
        feature_image,
        published_at,
        status,
        tags: tags?.map((tag: string) => ({ name: tag })) || [],
        meta_description,
        meta_title,
      });
    } else {
      result = await publishPostToGhost({
        title,
        excerpt,
        html,
        slug,
        feature_image,
        published_at,
        status,
        tags: tags?.map((tag: string) => ({ name: tag })) || [],
        meta_description,
        meta_title,
      });
    }

    return res.status(200).json({
      success: true,
      postId: result.id,
      url: result.url,
    });
  } catch (error: any) {
    console.error("Blog publish API error:", error);
    return res.status(500).json({
      error: "Failed to publish post",
      message: error?.message || "Unknown error",
    });
  }
}
