import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";
import { useAethexToast } from "@/hooks/use-aethex-toast";

export default function DiscordVerify() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const { success: toastSuccess, error: toastError } = useAethexToast();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleVerification = async () => {
      if (authLoading) return;

      if (!user) {
        toastError({
          title: "Not Authenticated",
          description: "Please sign in to link your Discord account",
        });
        navigate("/login");
        return;
      }

      const code = searchParams.get("code");
      if (!code) {
        toastError({
          title: "Invalid Link",
          description: "No verification code provided",
        });
        navigate("/dashboard?tab=connections");
        return;
      }

      setIsProcessing(true);

      try {
        const response = await fetch("/api/discord/link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            verification_code: code,
            user_id: user.id,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Verification failed");
        }

        const data = await response.json();

        toastSuccess({
          title: "Discord Linked!",
          description:
            "Your Discord account has been successfully linked to AeThex",
        });

        // Redirect to profile settings
        setTimeout(() => {
          navigate("/dashboard?tab=connections");
        }, 2000);
      } catch (error: any) {
        console.error("Discord verification error:", error);
        toastError({
          title: "Linking Failed",
          description: error?.message || "Could not link Discord account",
        });
        navigate("/dashboard?tab=connections");
      } finally {
        setIsProcessing(false);
      }
    };

    if (!authLoading) {
      handleVerification();
    }
  }, [searchParams, user, authLoading, navigate, toastSuccess, toastError]);

  return (
    <LoadingScreen
      message="Linking your Discord account..."
      showProgress={true}
      duration={5000}
    />
  );
}
