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

  // Get the current API base from the request origin
  const protocol = req.headers["x-forwarded-proto"] || req.headers.protocol || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const apiBase = `${protocol}://${host}`;

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
