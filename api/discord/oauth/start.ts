export const config = {
  runtime: "nodejs",
};

export default function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const clientId = process.env.DISCORD_CLIENT_ID;
  if (!clientId) {
    return res.status(500).json({ error: "Discord client ID not configured" });
  }

  // Use the main API base domain to ensure the redirect_uri matches the registered one
  // This is critical because Discord OAuth requires exact match of redirect_uri
  const apiBase = process.env.VITE_API_BASE || "https://aethex.dev";
  const redirectUri = `${apiBase}/api/discord/oauth/callback`;

  // Get the state from query params (can be a JSON string with action and redirectTo)
  const state = req.query.state || "/dashboard";

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "identify email",
    state: typeof state === "string" ? state : "/dashboard",
  });

  const discordOAuthUrl = `https://discord.com/api/oauth2/authorize?${params.toString()}`;
  res.redirect(discordOAuthUrl);
}
