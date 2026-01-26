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
      const { data: expenses, error } = await supabase
        .from("staff_expense_reports")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const stats = {
        total: expenses?.length || 0,
        pending: expenses?.filter(e => e.status === "pending").length || 0,
        approved: expenses?.filter(e => e.status === "approved").length || 0,
        reimbursed: expenses?.filter(e => e.status === "reimbursed").length || 0,
        total_amount: expenses?.reduce((sum, e) => sum + parseFloat(e.amount), 0) || 0,
        pending_amount: expenses?.filter(e => e.status === "pending").reduce((sum, e) => sum + parseFloat(e.amount), 0) || 0
      };

      return new Response(JSON.stringify({ expenses: expenses || [], stats }), { headers: { "Content-Type": "application/json" } });
    }

    if (req.method === "POST") {
      const body = await req.json();
      const { title, description, amount, category, receipt_url } = body;

      const { data, error } = await supabase
        .from("staff_expense_reports")
        .insert({
          user_id: userId,
          title,
          description,
          amount,
          category,
          receipt_url,
          status: "pending",
          submitted_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return new Response(JSON.stringify({ expense: data }), { status: 201, headers: { "Content-Type": "application/json" } });
    }

    if (req.method === "PATCH") {
      const body = await req.json();
      const { id, ...updates } = body;

      const { data, error } = await supabase
        .from("staff_expense_reports")
        .update(updates)
        .eq("id", id)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;
      return new Response(JSON.stringify({ expense: data }), { headers: { "Content-Type": "application/json" } });
    }

    if (req.method === "DELETE") {
      const url = new URL(req.url);
      const id = url.searchParams.get("id");

      const { error } = await supabase
        .from("staff_expense_reports")
        .delete()
        .eq("id", id)
        .eq("user_id", userId)
        .in("status", ["draft", "pending"]);

      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};
