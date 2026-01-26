import { supabase } from "../_supabase.js";

export default async (req: Request) => {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }

  const { data: userData } = await supabase.auth.getUser(token);
  if (!userData.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }

  const url = new URL(req.url);

  try {
    if (req.method === "GET") {
      const category = url.searchParams.get("category");
      const search = url.searchParams.get("search");

      let query = supabase
        .from("staff_knowledge_articles")
        .select(`*, author:profiles!staff_knowledge_articles_author_id_fkey(full_name, avatar_url)`)
        .eq("is_published", true)
        .order("views", { ascending: false });

      if (category && category !== "all") {
        query = query.eq("category", category);
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
      }

      const { data: articles, error } = await query;
      if (error) throw error;

      // Get unique categories
      const { data: allArticles } = await supabase
        .from("staff_knowledge_articles")
        .select("category")
        .eq("is_published", true);

      const categories = [...new Set(allArticles?.map(a => a.category) || [])];

      return new Response(JSON.stringify({ articles: articles || [], categories }), { headers: { "Content-Type": "application/json" } });
    }

    if (req.method === "POST") {
      const body = await req.json();

      // Increment view count
      if (body.action === "view" && body.id) {
        await supabase.rpc("increment_kb_views", { article_id: body.id });
        return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
      }

      // Mark as helpful
      if (body.action === "helpful" && body.id) {
        await supabase
          .from("staff_knowledge_articles")
          .update({ helpful_count: supabase.rpc("increment") })
          .eq("id", body.id);
        return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
      }
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};
