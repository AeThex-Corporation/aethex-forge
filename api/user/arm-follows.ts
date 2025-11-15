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
  const userId = req.query.user_id;

  if (!userId) {
    return res.status(400).json({ error: "Missing user_id" });
  }

  if (req.method === "GET") {
    try {
      const { data, error } = await supabase
        .from("arm_follows")
        .select("arm_affiliation")
        .eq("user_id", userId)
        .order("followed_at", { ascending: false });

      if (error) {
        console.error("[ARM Follows API] Query error:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({
        arms: (data || []).map((row: any) => row.arm_affiliation),
      });
    } catch (error: any) {
      console.error("[ARM Follows API GET] Unexpected error:", error);
      return res
        .status(500)
        .json({ error: error.message || "Internal server error" });
    }
  }

  if (req.method === "POST") {
    try {
      const { arm_affiliation } = req.body;

      if (!arm_affiliation) {
        return res.status(400).json({ error: "Missing arm_affiliation" });
      }

      if (!VALID_ARMS.includes(arm_affiliation)) {
        return res.status(400).json({
          error: `Invalid arm_affiliation. Must be one of: ${VALID_ARMS.join(", ")}`,
        });
      }

      // Check if already following
      const { data: existing, error: checkError } = await supabase
        .from("arm_follows")
        .select("id")
        .eq("user_id", userId)
        .eq("arm_affiliation", arm_affiliation)
        .single();

      if (!checkError && existing) {
        return res.status(409).json({
          error: "Already following this arm",
        });
      }

      // Follow the arm
      const { data, error } = await supabase
        .from("arm_follows")
        .insert({
          user_id: userId,
          arm_affiliation,
        })
        .select("arm_affiliation, followed_at");

      if (error) {
        console.error("[ARM Follows API] Insert error:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json({
        success: true,
        arm: data?.[0],
      });
    } catch (error: any) {
      console.error("[ARM Follows API POST] Unexpected error:", error);
      return res
        .status(500)
        .json({ error: error.message || "Internal server error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { arm_affiliation } = req.body;

      if (!arm_affiliation) {
        return res.status(400).json({ error: "Missing arm_affiliation" });
      }

      // Unfollow the arm
      const { error } = await supabase
        .from("arm_follows")
        .delete()
        .eq("user_id", userId)
        .eq("arm_affiliation", arm_affiliation);

      if (error) {
        console.error("[ARM Follows API] Delete error:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({
        success: true,
        message: "Arm unfollowed successfully",
      });
    } catch (error: any) {
      console.error("[ARM Follows API DELETE] Unexpected error:", error);
      return res
        .status(500)
        .json({ error: error.message || "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
