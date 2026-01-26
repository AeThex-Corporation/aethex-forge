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

  // Check if user is admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { "Content-Type": "application/json" } });
  }

  const url = new URL(req.url);

  try {
    // GET - Fetch reports and stats
    if (req.method === "GET") {
      const status = url.searchParams.get("status") || "open";
      const type = url.searchParams.get("type"); // report, dispute, user

      // Get content reports
      let reportsQuery = supabase
        .from("moderation_reports")
        .select(`
          *,
          reporter:profiles!moderation_reports_reporter_id_fkey(id, full_name, email, avatar_url)
        `)
        .order("created_at", { ascending: false })
        .limit(50);

      if (status !== "all") {
        reportsQuery = reportsQuery.eq("status", status);
      }
      if (type && type !== "all") {
        reportsQuery = reportsQuery.eq("target_type", type);
      }

      const { data: reports, error: reportsError } = await reportsQuery;
      if (reportsError) console.error("Reports error:", reportsError);

      // Get disputes
      let disputesQuery = supabase
        .from("nexus_disputes")
        .select(`
          *,
          reporter:profiles!nexus_disputes_reported_by_fkey(id, full_name, email)
        `)
        .order("created_at", { ascending: false })
        .limit(50);

      if (status !== "all") {
        disputesQuery = disputesQuery.eq("status", status);
      }

      const { data: disputes, error: disputesError } = await disputesQuery;
      if (disputesError) console.error("Disputes error:", disputesError);

      // Get flagged users (users with warnings/bans)
      const { data: flaggedUsers } = await supabase
        .from("profiles")
        .select("id, full_name, email, avatar_url, is_banned, warning_count, created_at")
        .or("is_banned.eq.true,warning_count.gt.0")
        .order("created_at", { ascending: false })
        .limit(50);

      // Calculate stats
      const { count: openReports } = await supabase
        .from("moderation_reports")
        .select("*", { count: "exact", head: true })
        .eq("status", "open");

      const { count: openDisputes } = await supabase
        .from("nexus_disputes")
        .select("*", { count: "exact", head: true })
        .eq("status", "open");

      const { count: resolvedToday } = await supabase
        .from("moderation_reports")
        .select("*", { count: "exact", head: true })
        .eq("status", "resolved")
        .gte("updated_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString());

      const stats = {
        openReports: openReports || 0,
        openDisputes: openDisputes || 0,
        resolvedToday: resolvedToday || 0,
        flaggedUsers: flaggedUsers?.length || 0
      };

      return new Response(JSON.stringify({
        reports: reports || [],
        disputes: disputes || [],
        flaggedUsers: flaggedUsers || [],
        stats
      }), { headers: { "Content-Type": "application/json" } });
    }

    // POST - Take moderation action
    if (req.method === "POST") {
      const body = await req.json();

      // Resolve/ignore report
      if (body.action === "update_report") {
        const { report_id, status, resolution_notes } = body;

        const { data, error } = await supabase
          .from("moderation_reports")
          .update({
            status,
            resolution_notes,
            resolved_by: userData.user.id,
            updated_at: new Date().toISOString()
          })
          .eq("id", report_id)
          .select()
          .single();

        if (error) throw error;
        return new Response(JSON.stringify({ report: data }), { headers: { "Content-Type": "application/json" } });
      }

      // Resolve dispute
      if (body.action === "update_dispute") {
        const { dispute_id, status, resolution_notes } = body;

        const { data, error } = await supabase
          .from("nexus_disputes")
          .update({
            status,
            resolution_notes,
            resolved_by: userData.user.id,
            resolved_at: new Date().toISOString()
          })
          .eq("id", dispute_id)
          .select()
          .single();

        if (error) throw error;
        return new Response(JSON.stringify({ dispute: data }), { headers: { "Content-Type": "application/json" } });
      }

      // Ban/warn user
      if (body.action === "moderate_user") {
        const { user_id, action_type, reason } = body;

        if (action_type === "ban") {
          const { data, error } = await supabase
            .from("profiles")
            .update({
              is_banned: true,
              ban_reason: reason,
              banned_at: new Date().toISOString(),
              banned_by: userData.user.id
            })
            .eq("id", user_id)
            .select()
            .single();

          if (error) throw error;
          return new Response(JSON.stringify({ user: data, action: "banned" }), { headers: { "Content-Type": "application/json" } });
        }

        if (action_type === "warn") {
          const { data: currentUser } = await supabase
            .from("profiles")
            .select("warning_count")
            .eq("id", user_id)
            .single();

          const { data, error } = await supabase
            .from("profiles")
            .update({
              warning_count: (currentUser?.warning_count || 0) + 1,
              last_warning_at: new Date().toISOString(),
              last_warning_reason: reason
            })
            .eq("id", user_id)
            .select()
            .single();

          if (error) throw error;
          return new Response(JSON.stringify({ user: data, action: "warned" }), { headers: { "Content-Type": "application/json" } });
        }

        if (action_type === "unban") {
          const { data, error } = await supabase
            .from("profiles")
            .update({
              is_banned: false,
              ban_reason: null,
              unbanned_at: new Date().toISOString(),
              unbanned_by: userData.user.id
            })
            .eq("id", user_id)
            .select()
            .single();

          if (error) throw error;
          return new Response(JSON.stringify({ user: data, action: "unbanned" }), { headers: { "Content-Type": "application/json" } });
        }
      }

      // Delete content
      if (body.action === "delete_content") {
        const { content_type, content_id } = body;

        const tableMap: Record<string, string> = {
          post: "community_posts",
          comment: "community_comments",
          project: "projects",
          opportunity: "aethex_opportunities"
        };

        const table = tableMap[content_type];
        if (!table) {
          return new Response(JSON.stringify({ error: "Invalid content type" }), { status: 400, headers: { "Content-Type": "application/json" } });
        }

        const { error } = await supabase.from(table).delete().eq("id", content_id);
        if (error) throw error;

        return new Response(JSON.stringify({ success: true, deleted: content_type }), { headers: { "Content-Type": "application/json" } });
      }

      return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    console.error("Moderation API error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};
