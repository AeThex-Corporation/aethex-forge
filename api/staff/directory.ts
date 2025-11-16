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

    const { data: directory, error } = await supabase
      .from("staff_members")
      .select(
        `
        id,
        user_id,
        full_name,
        email,
        role,
        department,
        employment_type,
        avatar_url,
        phone,
        location,
        username,
        created_at
      `,
      )
      .order("full_name", { ascending: true });

    if (error) {
      console.error("Directory fetch error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify(directory || []), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
