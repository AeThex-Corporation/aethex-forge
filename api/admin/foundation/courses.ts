import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!,
);

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    try {
      const { data: courses, error } = await supabase
        .from("foundation_courses")
        .select(
          `
        id,
        slug,
        title,
        description,
        category,
        difficulty,
        instructor_id,
        cover_image_url,
        estimated_hours,
        is_published,
        user_profiles!foundation_courses_instructor_id_fkey (
          id,
          full_name
        )
      `,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedCourses = (courses || []).map((c: any) => ({
        id: c.id,
        slug: c.slug,
        title: c.title,
        description: c.description,
        category: c.category,
        difficulty: c.difficulty,
        instructor_id: c.instructor_id,
        instructor_name: c.user_profiles?.full_name,
        cover_image_url: c.cover_image_url,
        estimated_hours: c.estimated_hours,
        is_published: c.is_published,
      }));

      res.status(200).json(formattedCourses);
    } catch (error: any) {
      res
        .status(500)
        .json({ error: error.message || "Failed to fetch courses" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
