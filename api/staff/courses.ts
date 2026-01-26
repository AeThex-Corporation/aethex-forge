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
      // Get all courses
      const { data: courses, error: coursesError } = await supabase
        .from("staff_courses")
        .select("*")
        .order("title");

      if (coursesError) throw coursesError;

      // Get user's progress
      const { data: progress, error: progressError } = await supabase
        .from("staff_course_progress")
        .select("*")
        .eq("user_id", userId);

      if (progressError) throw progressError;

      // Merge progress with courses
      const coursesWithProgress = courses?.map(course => {
        const userProgress = progress?.find(p => p.course_id === course.id);
        return {
          ...course,
          progress: userProgress?.progress_percent || 0,
          status: userProgress?.status || "available",
          started_at: userProgress?.started_at,
          completed_at: userProgress?.completed_at
        };
      });

      const stats = {
        total: courses?.length || 0,
        completed: coursesWithProgress?.filter(c => c.status === "completed").length || 0,
        in_progress: coursesWithProgress?.filter(c => c.status === "in_progress").length || 0,
        required: courses?.filter(c => c.is_required).length || 0
      };

      return new Response(JSON.stringify({ courses: coursesWithProgress || [], stats }), { headers: { "Content-Type": "application/json" } });
    }

    if (req.method === "POST") {
      const body = await req.json();
      const { course_id, action, progress } = body;

      if (action === "start") {
        const { data, error } = await supabase
          .from("staff_course_progress")
          .upsert({
            user_id: userId,
            course_id,
            status: "in_progress",
            progress_percent: 0,
            started_at: new Date().toISOString()
          }, { onConflict: "user_id,course_id" })
          .select()
          .single();

        if (error) throw error;
        return new Response(JSON.stringify({ progress: data }), { headers: { "Content-Type": "application/json" } });
      }

      if (action === "update_progress") {
        const isComplete = progress >= 100;
        const { data, error } = await supabase
          .from("staff_course_progress")
          .upsert({
            user_id: userId,
            course_id,
            progress_percent: Math.min(progress, 100),
            status: isComplete ? "completed" : "in_progress",
            completed_at: isComplete ? new Date().toISOString() : null
          }, { onConflict: "user_id,course_id" })
          .select()
          .single();

        if (error) throw error;
        return new Response(JSON.stringify({ progress: data }), { headers: { "Content-Type": "application/json" } });
      }
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};
