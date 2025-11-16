import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAdminClient } from "../_supabase.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const admin = getAdminClient();

  // Only authenticated requests for enrollment
  const authHeader = req.headers.authorization;
  let userId: string | null = null;

  if (authHeader) {
    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await admin.auth.getUser(token);
    if (!authError && user) {
      userId = user.id;
    }
  }

  try {
    if (req.method === "GET") {
      // List all published courses
      const { data: courses, error: coursesError } = await admin
        .from("foundation_courses")
        .select(
          `
          *,
          instructor:user_profiles(id, full_name, avatar_url)
        `,
        )
        .eq("is_published", true)
        .order("order_index", { ascending: true });

      if (coursesError) {
        return res.status(500).json({ error: coursesError.message });
      }

      // If user is authenticated, get their enrollment status
      let enrollments: any = {};
      if (userId) {
        const { data: userEnrollments } = await admin
          .from("foundation_enrollments")
          .select("course_id, progress_percent, status, completed_at")
          .eq("user_id", userId);

        if (userEnrollments) {
          enrollments = Object.fromEntries(
            userEnrollments.map((e: any) => [e.course_id, e]),
          );
        }
      }

      const coursesWithStatus = (courses || []).map((course: any) => ({
        ...course,
        userEnrollment: enrollments[course.id] || null,
      }));

      return res.status(200).json(coursesWithStatus);
    }

    if (req.method === "POST") {
      // Enroll in a course
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { course_id } = req.body;
      if (!course_id) {
        return res.status(400).json({ error: "course_id required" });
      }

      const { data: enrollment, error: enrollError } = await admin
        .from("foundation_enrollments")
        .upsert(
          {
            user_id: userId,
            course_id,
            progress_percent: 0,
            status: "in_progress",
            enrolled_at: new Date().toISOString(),
          },
          { onConflict: "user_id,course_id" },
        )
        .select()
        .single();

      if (enrollError) {
        return res.status(500).json({ error: enrollError.message });
      }

      return res.status(200).json(enrollment);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Server error" });
  }
}
