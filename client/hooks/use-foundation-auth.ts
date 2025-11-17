/**
 * useFoundationAuth Hook
 * 
 * Manages Foundation OAuth flow including:
 * - Detecting authorization code in URL
 * - Exchanging code for token
 * - Syncing user profile from Foundation
 * - Handling session establishment
 */

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getFoundationAuthCode,
  hasFoundationAuthCode,
  getFoundationAccessToken,
  getAuthUserId,
  clearFoundationAuth,
  fetchUserProfileFromFoundation,
  syncFoundationProfileToLocal,
} from "@/lib/foundation-auth";
import { aethexToast } from "@/lib/aethex-toast";

interface UseFoundationAuthReturn {
  isProcessing: boolean;
  error: string | null;
}

export function useFoundationAuth(): UseFoundationAuthReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if we just received an auth code from Foundation
    if (!hasFoundationAuthCode()) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    const processFoundationAuth = async () => {
      try {
        const code = getFoundationAuthCode();
        if (!code) {
          throw new Error("No authorization code found");
        }

        // Exchange code for token with backend
        const API_BASE = import.meta.env.VITE_API_BASE || "";
        const response = await fetch(`${API_BASE}/api/auth/exchange-token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
          credentials: "include", // Include cookies
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || "Failed to exchange authorization code",
          );
        }

        const data = await response.json();

        if (!data.accessToken || !data.user) {
          throw new Error("Invalid response from token exchange");
        }

        // Sync Foundation user profile to local database
        await syncFoundationProfileToLocal(data.user);

        // Clear auth code from URL
        const url = new URL(window.location.href);
        url.searchParams.delete("code");
        url.searchParams.delete("state");
        window.history.replaceState({}, "", url.toString());

        aethexToast.success({
          title: "Authenticated",
          description: "Successfully authenticated with Foundation",
        });

        // Redirect to dashboard or stored redirect
        const redirectTo = sessionStorage.getItem("auth_redirect_to") || "/dashboard";
        sessionStorage.removeItem("auth_redirect_to");
        navigate(redirectTo, { replace: true });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Authentication failed";
        setError(message);

        aethexToast.error({
          title: "Authentication failed",
          description: message,
        });

        // Clear auth state on error
        clearFoundationAuth();

        // Redirect back to login after a delay
        setTimeout(() => {
          navigate("/login?error=auth_failed", { replace: true });
        }, 2000);
      } finally {
        setIsProcessing(false);
      }
    };

    processFoundationAuth();
  }, [location.search, navigate]);

  return {
    isProcessing,
    error,
  };
}

/**
 * Check if user has active Foundation authentication
 */
export function useFoundationAuthStatus(): {
  isAuthenticated: boolean;
  userId: string | null;
  accessToken: string | null;
} {
  const [status, setStatus] = useState({
    isAuthenticated: false,
    userId: null as string | null,
    accessToken: null as string | null,
  });

  useEffect(() => {
    const token = getFoundationAccessToken();
    const userId = getAuthUserId();

    setStatus({
      isAuthenticated: !!token && !!userId,
      userId,
      accessToken: token,
    });
  }, []);

  return status;
}
