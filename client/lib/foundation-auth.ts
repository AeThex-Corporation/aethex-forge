/**
 * Foundation Authentication Helpers
 *
 * Simple utilities for managing Foundation OAuth session cookies and tokens.
 */

/**
 * Get Foundation access token from cookies
 */
export function getFoundationAccessToken(): string | null {
  if (typeof window === "undefined") return null;

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const trimmed = cookie.trim();
    if (trimmed.startsWith("foundation_access_token=")) {
      return trimmed.substring("foundation_access_token=".length);
    }
  }
  return null;
}

/**
 * Get authenticated user ID from cookies
 */
export function getAuthUserId(): string | null {
  if (typeof window === "undefined") return null;

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const trimmed = cookie.trim();
    if (trimmed.startsWith("auth_user_id=")) {
      return trimmed.substring("auth_user_id=".length);
    }
  }
  return null;
}

/**
 * Check if user has active Foundation authentication
 */
export function isFoundationAuthenticated(): boolean {
  return !!getFoundationAccessToken() && !!getAuthUserId();
}

/**
 * Clear Foundation authentication (on logout)
 */
export function clearFoundationAuth(): void {
  if (typeof window === "undefined") return;

  // Clear cookies by setting expiration to past
  document.cookie = "foundation_access_token=; Path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  document.cookie = "auth_user_id=; Path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

  // Clear session storage
  sessionStorage.removeItem("oauth_code_verifier");
  sessionStorage.removeItem("oauth_state");
  sessionStorage.removeItem("oauth_redirect_to");
}

/**
 * Make authenticated API request with Foundation token
 */
export async function makeAuthenticatedRequest(
  url: string,
  options?: RequestInit,
): Promise<Response> {
  const token = getFoundationAccessToken();

  if (!token) {
    throw new Error("No Foundation access token available");
  }

  const headers = {
    ...options?.headers,
    Authorization: `Bearer ${token}`,
  };

  return fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });
}

/**
 * Logout from Foundation
 * Clears local auth state and optionally notifies Foundation
 */
export async function logoutFromFoundation(): Promise<void> {
  const FOUNDATION_URL = import.meta.env.VITE_FOUNDATION_URL || "https://aethex.foundation";
  const token = getFoundationAccessToken();

  // Clear local auth
  clearFoundationAuth();

  // Optionally notify Foundation of logout
  if (token) {
    try {
      await fetch(`${FOUNDATION_URL}/api/oauth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).catch(() => {
        // Ignore errors - local logout already happened
      });
    } catch {
      // Ignore errors
    }
  }
}
