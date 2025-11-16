import { getAdminClient } from "../_supabase.js";

/**
 * Link a .dev email to an existing profile (no merging, just email linking)
 * Used when .dev account exists but was never onboarded
 */
export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Check authorization
    const authHeader = req.headers.get("authorization");
    const adminToken = authHeader?.replace("Bearer ", "");

    if (adminToken !== "mrpiglr-admin-token") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabase = getAdminClient();
    const devEmail = "mrpiglr@aethex.dev";
    const mainEmail = "mrpiglr@gmail.com";

    // Get the main user
    const { data: mainUser, error: mainError } = await supabase
      .from("user_profiles")
      .select("user_id")
      .eq("email", mainEmail)
      .single();

    if (mainError || !mainUser) {
      return new Response(
        JSON.stringify({ error: `User ${mainEmail} not found` }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    // Check if .dev email is already linked
    const { data: existing } = await supabase
      .from("user_email_links")
      .select("*")
      .eq("email", devEmail)
      .single();

    if (existing) {
      return new Response(
        JSON.stringify({
          success: true,
          message: `.dev email already linked`,
          email: devEmail,
          user_id: mainUser.user_id,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }

    // Link .dev email to main user
    const { error: linkError } = await supabase
      .from("user_email_links")
      .insert({
        user_id: mainUser.user_id,
        email: devEmail,
        is_primary: false,
        verified_at: new Date().toISOString(),
      });

    if (linkError) {
      throw linkError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully linked ${devEmail} to ${mainEmail}`,
        devEmail,
        mainEmail,
        userId: mainUser.user_id,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    console.error("[Link Dev Email Error]", error);
    return new Response(
      JSON.stringify({
        error: "Failed to link email",
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
