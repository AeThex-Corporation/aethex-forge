import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader, AlertTriangle, CheckCircle } from "lucide-react";

export default function DiscordOAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, signIn } = useAuth();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Connecting to Discord...");

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const error = searchParams.get("error");

      if (error) {
        setStatus("error");
        setMessage(`Discord authorization failed: ${error}`);
        return;
      }

      if (!code) {
        setStatus("error");
        setMessage("No authorization code received from Discord");
        return;
      }

      try {
        setMessage("Processing authentication...");

        // Call backend to handle OAuth exchange
        const response = await fetch("/api/discord/oauth/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            state: state || "/dashboard",
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setStatus("error");
          setMessage(data.message || "Failed to authenticate with Discord");
          return;
        }

        // Success
        setStatus("success");
        setMessage("Successfully linked! Redirecting...");

        // The backend handles session setup, so just redirect
        const nextPath = state && state.startsWith("/") ? state : "/dashboard";
        setTimeout(() => {
          navigate(nextPath);
        }, 2000);
      } catch (error) {
        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        );
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <Layout>
      <SEO title="Discord Authentication | AeThex" />

      <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4">
        <Card className="bg-card/60 border-border/40 backdrop-blur max-w-md w-full">
          <CardContent className="pt-8 space-y-6">
            {status === "loading" && (
              <div className="flex flex-col items-center gap-4">
                <Loader className="h-8 w-8 animate-spin text-blue-500" />
                <div className="text-center space-y-2">
                  <p className="font-semibold text-foreground">{message}</p>
                  <p className="text-sm text-muted-foreground">
                    Please wait while we secure your account...
                  </p>
                </div>
              </div>
            )}

            {status === "success" && (
              <div className="flex flex-col items-center gap-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div className="text-center space-y-2">
                  <p className="font-semibold text-foreground">{message}</p>
                  <p className="text-sm text-muted-foreground">
                    You'll be taken to your dashboard shortly...
                  </p>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p className="font-semibold text-red-600">
                      Authentication Failed
                    </p>
                    <p className="text-sm text-red-500/80">{message}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate("/login")}
                    className="flex-1 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors"
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
