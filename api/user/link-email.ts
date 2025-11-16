import { getAdminClient } from "../_supabase.js";

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const supabase = getAdminClient();
    const { primaryEmail, linkedEmail } = (await req.json()) as {
      primaryEmail?: string;
      linkedEmail?: string;
    };

    if (!primaryEmail || !linkedEmail) {
      return new Response(
        JSON.stringify({ error: "Missing primaryEmail or linkedEmail" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Fetch the primary user
    const { data: primaryUser, error: primaryError } = await supabase
      .from("user_profiles")
      .select("user_id, email")
      .eq("email", primaryEmail)
      .single();

    if (primaryError || !primaryUser) {
      return new Response(
        JSON.stringify({
          error: "Primary email not found",
          details: primaryError?.message,
        }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    // Fetch the linked user
    const { data: linkedUser, error: linkedError } = await supabase
      .from("user_profiles")
      .select("user_id, email")
      .eq("email", linkedEmail)
      .single();

    if (linkedError || !linkedUser) {
      return new Response(
        JSON.stringify({
          error: "Linked email not found",
          details: linkedError?.message,
        }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    // Transfer all data from linked user to primary user
    const sourceUserId = linkedUser.user_id;
    const targetUserId = primaryUser.user_id;

    // 1. Transfer achievements
    await supabase
      .from("achievements_earned")
      .update({ user_id: targetUserId })
      .eq("user_id", sourceUserId);

    // 2. Transfer aethex_creators profile
    const { data: creatorProfile } = await supabase
      .from("aethex_creators")
      .select("*")
      .eq("user_id", sourceUserId)
      .single();

    if (creatorProfile) {
      await supabase
        .from("aethex_creators")
        .update({ user_id: targetUserId })
        .eq("user_id", sourceUserId);
    }

    // 3. Transfer applications
    await supabase
      .from("aethex_applications")
      .update({ user_id: targetUserId })
      .eq("user_id", sourceUserId);

    // 4. Transfer discord_links
    const { data: discordLinks } = await supabase
      .from("discord_links")
      .select("*")
      .eq("user_id", sourceUserId);

    if (discordLinks && discordLinks.length > 0) {
      for (const link of discordLinks) {
        // Check if target already has discord link
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

    // 5. Transfer web3 wallet links
    const { data: web3Links } = await supabase
      .from("web3_wallets")
      .select("*")
      .eq("user_id", sourceUserId);

    if (web3Links && web3Links.length > 0) {
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
    // First, check if emails already exist in the table
    const { data: existingLinks } = await supabase
      .from("user_email_links")
      .select("*")
      .in("email", [primaryEmail, linkedEmail]);

    // Insert or update primary email
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

    // Insert or update linked email
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

    // 7. Update user_profiles primary_email and is_dev_account
    const isDev = primaryEmail.endsWith("@aethex.dev");
    await supabase
      .from("user_profiles")
      .update({
        primary_email: primaryEmail,
        is_dev_account: isDev,
      })
      .eq("user_id", targetUserId);

    // 8. Disable or delete source auth user (optional - keeping for now but can add flag)
    // Note: Actual deletion from auth.users requires direct admin access
    // For now we just mark the profile as merged
    await supabase
      .from("user_profiles")
      .update({
        merged_to_user_id: targetUserId,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", sourceUserId);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully linked ${linkedEmail} to ${primaryEmail}`,
        targetUserId,
        sourceUserId,
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
        error: "Failed to link emails",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
