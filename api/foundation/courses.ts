import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!,
);

export async function getCourses(req: Request) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category");
    const difficulty = url.searchParams.get("difficulty");

    let query = supabase.from("foundation_courses").select(
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
        full_name,
        avatar_url
      )
    `,
    );

    // Only show published courses
    query = query.eq("is_published", true);

    if (category) {
      query = query.eq("category", category);
    }

    if (difficulty) {
      query = query.eq("difficulty", difficulty);
    }

    const { data: courses, error } = await query.order("created_at", {
      ascending: false,
    });

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
      instructor_avatar: c.user_profiles?.avatar_url,
      cover_image_url: c.cover_image_url,
      estimated_hours: c.estimated_hours,
    }));

    return new Response(JSON.stringify(formattedCourses), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error fetching courses:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch courses" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
