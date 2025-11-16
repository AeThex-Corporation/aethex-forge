import { getAdminClient } from "../_supabase.js";

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { email } = (await req.json()) as { email?: string };

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabase = getAdminClient();

    // Look up the email in user_email_links
    const { data: emailLink, error: linkError } = await supabase
      .from("user_email_links")
      .select("user_id")
      .eq("email", email)
      .single();

    if (linkError && linkError.code !== "PGRST116") {
      // PGRST116 = no rows found (expected when email not linked)
      throw linkError;
    }

    if (!emailLink) {
      // Email is not linked, return the email as-is
      return new Response(JSON.stringify({ primaryEmail: email }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get the primary email for this user
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("email")
      .eq("user_id", emailLink.user_id)
      .single();

    if (profileError) {
      console.error("Profile lookup error:", profileError);
      // If we can't find the profile, return original email
      return new Response(JSON.stringify({ primaryEmail: email }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        primaryEmail: profile.email || email,
        linkedFrom: email,
        userId: emailLink.user_id,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    console.error("[Resolve Linked Email Error]", error);
    return new Response(
      JSON.stringify({
        error: "Failed to resolve email",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
