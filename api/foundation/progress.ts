import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAdminClient } from "../_supabase.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const admin = getAdminClient();

  // Only authenticated requests
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user },
    error: authError,
  } = await admin.auth.getUser(token);

  if (authError || !user) {
    return res.status(401).json({ error: "Invalid token" });
  }

  try {
    if (req.method === "GET") {
      // Get progress for a course
      const courseId = req.query.course_id as string | undefined;

      if (!courseId) {
        return res.status(400).json({ error: "course_id required" });
      }

      // Get enrollment
      const { data: enrollment, error: enrollError } = await admin
        .from("foundation_enrollments")
        .select("*")
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .single();

      if (enrollError) {
        return res.status(404).json({ error: "Not enrolled in this course" });
      }

      // Get lesson progress
      const { data: lessonProgress } = await admin
        .from("foundation_lesson_progress")
        .select(
          `
          *,
          lesson:foundation_course_lessons(id, title, order_index)
        `,
        )
        .eq("user_id", user.id)
        .in(
          "lesson_id",
          // Get lesson IDs for this course
          await admin
            .from("foundation_course_lessons")
            .select("id")
            .eq("course_id", courseId)
            .then((r) => r.data?.map((l: any) => l.id) || []),
        );

      return res.status(200).json({
        enrollment,
        lesson_progress: lessonProgress || [],
      });
    }

    if (req.method === "POST") {
      // Mark lesson as complete
      const { lesson_id, course_id, completed } = req.body;

      if (!lesson_id || !course_id) {
        return res
          .status(400)
          .json({ error: "lesson_id and course_id required" });
      }

      if (completed) {
        // Mark lesson complete
        const { error: progressError } = await admin
          .from("foundation_lesson_progress")
          .upsert({
            user_id: user.id,
            lesson_id,
            completed: true,
            completed_at: new Date().toISOString(),
          })
          .eq("user_id", user.id)
          .eq("lesson_id", lesson_id);

        if (progressError) {
          return res.status(500).json({ error: progressError.message });
        }

        // Get total lessons in course
        const { data: lessonsData } = await admin
          .from("foundation_course_lessons")
          .select("id")
          .eq("course_id", course_id);

        const totalLessons = lessonsData?.length || 1;

        // Get completed lessons count
        const { data: completedData } = await admin
          .from("foundation_lesson_progress")
          .select("id")
          .eq("user_id", user.id)
          .eq("completed", true)
          .in("lesson_id", lessonsData?.map((l: any) => l.id) || []);

        const completedCount = completedData?.length || 0;
        const progressPercent = Math.round(
          (completedCount / totalLessons) * 100,
        );

        // Update enrollment progress
        await admin
          .from("foundation_enrollments")
          .update({
            progress_percent: progressPercent,
            ...(progressPercent === 100 && {
              status: "completed",
              completed_at: new Date().toISOString(),
            }),
          })
          .eq("user_id", user.id)
          .eq("course_id", course_id);

        return res.status(200).json({
          success: true,
          progress_percent: progressPercent,
          lesson_id,
        });
      } else {
        // Mark lesson incomplete
        const { error: deleteError } = await admin
          .from("foundation_lesson_progress")
          .delete()
          .eq("user_id", user.id)
          .eq("lesson_id", lesson_id);

        if (deleteError) {
          return res.status(500).json({ error: deleteError.message });
        }

        return res.status(200).json({
          success: true,
          lesson_id,
        });
      }
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Server error" });
  }
}
