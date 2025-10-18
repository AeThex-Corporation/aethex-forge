import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import LoadingScreen from "@/components/LoadingScreen";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useAethexToast } from "@/hooks/use-aethex-toast";
import { supabase } from "@/lib/supabase";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [resetEmail, setResetEmail] = useState("");
  const navigate = useNavigate();
  const { updatePassword, requestPasswordReset } = useAuth();
  const {
    error: toastError,
    success: toastSuccess,
    info: toastInfo,
  } = useAethexToast();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const hash =
          typeof window !== "undefined"
            ? window.location.hash.replace(/^#/, "")
            : "";
        const params = new URLSearchParams(hash);
        const urlError = params.get("error");
        const urlErrorDesc = params.get("error_description");
        if (urlError) {
          setLinkError(urlErrorDesc || "Reset link is invalid or has expired.");
          return;
        }
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");
        if (access_token && refresh_token) {
          const { error: setErr } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });
          if (setErr) {
            setLinkError("Reset link is invalid or has expired.");
            return;
          }
        } else {
          try {
            await supabase.auth.exchangeCodeForSession(window.location.href);
          } catch (e: any) {
            setLinkError("Reset link is invalid or has expired.");
            return;
          }
        }
        const { data } = await supabase.auth.getSession();
        if (!data?.session) {
          setLinkError("Reset link is invalid or has expired.");
          return;
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      toastError({
        title: "Invalid password",
        description: "Minimum 6 characters.",
      });
      return;
    }
    if (password !== confirm) {
      toastError({
        title: "Passwords do not match",
        description: "Please re-enter matching passwords.",
      });
      return;
    }
    setSubmitting(true);
    try {
      await updatePassword(password);
      toastSuccess({
        title: "Password updated",
        description: "Please sign in with your new password.",
      });
      navigate("/login", { replace: true });
    } catch (err: any) {
      // Error already toasted in context; keep here for safety
      toastError({
        title: "Update failed",
        description: err?.message || "Try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <LoadingScreen
        message="Preparing password reset..."
        showProgress={true}
        duration={1500}
      />
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient py-12 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-md">
          {linkError ? (
            <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-2xl">
              <CardHeader className="text-center space-y-2">
                <CardTitle className="text-2xl text-gradient-purple">
                  Reset link expired
                </CardTitle>
                <CardDescription>
                  {linkError ||
                    "The link is invalid or has expired. Request a new reset link."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Label htmlFor="resetEmail" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="resetEmail"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => navigate("/login")}
                    >
                      Back to login
                    </Button>
                    <Button
                      onClick={async () => {
                        if (!resetEmail) {
                          toastInfo({
                            title: "Enter your email",
                            description: "We will send a fresh reset link.",
                          });
                          return;
                        }
                        try {
                          await requestPasswordReset(resetEmail);
                        } catch {}
                      }}
                      disabled={!resetEmail}
                    >
                      Send new reset link
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-2xl">
              <CardHeader className="text-center space-y-2">
                <CardTitle className="text-2xl text-gradient-purple">
                  Set a new password
                </CardTitle>
                <CardDescription>
                  Enter and confirm your new password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      New Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter a new password"
                      minLength={6}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm" className="text-sm font-medium">
                      Confirm Password
                    </Label>
                    <Input
                      id="confirm"
                      type="password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Re-enter your new password"
                      minLength={6}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={submitting}
                  >
                    {submitting ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
