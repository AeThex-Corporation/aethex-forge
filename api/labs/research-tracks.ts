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

    const { data: tracks, error } = await supabase
      .from("labs_research_tracks")
      .select(
        `
        id,
        title,
        description,
        status,
        progress,
        lead_id,
        lead:lead_id(
          id,
          full_name,
          avatar_url
        ),
        publications,
        whitepaper_url,
        created_at
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Research tracks fetch error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify(tracks || []), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
