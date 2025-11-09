import { createClient } from "@supabase/supabase-js";

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

  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE;

  if (!clientId || !clientSecret || !supabaseUrl || !supabaseServiceRole) {
    console.error("[Discord OAuth] Missing environment variables");
    return res.redirect("/login?error=config");
  }

  try {
    const redirectUri = "https://aethex.dev/api/discord/oauth/callback";

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

    const tokenData: DiscordTokenResponse = await tokenResponse.json();

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

    const discordUser: DiscordUser = await userResponse.json();

    // Initialize Supabase client with service role
    const supabase = createClient(supabaseUrl, supabaseServiceRole);

    // Check if Discord user already exists
    const { data: existingLink } = await supabase
      .from("discord_links")
      .select("user_id")
      .eq("discord_id", discordUser.id)
      .single();

    let userId: string;
    let isNewUser = false;

    if (existingLink) {
      // User already linked - use existing user
      userId = existingLink.user_id;
    } else {
      // Check if email exists in user_profiles
      const { data: existingUser } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("email", discordUser.email)
        .single();

      if (existingUser) {
        // Link Discord to existing email
        userId = existingUser.id;
      } else {
        // Create new user
        // First create auth user
        const { data: authData, error: authError } =
          await supabase.auth.admin.createUser({
            email: discordUser.email,
            email_confirm: true,
            user_metadata: {
              full_name: discordUser.username,
              avatar_url: discordUser.avatar
                ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
                : null,
            },
          });

        if (authError || !authData.user) {
          console.error(
            "[Discord OAuth] Auth user creation failed:",
            authError,
          );
          return res.redirect("/login?error=auth_create");
        }

        userId = authData.user.id;
        isNewUser = true;

        // Create user profile
        const { error: profileError } = await supabase
          .from("user_profiles")
          .insert({
            id: userId,
            email: discordUser.email,
            full_name: discordUser.username,
            avatar_url: discordUser.avatar
              ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
              : null,
          });

        if (profileError) {
          console.error(
            "[Discord OAuth] Profile creation failed:",
            profileError,
          );
          return res.redirect("/login?error=profile_create");
        }
      }
    }

    // Create Discord link
    const { error: linkError } = await supabase.from("discord_links").upsert({
      discord_id: discordUser.id,
      user_id: userId,
      linked_at: new Date().toISOString(),
    });

    if (linkError) {
      console.error("[Discord OAuth] Link creation failed:", linkError);
      return res.redirect("/login?error=link_create");
    }

    // Generate session token
    const { data: sessionData, error: sessionError } =
      await supabase.auth.admin.createSession({
        user_id: userId,
      });

    if (sessionError || !sessionData.session) {
      console.error("[Discord OAuth] Session creation failed:", sessionError);
      return res.redirect("/login?error=session_create");
    }

    // Set session cookies
    const accessTokenCookie = `sb-access-token=${sessionData.session.access_token}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=3600`;
    const refreshTokenCookie = `sb-refresh-token=${sessionData.session.refresh_token}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=604800`;

    res.setHeader("Set-Cookie", [accessTokenCookie, refreshTokenCookie]);

    // Redirect to next page
    const nextPath =
      state && typeof state === "string" && state.startsWith("/")
        ? state
        : isNewUser
          ? "/onboarding"
          : "/dashboard";

    const redirectUrl = new URL(
      nextPath,
      process.env.VITE_API_BASE || "https://aethex.dev",
    );
    res.redirect(redirectUrl.toString());
  } catch (error) {
    console.error("[Discord OAuth] Callback error:", error);
    res.redirect("/login?error=unknown");
  }
}
