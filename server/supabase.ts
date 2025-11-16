import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE || "";

if (!SUPABASE_URL) {
  console.warn("SUPABASE_URL not set for server");
}
if (!SUPABASE_SERVICE_ROLE) {
  console.warn(
    "SUPABASE_SERVICE_ROLE not set for server (admin ops will fail)",
  );
}

let admin: any = null;
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE) {
  admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export const adminSupabase = admin as ReturnType<typeof createClient>;
