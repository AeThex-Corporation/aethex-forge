import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE || "";

let maintenanceModeCache: boolean | null = null;

const ADMIN_ROLES = ["admin", "super_admin", "staff", "owner"];

async function verifyAdmin(token: string): Promise<boolean> {
  if (!supabaseUrl || !supabaseServiceRole) return false;
  
  const supabase = createClient(supabaseUrl, supabaseServiceRole);
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return false;
    
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);
    
    if (!roles) return false;
    
    return roles.some(r => ADMIN_ROLES.includes(r.role?.toLowerCase()));
  } catch {
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  
  const supabase = supabaseUrl && supabaseServiceRole 
    ? createClient(supabaseUrl, supabaseServiceRole)
    : null;

  if (req.method === "GET") {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from("platform_settings")
          .select("value")
          .eq("key", "maintenance_mode")
          .single();

        if (!error && data) {
          const isEnabled = data.value === true || data.value === "true";
          maintenanceModeCache = isEnabled;
          return res.json({ maintenance_mode: isEnabled });
        }
      }
      
      const envMaintenance = process.env.MAINTENANCE_MODE === "true";
      return res.json({ maintenance_mode: maintenanceModeCache ?? envMaintenance });
    } catch (e) {
      const envMaintenance = process.env.MAINTENANCE_MODE === "true";
      return res.json({ maintenance_mode: maintenanceModeCache ?? envMaintenance });
    }
  }

  if (req.method === "POST") {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const isAdmin = await verifyAdmin(token);
    if (!isAdmin) {
      return res.status(403).json({ error: "Forbidden - Admin access required" });
    }

    const { maintenance_mode } = req.body;

    if (typeof maintenance_mode !== "boolean") {
      return res.status(400).json({ error: "maintenance_mode must be a boolean" });
    }

    try {
      if (supabase) {
        const { error } = await supabase
          .from("platform_settings")
          .upsert(
            { key: "maintenance_mode", value: maintenance_mode, updated_at: new Date().toISOString() },
            { onConflict: "key" }
          );

        if (error) {
          console.error("[Maintenance] DB error:", error);
        }
      }

      maintenanceModeCache = maintenance_mode;
      return res.json({ maintenance_mode, success: true });
    } catch (e) {
      maintenanceModeCache = maintenance_mode;
      return res.json({ maintenance_mode, success: true });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
