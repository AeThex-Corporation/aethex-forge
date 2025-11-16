import { getAdminClient } from "../_supabase.js";

/**
 * Admin-only endpoint to link mrpiglr@aethex.dev to mrpiglr@gmail.com
 * Both emails are tied to the same person, so they should share the same account.
 * Primary account: mrpiglr@aethex.dev (work email for dev account)
 * Linked account: mrpiglr@gmail.com (personal email, merges into work account)
 */
export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Check authorization header for admin token
    const authHeader = req.headers.get("authorization");
    const adminToken = authHeader?.replace("Bearer ", "");

    // Simple token check (in production, use more robust auth)
    if (adminToken !== "mrpiglr-admin-token") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabase = getAdminClient();
    const primaryEmail = "mrpiglr@aethex.dev";
    const linkedEmail = "mrpiglr@gmail.com";

    console.log(`[Email Linking] Starting mrpiglr account linking...`);

    // Fetch the primary user (work email)
    const { data: primaryUser, error: primaryError } = await supabase
      .from("user_profiles")
      .select("user_id, email")
      .eq("email", primaryEmail)
      .single();

    if (primaryError || !primaryUser) {
      return new Response(
        JSON.stringify({
          error: "Primary email not found",
          email: primaryEmail,
          details: primaryError?.message,
        }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    // Fetch the linked user (personal email)
    const { data: linkedUser, error: linkedError } = await supabase
      .from("user_profiles")
      .select("user_id, email")
      .eq("email", linkedEmail)
      .single();

    if (linkedError || !linkedUser) {
      return new Response(
        JSON.stringify({
          error: "Linked email not found",
          email: linkedEmail,
          details: linkedError?.message,
        }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    const sourceUserId = linkedUser.user_id; // gmail account
    const targetUserId = primaryUser.user_id; // aethex.dev account

    console.log(`[Email Linking] Merging ${sourceUserId} into ${targetUserId}`);

    // 1. Transfer achievements
    console.log(`[Email Linking] Transferring achievements...`);
    const { error: achievementError } = await supabase
      .from("achievements_earned")
      .update({ user_id: targetUserId })
      .eq("user_id", sourceUserId);
    if (achievementError) {
      console.warn("Achievement transfer warning:", achievementError);
    }

    // 2. Transfer aethex_creators profile
    console.log(`[Email Linking] Checking for creator profile...`);
    const { data: creatorProfile } = await supabase
      .from("aethex_creators")
      .select("*")
      .eq("user_id", sourceUserId)
      .single();

    if (creatorProfile) {
      console.log(`[Email Linking] Transferring creator profile...`);
      await supabase
        .from("aethex_creators")
        .update({ user_id: targetUserId })
        .eq("user_id", sourceUserId);
    }

    // 3. Transfer applications
    console.log(`[Email Linking] Transferring applications...`);
    const { error: appError } = await supabase
      .from("aethex_applications")
      .update({ user_id: targetUserId })
      .eq("user_id", sourceUserId);
    if (appError) {
      console.warn("Application transfer warning:", appError);
    }

    // 4. Transfer discord_links
    console.log(`[Email Linking] Checking for discord links...`);
    const { data: discordLinks } = await supabase
      .from("discord_links")
      .select("*")
      .eq("user_id", sourceUserId);

    if (discordLinks && discordLinks.length > 0) {
      console.log(
        `[Email Linking] Found ${discordLinks.length} discord links, transferring...`,
      );
      for (const link of discordLinks) {
        const { data: existing } = await supabase
          .from("discord_links")
          .select("*")
          .eq("user_id", targetUserId);

        if (!existing || existing.length === 0) {
          await supabase
            .from("discord_links")
            .update({ user_id: targetUserId })
            .eq("id", link.id);
        }
      }
    }

    // 5. Transfer web3_wallets if they exist
    console.log(`[Email Linking] Checking for web3 wallets...`);
    const { data: web3Links } = await supabase
      .from("web3_wallets")
      .select("*")
      .eq("user_id", sourceUserId);

    if (web3Links && web3Links.length > 0) {
      console.log(
        `[Email Linking] Found ${web3Links.length} web3 wallets, transferring...`,
      );
      for (const wallet of web3Links) {
        const { data: existing } = await supabase
          .from("web3_wallets")
          .select("*")
          .eq("user_id", targetUserId)
          .eq("wallet_address", wallet.wallet_address);

        if (!existing || existing.length === 0) {
          await supabase
            .from("web3_wallets")
            .update({ user_id: targetUserId })
            .eq("id", wallet.id);
        }
      }
    }

    // 6. Link both emails in user_email_links
    console.log(`[Email Linking] Creating email links...`);
    const { data: existingLinks } = await supabase
      .from("user_email_links")
      .select("*")
      .in("email", [primaryEmail, linkedEmail]);

    // Insert primary email
    const primaryEmailExists = existingLinks?.some(
      (l) => l.email === primaryEmail,
    );
    if (!primaryEmailExists) {
      await supabase.from("user_email_links").insert({
        user_id: targetUserId,
        email: primaryEmail,
        is_primary: true,
        verified_at: new Date().toISOString(),
      });
    }

    // Insert linked email
    const linkedEmailExists = existingLinks?.some(
      (l) => l.email === linkedEmail,
    );
    if (!linkedEmailExists) {
      await supabase.from("user_email_links").insert({
        user_id: targetUserId,
        email: linkedEmail,
        is_primary: false,
        verified_at: new Date().toISOString(),
      });
    }

    // 7. Update user_profiles
    console.log(`[Email Linking] Updating user profiles...`);
    await supabase
      .from("user_profiles")
      .update({
        primary_email: primaryEmail,
        is_dev_account: true,
      })
      .eq("user_id", targetUserId);

    // Mark source profile as merged
    await supabase
      .from("user_profiles")
      .update({
        merged_to_user_id: targetUserId,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", sourceUserId);

    console.log(`[Email Linking] ✅ Successfully linked mrpiglr accounts`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Successfully linked mrpiglr@aethex.dev and mrpiglr@gmail.com",
        primaryEmail,
        linkedEmail,
        targetUserId,
        sourceUserId,
        note: "Both emails can now log in and will access the same account. Primary account is mrpiglr@aethex.dev (work/dev account).",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error: any) {
    console.error("[Email Linking Error]", error);
    return new Response(
      JSON.stringify({
        error: "Failed to link mrpiglr accounts",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
