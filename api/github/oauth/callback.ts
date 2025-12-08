import { createClient } from "@supabase/supabase-js";
import { notifyAccountLinked } from "../../_notifications.js";
import { getAdminClient } from "../../_supabase.js";
import {
  federateOAuthUser,
  linkProviderToPassport,
} from "../../_oauth-federation.js";

export const config = {
  runtime: "nodejs",
};

interface GitHubUser {
  id: number;
  login: string;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
}

interface GitHubTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code, state, error } = req.query;

  // Handle GitHub error
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
      const stateData = JSON.parse(decodeURIComponent(state as string));
      isLinkingFlow = stateData.action === "link";
      redirectTo = stateData.redirectTo || redirectTo;
    } catch (e) {
      console.log("[GitHub OAuth] Could not parse state:", e);
    }
  }

  // For linking flow, extract user ID from temporary session stored in database
  let authenticatedUserId: string | null = null;
  if (isLinkingFlow) {
    try {
      const stateData = JSON.parse(decodeURIComponent(state));
      const sessionToken = stateData.sessionToken;

      if (!sessionToken) {
        console.error(
          "[GitHub OAuth] No session token found in linking flow state",
        );
        return res.redirect(
          "/login?error=session_lost&message=Session%20expired.%20Please%20try%20linking%20GitHub%20again.",
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
          "[GitHub OAuth] Linking session not found or expired",
          sessionError,
        );
        return res.redirect(
          "/login?error=session_lost&message=Session%20expired.%20Please%20try%20linking%20GitHub%20again.",
        );
      }

      authenticatedUserId = session.user_id;
      console.log(
        "[GitHub OAuth] Linking session found, user_id:",
        authenticatedUserId,
      );

      // Clean up: delete the temporary session
      await tempAdminClient
        .from("discord_linking_sessions")
        .delete()
        .eq("session_token", sessionToken);
    } catch (e) {
      console.error("[GitHub OAuth] Error parsing/using session token:", e);
      return res.redirect(
        "/login?error=session_lost&message=Session%20error.%20Please%20try%20again.",
      );
    }
  }

  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE;

  if (!clientId || !clientSecret || !supabaseUrl || !supabaseServiceRole) {
    console.error("[GitHub OAuth] Missing environment variables");
    return res.redirect("/login?error=config");
  }

  try {
    const apiBase = process.env.VITE_API_BASE || "https://aethex.dev";
    const redirectUri = `${apiBase}/api/github/oauth/callback`;

    // Exchange code for access token
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          redirect_uri: redirectUri,
        }),
      },
    );

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("[GitHub OAuth] Token exchange failed:", errorData);
      return res.redirect("/login?error=token_exchange");
    }

    const tokenData = (await tokenResponse.json()) as GitHubTokenResponse;

    if (!tokenData.access_token) {
      console.error("[GitHub OAuth] No access token in response");
      return res.redirect("/login?error=no_token");
    }

    // Fetch GitHub user profile
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!userResponse.ok) {
      console.error("[GitHub OAuth] User fetch failed:", userResponse.status);
      return res.redirect("/login?error=user_fetch");
    }

    const githubUser = (await userResponse.json()) as GitHubUser;

    // If user doesn't have public email, fetch from emails endpoint
    let email = githubUser.email;
    if (!email) {
      const emailResponse = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (emailResponse.ok) {
        const emails = (await emailResponse.json()) as Array<{ email: string; primary: boolean }>;
        const primaryEmail = emails.find((e) => e.primary);
        email = primaryEmail?.email || emails[0]?.email;
      }
    }

    // Use a generated email if no email from GitHub
    if (!email) {
      email = `${githubUser.login}@github.local`;
    }

    const supabase = getAdminClient();

    // LINKING FLOW: Link GitHub to authenticated user's Foundation Passport
    if (isLinkingFlow && authenticatedUserId) {
      console.log(
        "[GitHub OAuth] Linking GitHub to user:",
        authenticatedUserId,
      );

      try {
        await linkProviderToPassport(authenticatedUserId, "github", {
          id: githubUser.id.toString(),
          email,
          username: githubUser.login,
          name: githubUser.name || undefined,
          avatar: githubUser.avatar_url || undefined,
        });

        console.log(
          "[GitHub OAuth] Successfully linked GitHub to user:",
          authenticatedUserId,
        );

        await notifyAccountLinked(authenticatedUserId, "GitHub");
        return res.redirect(redirectTo);
      } catch (linkError: any) {
        console.error("[GitHub OAuth] Linking failed:", linkError);
        return res.redirect(
          `/dashboard?error=link_failed&message=${encodeURIComponent(linkError?.message || "Failed to link GitHub account")}`,
        );
      }
    }

    // LOGIN FLOW: OAuth Federation
    // Federate GitHub OAuth to Foundation Passport
    try {
      const federationResult = await federateOAuthUser("github", {
        id: githubUser.id.toString(),
        email,
        username: githubUser.login,
        name: githubUser.name || undefined,
        avatar: githubUser.avatar_url || undefined,
      });

      console.log("[GitHub OAuth] Federation result:", {
        user_id: federationResult.user_id,
        is_new_user: federationResult.is_new_user,
        provider_linked: federationResult.provider_linked,
      });

      // Send notification if this is a new user
      if (federationResult.is_new_user) {
        await notifyAccountLinked(federationResult.user_id, "GitHub");
      }

      // Redirect to dashboard after successful federation
      return res.redirect("/dashboard");
    } catch (federationError) {
      console.error("[GitHub OAuth] Federation error:", federationError);
      return res.redirect(
        `/login?error=federation_failed&message=${encodeURIComponent("Failed to link GitHub account. Please try again.")}`,
      );
    }
  } catch (error) {
    console.error("[GitHub OAuth] Callback error:", error);
    res.redirect("/login?error=unknown");
  }
}
