import { createClient } from "@supabase/supabase-js";
import { notifyAccountLinked } from "../../_notifications.js";
import { getAdminClient } from "../../_supabase.js";
import { federateOAuthUser, linkProviderToPassport } from "../../_oauth-federation.js";

export const config = {
  runtime: "nodejs",
};

interface GoogleTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  id_token: string;
}

interface GoogleUserInfo {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}

function decodeJWT(token: string): any {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const decoded = Buffer.from(parts[1], "base64").toString("utf-8");
    return JSON.parse(decoded);
  } catch (e) {
    return null;
  }
}

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code, state, error } = req.query;

  // Handle Google error
  if (error) {
    return res.redirect(`/login?error=${error}`);
  }

  if (!code) {
    return res.redirect("/login?error=no_code");
  }

  // Parse state to determine if this is a linking or login flow
  let isLinkingFlow = false;
  let redirectTo = "/dashboard";

  if (state) {
    try {
      const stateData = JSON.parse(
        Buffer.from(state as string, "base64").toString("utf-8"),
      );
      isLinkingFlow = stateData.action === "link";
      redirectTo = stateData.redirectTo || redirectTo;
    } catch (e) {
      console.log("[Google OAuth] Could not parse state:", e);
    }
  }

  // For linking flow, extract user ID from temporary session stored in database
  let authenticatedUserId: string | null = null;
  if (isLinkingFlow) {
    try {
      const stateData = JSON.parse(
        Buffer.from(state as string, "base64").toString("utf-8"),
      );
      const sessionToken = stateData.sessionToken;

      if (!sessionToken) {
        console.error(
          "[Google OAuth] No session token found in linking flow state",
        );
        return res.redirect(
          "/login?error=session_lost&message=Session%20expired.%20Please%20try%20linking%20Google%20again.",
        );
      }

      // Query database for the temporary linking session
      const tempAdminClient = getAdminClient();
      const { data: session, error: sessionError } = await tempAdminClient
        .from("discord_linking_sessions")
        .select("user_id")
        .eq("session_token", sessionToken)
        .gt("expires_at", new Date().toISOString())
        .single();

      if (sessionError || !session) {
        console.error(
          "[Google OAuth] Linking session not found or expired",
          sessionError,
        );
        return res.redirect(
          "/login?error=session_lost&message=Session%20expired.%20Please%20try%20linking%20Google%20again.",
        );
      }

      authenticatedUserId = session.user_id;
      console.log(
        "[Google OAuth] Linking session found, user_id:",
        authenticatedUserId,
      );

      // Clean up: delete the temporary session
      await tempAdminClient
        .from("discord_linking_sessions")
        .delete()
        .eq("session_token", sessionToken);
    } catch (e) {
      console.error("[Google OAuth] Error parsing/using session token:", e);
      return res.redirect(
        "/login?error=session_lost&message=Session%20error.%20Please%20try%20again.",
      );
    }
  }

  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE;

  if (!clientId || !clientSecret || !supabaseUrl || !supabaseServiceRole) {
    console.error("[Google OAuth] Missing environment variables");
    return res.redirect("/login?error=config");
  }

  try {
    const apiBase = process.env.VITE_API_BASE || "https://aethex.dev";
    const redirectUri = `${apiBase}/api/google/oauth/callback`;

    // Exchange code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("[Google OAuth] Token exchange failed:", errorData);
      return res.redirect("/login?error=token_exchange");
    }

    const tokenData = (await tokenResponse.json()) as GoogleTokenResponse;

    if (!tokenData.access_token) {
      console.error("[Google OAuth] No access token in response");
      return res.redirect("/login?error=no_token");
    }

    // Decode ID token to get user info
    let googleUser: GoogleUserInfo | null = null;

    if (tokenData.id_token) {
      googleUser = decodeJWT(tokenData.id_token) as GoogleUserInfo;
    }

    // Fallback: Fetch user info from Google API if JWT decode failed
    if (!googleUser) {
      const userResponse = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        },
      );

      if (!userResponse.ok) {
        console.error("[Google OAuth] User fetch failed:", userResponse.status);
        return res.redirect("/login?error=user_fetch");
      }

      googleUser = (await userResponse.json()) as GoogleUserInfo;
    }

    if (!googleUser || !googleUser.email) {
      console.error("[Google OAuth] No email in user info");
      return res.redirect(
        "/login?error=no_email&message=Please+enable+email+on+your+Google+account",
      );
    }

    const supabase = getAdminClient();

    // LINKING FLOW: Link Google to authenticated user's Foundation Passport
    if (isLinkingFlow && authenticatedUserId) {
      console.log(
        "[Google OAuth] Linking Google to user:",
        authenticatedUserId,
      );

      try {
        await linkProviderToPassport(authenticatedUserId, "google", {
          id: googleUser.sub,
          email: googleUser.email,
          name: googleUser.name || undefined,
          avatar: googleUser.picture || undefined,
        });

        console.log(
          "[Google OAuth] Successfully linked Google to user:",
          authenticatedUserId,
        );

        await notifyAccountLinked(authenticatedUserId, "Google");
        return res.redirect(redirectTo);
      } catch (linkError: any) {
        console.error("[Google OAuth] Linking failed:", linkError);
        return res.redirect(
          `/dashboard?error=link_failed&message=${encodeURIComponent(linkError?.message || "Failed to link Google account")}`,
        );
      }
    }

    // LOGIN FLOW: OAuth Federation
    // Federate Google OAuth to Foundation Passport
    try {
      const federationResult = await federateOAuthUser("google", {
        id: googleUser.sub,
        email: googleUser.email,
        name: googleUser.name || undefined,
        avatar: googleUser.picture || undefined,
      });

      console.log("[Google OAuth] Federation result:", {
        user_id: federationResult.user_id,
        is_new_user: federationResult.is_new_user,
        provider_linked: federationResult.provider_linked,
      });

      // Send notification if this is a new user
      if (federationResult.is_new_user) {
        await notifyAccountLinked(federationResult.user_id, "Google");
      }

      // Redirect to dashboard after successful federation
      return res.redirect("/dashboard");
    } catch (federationError) {
      console.error("[Google OAuth] Federation error:", federationError);
      return res.redirect(
        `/login?error=federation_failed&message=${encodeURIComponent("Failed to link Google account. Please try again.")}`,
      );
    }
  } catch (error) {
    console.error("[Google OAuth] Callback error:", error);
    res.redirect("/login?error=unknown");
  }
}
