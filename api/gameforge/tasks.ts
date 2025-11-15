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

    const url = new URL(req.url);
    const sprintId = url.searchParams.get("sprint_id");

    let query = supabase
      .from("gameforge_tasks")
      .select(`
        id,
        title,
        description,
        status,
        assigned_to:assigned_to_id(
          id,
          full_name,
          avatar_url
        ),
        priority,
        due_date,
        created_at
      `)
      .eq("created_by_id", userData.user.id);

    if (sprintId) {
      query = query.eq("sprint_id", sprintId);
    }

    const { data: tasks, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      console.error("Tasks fetch error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify(tasks || []), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
