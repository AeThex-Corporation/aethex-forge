import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE || "",
);

interface StaffMember {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  position: string;
  department: string;
  phone: string;
  avatar_url?: string;
  role: "owner" | "admin" | "founder" | "staff" | "employee";
  is_active: boolean;
  hired_date?: string;
  created_at: string;
  updated_at: string;
}

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // GET /api/staff/members - List all staff members
    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("staff_members")
        .select("*")
        .order("full_name", { ascending: true });

      if (error) {
        console.error("Error fetching staff members:", error);
        return res.status(500).json({
          error: "Failed to fetch staff members",
          details: error.message,
        });
      }

      return res.status(200).json(data || []);
    }

    // POST /api/staff/members - Create new staff member
    if (req.method === "POST") {
      const {
        user_id,
        email,
        full_name,
        position,
        department,
        phone,
        avatar_url,
        role,
        hired_date,
      } = req.body;

      if (!email || !full_name) {
        return res.status(400).json({
          error: "Missing required fields: email, full_name",
        });
      }

      const { data, error } = await supabase
        .from("staff_members")
        .insert([
          {
            user_id: user_id || null,
            email,
            full_name,
            position: position || null,
            department: department || null,
            phone: phone || null,
            avatar_url: avatar_url || null,
            role: role || "employee",
            hired_date: hired_date || null,
          },
        ])
        .select();

      if (error) {
        console.error("Error creating staff member:", error);
        return res.status(500).json({
          error: "Failed to create staff member",
          details: error.message,
        });
      }

      return res.status(201).json(data[0]);
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
