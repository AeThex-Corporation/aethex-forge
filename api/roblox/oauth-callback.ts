import type { VercelRequest, VercelResponse } from "@vercel/node";

interface RobloxTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
}

interface RobloxUserInfo {
  sub: string;
  preferred_username: string;
  name: string;
  email?: string;
  picture?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { code, state } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Authorization code is required" });
    }

    const clientId = process.env.ROBLOX_OAUTH_CLIENT_ID;
    const clientSecret = process.env.ROBLOX_OAUTH_CLIENT_SECRET;
    const redirectUri =
      process.env.ROBLOX_OAUTH_REDIRECT_URI ||
      "https://aethex.dev/roblox-callback";

    if (!clientId || !clientSecret) {
      return res.status(500).json({ error: "Roblox OAuth not configured" });
    }

    // Exchange code for token
    const tokenResponse = await fetch("https://apis.roblox.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error("Roblox token exchange failed:", errorData);
      return res.status(401).json({ error: "Token exchange failed" });
    }

    const tokenData = (await tokenResponse.json()) as RobloxTokenResponse;

    // Get user info with access token
    const userResponse = await fetch(
      "https://apis.roblox.com/oauth/v1/userinfo",
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      },
    );

    if (!userResponse.ok) {
      console.error("Failed to fetch Roblox user info");
      return res.status(401).json({ error: "Failed to fetch user info" });
    }

    const userInfo = (await userResponse.json()) as RobloxUserInfo;

    // Return user info to frontend
    return res.status(200).json({
      roblox_user_id: userInfo.sub,
      roblox_username: userInfo.preferred_username,
      roblox_name: userInfo.name,
      roblox_email: userInfo.email || null,
      roblox_avatar: userInfo.picture || null,
      state,
    });
  } catch (error: any) {
    console.error("Roblox OAuth callback error:", error);
    return res.status(500).json({
      error: error?.message || "Authentication failed",
    });
  }
}
