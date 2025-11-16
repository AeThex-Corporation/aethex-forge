import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE || "",
);

interface ActivityAuthRequest {
  access_token: string;
}

interface UserData {
  id: string;
  discord_id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  user_type: string | null;
  primary_arm: string | null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { access_token } = req.body as ActivityAuthRequest;

    if (!access_token) {
      return res.status(400).json({ error: "access_token is required" });
    }

    // Verify the access token with Discord API
    const discordResponse = await fetch(
      "https://discord.com/api/v10/users/@me",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    if (!discordResponse.ok) {
      if (discordResponse.status === 401) {
        return res
          .status(401)
          .json({ error: "Invalid or expired access token" });
      }
      throw new Error(`Discord API error: ${discordResponse.statusText}`);
    }

    const discordUser = (await discordResponse.json()) as {
      id: string;
      username: string;
      global_name?: string;
      avatar?: string;
    };
    const discord_id = discordUser.id;
    const discord_username = discordUser.username;

    // Find or create user in Supabase
    const { data: existingUser, error: fetchError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("discord_id", discord_id)
      .maybeSingle();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Supabase error:", fetchError);
      return res.status(500).json({ error: "Database error" });
    }

    if (existingUser) {
      // User already exists, return their data
      return res.status(200).json({
        success: true,
        user: {
          id: existingUser.id,
          discord_id: existingUser.discord_id,
          full_name: existingUser.full_name,
          username: existingUser.username,
          avatar_url: existingUser.avatar_url,
          bio: existingUser.bio,
          user_type: existingUser.user_type,
          primary_arm: existingUser.primary_arm,
        } as UserData,
      });
    }

    // Create new user if they don't exist
    const { data: newUser, error: createError } = await supabase
      .from("user_profiles")
      .insert({
        discord_id,
        username: discord_username,
        full_name: discordUser.global_name || discord_username,
        avatar_url: discordUser.avatar
          ? `https://cdn.discordapp.com/avatars/${discord_id}/${discordUser.avatar}.png`
          : null,
        user_type: "community_member",
        primary_arm: "labs",
      })
      .select()
      .single();

    if (createError) {
      console.error("Error creating user:", createError);
      return res.status(500).json({ error: "Failed to create user" });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: newUser.id,
        discord_id: newUser.discord_id,
        full_name: newUser.full_name,
        username: newUser.username,
        avatar_url: newUser.avatar_url,
        bio: newUser.bio,
        user_type: newUser.user_type,
        primary_arm: newUser.primary_arm,
      } as UserData,
    });
  } catch (error: any) {
    console.error("Activity auth error:", error);
    return res.status(500).json({
      error: error?.message || "Failed to authenticate activity",
    });
  }
}
