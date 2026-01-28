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
    const { data: invoices, error } = await supabase
      .from("contractor_invoices")
      .select(`
        id,
        user_id,
        invoice_number,
        amount,
        status,
        date,
        due_date,
        description,
        created_at
      `)
      .eq("user_id", userData.user.id)
      .order("date", { ascending: false })
      .range(offset, offset + limit - 1);
    const elapsed = Date.now() - start;
    console.log(`[staff/invoices] Query took ${elapsed}ms (limit=${limit}, offset=${offset})`);

    if (error) {
      console.error("Invoices fetch error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify(invoices || []), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
