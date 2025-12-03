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

  let step = "init";
  try {
    step = "create_client";
    console.log("[Discord Verify] Creating Supabase client with URL:", supabaseUrl?.substring(0, 30) + "...");
    const supabase = createClient(supabaseUrl, supabaseServiceRole);

    step = "lookup_code";
    console.log("[Discord Verify] Looking up code:", verification_code.trim());
    
    const { data: verification, error: verifyError } = await supabase
      .from("discord_verifications")
      .select("*")
      .eq("verification_code", verification_code.trim())
      .gt("expires_at", new Date().toISOString())
      .single();

    console.log("[Discord Verify] Query result:", { 
      found: !!verification, 
      error: verifyError?.message,
      code: verifyError?.code 
    });

    if (verifyError) {
      console.error("[Discord Verify] Code lookup failed:", {
        code: verification_code.trim(),
        error: verifyError,
      });
      return res.status(400).json({
        message: "Invalid or expired verification code. Please try /verify again.",
        error: verifyError.message,
        step,
      });
    }

    if (!verification) {
      return res.status(400).json({
        message: "Invalid or expired verification code. Please try /verify again.",
        step,
      });
    }

    step = "check_existing_link";
    const discordId = verification.discord_id;

    const { data: existingLink, error: existingLinkError } = await supabase
      .from("discord_links")
      .select("*")
      .eq("discord_id", discordId)
      .single();

    if (existingLinkError && existingLinkError.code !== "PGRST116") {
      console.error("[Discord Verify] Existing link check failed:", existingLinkError);
      return res.status(500).json({
        message: "Failed to check existing link",
        step,
        error: existingLinkError.message,
      });
    }

    if (existingLink && existingLink.user_id !== user_id) {
      return res.status(400).json({
        message: "This Discord account is already linked to another AeThex account.",
        step,
      });
    }

    step = "create_link";
    const { error: linkError } = await supabase.from("discord_links").upsert(
      {
        discord_id: discordId,
        user_id: user_id,
        linked_at: new Date().toISOString(),
      },
      { onConflict: "discord_id" }
    );

    if (linkError) {
      console.error("[Discord Verify] Link creation failed:", linkError);
      return res.status(500).json({
        message: "Failed to link Discord account",
        step,
        error: linkError.message,
      });
    }

    step = "delete_code";
    const { error: deleteError } = await supabase
      .from("discord_verifications")
      .delete()
      .eq("verification_code", verification_code.trim());

    if (deleteError) {
      console.error("[Discord Verify] Failed to delete verification code:", deleteError);
    }

    step = "success";
    res.status(200).json({
      success: true,
      message: "Discord account linked successfully!",
      discord_user: {
        id: discordId,
        username: verification.username || "Discord User",
        discriminator: "0000",
      },
    });
  } catch (error: any) {
    console.error("[Discord Verify] Error at step:", step, {
      message: error?.message,
      code: error?.code,
      stack: error?.stack?.substring(0, 500),
    });
    res.status(500).json({
      message: "An error occurred. Please try again.",
      step,
      error: error?.message,
    });
  }
}
