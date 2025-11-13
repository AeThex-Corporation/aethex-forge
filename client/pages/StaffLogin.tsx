import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { useAethexToast } from "@/hooks/use-aethex-toast";
import LoadingScreen from "@/components/LoadingScreen";
import { Mail, AlertCircle, Loader2 } from "lucide-react";

export default function StaffLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithOAuth, user, loading, profile } = useAuth();
  const { error: toastError, info: toastInfo } = useAethexToast();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already authenticated and has @aethex.dev email (primary or linked)
  useEffect(() => {
    if (!loading && user && profile) {
      const email = user.email || profile.email || "";
      const hasDevEmail =
        email.endsWith("@aethex.dev") ||
        (profile as any)?.is_dev_account ||
        user.identities?.some((identity: any) =>
          identity.identity_data?.email?.endsWith("@aethex.dev"),
        );

      if (hasDevEmail) {
        toastInfo({
          title: "Already logged in",
          description: "Redirecting to staff dashboard...",
        });
        navigate("/staff/dashboard", { replace: true });
      } else {
        setError(
          "Only @aethex.dev email addresses (or linked accounts) are allowed",
        );
      }
    }
  }, [user, profile, loading, navigate, toastInfo]);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setError(null);
    try {
      await signInWithOAuth("google");
      // Note: Redirect will happen in the useEffect above after auth completes
    } catch (err: any) {
      const errorMsg =
        err?.message || "Failed to sign in with Google. Please try again.";
      setError(errorMsg);
      toastError({
        title: "Sign in failed",
        description: errorMsg,
      });
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return (
      <LoadingScreen
        message="Authenticating..."
        showProgress={true}
        duration={3000}
      />
    );
  }

  return (
    <Layout hideNav>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-900/20 to-slate-950 px-4">
        <Card className="w-full max-w-md border-purple-500/20 bg-slate-900/80 backdrop-blur">
          <CardHeader className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Staff Portal
            </CardTitle>
            <p className="text-sm text-gray-300">
              Internal operations and management dashboard for AeThex staff
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert className="border-red-500/50 bg-red-500/10">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-300 ml-2">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <p className="text-sm text-gray-400 text-center">
                Only staff members with @aethex.dev email addresses can access
                this portal
              </p>

              <Button
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium flex items-center justify-center gap-2"
              >
                {isSigningIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Sign in with Google
                  </>
                )}
              </Button>
            </div>

            <div className="pt-4 border-t border-purple-500/20">
              <p className="text-xs text-gray-500 text-center">
                This portal is restricted to authorized AeThex staff members
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

const Shield = ({ className }: { className: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
  </svg>
);
