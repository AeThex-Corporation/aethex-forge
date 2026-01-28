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

    // Add a limit to prevent timeouts
    const url = new URL(req.url);
    const limit = Math.max(1, Math.min(100, parseInt(url.searchParams.get("limit") || "50")));
    const offset = Math.max(0, parseInt(url.searchParams.get("offset") || "0"));

    const start = Date.now();
    const { data: okrs, error } = await supabase
      .from("staff_okrs")
      .select(`
        id,
        user_id,
        objective,
        description,
        status,
        quarter,
        year,
        key_results(
          id,
          title,
          progress,
          target_value
        ),
        created_at
      `)
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);
    const elapsed = Date.now() - start;
    console.log(`[staff/okrs] Query took ${elapsed}ms (limit=${limit}, offset=${offset})`);

    if (error) {
      console.error("OKRs fetch error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify(okrs || []), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
