import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { createHmac } from "crypto";

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE || "",
);

// Verify Roblox signature for server-to-server requests
function verifyRobloxSignature(
  payload: string,
  signature: string,
  secret: string,
): boolean {
  const hmac = createHmac("sha256", secret);
  hmac.update(payload);
  const computedSignature = hmac.digest("base64");
  return computedSignature === signature;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const signature = req.headers["x-roblox-signature"] as string;
    const payload = JSON.stringify(req.body);
    const secret = process.env.ROBLOX_SHARED_SECRET || "";

    // Verify signature for security
    if (
      signature &&
      secret &&
      !verifyRobloxSignature(payload, signature, secret)
    ) {
      console.warn("Invalid Roblox signature");
      return res.status(401).json({ error: "Invalid signature" });
    }

    const {
      roblox_user_id,
      roblox_username,
      player_token,
      action = "authenticate",
    } = req.body;

    if (!roblox_user_id || !roblox_username) {
      return res.status(400).json({ error: "Missing Roblox user info" });
    }

    // Find or create user linked to Roblox account
    let { data: userData } = await supabase
      .from("user_profiles")
      .select("id, auth_id, email")
      .eq("roblox_user_id", String(roblox_user_id))
      .single();

    if (!userData) {
      // Create new user linked to Roblox
      const { data: newUser, error: createError } = await supabase
        .from("user_profiles")
        .insert({
          roblox_user_id: String(roblox_user_id),
          roblox_username,
          username: roblox_username,
          user_type: "game_developer",
          full_name: roblox_username,
          email: `${roblox_user_id}@roblox.aethex.dev`,
        })
        .select()
        .single();

      if (createError) {
        console.error("Failed to create Roblox user:", createError);
        return res.status(500).json({ error: "Failed to create user" });
      }

      userData = newUser;
    }

    // Generate game token for in-game authentication
    const gameToken = require("crypto").randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store game token
    await supabase.from("game_auth_tokens").insert({
      user_id: userData.id,
      game: "roblox",
      token: gameToken,
      player_token,
      expires_at: expiresAt.toISOString(),
      metadata: {
        roblox_user_id,
        roblox_username,
      },
    });

    return res.status(200).json({
      success: true,
      game_token: gameToken,
      user_id: userData.id,
      username: userData.username || roblox_username,
      expires_in: 86400, // seconds
    });
  } catch (error: any) {
    console.error("Roblox game auth error:", error);
    return res.status(500).json({
      error: error?.message || "Authentication failed",
    });
  }
}
