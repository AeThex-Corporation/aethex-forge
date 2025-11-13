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
  try {
    const { user_id, arm_id, action } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: "Missing user_id" });
    }

    if (req.method === "GET") {
      // Get all followed arms for a user
      const { data, error } = await supabase
        .from("user_followed_arms")
        .select("arm_id")
        .eq("user_id", user_id);

      if (error) {
        console.error("[Followed Arms API] Query error:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({
        followedArms: (data || []).map((row: any) => row.arm_id),
      });
    } else if (req.method === "POST") {
      // Follow or unfollow an arm
      if (!arm_id || !action || !["follow", "unfollow"].includes(action)) {
        return res.status(400).json({
          error: "Missing or invalid parameters: arm_id, action (follow/unfollow)",
        });
      }

      const validArms = ["labs", "gameforge", "corp", "foundation", "devlink", "nexus", "staff"];
      if (!validArms.includes(arm_id)) {
        return res.status(400).json({
          error: `Invalid arm_id. Must be one of: ${validArms.join(", ")}`,
        });
      }

      if (action === "follow") {
        // Follow arm
        const { error } = await supabase.from("user_followed_arms").insert({
          user_id,
          arm_id,
        });

        if (error) {
          if (error.code === "23505") {
            // Unique constraint violation - already following
            return res.status(200).json({
              message: "Already following this arm",
              arm_id,
            });
          }
          console.error("[Followed Arms API] Insert error:", error);
          return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({
          message: "Arm followed successfully",
          arm_id,
        });
      } else {
        // Unfollow arm
        const { error } = await supabase
          .from("user_followed_arms")
          .delete()
          .eq("user_id", user_id)
          .eq("arm_id", arm_id);

        if (error) {
          console.error("[Followed Arms API] Delete error:", error);
          return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({
          message: "Arm unfollowed successfully",
          arm_id,
        });
      }
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error: any) {
    console.error("[Followed Arms API] Unexpected error:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}
