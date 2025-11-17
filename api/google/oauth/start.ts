import type { VercelRequest, VercelResponse } from "@vercel/node";
import { randomBytes } from "crypto";

export const config = {
  runtime: "nodejs",
};

function generateState(): string {
  return randomBytes(32).toString("hex");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  if (!clientId) {
    console.error("[Google OAuth] Missing GOOGLE_OAUTH_CLIENT_ID");
    return res.status(500).json({ error: "Google OAuth not configured" });
  }

  const { state: incomingState } = req.query;
  const apiBase = process.env.VITE_API_BASE || "https://aethex.dev";
  const redirectUri = `${apiBase}/api/google/oauth/callback`;

  // Generate state and store any incoming state data in it
  let stateData: any = { nonce: generateState() };
  if (incomingState) {
    try {
      stateData = {
        ...JSON.parse(decodeURIComponent(incomingState as string)),
        nonce: generateState(),
      };
    } catch (e) {
      console.log("[Google OAuth] Could not parse incoming state");
      stateData = { nonce: generateState() };
    }
  }

  const state = Buffer.from(JSON.stringify(stateData)).toString("base64");

  // Build Google authorization URL
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
  });

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  return res.redirect(googleAuthUrl);
}
