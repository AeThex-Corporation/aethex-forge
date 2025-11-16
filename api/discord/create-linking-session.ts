import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

export const config = {
  runtime: "nodejs",
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Missing or invalid authorization header" });
    }

    const accessToken = authHeader.slice(7);

    // Initialize Supabase with anon key to verify the token
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
    const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE;

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRole) {
      console.error("[Discord Create Session] Missing environment variables:", {
        supabaseUrl: !!supabaseUrl,
        supabaseAnonKey: !!supabaseAnonKey,
        supabaseServiceRole: !!supabaseServiceRole,
      });
      return res.status(500).json({ error: "Server configuration error" });
    }

    // Create client with anon key to verify token
    const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole);

    // Verify the access token by getting the user
    const {
      data: { user },
      error: userError,
    } = await supabaseAnon.auth.getUser(accessToken);

    if (userError || !user) {
      console.error("[Discord Create Session] Invalid token:", userError);
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const userId = user.id;

    // Generate a random session token
    const sessionToken = randomUUID();

    // Create a temporary linking session (expires in 10 minutes)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { error: createError } = await supabaseAdmin
      .from("discord_linking_sessions")
      .insert({
        user_id: userId,
        session_token: sessionToken,
        expires_at: expiresAt,
      });

    if (createError) {
      console.error(
        "[Discord Create Session] Failed to create session:",
        createError,
      );
      return res
        .status(500)
        .json({ error: "Failed to create linking session" });
    }

    console.log("[Discord Create Session] Session created for user:", userId);

    return res.status(200).json({
      success: true,
      token: sessionToken,
      expiresAt,
    });
  } catch (error: any) {
    console.error("[Discord Create Session] Error:", error);
    return res.status(500).json({
      error: error?.message || "Failed to create linking session",
    });
  }
}
