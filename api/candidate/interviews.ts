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
  const url = new URL(req.url);

  try {
    // GET - Fetch interviews
    if (req.method === "GET") {
      const status = url.searchParams.get("status");
      const upcoming = url.searchParams.get("upcoming") === "true";

      let query = supabase
        .from("candidate_interviews")
        .select(
          `
          *,
          employer:profiles!candidate_interviews_employer_id_fkey(
            full_name,
            avatar_url,
            email
          )
        `,
        )
        .eq("candidate_id", userId)
        .order("scheduled_at", { ascending: true });

      if (status) {
        query = query.eq("status", status);
      }

      if (upcoming) {
        query = query
          .gte("scheduled_at", new Date().toISOString())
          .in("status", ["scheduled", "rescheduled"]);
      }

      const { data: interviews, error } = await query;

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Group by status
      const grouped = {
        upcoming: interviews?.filter(
          (i) =>
            ["scheduled", "rescheduled"].includes(i.status) &&
            new Date(i.scheduled_at) >= new Date(),
        ) || [],
        past: interviews?.filter(
          (i) =>
            i.status === "completed" ||
            new Date(i.scheduled_at) < new Date(),
        ) || [],
        cancelled: interviews?.filter((i) => i.status === "cancelled") || [],
      };

      return new Response(
        JSON.stringify({
          interviews: interviews || [],
          grouped,
          total: interviews?.length || 0,
        }),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // POST - Create interview (for self-scheduling or employer invites)
    if (req.method === "POST") {
      const body = await req.json();
      const {
        application_id,
        employer_id,
        opportunity_id,
        scheduled_at,
        duration_minutes,
        meeting_link,
        meeting_type,
        notes,
      } = body;

      if (!scheduled_at || !employer_id) {
        return new Response(
          JSON.stringify({ error: "scheduled_at and employer_id are required" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      const { data, error } = await supabase
        .from("candidate_interviews")
        .insert({
          application_id,
          candidate_id: userId,
          employer_id,
          opportunity_id,
          scheduled_at,
          duration_minutes: duration_minutes || 30,
          meeting_link,
          meeting_type: meeting_type || "video",
          notes,
          status: "scheduled",
        })
        .select()
        .single();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ interview: data }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }

    // PATCH - Update interview (feedback, reschedule)
    if (req.method === "PATCH") {
      const body = await req.json();
      const { id, candidate_feedback, status, scheduled_at } = body;

      if (!id) {
        return new Response(JSON.stringify({ error: "Interview id is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const updateData: Record<string, any> = {};
      if (candidate_feedback !== undefined)
        updateData.candidate_feedback = candidate_feedback;
      if (status !== undefined) updateData.status = status;
      if (scheduled_at !== undefined) {
        updateData.scheduled_at = scheduled_at;
        updateData.status = "rescheduled";
      }

      const { data, error } = await supabase
        .from("candidate_interviews")
        .update(updateData)
        .eq("id", id)
        .eq("candidate_id", userId)
        .select()
        .single();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ interview: data }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Candidate interviews API error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
