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
    // GET - Fetch time entries and timesheets
    if (req.method === "GET") {
      const startDate = url.searchParams.get("start_date");
      const endDate = url.searchParams.get("end_date");
      const view = url.searchParams.get("view") || "week"; // week, month, all

      // Calculate default date range based on view
      const now = new Date();
      let defaultStart: string;
      let defaultEnd: string;

      if (view === "week") {
        const dayOfWeek = now.getDay();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - dayOfWeek);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        defaultStart = weekStart.toISOString().split("T")[0];
        defaultEnd = weekEnd.toISOString().split("T")[0];
      } else if (view === "month") {
        defaultStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
        defaultEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];
      } else {
        defaultStart = new Date(now.getFullYear(), 0, 1).toISOString().split("T")[0];
        defaultEnd = new Date(now.getFullYear(), 11, 31).toISOString().split("T")[0];
      }

      const rangeStart = startDate || defaultStart;
      const rangeEnd = endDate || defaultEnd;

      // Get time entries
      const { data: entries, error: entriesError } = await supabase
        .from("staff_time_entries")
        .select(`
          *,
          project:staff_projects(id, name),
          task:staff_project_tasks(id, title)
        `)
        .eq("user_id", userId)
        .gte("date", rangeStart)
        .lte("date", rangeEnd)
        .order("date", { ascending: false })
        .order("start_time", { ascending: false });

      if (entriesError) throw entriesError;

      // Get projects for dropdown
      const { data: projects } = await supabase
        .from("staff_projects")
        .select("id, name")
        .or(`lead_id.eq.${userId},team_members.cs.{${userId}}`)
        .eq("status", "active");

      // Calculate stats
      const totalMinutes = entries?.reduce((sum, e) => sum + (e.duration_minutes || 0), 0) || 0;
      const billableMinutes = entries?.filter(e => e.is_billable).reduce((sum, e) => sum + (e.duration_minutes || 0), 0) || 0;

      const stats = {
        totalHours: Math.round((totalMinutes / 60) * 10) / 10,
        billableHours: Math.round((billableMinutes / 60) * 10) / 10,
        entriesCount: entries?.length || 0,
        avgHoursPerDay: entries?.length ? Math.round((totalMinutes / 60 / new Set(entries.map(e => e.date)).size) * 10) / 10 : 0
      };

      return new Response(JSON.stringify({
        entries: entries || [],
        projects: projects || [],
        stats,
        dateRange: { start: rangeStart, end: rangeEnd }
      }), { headers: { "Content-Type": "application/json" } });
    }

    // POST - Create time entry or actions
    if (req.method === "POST") {
      const body = await req.json();

      // Create time entry
      if (body.action === "create_entry") {
        const { project_id, task_id, description, date, start_time, end_time, duration_minutes, is_billable, notes } = body;

        // Calculate duration if start/end provided
        let calculatedDuration = duration_minutes;
        if (start_time && end_time && !duration_minutes) {
          const [sh, sm] = start_time.split(":").map(Number);
          const [eh, em] = end_time.split(":").map(Number);
          calculatedDuration = (eh * 60 + em) - (sh * 60 + sm);
        }

        const { data: entry, error } = await supabase
          .from("staff_time_entries")
          .insert({
            user_id: userId,
            project_id,
            task_id,
            description,
            date: date || new Date().toISOString().split("T")[0],
            start_time,
            end_time,
            duration_minutes: calculatedDuration || 0,
            is_billable: is_billable !== false,
            notes
          })
          .select()
          .single();

        if (error) throw error;
        return new Response(JSON.stringify({ entry }), { status: 201, headers: { "Content-Type": "application/json" } });
      }

      // Start timer (quick entry)
      if (body.action === "start_timer") {
        const { project_id, description } = body;
        const now = new Date();

        const { data: entry, error } = await supabase
          .from("staff_time_entries")
          .insert({
            user_id: userId,
            project_id,
            description: description || "Time tracking",
            date: now.toISOString().split("T")[0],
            start_time: now.toTimeString().split(" ")[0].substring(0, 5),
            duration_minutes: 0,
            is_billable: true
          })
          .select()
          .single();

        if (error) throw error;
        return new Response(JSON.stringify({ entry }), { status: 201, headers: { "Content-Type": "application/json" } });
      }

      // Stop timer
      if (body.action === "stop_timer") {
        const { entry_id } = body;
        const now = new Date();
        const endTime = now.toTimeString().split(" ")[0].substring(0, 5);

        // Get the entry to calculate duration
        const { data: existing } = await supabase
          .from("staff_time_entries")
          .select("start_time")
          .eq("id", entry_id)
          .single();

        if (existing?.start_time) {
          const [sh, sm] = existing.start_time.split(":").map(Number);
          const [eh, em] = endTime.split(":").map(Number);
          const duration = (eh * 60 + em) - (sh * 60 + sm);

          const { data: entry, error } = await supabase
            .from("staff_time_entries")
            .update({
              end_time: endTime,
              duration_minutes: Math.max(0, duration),
              updated_at: new Date().toISOString()
            })
            .eq("id", entry_id)
            .eq("user_id", userId)
            .select()
            .single();

          if (error) throw error;
          return new Response(JSON.stringify({ entry }), { headers: { "Content-Type": "application/json" } });
        }
      }

      return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // PUT - Update time entry
    if (req.method === "PUT") {
      const body = await req.json();
      const { id, project_id, task_id, description, date, start_time, end_time, duration_minutes, is_billable, notes } = body;

      // Calculate duration if times provided
      let calculatedDuration = duration_minutes;
      if (start_time && end_time) {
        const [sh, sm] = start_time.split(":").map(Number);
        const [eh, em] = end_time.split(":").map(Number);
        calculatedDuration = (eh * 60 + em) - (sh * 60 + sm);
      }

      const { data: entry, error } = await supabase
        .from("staff_time_entries")
        .update({
          project_id,
          task_id,
          description,
          date,
          start_time,
          end_time,
          duration_minutes: calculatedDuration,
          is_billable,
          notes,
          updated_at: new Date().toISOString()
        })
        .eq("id", id)
        .eq("user_id", userId)
        .eq("status", "draft")
        .select()
        .single();

      if (error) throw error;
      return new Response(JSON.stringify({ entry }), { headers: { "Content-Type": "application/json" } });
    }

    // DELETE - Delete time entry
    if (req.method === "DELETE") {
      const id = url.searchParams.get("id");

      const { error } = await supabase
        .from("staff_time_entries")
        .delete()
        .eq("id", id)
        .eq("user_id", userId)
        .eq("status", "draft");

      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    console.error("Time tracking API error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};
