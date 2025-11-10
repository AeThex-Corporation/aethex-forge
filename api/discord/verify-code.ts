import { createClient } from "@supabase/supabase-js";

export const config = {
  runtime: "nodejs",
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { verification_code, user_id } = req.body;

  if (!verification_code || !user_id) {
    return res
      .status(400)
      .json({ message: "Missing verification code or user ID" });
  }

  // Try both possible env var names for backwards compatibility
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE;

  if (!supabaseUrl || !supabaseServiceRole) {
    console.error("[Discord Verify] Missing env vars:", {
      supabaseUrl: !!supabaseUrl,
      supabaseServiceRole: !!supabaseServiceRole,
    });
    return res.status(500).json({ message: "Server configuration error" });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceRole);

    // Find valid verification code
    const { data: verification, error: verifyError } = await supabase
      .from("discord_verifications")
      .select("*")
      .eq("verification_code", verification_code.trim())
      .gt("expires_at", new Date().toISOString())
      .single();

    if (verifyError) {
      console.error("[Discord Verify] Code lookup failed:", {
        code: verification_code.trim(),
        error: verifyError,
      });
      return res.status(400).json({
        message:
          "Invalid or expired verification code. Please try /verify again.",
        error: verifyError.message,
      });
    }

    if (!verification) {
      return res.status(400).json({
        message:
          "Invalid or expired verification code. Please try /verify again.",
      });
    }

    const discordId = verification.discord_id;

    // Check if already linked
    const { data: existingLink } = await supabase
      .from("discord_links")
      .select("*")
      .eq("discord_id", discordId)
      .single();

    if (existingLink && existingLink.user_id !== user_id) {
      return res.status(400).json({
        message:
          "This Discord account is already linked to another AeThex account.",
      });
    }

    // Create or update link
    const { error: linkError } = await supabase.from("discord_links").upsert({
      discord_id: discordId,
      user_id: user_id,
      linked_at: new Date().toISOString(),
    });

    if (linkError) {
      console.error("[Discord Verify] Link creation failed:", linkError);
      return res
        .status(500)
        .json({ message: "Failed to link Discord account" });
    }

    // Delete used verification code
    const { error: deleteError } = await supabase
      .from("discord_verifications")
      .delete()
      .eq("verification_code", verification_code.trim());

    if (deleteError) {
      console.error(
        "[Discord Verify] Failed to delete verification code:",
        deleteError,
      );
      // Don't return error - code is already used and link is created
    }

    res.status(200).json({
      success: true,
      message: "Discord account linked successfully!",
      discord_user: {
        id: discordId,
        username: verification.username || "Discord User",
        discriminator: "0000",
      },
    });
  } catch (error) {
    console.error("[Discord Verify] Error:", error);
    res.status(500).json({
      message: "An error occurred. Please try again.",
    });
  }
}
