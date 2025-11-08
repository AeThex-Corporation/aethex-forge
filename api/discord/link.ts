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
    const { verification_code, user_id } = req.body;

    if (!verification_code || !user_id) {
      return res
        .status(400)
        .json({ error: "verification_code and user_id are required" });
    }

    // Find verification code
    const { data: verification, error: verifyError } = await supabase
      .from("discord_verifications")
      .select("*")
      .eq("verification_code", verification_code)
      .single();

    if (verifyError || !verification) {
      return res.status(401).json({ error: "Invalid verification code" });
    }

    // Check if expired
    const expiresAt = new Date(verification.expires_at);
    if (expiresAt < new Date()) {
      // Delete expired code
      await supabase
        .from("discord_verifications")
        .delete()
        .eq("verification_code", verification_code);

      return res.status(401).json({ error: "Verification code has expired" });
    }

    // Verify user exists
    const { data: userData, error: userError } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("id", user_id)
      .single();

    if (userError || !userData) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if Discord ID is already linked
    const { data: existingLink } = await supabase
      .from("discord_links")
      .select("*")
      .eq("discord_id", verification.discord_id)
      .single();

    if (existingLink) {
      return res.status(409).json({
        error:
          "This Discord account is already linked to another AeThex account",
      });
    }

    // Create the link
    const { error: linkError } = await supabase.from("discord_links").insert({
      discord_id: verification.discord_id,
      user_id,
      primary_arm: "labs", // Default to labs
    });

    if (linkError) {
      console.error("Failed to create discord link:", linkError);
      return res.status(500).json({ error: "Failed to link Discord account" });
    }

    // Delete used verification code
    await supabase
      .from("discord_verifications")
      .delete()
      .eq("verification_code", verification_code);

    return res.status(200).json({
      success: true,
      message: "Discord account linked successfully",
      discord_id: verification.discord_id,
    });
  } catch (error: any) {
    console.error("Discord link error:", error);
    return res.status(500).json({
      error: error?.message || "Failed to link Discord account",
    });
  }
}
