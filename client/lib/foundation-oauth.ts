/**
 * Foundation OAuth Client
 * 
 * This module handles the OAuth flow with aethex.foundation as the identity provider.
 * aethex.dev acts as an OAuth client, redirecting users to Foundation for authentication.
 */

const FOUNDATION_URL = import.meta.env.VITE_FOUNDATION_URL || "https://aethex.foundation";
const API_BASE = import.meta.env.VITE_API_BASE || "https://aethex.dev";

/**
 * Generate authorization URL for redirecting to Foundation login
 */
export function getFoundationAuthorizationUrl(options?: {
  redirectTo?: string;
  state?: string;
}): string {
  const params = new URLSearchParams();
  
  // client_id identifies aethex.dev as the client
  params.set("client_id", "aethex-corp");
  
  // Redirect back to aethex.dev after authentication
  params.set("redirect_uri", `${API_BASE}/api/auth/foundation-callback`);
  
  // OAuth standard - maintain context across redirect
  params.set("response_type", "code");
  params.set("scope", "openid profile email");
  
  // Custom state for additional context
  if (options?.state) {
    params.set("state", options.state);
  }
  
  return `${FOUNDATION_URL}/api/oauth/authorize?${params.toString()}`;
}

/**
 * Start the OAuth flow by redirecting to Foundation
 */
export function initiateFoundationLogin(redirectTo?: string): void {
  // Store intended destination for after auth
  if (redirectTo) {
    sessionStorage.setItem("auth_redirect_to", redirectTo);
  }
  
  const state = JSON.stringify({
    redirectTo: redirectTo || "/dashboard",
    timestamp: Date.now(),
  });
  
  const authUrl = getFoundationAuthorizationUrl({
    redirectTo,
    state: encodeURIComponent(state),
  });
  
  window.location.href = authUrl;
}

/**
 * Exchange authorization code for token
 * This is called from the Foundation callback endpoint on the backend
 */
export async function exchangeCodeForToken(code: string): Promise<{
  accessToken: string;
  user: any;
}> {
  const response = await fetch(`${API_BASE}/api/auth/exchange-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
    credentials: "include", // Include cookies for session
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to exchange code for token");
  }
  
  return response.json();
}

/**
 * Get the stored redirect destination after auth
 */
export function getStoredRedirectTo(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("auth_redirect_to");
}

/**
 * Clear the stored redirect destination
 */
export function clearStoredRedirectTo(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem("auth_redirect_to");
}
