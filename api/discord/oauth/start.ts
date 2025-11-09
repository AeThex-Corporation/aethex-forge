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

  const redirectUri = "https://aethex.dev/api/discord/oauth/callback";

  // Get the next URL from query params (where to redirect after login)
  const next = req.query.state || "/dashboard";

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "identify email",
    state: typeof next === "string" ? next : "/dashboard",
  });

  const discordOAuthUrl = `https://discord.com/api/oauth2/authorize?${params.toString()}`;
  res.redirect(discordOAuthUrl);
}
