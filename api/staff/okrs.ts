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
  const url = new URL(req.url);

  try {
    // GET - Fetch OKRs with key results
    if (req.method === "GET") {
      const quarter = url.searchParams.get("quarter");
      const year = url.searchParams.get("year");
      const status = url.searchParams.get("status");

      let query = supabase
        .from("staff_okrs")
        .select(`
          *,
          key_results:staff_key_results(*)
        `)
        .or(`user_id.eq.${userId},owner_type.in.(team,company)`)
        .order("created_at", { ascending: false });

      if (quarter) query = query.eq("quarter", parseInt(quarter));
      if (year) query = query.eq("year", parseInt(year));
      if (status) query = query.eq("status", status);

      const { data: okrs, error } = await query;
      if (error) throw error;

      // Calculate stats
      const myOkrs = okrs?.filter(o => o.user_id === userId) || [];
      const stats = {
        total: myOkrs.length,
        active: myOkrs.filter(o => o.status === "active").length,
        completed: myOkrs.filter(o => o.status === "completed").length,
        avgProgress: myOkrs.length > 0
          ? Math.round(myOkrs.reduce((sum, o) => sum + (o.progress || 0), 0) / myOkrs.length)
          : 0
      };

      return new Response(JSON.stringify({ okrs: okrs || [], stats }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // POST - Create OKR or Key Result
    if (req.method === "POST") {
      const body = await req.json();

      // Create new OKR
      if (body.action === "create_okr") {
        const { objective, description, quarter, year, team, owner_type } = body;

        const { data: okr, error } = await supabase
          .from("staff_okrs")
          .insert({
            user_id: userId,
            objective,
            description,
            quarter,
            year,
            team,
            owner_type: owner_type || "individual",
            status: "draft"
          })
          .select()
          .single();

        if (error) throw error;
        return new Response(JSON.stringify({ okr }), { status: 201, headers: { "Content-Type": "application/json" } });
      }

      // Add key result to OKR
      if (body.action === "add_key_result") {
        const { okr_id, title, description, target_value, metric_type, unit, due_date } = body;

        const { data: keyResult, error } = await supabase
          .from("staff_key_results")
          .insert({
            okr_id,
            title,
            description,
            target_value,
            metric_type: metric_type || "percentage",
            unit,
            due_date
          })
          .select()
          .single();

        if (error) throw error;
        return new Response(JSON.stringify({ key_result: keyResult }), { status: 201, headers: { "Content-Type": "application/json" } });
      }

      // Update key result progress
      if (body.action === "update_key_result") {
        const { key_result_id, current_value, status } = body;

        // Get target value to calculate progress
        const { data: kr } = await supabase
          .from("staff_key_results")
          .select("target_value, start_value")
          .eq("id", key_result_id)
          .single();

        const progress = kr ? Math.min(100, Math.round(((current_value - (kr.start_value || 0)) / (kr.target_value - (kr.start_value || 0))) * 100)) : 0;

        const { data: keyResult, error } = await supabase
          .from("staff_key_results")
          .update({
            current_value,
            progress: Math.max(0, progress),
            status: status || (progress >= 100 ? "completed" : progress >= 70 ? "on_track" : progress >= 40 ? "at_risk" : "behind"),
            updated_at: new Date().toISOString()
          })
          .eq("id", key_result_id)
          .select()
          .single();

        if (error) throw error;
        return new Response(JSON.stringify({ key_result: keyResult }), { headers: { "Content-Type": "application/json" } });
      }

      // Add check-in
      if (body.action === "add_checkin") {
        const { okr_id, notes, progress_snapshot } = body;

        const { data: checkin, error } = await supabase
          .from("staff_okr_checkins")
          .insert({
            okr_id,
            user_id: userId,
            notes,
            progress_snapshot
          })
          .select()
          .single();

        if (error) throw error;
        return new Response(JSON.stringify({ checkin }), { status: 201, headers: { "Content-Type": "application/json" } });
      }

      return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // PUT - Update OKR
    if (req.method === "PUT") {
      const body = await req.json();
      const { id, objective, description, status, quarter, year } = body;

      const { data: okr, error } = await supabase
        .from("staff_okrs")
        .update({
          objective,
          description,
          status,
          quarter,
          year,
          updated_at: new Date().toISOString()
        })
        .eq("id", id)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;
      return new Response(JSON.stringify({ okr }), { headers: { "Content-Type": "application/json" } });
    }

    // DELETE - Delete OKR or Key Result
    if (req.method === "DELETE") {
      const id = url.searchParams.get("id");
      const type = url.searchParams.get("type") || "okr";

      if (type === "key_result") {
        const { error } = await supabase
          .from("staff_key_results")
          .delete()
          .eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("staff_okrs")
          .delete()
          .eq("id", id)
          .eq("user_id", userId);
        if (error) throw error;
      }

      return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    console.error("OKR API error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};
