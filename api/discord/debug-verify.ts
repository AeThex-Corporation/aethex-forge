import { createClient } from "@supabase/supabase-js";

export const config = {
  runtime: "nodejs",
};

export default async function handler(req: any, res: any) {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE;

  const debug: any = {
    timestamp: new Date().toISOString(),
    env: {
      hasSupabaseUrl: !!supabaseUrl,
      supabaseUrlPrefix: supabaseUrl?.substring(0, 30) + "...",
      hasServiceRole: !!supabaseServiceRole,
      serviceRolePrefix: supabaseServiceRole?.substring(0, 20) + "...",
    },
  };

  if (!supabaseUrl || !supabaseServiceRole) {
    return res.status(500).json({
      error: "Missing environment variables",
      debug,
    });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceRole);

    const { data: codes, error: codesError } = await supabase
      .from("discord_verifications")
      .select("verification_code, discord_id, expires_at, created_at")
      .order("created_at", { ascending: false })
      .limit(5);

    debug.verificationCodes = {
      count: codes?.length || 0,
      error: codesError?.message,
      codes: codes?.map((c) => ({
        code: c.verification_code,
        discord_id: c.discord_id?.substring(0, 6) + "...",
        expires_at: c.expires_at,
        is_expired: new Date(c.expires_at) < new Date(),
      })),
    };

    const { data: links, error: linksError } = await supabase
      .from("discord_links")
      .select("discord_id, user_id, linked_at")
      .order("linked_at", { ascending: false })
      .limit(5);

    debug.discordLinks = {
      count: links?.length || 0,
      error: linksError?.message,
    };

    res.status(200).json({
      status: "ok",
      message: "Supabase connection working",
      debug,
    });
  } catch (error: any) {
    res.status(500).json({
      error: "Connection failed",
      message: error?.message,
      debug,
    });
  }
}
