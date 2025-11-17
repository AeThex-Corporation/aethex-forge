/**
 * useFoundationAuth Hook
 *
 * Handles Foundation OAuth callback:
 * - Detects authorization code in URL
 * - Validates state token (CSRF protection)
 * - Exchanges code for access token
 * - Syncs user profile from Foundation
 * - Establishes session
 */

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getAuthorizationCode,
  getStateFromUrl,
  hasAuthorizationCode,
  validateState,
  exchangeCodeForToken,
  clearOAuthStorage,
  getStoredRedirectTo,
} from "@/lib/foundation-oauth";
import { aethexToast } from "@/lib/aethex-toast";

interface UseFoundationAuthReturn {
  isProcessing: boolean;
  error: string | null;
}

/**
 * Hook that processes Foundation OAuth callback
 * Should be called in your main App component to catch oauth redirects
 */
export function useFoundationAuth(): UseFoundationAuthReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if we have an authorization code in the URL
    if (!hasAuthorizationCode()) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    const processFoundationCallback = async () => {
      try {
        // Get authorization code and state from URL
        const code = getAuthorizationCode();
        const urlState = getStateFromUrl();

        if (!code) {
          throw new Error("No authorization code found in URL");
        }

        // Validate state token (CSRF protection)
        if (!validateState(urlState)) {
          console.warn("[Foundation Auth] State validation failed");
          throw new Error("Invalid state token - possible CSRF attack");
        }

        console.log("[Foundation Auth] Processing OAuth callback with code");

        // Exchange authorization code for access token
        try {
          const tokenData = await exchangeCodeForToken(code);

          if (!tokenData.accessToken || !tokenData.user) {
            throw new Error("Invalid response from token exchange");
          }

          console.log(
            "[Foundation Auth] Token exchange successful for user:",
            tokenData.user.id,
          );

          // Clear auth parameters from URL and storage
          const url = new URL(window.location.href);
          url.searchParams.delete("code");
          url.searchParams.delete("state");
          window.history.replaceState({}, "", url.toString());

          clearOAuthStorage();

          // Show success message
          aethexToast.success({
            title: "Authenticated",
            description: `Welcome back, ${tokenData.user.username || tokenData.user.email}!`,
          });

          // Determine redirect destination
          const storedRedirect = getStoredRedirectTo();
          const redirectTo = storedRedirect || "/dashboard";

          // Redirect to dashboard or stored destination
          navigate(redirectTo, { replace: true });
        } catch (exchangeError) {
          const message =
            exchangeError instanceof Error
              ? exchangeError.message
              : "Failed to exchange authorization code";

          console.error(
            "[Foundation Auth] Token exchange failed:",
            exchangeError,
          );

          throw new Error(message);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Authentication failed";
        setError(message);

        console.error("[Foundation Auth] Callback processing error:", err);

        aethexToast.error({
          title: "Authentication failed",
          description: message,
        });

        // Clear OAuth storage on error
        clearOAuthStorage();

        // Redirect back to login after a delay
        setTimeout(() => {
          navigate("/login?error=auth_failed", { replace: true });
        }, 2000);
      } finally {
        setIsProcessing(false);
      }
    };

    processFoundationCallback();
  }, [location.search, navigate]);

  return {
    isProcessing,
    error,
  };
}

/**
 * Hook to check current Foundation authentication status
 */
export function useFoundationAuthStatus(): {
  isAuthenticated: boolean;
  userId: string | null;
} {
  const [status, setStatus] = useState({
    isAuthenticated: false,
    userId: null as string | null,
  });

  useEffect(() => {
    // Check for foundation_access_token cookie
    const cookies = document.cookie.split(";").map((c) => c.trim());
    const tokenCookie = cookies.find((c) =>
      c.startsWith("foundation_access_token="),
    );
    const userCookie = cookies.find((c) => c.startsWith("auth_user_id="));

    if (tokenCookie && userCookie) {
      const userId = userCookie.split("=")[1];
      setStatus({
        isAuthenticated: true,
        userId,
      });
    } else {
      setStatus({
        isAuthenticated: false,
        userId: null,
      });
    }
  }, []);

  return status;
}
