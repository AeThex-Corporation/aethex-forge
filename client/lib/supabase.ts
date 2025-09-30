import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

console.log("Supabase Config:", {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  url: supabaseUrl,
  keyPrefix: supabaseAnonKey?.substring(0, 20) + "...",
  isSupabaseConfigured,
});

if (!isSupabaseConfigured) {
  const message =
    "Supabase environment variables are missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.";
  console.error(message);
  throw new Error(message);
}

export const supabase = createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

type SupabaseError = { message?: string };

setTimeout(async () => {
  try {
    console.log("🔍 Testing Supabase connection to:", supabaseUrl);
    const { error } = await supabase
      .from("user_profiles")
      .select("count", { count: "exact", head: true });
    if (error) {
      console.warn("⚠️ Supabase connection test failed:", error.message);
    } else {
      console.log("✅ Supabase connection successful");
    }
  } catch (err) {
    const error = err as SupabaseError;
    console.warn("⚠️ Supabase connection error:", error?.message ?? err);
  }

  try {
    console.log("🔍 Testing Supabase auth endpoint...");
    const { error } = await supabase.auth.getSession();
    if (error) {
      console.warn("⚠️ Supabase auth test failed:", error.message);
    } else {
      console.log("✅ Supabase auth endpoint accessible");
    }
  } catch (authErr) {
    const error = authErr as SupabaseError;
    console.warn("⚠️ Supabase auth endpoint error:", error?.message ?? authErr);
  }
}, 1000);

export const auth = supabase.auth;
export const db = supabase.from.bind(supabase);
export const storage = supabase.storage;
export const channel = supabase.channel.bind(supabase);

if (typeof window !== "undefined") {
  (window as any).testSupabase = async () => {
    console.log("🧪 Manual Supabase Test");
    console.log("URL:", supabaseUrl);
    console.log("Key configured:", !!supabaseAnonKey);

    try {
      const testLogin = await supabase.auth.signInWithPassword({
        email: "test@example.com",
        password: "test123",
      });
      console.log("Auth test result:", testLogin);
    } catch (error) {
      console.error("Auth test error:", error);
    }

    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .limit(1);
      console.log("Database test - data:", data, "error:", error);
    } catch (dbError) {
      console.error("Database test error:", dbError);
    }
  };
}
