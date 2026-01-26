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
      const { data: announcements, error } = await supabase
        .from("staff_announcements")
        .select(`*, author:profiles!staff_announcements_author_id_fkey(full_name, avatar_url)`)
        .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
        .order("is_pinned", { ascending: false })
        .order("published_at", { ascending: false });

      if (error) throw error;

      // Mark read status
      const withReadStatus = announcements?.map(a => ({
        ...a,
        is_read: a.read_by?.includes(userId) || false
      }));

      return new Response(JSON.stringify({ announcements: withReadStatus || [] }), { headers: { "Content-Type": "application/json" } });
    }

    if (req.method === "POST") {
      const body = await req.json();

      // Mark as read
      if (body.action === "mark_read" && body.id) {
        const { data: current } = await supabase
          .from("staff_announcements")
          .select("read_by")
          .eq("id", body.id)
          .single();

        const readBy = current?.read_by || [];
        if (!readBy.includes(userId)) {
          await supabase
            .from("staff_announcements")
            .update({ read_by: [...readBy, userId] })
            .eq("id", body.id);
        }
        return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
      }
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};
