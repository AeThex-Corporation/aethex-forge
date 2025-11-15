import { supabase } from "../_supabase";

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

    const { data: sprint, error } = await supabase
      .from("gameforge_sprints")
      .select(
        `
        id,
        project_id,
        title,
        phase,
        status,
        start_date,
        end_date,
        deadline,
        gdd,
        scope
      `,
      )
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Sprint fetch error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify(sprint || null), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
