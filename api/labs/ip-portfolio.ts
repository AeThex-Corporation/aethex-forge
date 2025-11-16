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

    // Check if user is admin in labs
    const { data: labsAdmin, error: adminError } = await supabase
      .from("labs_admin")
      .select("id")
      .eq("user_id", userData.user.id)
      .single();

    if (adminError && adminError.code !== "PGRST116") {
      console.error("Admin check error:", adminError);
    }

    const isAdmin = !!labsAdmin;

    // Fetch IP portfolio (all projects' IP counts)
    const { data: portfolio, error } = await supabase
      .from("labs_ip_portfolio")
      .select(
        `
        id,
        patents_count,
        trademarks_count,
        trade_secrets_count,
        copyrights_count,
        created_at,
        updated_at
      `,
      )
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("IP portfolio fetch error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    const result = {
      ...portfolio,
      is_admin: isAdmin,
    };

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
