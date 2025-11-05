import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const devUrl = import.meta.env.VITE_DEVCONNECT_URL as string | undefined;
const devAnon = import.meta.env.VITE_DEVCONNECT_ANON_KEY as string | undefined;

export const hasDevConnect = Boolean(devUrl && devAnon);

export const devconnect: SupabaseClient | null = hasDevConnect
  ? createClient(devUrl!, devAnon!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;
