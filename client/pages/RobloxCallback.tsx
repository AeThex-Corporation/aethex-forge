import { useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "";

import { useNavigate, useSearchParams } from "react-router-dom";
import LoadingScreen from "@/components/LoadingScreen";
import { useAuth } from "@/contexts/AuthContext";
import { useAethexToast } from "@/hooks/use-aethex-toast";

export default function RobloxCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading } = useAuth();
  const { error: toastError } = useAethexToast();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const error = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        if (error) {
          toastError({
            title: "Roblox OAuth Error",
            description: errorDescription || error,
          });
          navigate("/login");
          return;
        }

        if (!code) {
          toastError({
            title: "Invalid Roblox callback",
            description: "No authorization code received",
          });
          navigate("/login");
          return;
        }

        // Exchange code for Roblox user info via backend
        const response = await fetch(`${API_BASE}/api/roblox/oauth/callback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, state }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          toastError({
            title: "Authentication failed",
            description:
              errorData.error || "Could not authenticate with Roblox",
          });
          navigate("/login");
          return;
        }

        const data = await response.json();

        // If user is already authenticated, link the Roblox account
        if (user && data.roblox_user_id) {
          await fetch(`${API_BASE}/api/user/link-roblox`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              roblox_user_id: data.roblox_user_id,
              roblox_username: data.roblox_username,
            }),
          });
          navigate("/dashboard?tab=connections");
          return;
        }

        // Otherwise, redirect to onboarding with Roblox data
        const nextUrl = state && state.startsWith("/") ? state : "/onboarding";
        navigate(`${nextUrl}?roblox_id=${data.roblox_user_id}`);
      } catch (err: any) {
        console.error("Roblox callback error:", err);
        toastError({
          title: "Callback processing failed",
          description: err?.message || "An error occurred",
        });
        navigate("/login");
      }
    };

    if (!loading) {
      handleCallback();
    }
  }, [searchParams, user, loading, navigate, toastError]);

  return (
    <LoadingScreen
      message="Authenticating with Roblox..."
      showProgress={true}
      duration={3000}
    />
  );
}
