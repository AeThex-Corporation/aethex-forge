import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE || "",
);

export interface GameAuthRequest {
  game: "unity" | "unreal" | "godot" | string;
  player_id: string;
  player_name: string;
  auth_token?: string; // Optional existing AeThex auth token
  device_id?: string;
  platform?: string; // "PC", "Mobile", "Console", etc.
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow both GET (for testing) and POST (for actual auth)
  if (req.method !== "POST" && req.method !== "GET") {
    res.setHeader("Allow", "POST, GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { game, player_id, player_name, auth_token, device_id, platform } =
      req.method === "POST" ? req.body : req.query;

    if (!game || !player_id || !player_name) {
      return res.status(400).json({
        error: "Missing required fields: game, player_id, player_name",
      });
    }

    const validGames = ["unity", "unreal", "godot", "roblox", "custom"];
    if (!validGames.includes(String(game))) {
      return res.status(400).json({
        error: `Invalid game. Must be one of: ${validGames.join(", ")}`,
      });
    }

    const gameType = String(game).toLowerCase();

    // Find or create user for this game
    const lookupKey = `${gameType}_player_id`;
    let { data: userData } = await supabase
      .from("user_profiles")
      .select("id, auth_id, email, username")
      .eq(lookupKey, String(player_id))
      .single();

    if (!userData) {
      // Create new game player user
      const email = `${String(player_id)}@${gameType}.aethex.dev`;
      const username = `${gameType}_${String(player_id).substring(0, 8)}`;

      const { data: newUser, error: createError } = await supabase
        .from("user_profiles")
        .insert({
          [lookupKey]: String(player_id),
          username,
          user_type: "game_developer",
          full_name: String(player_name),
          email,
          metadata: {
            game: gameType,
            player_id: String(player_id),
            player_name: String(player_name),
            platform: platform || null,
          },
        })
        .select()
        .single();

      if (createError) {
        console.error(`Failed to create ${gameType} user:`, createError);
        return res.status(500).json({ error: "Failed to create user" });
      }

      userData = newUser;
    }

    // Generate game session token
    const sessionToken = require("crypto").randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Store game session
    const { error: sessionError } = await supabase
      .from("game_sessions")
      .insert({
        user_id: userData.id,
        game: gameType,
        session_token: sessionToken,
        device_id,
        platform,
        expires_at: expiresAt.toISOString(),
        last_activity: new Date().toISOString(),
      });

    if (sessionError) {
      console.error("Failed to create game session:", sessionError);
      return res.status(500).json({ error: "Failed to create session" });
    }

    // Return auth data for game
    return res.status(200).json({
      success: true,
      session_token: sessionToken,
      user_id: userData.id,
      username: userData.username,
      email: userData.email,
      game: gameType,
      expires_in: 604800, // 7 days in seconds
      api_base_url: process.env.VITE_API_BASE || "https://aethex.dev/api",
      docs_url: "https://docs.aethex.dev/game-integration",
    });
  } catch (error: any) {
    console.error("Game authentication error:", error);
    return res.status(500).json({
      error: error?.message || "Authentication failed",
    });
  }
}
