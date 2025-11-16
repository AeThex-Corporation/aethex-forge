import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE || "";

console.log("[Supabase Init] SUPABASE_URL configured:", !!SUPABASE_URL);
console.log(
  "[Supabase Init] SUPABASE_SERVICE_ROLE configured:",
  !!SUPABASE_SERVICE_ROLE,
);

export function getAdminClient() {
  if (!SUPABASE_URL) {
    console.error("[Supabase] SUPABASE_URL not set");
    throw new Error("SUPABASE_URL not set");
  }
  if (!SUPABASE_SERVICE_ROLE) {
    console.error("[Supabase] SUPABASE_SERVICE_ROLE not set");
    throw new Error("SUPABASE_SERVICE_ROLE not set");
  }

  console.log(
    "[Supabase] Creating client with URL:",
    SUPABASE_URL.substring(0, 30) + "...",
  );
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// Alias for backward compatibility
export const supabase = getAdminClient();

// Dummy default export for Vercel (this file is a utility, not a handler)
export default async function handler(req: VercelRequest, res: VercelResponse) {
  return res.status(501).json({ error: "Not a handler" });
}
