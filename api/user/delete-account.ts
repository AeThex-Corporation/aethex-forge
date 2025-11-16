import { getAdminClient } from "../_supabase.js";

export default async (req: Request) => {
  const { method, headers } = req;

  if (method !== "DELETE") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const adminToken =
      headers.get("Authorization")?.replace("Bearer ", "") || "";

    if (adminToken !== "mrpiglr-admin-token") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { email } = (await req.json()) as { email?: string };

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Missing email parameter" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const supabase = getAdminClient();

    // Get the user by email
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("user_id, email")
      .eq("email", email)
      .single();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({
          error: "User not found",
          details: profileError?.message,
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const userId = profile.user_id;

    // Delete from various tables
    // 1. Delete achievements
    await supabase.from("achievements_earned").delete().eq("user_id", userId);

    // 2. Delete applications
    await supabase.from("applications").delete().eq("user_id", userId);

    // 3. Delete creator profiles
    await supabase.from("creator_profiles").delete().eq("user_id", userId);

    // 4. Delete projects
    await supabase.from("projects").delete().eq("user_id", userId);

    // 5. Delete social posts
    await supabase.from("social_posts").delete().eq("user_id", userId);

    // 6. Delete linked emails
    await supabase.from("user_email_links").delete().eq("user_id", userId);

    // 7. Delete Discord links
    await supabase.from("discord_links").delete().eq("user_id", userId);

    // 8. Delete web3 wallets
    await supabase.from("web3_wallets").delete().eq("user_id", userId);

    // 9. Delete user profile
    const { error: profileDeleteError } = await supabase
      .from("user_profiles")
      .delete()
      .eq("user_id", userId);

    if (profileDeleteError) {
      return new Response(
        JSON.stringify({
          error: "Failed to delete user profile",
          details: profileDeleteError.message,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // 10. Delete from Supabase auth (this is a special call)
    // Note: This requires admin access and will remove the auth user
    const { error: authError } = await (supabase.auth.admin as any).deleteUser(
      userId,
    );

    if (authError) {
      console.error("Auth deletion error:", authError);
      // Don't fail the entire operation if auth deletion fails
      // The profile is already deleted
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `User account ${email} has been successfully deleted`,
        userId,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error?.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
