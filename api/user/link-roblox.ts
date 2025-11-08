import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE || "",
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing authorization header" });
    }

    const token = authHeader.substring(7);

    // Verify token with Supabase
    const { data: userData, error: authError } =
      await supabase.auth.getUser(token);
    if (authError || !userData.user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const { roblox_user_id, roblox_username } = req.body;

    if (!roblox_user_id || !roblox_username) {
      return res.status(400).json({ error: "Missing Roblox user info" });
    }

    // Update user profile with Roblox info
    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({
        roblox_user_id: String(roblox_user_id),
        roblox_username,
      })
      .eq("auth_id", userData.user.id);

    if (updateError) {
      console.error("Failed to link Roblox:", updateError);
      return res.status(500).json({ error: "Failed to link Roblox account" });
    }

    return res.status(200).json({
      success: true,
      message: "Roblox account linked successfully",
    });
  } catch (error: any) {
    console.error("Link Roblox error:", error);
    return res.status(500).json({
      error: error?.message || "Failed to link account",
    });
  }
}
