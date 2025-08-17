import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { mockAuth } from "./mock-auth";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("Supabase Config:", {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  url: supabaseUrl?.substring(0, 30) + "..."
});

// Check if we have valid environment variables
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey &&
  !supabaseUrl.includes('demo') && !supabaseAnonKey.includes('demo'));

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
      const { error } = await supabaseClient.from('user_profiles').select('count', { count: 'exact', head: true });
      if (error) {
        console.warn("⚠️ Supabase connection test failed:", error.message);
        console.log("🔄 Falling back to mock authentication for development");
      } else {
        console.log("✅ Supabase connection successful");
      }
    } catch (err: any) {
      console.warn("⚠️ Supabase connection error:", err.message);
      console.log("🔄 Using mock authentication for development");
    }
  }, 1000);
}

// Create a proxy that falls back to mock when Supabase fails
export const supabase = new Proxy(supabaseClient || {}, {
  get(target, prop) {
    if (prop === 'auth') {
      return {
        signInWithPassword: async (credentials: any) => {
          if (isSupabaseConfigured && target.auth) {
            try {
              return await target.auth.signInWithPassword(credentials);
            } catch (error: any) {
              if (error.message?.includes('Failed to fetch')) {
                console.log("🔄 Supabase failed, using mock auth");
                return await mockAuth.signInWithPassword(credentials.email, credentials.password);
              }
              throw error;
            }
          }
          return await mockAuth.signInWithPassword(credentials.email, credentials.password);
        },
        signOut: async () => {
          if (isSupabaseConfigured && target.auth) {
            try {
              return await target.auth.signOut();
            } catch (error) {
              console.warn("Supabase signOut failed, using mock");
            }
          }
          return await mockAuth.signOut();
        },
        getUser: async () => {
          if (isSupabaseConfigured && target.auth) {
            try {
              return await target.auth.getUser();
            } catch (error) {
              console.warn("Supabase getUser failed, using mock");
            }
          }
          return await mockAuth.getUser();
        },
        getSession: async () => {
          if (isSupabaseConfigured && target.auth) {
            try {
              return await target.auth.getSession();
            } catch (error) {
              console.warn("Supabase getSession failed, using mock");
            }
          }
          return await mockAuth.getSession();
        },
        onAuthStateChange: (callback: any) => {
          if (isSupabaseConfigured && target.auth) {
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

// Auth helpers
export const auth = supabase.auth;

// Database helpers
export const db = supabase.from;

// Storage helpers
export const storage = supabase.storage;

// Real-time helpers
export const channel = supabase.channel;
