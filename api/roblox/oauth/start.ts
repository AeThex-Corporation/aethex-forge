import type { VercelRequest, VercelResponse } from "@vercel/node";
import { randomUUID, createHash } from "crypto";

function isHttps(req: VercelRequest) {
  const xfProto = (req.headers["x-forwarded-proto"] || "").toString();
  return xfProto.includes("https");
}

function toBase64Url(input: Buffer) {
  return input
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const clientId = process.env.ROBLOX_OAUTH_CLIENT_ID;
    if (!clientId) return res.status(500).json({ error: "Roblox OAuth not configured" });

    const baseSite =
      process.env.PUBLIC_BASE_URL || process.env.SITE_URL || "https://aethex.dev";

    const redirectParam = Array.isArray(req.query.redirect_uri)
      ? req.query.redirect_uri[0]
      : (req.query.redirect_uri as string | undefined);

    const redirectUri = redirectParam && redirectParam.startsWith("http")
      ? redirectParam
      : process.env.ROBLOX_OAUTH_REDIRECT_URI || `${baseSite}/roblox-callback`;

    const scope = (Array.isArray(req.query.scope) ? req.query.scope[0] : (req.query.scope as string)) ||
      process.env.ROBLOX_OAUTH_SCOPE ||
      "openid";

    const state = (Array.isArray(req.query.state) ? req.query.state[0] : (req.query.state as string)) || randomUUID();

    const codeVerifier = toBase64Url(Buffer.from(randomUUID() + randomUUID())).slice(0, 64);
    const codeChallenge = toBase64Url(
      createHash("sha256").update(codeVerifier).digest(),
    );

    const params = new URLSearchParams({
      client_id: clientId,
      response_type: "code",
      redirect_uri: redirectUri,
      scope: String(scope),
      state: String(state),
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    });

    const authorizeUrl = `https://apis.roblox.com/oauth/authorize?${params.toString()}`;

    const secure = isHttps(req) || process.env.NODE_ENV === "production";
    const cookieCommon = `Path=/; HttpOnly; SameSite=Lax; Max-Age=${10 * 60}${secure ? "; Secure" : ""}`;
    res.setHeader("Set-Cookie", [
      `roblox_oauth_state=${encodeURIComponent(state)}; ${cookieCommon}`,
      `roblox_oauth_code_verifier=${encodeURIComponent(codeVerifier)}; ${cookieCommon}`,
    ]);

    // CORS for JSON fetch testing
    const origin = (req.headers.origin as string) || "*";
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");

    const json = ((Array.isArray(req.query.json) ? req.query.json[0] : req.query.json) || "").toString().toLowerCase();
    if (json === "true") {
      return res.status(200).json({ authorizeUrl, state });
    }

    res.status(302).setHeader("Location", authorizeUrl);
    return res.end();
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || String(e) });
  }
}
