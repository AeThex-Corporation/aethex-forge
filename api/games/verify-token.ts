import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE || "",
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST" && req.method !== "GET") {
    res.setHeader("Allow", "POST, GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { session_token, game } =
      req.method === "POST" ? req.body : req.query;

    if (!session_token) {
      return res.status(400).json({ error: "session_token is required" });
    }

    // Find the session
    const { data: sessionData, error: sessionError } = await supabase
      .from("game_sessions")
      .select(
        "*, user_profiles!inner(id, username, email, full_name, metadata)",
      )
      .eq("session_token", String(session_token))
      .single();

    if (sessionError || !sessionData) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Check if session is expired
    const expiresAt = new Date(sessionData.expires_at);
    if (expiresAt < new Date()) {
      return res.status(401).json({ error: "Session has expired" });
    }

    // Optional: Verify game matches if provided
    if (game && sessionData.game !== String(game).toLowerCase()) {
      return res
        .status(403)
        .json({ error: "Token is not valid for this game" });
    }

    // Update last activity
    await supabase
      .from("game_sessions")
      .update({ last_activity: new Date().toISOString() })
      .eq("session_token", String(session_token));

    const user = sessionData.user_profiles;

    return res.status(200).json({
      valid: true,
      user_id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      game: sessionData.game,
      platform: sessionData.platform,
      expires_at: sessionData.expires_at,
      metadata: user.metadata || {},
    });
  } catch (error: any) {
    console.error("Token verification error:", error);
    return res.status(500).json({
      error: error?.message || "Verification failed",
    });
  }
}
