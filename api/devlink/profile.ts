import { supabase } from "../_supabase.js";

export default async (req: Request) => {
  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { data: userData } = await supabase.auth.getUser(token);
    if (!userData.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from("devlink_profiles")
      .select(
        `
        id,
        user_id,
        username,
        profile_views,
        creations,
        experiences,
        certifications,
        created_at,
        updated_at
      `,
      )
      .eq("user_id", userData.user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Profile fetch error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    if (!profile) {
      // Create default profile if it doesn't exist
      const { data: newProfile, error: createError } = await supabase
        .from("devlink_profiles")
        .insert([
          {
            user_id: userData.user.id,
            username:
              userData.user.user_metadata?.username ||
              userData.user.email?.split("@")[0],
            profile_views: 0,
          },
        ])
        .select()
        .single();

      if (createError) {
        console.error("Profile creation error:", createError);
        return new Response(JSON.stringify({ error: createError.message }), {
          status: 500,
        });
      }

      return new Response(JSON.stringify(newProfile), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(profile), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
