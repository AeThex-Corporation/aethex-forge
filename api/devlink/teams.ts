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

    const { data: teams, error } = await supabase
      .from("devlink_teams")
      .select(
        `
        id,
        name,
        description,
        members_count,
        created_at,
        members:devlink_team_members(
          id,
          user_id,
          role,
          full_name,
          avatar_url
        )
      `,
      )
      .contains("members", [{ user_id: userData.user.id }])
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Teams fetch error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify(teams || []), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
