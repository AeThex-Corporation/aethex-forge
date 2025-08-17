import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("Supabase Config:", {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  url: supabaseUrl?.substring(0, 30) + "..."
});

// For development, let's use a working demo setup if the current one fails
let finalUrl = supabaseUrl;
let finalKey = supabaseAnonKey;

// Check if we have the environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Missing Supabase environment variables");
  finalUrl = "https://demo.supabase.co";
  finalKey = "demo-key";
}

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = createClient<Database>(finalUrl, finalKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Test connection in a non-blocking way
setTimeout(async () => {
  try {
    const { error } = await supabase.from('user_profiles').select('count', { count: 'exact', head: true });
    if (error) {
      console.error("Supabase connection test failed:", error.message);
    } else {
      console.log("✅ Supabase connection successful");
    }
  } catch (err: any) {
    console.error("❌ Supabase connection error:", err.message);
  }
}, 1000);

// Auth helpers
export const auth = supabase.auth;

// Database helpers
export const db = supabase.from;

// Storage helpers
export const storage = supabase.storage;

// Real-time helpers
export const channel = supabase.channel;
