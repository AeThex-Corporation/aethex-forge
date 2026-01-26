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

  try {
    if (req.method === "GET") {
      const { data: sections, error } = await supabase
        .from("staff_handbook_sections")
        .select("*")
        .order("category")
        .order("order_index");

      if (error) throw error;

      // Group by category
      const grouped = sections?.reduce((acc, section) => {
        if (!acc[section.category]) {
          acc[section.category] = [];
        }
        acc[section.category].push(section);
        return acc;
      }, {} as Record<string, typeof sections>);

      const categories = Object.keys(grouped || {});

      return new Response(JSON.stringify({
        sections: sections || [],
        grouped: grouped || {},
        categories
      }), { headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};
