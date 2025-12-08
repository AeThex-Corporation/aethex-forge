/**
 * Token Exchange Endpoint
 *
 * Frontend calls this endpoint after receiving the authorization code from Foundation.
 * It stores the Foundation's access token and returns user information.
 */

import { VercelRequest, VercelResponse } from "@vercel/node";

const FOUNDATION_URL =
  process.env.VITE_FOUNDATION_URL || "https://aethex.foundation";
const API_BASE = process.env.VITE_API_BASE || "https://aethex.dev";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Authorization code is required" });
  }

  try {
    // Exchange code for token with Foundation
    const tokenResponse = await fetch(`${FOUNDATION_URL}/api/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code,
        client_id: "aethex-corp",
        client_secret: process.env.FOUNDATION_OAUTH_CLIENT_SECRET,
        redirect_uri: `${API_BASE}/api/auth/foundation-callback`,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json().catch(() => ({}));
      console.error("[Exchange Token] Token exchange failed:", errorData);
      return res.status(400).json({
        error: "Failed to exchange code for token",
        details: errorData,
      });
    }

    const tokenData = (await tokenResponse.json()) as { access_token?: string; user?: { id: string } };

    if (!tokenData.access_token) {
      return res.status(400).json({ error: "No access token in response" });
    }

    // Set cookie with access token
    res.setHeader("Set-Cookie", [
      `foundation_access_token=${tokenData.access_token}; Path=/; HttpOnly; Secure; SameSite=Strict`,
      `auth_user_id=${tokenData.user?.id || ""}; Path=/; Secure; SameSite=Strict`,
    ]);

    return res.status(200).json({
      accessToken: tokenData.access_token,
      user: tokenData.user,
    });
  } catch (error) {
    console.error("[Exchange Token] Error:", error);
    return res.status(500).json({
      error: "Failed to exchange token",
      details: String(error),
    });
  }
}
