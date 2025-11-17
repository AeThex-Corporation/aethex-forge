import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE || "",
);

export interface OAuthUser {
  id: string; // OAuth provider user ID
  email: string;
  name?: string;
  avatar?: string;
  username?: string;
}

export interface FederationResult {
  user_id: string; // Foundation Passport user ID
  email: string;
  is_new_user: boolean;
  provider_linked: boolean;
}

/**
 * OAuth Federation: Link external OAuth providers to Foundation Passports
 *
 * This function implements the federation model where:
 * 1. User logs in with GitHub/Discord/Google/etc
 * 2. We check if a provider_identity exists for this OAuth user
 * 3. If yes, return the linked Foundation Passport
 * 4. If no, create a new Foundation Passport and link the provider
 * 5. All future logins with this provider link to the same Passport
 *
 * @param provider - OAuth provider name (github, discord, google, roblox, ethereum)
 * @param oauthUser - OAuth user data from the provider
 * @returns FederationResult with Foundation Passport user_id and linking status
 */
export async function federateOAuthUser(
  provider: string,
  oauthUser: OAuthUser,
): Promise<FederationResult> {
  try {
    // Step 1: Check if this OAuth identity already exists
    const { data: existingIdentity, error: lookupError } = await supabase
      .from("provider_identities")
      .select("user_id")
      .eq("provider", provider)
      .eq("provider_user_id", oauthUser.id)
      .single();

    if (lookupError && lookupError.code !== "PGRST116") {
      // PGRST116 = "no rows returned" (expected for new users)
      console.error("[OAuth Federation] Lookup error:", lookupError);
      throw lookupError;
    }

    // Step 2a: Existing provider identity - return the linked user
    if (existingIdentity) {
      return {
        user_id: existingIdentity.user_id,
        email: oauthUser.email,
        is_new_user: false,
        provider_linked: true,
      };
    }

    // Step 2b: New provider identity - create Foundation Passport
    // Create a new user profile (Foundation Passport)
    const { data: newProfile, error: profileError } = await supabase
      .from("user_profiles")
      .insert({
        email: oauthUser.email,
        full_name: oauthUser.name || oauthUser.username || "User",
        avatar_url: oauthUser.avatar || null,
        username: await generateUniqueUsername(oauthUser.username),
        created_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (profileError || !newProfile) {
      console.error("[OAuth Federation] Profile creation error:", profileError);
      throw profileError || new Error("Failed to create user profile");
    }

    // Step 3: Link the OAuth provider to the new Foundation Passport
    const { error: linkError } = await supabase
      .from("provider_identities")
      .insert({
        user_id: newProfile.id,
        provider,
        provider_user_id: oauthUser.id,
        provider_email: oauthUser.email,
        provider_data: {
          username: oauthUser.username,
          avatar: oauthUser.avatar,
          name: oauthUser.name,
        },
      });

    if (linkError) {
      console.error("[OAuth Federation] Linking error:", linkError);
      // Clean up the profile if linking fails
      await supabase.from("user_profiles").delete().eq("id", newProfile.id);
      throw linkError;
    }

    // Step 4: Return the new user with linking success
    return {
      user_id: newProfile.id,
      email: oauthUser.email,
      is_new_user: true,
      provider_linked: true,
    };
  } catch (error) {
    console.error("[OAuth Federation] Error:", error);
    throw error;
  }
}

/**
 * Check if a provider identity exists and return the linked Foundation Passport
 * Used for quick lookups during OAuth callbacks
 */
export async function getLinkedPassport(
  provider: string,
  provider_user_id: string,
): Promise<string | null> {
  const { data, error } = await supabase
    .from("provider_identities")
    .select("user_id")
    .eq("provider", provider)
    .eq("provider_user_id", provider_user_id)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("[OAuth Federation] Lookup error:", error);
  }

  return data?.user_id || null;
}

/**
 * Link an additional OAuth provider to an existing Foundation Passport
 * Used when a user wants to add GitHub/Discord to their existing account
 */
export async function linkProviderToPassport(
  user_id: string,
  provider: string,
  oauthUser: OAuthUser,
): Promise<void> {
  // Check if this provider is already linked to a different user
  const { data: existingLink } = await supabase
    .from("provider_identities")
    .select("user_id")
    .eq("provider", provider)
    .eq("provider_user_id", oauthUser.id)
    .single();

  if (existingLink && existingLink.user_id !== user_id) {
    throw new Error(
      `This ${provider} account is already linked to another AeThex account`,
    );
  }

  // Insert the new provider link
  const { error } = await supabase.from("provider_identities").insert({
    user_id,
    provider,
    provider_user_id: oauthUser.id,
    provider_email: oauthUser.email,
    provider_data: {
      username: oauthUser.username,
      avatar: oauthUser.avatar,
      name: oauthUser.name,
    },
  });

  if (error) {
    console.error("[OAuth Federation] Linking error:", error);
    throw error;
  }
}

/**
 * Generate a unique username from OAuth data
 * Fallback: use provider_username + random suffix
 */
async function generateUniqueUsername(
  preferredUsername?: string,
): Promise<string> {
  let username =
    preferredUsername?.toLowerCase().replace(/[^a-z0-9_-]/g, "") || "user";

  // Ensure minimum length
  if (username.length < 3) {
    username = "user" + Math.random().toString(36).substring(7);
  }

  // Check if username is already taken
  let attempts = 0;
  let finalUsername = username;

  while (attempts < 10) {
    const { data: existing } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("username", finalUsername)
      .single();

    if (!existing) {
      return finalUsername;
    }

    // Add a random suffix and try again
    finalUsername = `${username}${Math.random().toString(36).substring(7)}`;
    attempts++;
  }

  // Fallback to UUID-based username
  return `user_${Math.random().toString(36).substring(7)}`;
}

/**
 * Unlink a provider from a Foundation Passport
 * Ensures users can't unlink their last authentication method
 */
export async function unlinkProvider(
  user_id: string,
  provider: string,
): Promise<void> {
  // Check how many providers this user has
  const { data: providers, error: listError } = await supabase
    .from("provider_identities")
    .select("provider")
    .eq("user_id", user_id);

  if (listError) {
    throw listError;
  }

  // Don't allow unlinking the last provider
  if (providers && providers.length <= 1) {
    throw new Error(
      "You must keep at least one login method. Add another provider before unlinking this one.",
    );
  }

  // Unlink the provider
  const { error: deleteError } = await supabase
    .from("provider_identities")
    .delete()
    .eq("user_id", user_id)
    .eq("provider", provider);

  if (deleteError) {
    throw deleteError;
  }
}
