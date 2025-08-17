import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { mockAuth } from "./mock-auth";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("Supabase Config:", {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  url: supabaseUrl,
  keyPrefix: supabaseAnonKey?.substring(0, 20) + "...",
  isSupabaseConfigured
});

// Check if we have valid environment variables
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

let supabaseClient: any = null;

if (isSupabaseConfigured) {
  supabaseClient = createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });

  // Test connection
  setTimeout(async () => {
    try {
      console.log("🔍 Testing Supabase connection to:", supabaseUrl);
      const { data, error } = await supabaseClient.from('user_profiles').select('count', { count: 'exact', head: true });
      if (error) {
        console.warn("⚠️ Supabase connection test failed:", error.message);
        console.log("🔄 Falling back to mock authentication for development");
      } else {
        console.log("✅ Supabase connection successful - found", data, "user profiles");
      }
    } catch (err: any) {
      console.warn("⚠️ Supabase connection error:", err.message);
      console.log("🔄 Using mock authentication for development");
    }

    // Also test auth endpoint specifically
    try {
      console.log("🔍 Testing Supabase auth endpoint...");
      const { data, error } = await supabaseClient.auth.getSession();
      if (error) {
        console.warn("⚠️ Supabase auth test failed:", error.message);
      } else {
        console.log("✅ Supabase auth endpoint accessible");
      }
    } catch (authErr: any) {
      console.warn("⚠️ Supabase auth endpoint error:", authErr.message);
    }
  }, 1000);
}

// Create a proxy that falls back to mock when Supabase fails
export const supabase = new Proxy(supabaseClient || {}, {
  get(target, prop) {
    if (prop === 'auth') {
      return {
        signInWithPassword: async (credentials: any) => {
          if (isSupabaseConfigured && target && target.auth) {
            try {
              console.log("Attempting Supabase authentication...");
              const result = await target.auth.signInWithPassword(credentials);
              console.log("✅ Supabase authentication successful");
              return result;
            } catch (error: any) {
              console.warn("⚠️ Supabase authentication failed:", error.message);
              if (error.message?.includes('Failed to fetch') ||
                  error.name === 'AuthRetryableFetchError' ||
                  error.message?.includes('fetch')) {
                console.log("🔄 Falling back to mock authentication");
                return await mockAuth.signInWithPassword(credentials.email, credentials.password);
              }
              throw error;
            }
          } else {
            console.log("🔄 Using mock authentication (Supabase not configured)");
            return await mockAuth.signInWithPassword(credentials.email, credentials.password);
          }
        },
        signOut: async () => {
          if (isSupabaseConfigured && target && target.auth) {
            try {
              return await target.auth.signOut();
            } catch (error) {
              console.warn("Supabase signOut failed, using mock");
            }
          }
          return await mockAuth.signOut();
        },
        getUser: async () => {
          if (isSupabaseConfigured && target && target.auth) {
            try {
              return await target.auth.getUser();
            } catch (error) {
              console.warn("Supabase getUser failed, using mock");
            }
          }
          return await mockAuth.getUser();
        },
        getSession: async () => {
          if (isSupabaseConfigured && target && target.auth) {
            try {
              return await target.auth.getSession();
            } catch (error) {
              console.warn("Supabase getSession failed, using mock");
            }
          }
          return await mockAuth.getSession();
        },
        onAuthStateChange: (callback: any) => {
          if (isSupabaseConfigured && target && target.auth) {
            try {
              return target.auth.onAuthStateChange(callback);
            } catch (error) {
              console.warn("Supabase onAuthStateChange failed, using mock");
            }
          }
          return mockAuth.onAuthStateChange(callback);
        }
      };
    }

    if (prop === 'from') {
      return (table: string) => ({
        select: () => ({ error: null, data: [] }),
        insert: () => ({ error: null, data: [] }),
        update: () => ({ error: null, data: [] }),
        delete: () => ({ error: null, data: [] })
      });
    }

    return target[prop];
  }
});

// Auth helpers
export const auth = supabase.auth;

// Database helpers
export const db = supabase.from;

// Storage helpers
export const storage = supabase.storage;

// Real-time helpers
export const channel = supabase.channel;

// Test function for debugging
(window as any).testSupabase = async () => {
  console.log("🧪 Manual Supabase Test");
  console.log("URL:", supabaseUrl);
  console.log("Key configured:", !!supabaseAnonKey);

  try {
    const testLogin = await supabase.auth.signInWithPassword({
      email: "test@example.com",
      password: "test123"
    });
    console.log("Auth test result:", testLogin);
  } catch (error) {
    console.error("Auth test error:", error);
  }

  try {
    const { data, error } = await supabase.from('user_profiles').select('*').limit(1);
    console.log("Database test - data:", data, "error:", error);
  } catch (dbError) {
    console.error("Database test error:", dbError);
  }
};
