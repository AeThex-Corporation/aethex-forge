import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAethexToast } from "@/hooks/use-aethex-toast";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import LoadingScreen from "@/components/LoadingScreen";
import { LogIn, Lock, Users } from "lucide-react";

const GoogleIcon = () => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="currentColor"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="currentColor"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="currentColor"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="currentColor"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

export default function StaffLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorFromUrl, setErrorFromUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithOAuth, user, loading, profileComplete } = useAuth();
  const { error: toastError, info: toastInfo } = useAethexToast();

  // Check for error messages from URL (e.g., from OAuth callbacks)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorType = params.get("error");
    const errorMessage = params.get("message");

    if (errorType && errorMessage) {
      setErrorFromUrl(decodeURIComponent(errorMessage));
      if (errorType === "domain_not_allowed") {
        toastError({
          title: "Access Denied",
          description: errorMessage,
        });
      }
    }
  }, [location.search, toastError]);

  // Redirect if already authenticated (with @aethex.dev email validation)
  useEffect(() => {
    if (!loading && user) {
      const userEmail = user.email || "";
      const isAethexDev = userEmail.endsWith("@aethex.dev");

      if (!isAethexDev) {
        // Email is not @aethex.dev - show error
        setErrorFromUrl(
          "Only @aethex.dev email addresses can access the Staff Portal. If you're an authorized contractor, please use your assigned contractor email.",
        );
        toastError({
          title: "Access Denied",
          description: "This email domain is not authorized for staff access.",
        });
        return;
      }

      // Valid staff email - redirect to admin dashboard
      const params = new URLSearchParams(location.search);
      const next = params.get("next");
      const safeNext = next && next.startsWith("/admin") ? next : null;
      navigate(safeNext || "/admin", { replace: true });
    }
  }, [user, loading, navigate, location.search, toastError]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // Pass the staff dashboard as the intended destination after OAuth completes
      await signInWithOAuth("google", "/staff/dashboard");
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      toastError({
        title: "Sign-in failed",
        description:
          error?.message || "Failed to sign in with Google. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Layout>
      <SEO title="Staff Login" description="AeThex staff and employees only" />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        </div>

        <div className="relative w-full max-w-md">
          <Card className="border-slate-700/50 bg-slate-900/50 backdrop-blur">
            <CardHeader className="space-y-2 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-lg bg-purple-500/20 border border-purple-500/30">
                  <Lock className="h-6 w-6 text-purple-400" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">Staff Portal</CardTitle>
              <CardDescription>
                AeThex employees and authorized contractors only
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {errorFromUrl && (
                <Alert className="border-red-400/30 bg-red-500/10 text-foreground">
                  <AlertTitle>Access Denied</AlertTitle>
                  <AlertDescription>{errorFromUrl}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                <p className="text-sm text-slate-400 text-center">
                  Sign in with your @aethex.dev Google Workspace account
                </p>

                <Button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  size="lg"
                  className="w-full bg-white hover:bg-slate-100 text-slate-900 font-semibold"
                >
                  <GoogleIcon />
                  <span>
                    {isLoading ? "Signing in..." : "Sign in with Google"}
                  </span>
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-900 text-slate-400">
                    For team members only
                  </span>
                </div>
              </div>

              <div className="grid gap-3 text-sm text-slate-400">
                <div className="flex gap-2">
                  <Users className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <span>Full access to internal tools and dashboards</span>
                </div>
                <div className="flex gap-2">
                  <Lock className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <span>Secured with Google Workspace authentication</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <p className="text-xs text-slate-500 text-center">
                  Public login available at{" "}
                  <a
                    href="/login"
                    className="text-purple-400 hover:text-purple-300"
                  >
                    aethex.dev/login
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
