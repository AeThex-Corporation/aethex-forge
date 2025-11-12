import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!,
);

export default async function handler(req: any, res: any) {
  const { id } = req.query;

  if (req.method === "PUT") {
    try {
      const { is_published } = req.body;

      const { data, error } = await supabase
        .from("foundation_courses")
        .update({ is_published })
        .eq("id", id)
        .select();

      if (error) throw error;

      res.status(200).json(data);
    } catch (error: any) {
      res
        .status(500)
        .json({ error: error.message || "Failed to update course" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { error } = await supabase
        .from("foundation_courses")
        .delete()
        .eq("id", id);

      if (error) throw error;

      res.status(200).json({ message: "Course deleted" });
    } catch (error: any) {
      res
        .status(500)
        .json({ error: error.message || "Failed to delete course" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
