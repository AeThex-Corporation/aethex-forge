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
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code, state } = req.body;

  if (!code) {
    return res.status(400).json({ message: "No authorization code provided" });
  }

  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE;

  if (!clientId || !clientSecret || !supabaseUrl || !supabaseServiceRole) {
    console.error("[Discord OAuth] Missing environment variables");
    return res.status(500).json({ message: "Server configuration error" });
  }

  try {
    const redirectUri = `${process.env.VITE_API_BASE || "https://aethex.dev"}/discord`;

    // Exchange code for access token
    const tokenResponse = await fetch("https://discord.com/api/v10/oauth2/token", {
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
      console.error("[Discord OAuth] Token exchange failed:", errorData);
      return res.status(400).json({
        message: "Failed to authenticate with Discord. Please try again.",
      });
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
      return res.status(400).json({
        message: "Failed to fetch Discord profile. Please try again.",
      });
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
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
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
          console.error("[Discord OAuth] Auth user creation failed:", authError);
          return res.status(500).json({ message: "Failed to create account" });
        }

        userId = authData.user.id;
        isNewUser = true;

        // Create user profile
        const { error: profileError } = await supabase.from("user_profiles").insert({
          id: userId,
          email: discordUser.email,
          full_name: discordUser.username,
          avatar_url: discordUser.avatar
            ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
            : null,
        });

        if (profileError) {
          console.error("[Discord OAuth] Profile creation failed:", profileError);
          return res.status(500).json({ message: "Failed to create user profile" });
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
      return res.status(500).json({ message: "Failed to link Discord account" });
    }

    // Generate session token
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.createSession({
      user_id: userId,
    });

    if (sessionError || !sessionData.session) {
      console.error("[Discord OAuth] Session creation failed:", sessionError);
      return res.status(500).json({ message: "Failed to create session" });
    }

    // Set session cookies
    const accessTokenCookie = `sb-access-token=${sessionData.session.access_token}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=3600`;
    const refreshTokenCookie = `sb-refresh-token=${sessionData.session.refresh_token}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=604800`;

    res.setHeader("Set-Cookie", [accessTokenCookie, refreshTokenCookie]);
    res.setHeader("Content-Type", "application/json");

    return res.status(200).json({
      success: true,
      message: isNewUser ? "Account created successfully" : "Linked successfully",
      session: {
        access_token: sessionData.session.access_token,
        refresh_token: sessionData.session.refresh_token,
      },
      user: {
        id: userId,
        email: discordUser.email,
        full_name: discordUser.username,
        discord_id: discordUser.id,
      },
      isNewUser,
    });
  } catch (error) {
    console.error("[Discord OAuth] Callback error:", error);
    res.status(500).json({
      message: "An unexpected error occurred. Please try again.",
    });
  }
}
