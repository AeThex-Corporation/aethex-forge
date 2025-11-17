/**
 * Foundation Authentication Integration
 * 
 * Helper functions for integrating with Foundation's identity system
 */

import { getAdminClient } from "@supabase/supabase-js";
import { supabase } from "./supabase";

/**
 * Get Foundation access token from cookies
 */
export function getFoundationAccessToken(): string | null {
  if (typeof window === "undefined") return null;

  const cookies = document.cookie.split(";").map((c) => c.trim());
  const tokenCookie = cookies.find((c) => c.startsWith("foundation_access_token="));

  if (!tokenCookie) return null;
  return tokenCookie.split("=")[1];
}

/**
 * Get authenticated user ID from cookies
 */
export function getAuthUserId(): string | null {
  if (typeof window === "undefined") return null;

  const cookies = document.cookie.split(";").map((c) => c.trim());
  const userCookie = cookies.find((c) => c.startsWith("auth_user_id="));

  if (!userCookie) return null;
  return userCookie.split("=")[1];
}

/**
 * Check if user is authenticated with Foundation
 */
export function isFoundationAuthenticated(): boolean {
  return !!getFoundationAccessToken() && !!getAuthUserId();
}

/**
 * Fetch user profile from Foundation using access token
 */
export async function fetchUserProfileFromFoundation(
  accessToken: string,
): Promise<any> {
  const FOUNDATION_URL = import.meta.env.VITE_FOUNDATION_URL || "https://aethex.foundation";

  const response = await fetch(`${FOUNDATION_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user profile from Foundation");
  }

  return response.json();
}

/**
 * Sync Foundation user profile to aethex.dev local database
 */
export async function syncFoundationProfileToLocal(
  foundationUser: any,
): Promise<any> {
  const { data, error } = await supabase
    .from("user_profiles")
    .upsert({
      id: foundationUser.id,
      email: foundationUser.email,
      username: foundationUser.username || null,
      full_name: foundationUser.full_name || null,
      avatar_url: foundationUser.avatar_url || null,
      profile_completed: foundationUser.profile_complete || false,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("[Foundation Sync] Failed to sync profile:", error);
    throw error;
  }

  return data;
}

/**
 * Clear Foundation authentication
 */
export function clearFoundationAuth(): void {
  if (typeof window === "undefined") return;

  // Clear cookies
  document.cookie = "foundation_access_token=; Path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  document.cookie = "auth_user_id=; Path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

  // Clear session storage
  sessionStorage.removeItem("auth_redirect_to");
}

/**
 * Redirect to Foundation logout and clear local auth
 */
export async function logoutWithFoundation(): Promise<void> {
  const FOUNDATION_URL = import.meta.env.VITE_FOUNDATION_URL || "https://aethex.foundation";
  const accessToken = getFoundationAccessToken();

  try {
    // Notify Foundation of logout
    if (accessToken) {
      await fetch(`${FOUNDATION_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).catch(() => {
        // Ignore errors
      });
    }
  } finally {
    // Always clear local auth
    clearFoundationAuth();
  }
}

/**
 * Check if code is in URL (after Foundation redirect)
 */
export function hasFoundationAuthCode(): boolean {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return !!params.get("code");
}

/**
 * Get authorization code from URL
 */
export function getFoundationAuthCode(): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return params.get("code");
}
