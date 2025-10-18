import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  const { error: toastError, success: toastSuccess } = useAethexToast();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Ensure recovery session is established from URL parameters
        try {
          await supabase.auth.exchangeCodeForSession(window.location.href);
        } catch {}
        await supabase.auth.getSession();
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
      toastError({ title: "Invalid password", description: "Minimum 6 characters." });
      return;
    }
    if (password !== confirm) {
      toastError({ title: "Passwords do not match", description: "Please re-enter matching passwords." });
      return;
    }
    setSubmitting(true);
    try {
      await updatePassword(password);
      toastSuccess({ title: "Password updated", description: "Please sign in with your new password." });
      navigate("/login", { replace: true });
    } catch (err: any) {
      // Error already toasted in context; keep here for safety
      toastError({ title: "Update failed", description: err?.message || "Try again." });
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <LoadingScreen message="Preparing password reset..." showProgress={true} duration={1500} />
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient py-12 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-md">
          <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-2xl">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl text-gradient-purple">Set a new password</CardTitle>
              <CardDescription>Enter and confirm your new password</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">New Password</Label>
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
                  <Label htmlFor="confirm" className="text-sm font-medium">Confirm Password</Label>
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
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
