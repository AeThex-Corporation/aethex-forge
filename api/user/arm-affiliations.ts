import { supabase } from "../_supabase.js";

const VALID_ARMS = ["foundation", "gameforge", "labs", "corp", "devlink"];
const VALID_TYPES = [
  "courses",
  "projects",
  "research",
  "opportunities",
  "manual",
];

export default async (req: Request) => {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response("Unauthorized", { status: 401 });
    }

    const token = authHeader.slice(7);
    const { data: userData } = await supabase.auth.getUser(token);

    if (!userData.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const userId = userData.user.id;

    // GET - Fetch user's arm affiliations
    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("user_arm_affiliations")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
        });
      }

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // POST - Add or confirm arm affiliation
    if (req.method === "POST") {
      const body = (await req.json()) as any;
      const { arm, affiliation_type, affiliation_data, confirmed } = body;

      if (
        !VALID_ARMS.includes(arm) ||
        !VALID_TYPES.includes(affiliation_type)
      ) {
        return new Response("Invalid arm or affiliation type", { status: 400 });
      }

      // Upsert to handle duplicates
      const { data, error } = await supabase
        .from("user_arm_affiliations")
        .upsert(
          {
            user_id: userId,
            arm,
            affiliation_type,
            affiliation_data: affiliation_data || {},
            confirmed: confirmed === true,
          },
          { onConflict: "user_id,arm,affiliation_type" },
        )
        .select()
        .single();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
        });
      }

      return new Response(JSON.stringify(data), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }

    // DELETE - Remove arm affiliation
    if (req.method === "DELETE") {
      const body = await req.json();
      const { arm, affiliation_type } = body;

      if (!VALID_ARMS.includes(arm)) {
        return new Response("Invalid arm", { status: 400 });
      }

      const { error } = await supabase
        .from("user_arm_affiliations")
        .delete()
        .eq("user_id", userId)
        .eq("arm", arm)
        .eq("affiliation_type", affiliation_type || null);

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Method not allowed", { status: 405 });
  } catch (error: any) {
    console.error("Arm affiliations error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
