import { getAdminClient } from "../_supabase.js";

const VALID_ARMS = [
  "labs",
  "gameforge",
  "corp",
  "foundation",
  "devlink",
  "nexus",
  "staff",
];

export default async (req: Request) => {
  if (req.method !== "POST" && req.method !== "PUT") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const token = authHeader.slice(7);
    const supabase = getAdminClient();
    const { data: userData, error: authError } = await supabase.auth.getUser(token);

    if (authError || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json() as { primary_arm?: string };
    const { primary_arm } = body;

    if (!primary_arm || !VALID_ARMS.includes(primary_arm)) {
      return new Response(
        JSON.stringify({
          error: `Invalid primary_arm. Must be one of: ${VALID_ARMS.join(", ")}`,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { data, error } = await supabase
      .from("user_profiles")
      .update({ primary_arm })
      .eq("id", userData.user.id)
      .select("id, primary_arm")
      .single();

    if (error) {
      console.error("[Set Realm API] Update error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, primary_arm: data.primary_arm }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("[Set Realm API] Unexpected error:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
