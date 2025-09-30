import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE || "";

export function getAdminClient() {
  if (!SUPABASE_URL) throw new Error("SUPABASE_URL not set");
  if (!SUPABASE_SERVICE_ROLE) throw new Error("SUPABASE_SERVICE_ROLE not set");
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
