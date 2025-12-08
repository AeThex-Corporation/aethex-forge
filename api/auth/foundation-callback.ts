/**
 * Foundation OAuth Callback Handler
 *
 * This endpoint receives the authorization code from aethex.foundation after user authentication.
 * It exchanges the code for an access token and establishes a session on aethex.dev.
 */

import { getAdminClient } from "../_supabase";
import { VercelRequest, VercelResponse } from "@vercel/node";

const FOUNDATION_URL =
  process.env.VITE_FOUNDATION_URL || "https://aethex.foundation";
const API_BASE = process.env.VITE_API_BASE || "https://aethex.dev";

interface FoundationTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: string;
    email: string;
    username: string;
    full_name?: string;
    profile_complete: boolean;
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code, state, error } = req.query;

  // Handle Foundation errors
  if (error) {
    const errorDesc = req.query.error_description || error;
    return res.redirect(
      `/login?error=${error}&message=${encodeURIComponent(String(errorDesc))}`,
    );
  }

  if (!code) {
    return res.redirect(
      "/login?error=no_code&message=Authorization code not received",
    );
  }

  try {
    // Parse state to get redirect destination
    let redirectTo = "/dashboard";
    if (state) {
      try {
        const stateData = JSON.parse(decodeURIComponent(String(state)));
        redirectTo = stateData.redirectTo || redirectTo;
      } catch {
        // Ignore state parsing errors, use default
      }
    }

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
      console.error("[Foundation OAuth] Token exchange failed:", errorData);
      return res.redirect(
        `/login?error=token_exchange&message=${encodeURIComponent("Failed to exchange authorization code")}`,
      );
    }

    const tokenData = (await tokenResponse.json()) as FoundationTokenResponse;

    if (!tokenData.access_token || !tokenData.user) {
      console.error("[Foundation OAuth] Invalid token response");
      return res.redirect(
        "/login?error=invalid_token&message=Invalid token response",
      );
    }

    // Extract user information from Foundation response
    const { user, access_token } = tokenData;

    // Ensure user profile exists in aethex.dev's local database
    // This syncs the user profile from Foundation
    const supabase = getAdminClient();

    // Get or create user profile locally
    const { data: existingProfile, error: fetchError } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 = no rows found (expected for new users)
      console.error(
        "[Foundation OAuth] Error fetching user profile:",
        fetchError,
      );
    }

    if (!existingProfile) {
      // Create user profile from Foundation data
      const { error: createError } = await supabase
        .from("user_profiles")
        .insert({
          id: user.id,
          email: user.email,
          username: user.username || null,
          full_name: user.full_name || null,
          profile_completed: user.profile_complete || false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (createError) {
        console.error(
          "[Foundation OAuth] Failed to create user profile:",
          createError,
        );
        return res.redirect(
          `/login?error=profile_create&message=${encodeURIComponent("Failed to create local user profile")}`,
        );
      }
    }

    // Set session cookie with Foundation's access token
    // The frontend will use this token for authenticated requests
    res.setHeader("Set-Cookie", [
      `foundation_access_token=${access_token}; Path=/; HttpOnly; Secure; SameSite=Strict`,
      `auth_user_id=${user.id}; Path=/; Secure; SameSite=Strict`,
    ]);

    console.log("[Foundation OAuth] Successfully authenticated user:", user.id);

    // Redirect to intended destination or dashboard
    return res.redirect(redirectTo);
  } catch (error) {
    console.error("[Foundation OAuth] Callback error:", error);
    return res.redirect(
      `/login?error=unknown&message=${encodeURIComponent("An unexpected error occurred")}`,
    );
  }
}
