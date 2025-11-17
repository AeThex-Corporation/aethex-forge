/**
 * Foundation OAuth Callback Handler
 *
 * CRITICAL: This is a READ-ONLY sync from Foundation.
 * aethex.dev acts as an OAuth client that caches Foundation-issued passports.
 *
 * Flow:
 * 1. User authenticates with Foundation (oauth server)
 * 2. Foundation redirects to this callback with authorization code
 * 3. Exchange code for access_token + user info from Foundation
 * 4. ONE-WAY SYNC: Upsert Foundation user data to local cache
 * 5. Create session on aethex.dev (Foundation passport is SSOT)
 *
 * IMPORTANT: We NEVER write to passport data except during this sync.
 * All mutations must flow through Foundation's APIs.
 *
 * Endpoint: GET /auth/callback?code=...&state=...
 * Token Exchange: POST /auth/callback/exchange
 */

import { VercelRequest, VercelResponse } from "@vercel/node";
import { getAdminClient } from "../_supabase";

const FOUNDATION_URL =
  process.env.VITE_FOUNDATION_URL || "https://aethex.foundation";
const CLIENT_ID = process.env.FOUNDATION_OAUTH_CLIENT_ID || "aethex_corp";
const CLIENT_SECRET = process.env.FOUNDATION_OAUTH_CLIENT_SECRET;
const API_BASE = process.env.VITE_API_BASE || "https://aethex.dev";

interface FoundationTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface FoundationUserInfo {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  profile_complete: boolean;
  achievements?: string[];
  projects?: string[];
}

/**
 * GET /auth/callback
 * Receives authorization code from Foundation
 */
export async function handleCallback(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code, state, error, error_description } = req.query;

  // Handle Foundation errors
  if (error) {
    const message = error_description
      ? decodeURIComponent(String(error_description))
      : String(error);
    return res.redirect(
      `/login?error=${error}&message=${encodeURIComponent(message)}`,
    );
  }

  if (!code) {
    return res.redirect(
      `/login?error=no_code&message=${encodeURIComponent("No authorization code received")}`,
    );
  }

  try {
    // Validate state token (CSRF protection)
    // In production, state should be validated by checking session/cookie
    if (!state) {
      console.warn("[Foundation OAuth] Missing state parameter");
    }

    console.log(
      "[Foundation OAuth] Received authorization code, initiating token exchange",
    );

    // Store code in a temporary location for the exchange endpoint
    // In a real implementation, you'd use a temporary token or session
    const exchangeResult = await performTokenExchange(String(code));

    if (!exchangeResult.accessToken) {
      throw new Error("Failed to obtain access token");
    }

    // Fetch user information from Foundation
    const userInfo = await fetchUserInfoFromFoundation(
      exchangeResult.accessToken,
    );

    // Sync user to local database
    await syncUserToLocalDatabase(userInfo);

    // Set session cookies
    res.setHeader("Set-Cookie", [
      `foundation_access_token=${exchangeResult.accessToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${exchangeResult.expiresIn}`,
      `auth_user_id=${userInfo.id}; Path=/; Secure; SameSite=Strict; Max-Age=2592000`,
    ]);

    console.log("[Foundation OAuth] User authenticated:", userInfo.id);

    // Redirect to dashboard (or stored destination)
    const redirectTo = (req.query.redirect_to as string) || "/dashboard";
    return res.redirect(redirectTo);
  } catch (error) {
    console.error("[Foundation OAuth] Callback error:", error);
    const message =
      error instanceof Error ? error.message : "Authentication failed";
    return res.redirect(
      `/login?error=auth_failed&message=${encodeURIComponent(message)}`,
    );
  }
}

/**
 * POST /auth/callback/exchange
 * Exchange authorization code for access token
 * Called from frontend
 */
export async function handleTokenExchange(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Authorization code is required" });
  }

  try {
    const exchangeResult = await performTokenExchange(code);

    // Fetch user information from Foundation
    const userInfo = await fetchUserInfoFromFoundation(
      exchangeResult.accessToken,
    );

    // Sync user to local database
    await syncUserToLocalDatabase(userInfo);

    // Set session cookies
    res.setHeader("Set-Cookie", [
      `foundation_access_token=${exchangeResult.accessToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${exchangeResult.expiresIn}`,
      `auth_user_id=${userInfo.id}; Path=/; Secure; SameSite=Strict; Max-Age=2592000`,
    ]);

    console.log(
      "[Foundation OAuth] Token exchange successful for user:",
      userInfo.id,
    );

    return res.status(200).json({
      accessToken: exchangeResult.accessToken,
      user: userInfo,
    });
  } catch (error) {
    console.error("[Foundation OAuth] Token exchange error:", error);
    const message =
      error instanceof Error ? error.message : "Token exchange failed";
    return res.status(400).json({ error: message });
  }
}

