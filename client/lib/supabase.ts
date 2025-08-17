import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables. Using demo mode.");
  // Use demo values for development
  const demoUrl = "https://demo.supabase.co";
  const demoKey = "demo-key";

  export const isSupabaseConfigured = false;
  export const supabase = createClient<Database>(demoUrl, demoKey);
} else {
  console.log("Supabase configured with URL:", supabaseUrl);
  export const isSupabaseConfigured = true;

  export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });

  // Test the connection
  supabase.from('user_profiles').select('count', { count: 'exact', head: true })
    .then(({ error }) => {
      if (error) {
        console.error("Supabase connection test failed:", error);
      } else {
        console.log("Supabase connection test successful");
      }
    })
    .catch((err) => {
      console.error("Supabase connection error:", err);
    });
}

// Auth helpers
export const auth = supabase.auth;

// Database helpers
export const db = supabase.from;

// Storage helpers
export const storage = supabase.storage;

// Real-time helpers
export const channel = supabase.channel;
