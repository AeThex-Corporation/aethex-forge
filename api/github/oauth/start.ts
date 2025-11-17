import type { VercelRequest, VercelResponse } from "@vercel/node";

export const config = {
  runtime: "nodejs",
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  if (!clientId) {
    console.error("[GitHub OAuth] Missing GITHUB_OAUTH_CLIENT_ID");
    return res.status(500).json({ error: "GitHub OAuth not configured" });
  }

  const { state } = req.query;
  const apiBase = process.env.VITE_API_BASE || "https://aethex.dev";
  const redirectUri = `${apiBase}/api/github/oauth/callback`;

  // Build GitHub authorization URL
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "user:email",
    state: state ? decodeURIComponent(state as string) : "",
  });

  const githubAuthUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;
  return res.redirect(githubAuthUrl);
}