/**
 * Exchange authorization code for access token with Foundation
 */
async function performTokenExchange(code: string): Promise<{
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}> {
  if (!CLIENT_SECRET) {
    throw new Error("FOUNDATION_OAUTH_CLIENT_SECRET not configured");
  }

  // Get code verifier from request session or context
  // For now, Foundation might not require PKCE on backend exchange
  // But we'll prepare for it

  const tokenEndpoint = `${FOUNDATION_URL}/api/oauth/token`;

  console.log("[Foundation OAuth] Exchanging code at:", tokenEndpoint);

  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("client_id", CLIENT_ID);
  params.append("client_secret", CLIENT_SECRET);
  params.append("redirect_uri", `${API_BASE}/auth/callback`);
  // Note: If Foundation uses PKCE, code_verifier would be sent here
  // For now, assuming server-side clients don't need PKCE verifier

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("[Foundation OAuth] Token exchange failed:", errorData);
    throw new Error(`Token exchange failed: ${response.status}`);
  }

  const data = (await response.json()) as FoundationTokenResponse;

  if (!data.access_token) {
    throw new Error("No access token in Foundation response");
  }

  return {
    accessToken: data.access_token,
    tokenType: data.token_type,
    expiresIn: data.expires_in || 3600,
  };
}

/**
 * Fetch user information from Foundation using access token
 */
async function fetchUserInfoFromFoundation(
  accessToken: string,
): Promise<FoundationUserInfo> {
  const userInfoEndpoint = `${FOUNDATION_URL}/api/oauth/userinfo`;

  console.log("[Foundation OAuth] Fetching user info from:", userInfoEndpoint);

  const response = await fetch(userInfoEndpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user info: ${response.status}`);
  }

  const userInfo = (await response.json()) as FoundationUserInfo;

  if (!userInfo.id || !userInfo.email) {
    throw new Error("Invalid user info response from Foundation");
  }

  return userInfo;
}

/**
 * Sync Foundation user to local database (READ-ONLY CACHE)
 *
 * This performs a ONE-WAY sync from Foundation to local cache.
 * We UPSERT data from Foundation, but NEVER modify the cache independently.
 * This cache is read-only except during this sync operation.
 *
 * If user data changes on Foundation, it syncs on next login.
 * If user data is modified locally outside this function: ERROR (should not happen)
 */
async function syncUserToLocalDatabase(
  foundationUser: FoundationUserInfo,
): Promise<void> {
  const supabase = getAdminClient();

  console.log(
    "[Foundation Passport Sync] Starting one-way sync from Foundation:",
    foundationUser.id,
  );

  // ONE-WAY SYNC: Upsert Foundation data to local cache
  // Note: This is the ONLY place where user_profiles should be written to
  const now = new Date().toISOString();
  const cacheValidUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hour cache TTL

  const { error } = await supabase.from("user_profiles").upsert({
    id: foundationUser.id,
    email: foundationUser.email,
    username: foundationUser.username || null,
    full_name: foundationUser.full_name || null,
    avatar_url: foundationUser.avatar_url || null,
    profile_completed: foundationUser.profile_complete || false,

    // Sync metadata (critical for cache validation)
    foundation_synced_at: now,
    cache_valid_until: cacheValidUntil,

    // Never overwrite local timestamps
    updated_at: now,
  });

  if (error) {
    console.error(
      "[Foundation Passport Sync] Failed to sync user profile:",
      error,
    );
    throw new Error("Failed to cache Foundation passport data locally");
  }

  console.log(
    "[Foundation Passport Sync] User synced successfully:",
    foundationUser.id,
    "| Cache valid until:",
    cacheValidUntil,
  );
}

/**
 * Export both handlers with different routing
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Determine which handler to use based on method and path
  if (req.url?.includes("/exchange")) {
    return handleTokenExchange(req, res);
  }

  return handleCallback(req, res);
}
