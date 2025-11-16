import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.VITE_SUPABASE_URL || "https://kmdeisowhtsalsekkzqd.supabase.co";
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE || "";

export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Missing authorization code" });
    }

    const clientId = process.env.DISCORD_CLIENT_ID;
    const clientSecret = process.env.DISCORD_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error("[Discord Token] Missing CLIENT_ID or CLIENT_SECRET");
      return res.status(500).json({ error: "Server not configured" });
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch(
      "https://discord.com/api/v10/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "authorization_code",
          code,
          redirect_uri:
            process.env.DISCORD_ACTIVITY_REDIRECT_URI ||
            "https://aethex.dev/activity",
        }).toString(),
      },
    );

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json();
      console.error("[Discord Token] Token exchange failed:", error);
      return res.status(400).json({
        error: "Failed to exchange code for token",
        details: error,
      });
    }

    const tokenData = (await tokenResponse.json()) as {
      access_token: string;
      token_type: string;
      expires_in: number;
    };
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      console.error("[Discord Token] No access token in response");
      return res.status(500).json({ error: "Failed to obtain access token" });
    }

    // Fetch Discord user info to ensure token is valid
    const userResponse = await fetch("https://discord.com/api/v10/users/@me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      console.error("[Discord Token] Failed to fetch user info");
      return res.status(401).json({ error: "Invalid token" });
    }

    const discordUser = (await userResponse.json()) as {
      id: string;
      username: string;
    };
    console.log(
      "[Discord Token] Token exchange successful for user:",
      discordUser.id,
    );

    // Return access token to Activity
    return res.status(200).json({
      access_token: accessToken,
      token_type: tokenData.token_type,
      expires_in: tokenData.expires_in,
      user_id: discordUser.id,
      username: discordUser.username,
    });
  } catch (error) {
    console.error("[Discord Token] Error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
