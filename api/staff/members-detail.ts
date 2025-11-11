import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE || "",
);

interface StaffMemberUpdate {
  email?: string;
  full_name?: string;
  position?: string;
  department?: string;
  phone?: string;
  avatar_url?: string;
  role?: "owner" | "admin" | "founder" | "staff" | "employee";
  is_active?: boolean;
  hired_date?: string;
}

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Missing staff member ID" });
  }

  try {
    // GET /api/staff/members-detail?id=X - Get single staff member
    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("staff_members")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        return res.status(404).json({
          error: "Staff member not found",
        });
      }

      return res.status(200).json(data);
    }

    // PUT /api/staff/members-detail?id=X - Update staff member
    if (req.method === "PUT") {
      const updates: StaffMemberUpdate = req.body;

      const { data, error } = await supabase
        .from("staff_members")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating staff member:", error);
        return res.status(500).json({
          error: "Failed to update staff member",
          details: error.message,
        });
      }

      if (!data) {
        return res.status(404).json({
          error: "Staff member not found",
        });
      }

      return res.status(200).json(data);
    }

    // DELETE /api/staff/members-detail?id=X - Delete staff member
    if (req.method === "DELETE") {
      const { error } = await supabase
        .from("staff_members")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting staff member:", error);
        return res.status(500).json({
          error: "Failed to delete staff member",
          details: error.message,
        });
      }

      return res.status(200).json({ success: true, id });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    console.error("Server error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
}
