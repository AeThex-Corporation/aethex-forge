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

  const userId = userData.user.id;

  try {
    if (req.method === "GET") {
      const { data: reviews, error } = await supabase
        .from("staff_performance_reviews")
        .select(`
          *,
          reviewer:profiles!staff_performance_reviews_reviewer_id_fkey(full_name, avatar_url)
        `)
        .eq("employee_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const stats = {
        total: reviews?.length || 0,
        pending: reviews?.filter(r => r.status === "pending").length || 0,
        completed: reviews?.filter(r => r.status === "completed").length || 0,
        average_rating: reviews?.filter(r => r.overall_rating).reduce((sum, r) => sum + r.overall_rating, 0) / (reviews?.filter(r => r.overall_rating).length || 1) || 0
      };

      return new Response(JSON.stringify({ reviews: reviews || [], stats }), { headers: { "Content-Type": "application/json" } });
    }

    if (req.method === "POST") {
      const body = await req.json();
      const { review_id, employee_comments } = body;

      // Employee can only add their comments
      const { data, error } = await supabase
        .from("staff_performance_reviews")
        .update({ employee_comments })
        .eq("id", review_id)
        .eq("employee_id", userId)
        .select()
        .single();

      if (error) throw error;
      return new Response(JSON.stringify({ review: data }), { headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};
