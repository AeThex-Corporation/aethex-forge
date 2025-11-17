/**
 * Foundation OAuth Client with PKCE
 *
 * Implements OAuth 2.0 with PKCE (Proof Key for Code Exchange) for secure
 * authentication with aethex.foundation as the identity provider.
 *
 * Foundation Endpoints:
 * - GET /api/oauth/authorize - Authorization endpoint
 * - POST /api/oauth/token - Token endpoint
 * - GET /api/oauth/userinfo - User info endpoint
 */

const FOUNDATION_URL =
  import.meta.env.VITE_FOUNDATION_URL || "https://aethex.foundation";
const CLIENT_ID =
  import.meta.env.VITE_FOUNDATION_OAUTH_CLIENT_ID || "aethex_corp";
const API_BASE = import.meta.env.VITE_API_BASE || "https://aethex.dev";

/**
 * Generate a random string for PKCE code verifier
 * Must be 43-128 characters, URL-safe (A-Z, a-z, 0-9, -, ., _, ~)
 */
function generateCodeVerifier(): string {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  const length = 64;
  let verifier = "";
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    verifier += charset[randomValues[i] % charset.length];
  }

  return verifier;
}

/**
 * Create PKCE code challenge from code verifier
 * Uses SHA256 hash with base64url encoding
 */
async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);

  // Convert ArrayBuffer to base64url string
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

/**
 * Generate PKCE parameters
 */
async function generatePKCEParams(): Promise<{
  verifier: string;
  challenge: string;
}> {
  const verifier = generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);
  return { verifier, challenge };
}

/**
 * Generate a CSRF token (state parameter)
 */
function generateStateToken(): string {
  const randomValues = new Uint8Array(32);
  crypto.getRandomValues(randomValues);
  return Array.from(randomValues)
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Build Foundation authorization URL
 */
export async function getFoundationAuthorizationUrl(options?: {
  redirectTo?: string;
}): Promise<string> {
  // Generate PKCE parameters
  const pkce = await generatePKCEParams();
  const state = generateStateToken();

  // Store PKCE verifier and state in sessionStorage for callback
  sessionStorage.setItem("oauth_code_verifier", pkce.verifier);
  sessionStorage.setItem("oauth_state", state);
  if (options?.redirectTo) {
    sessionStorage.setItem("oauth_redirect_to", options.redirectTo);
  }

  // Build authorization URL
  const params = new URLSearchParams();
  params.set("client_id", CLIENT_ID);
  params.set("redirect_uri", `${API_BASE}/auth/callback`);
  params.set("response_type", "code");
  params.set("scope", "openid profile email achievements projects");
  params.set("state", state);
  params.set("code_challenge", pkce.challenge);
  params.set("code_challenge_method", "S256");

  return `${FOUNDATION_URL}/api/oauth/authorize?${params.toString()}`;
}

/**
 * Initiate the Foundation OAuth login flow
 */
export async function initiateFoundationLogin(
  redirectTo?: string,
): Promise<void> {
  try {
    const authUrl = await getFoundationAuthorizationUrl({ redirectTo });
    window.location.href = authUrl;
  } catch (error) {
    console.error("[Foundation OAuth] Failed to generate auth URL:", error);
    throw new Error("Failed to initiate Foundation login");
  }
}

/**
 * Exchange authorization code for access token using PKCE
 * Should be called from backend to keep client_secret secure
 */
export async function exchangeCodeForToken(code: string): Promise<{
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: any;
}> {
  const API_BASE = import.meta.env.VITE_API_BASE || "https://aethex.dev";

  const response = await fetch(`${API_BASE}/auth/callback/exchange`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to exchange code for token");
  }

  return response.json();
}

/**
 * Get stored PKCE verifier from session
 */
export function getStoredCodeVerifier(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("oauth_code_verifier");
}

/**
 * Get stored state token from session
 */
export function getStoredState(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("oauth_state");
}

/**
 * Get stored redirect destination
 */
export function getStoredRedirectTo(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("oauth_redirect_to");
}

/**
 * Clear stored OAuth parameters
 */
export function clearOAuthStorage(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem("oauth_code_verifier");
  sessionStorage.removeItem("oauth_state");
  sessionStorage.removeItem("oauth_redirect_to");
}

/**
 * Get authorization code from URL
 */
export function getAuthorizationCode(): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return params.get("code");
}

/**
 * Get state from URL (for CSRF validation)
 */
export function getStateFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return params.get("state");
}

/**
 * Check if we have an authorization code in the URL
 */
export function hasAuthorizationCode(): boolean {
  return !!getAuthorizationCode();
}

/**
 * Validate state token (CSRF protection)
 */
export function validateState(urlState: string | null): boolean {
  if (!urlState) return false;
  const storedState = getStoredState();
  return urlState === storedState;
}
