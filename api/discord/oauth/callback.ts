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

interface DiscordUser {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
}

interface DiscordTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code, state, error } = req.query;

  // Handle Discord error
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
      console.log("[Discord OAuth] Could not parse state:", e);
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
          "[Discord OAuth] No session token found in linking flow state",
        );
        return res.redirect(
          "/login?error=session_lost&message=Session%20expired.%20Please%20try%20linking%20Discord%20again.",
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
          "[Discord OAuth] Linking session not found or expired",
          sessionError,
        );
        return res.redirect(
          "/login?error=session_lost&message=Session%20expired.%20Please%20try%20linking%20Discord%20again.",
        );
      }

      authenticatedUserId = session.user_id;
      console.log(
        "[Discord OAuth] Linking session found, user_id:",
        authenticatedUserId,
      );

      // Clean up: delete the temporary session
      await tempAdminClient
        .from("discord_linking_sessions")
        .delete()
        .eq("session_token", sessionToken);
    } catch (e) {
      console.error("[Discord OAuth] Error parsing/using session token:", e);
      return res.redirect(
        "/login?error=session_lost&message=Session%20error.%20Please%20try%20again.",
      );
    }
  }

  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE;

  if (!clientId || !clientSecret || !supabaseUrl || !supabaseServiceRole) {
    console.error("[Discord OAuth] Missing environment variables");
    return res.redirect("/login?error=config");
  }

  try {
    // Use the main API base domain to ensure the redirect_uri matches the registered one
    // This is critical because Discord OAuth requires exact match of redirect_uri
    const apiBase = process.env.VITE_API_BASE || "https://aethex.dev";
    const redirectUri = `${apiBase}/api/discord/oauth/callback`;

    // Exchange code for access token
    const tokenResponse = await fetch(
      "https://discord.com/api/v10/oauth2/token",
      {
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
      },
    );

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("[Discord OAuth] Token exchange failed:", errorData);
      return res.redirect("/login?error=token_exchange");
    }

    const tokenData = (await tokenResponse.json()) as DiscordTokenResponse;

    // Fetch Discord user profile
    const userResponse = await fetch("https://discord.com/api/v10/users/@me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      console.error("[Discord OAuth] User fetch failed:", userResponse.status);
      return res.redirect("/login?error=user_fetch");
    }

    const discordUser = (await userResponse.json()) as DiscordUser;

    // Validate Discord user has email
    if (!discordUser.email) {
      console.error("[Discord OAuth] Discord user has no email");
      return res.redirect(
        "/login?error=no_email&message=Please+enable+email+on+your+Discord+account",
      );
    }

    // Initialize Supabase client with service role
    const supabase = getAdminClient();

    // LINKING FLOW: Link Discord to authenticated user's Foundation Passport
    if (isLinkingFlow && authenticatedUserId) {
      console.log(
        "[Discord OAuth] Linking Discord to user:",
        authenticatedUserId,
      );

      try {
        await linkProviderToPassport(authenticatedUserId, "discord", {
          id: discordUser.id,
          email: discordUser.email,
          username: discordUser.username,
          avatar: discordUser.avatar
            ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.webp`
            : undefined,
        });

        console.log(
          "[Discord OAuth] Successfully linked Discord to user:",
          authenticatedUserId,
        );

        await notifyAccountLinked(authenticatedUserId, "Discord");
        return res.redirect(redirectTo);
      } catch (linkError: any) {
        console.error("[Discord OAuth] Linking failed:", linkError);
        return res.redirect(
          `/dashboard?error=link_failed&message=${encodeURIComponent(linkError?.message || "Failed to link Discord account")}`,
        );
      }
    }

    // LOGIN FLOW: OAuth Federation
    // Federate Discord OAuth to Foundation Passport
    // Users can login via Discord and it automatically links to their Foundation identity

    try {
      const federationResult = await federateOAuthUser("discord", {
        id: discordUser.id,
        email: discordUser.email,
        username: discordUser.username,
        avatar: discordUser.avatar
          ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.webp`
          : undefined,
      });

      console.log("[Discord OAuth] Federation result:", {
        user_id: federationResult.user_id,
        is_new_user: federationResult.is_new_user,
        provider_linked: federationResult.provider_linked,
      });

      // Send notification if this is a new user
      if (federationResult.is_new_user) {
        await notifyAccountLinked(federationResult.user_id, "Discord");
      }

      // Redirect to dashboard after successful federation
      return res.redirect("/dashboard");
    } catch (federationError) {
      console.error("[Discord OAuth] Federation error:", federationError);
      return res.redirect(
        `/login?error=federation_failed&message=${encodeURIComponent("Failed to link Discord account. Please try again.")}`,
      );
    }
  } catch (error) {
    console.error("[Discord OAuth] Callback error:", error);
    res.redirect("/login?error=unknown");
  }
}
