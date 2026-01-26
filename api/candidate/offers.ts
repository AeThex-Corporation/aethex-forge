import { supabase } from "../_supabase.js";

export default async (req: Request) => {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { data: userData } = await supabase.auth.getUser(token);
  if (!userData.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const userId = userData.user.id;

  try {
    // GET - Fetch offers
    if (req.method === "GET") {
      const { data: offers, error } = await supabase
        .from("candidate_offers")
        .select(
          `
          *,
          employer:profiles!candidate_offers_employer_id_fkey(
            full_name,
            avatar_url,
            email
          )
        `,
        )
        .eq("candidate_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Group by status
      const grouped = {
        pending: offers?.filter((o) => o.status === "pending") || [],
        accepted: offers?.filter((o) => o.status === "accepted") || [],
        declined: offers?.filter((o) => o.status === "declined") || [],
        expired: offers?.filter((o) => o.status === "expired") || [],
        withdrawn: offers?.filter((o) => o.status === "withdrawn") || [],
      };

      return new Response(
        JSON.stringify({
          offers: offers || [],
          grouped,
          total: offers?.length || 0,
        }),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // PATCH - Respond to offer (accept/decline)
    if (req.method === "PATCH") {
      const body = await req.json();
      const { id, status, notes } = body;

      if (!id) {
        return new Response(JSON.stringify({ error: "Offer id is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (!["accepted", "declined"].includes(status)) {
        return new Response(
          JSON.stringify({ error: "Status must be accepted or declined" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      const { data, error } = await supabase
        .from("candidate_offers")
        .update({
          status,
          notes,
          candidate_response_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("candidate_id", userId)
        .eq("status", "pending") // Can only respond to pending offers
        .select()
        .single();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (!data) {
        return new Response(
          JSON.stringify({ error: "Offer not found or already responded" }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      return new Response(JSON.stringify({ offer: data }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Candidate offers API error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
