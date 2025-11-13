import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, Loader } from "lucide-react";

export default function DiscordVerify() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [discordUser, setDiscordUser] = useState<any>(null);

  const code = searchParams.get("code");

  useEffect(() => {
    // If code in URL, store it but don't verify yet (need user to be authenticated first)
    if (code) {
      setVerificationCode(code);
      // Don't call handleVerify here - wait for user authentication below
    }
  }, [code]);

  useEffect(() => {
    // Redirect if not authenticated, preserving the code param
    if (!user) {
      // Store code in sessionStorage so we can retrieve it after login
      if (code) {
        sessionStorage.setItem("discord_verification_code", code);
        // Redirect to login with the code preserved in the URL
        navigate(`/login?next=/discord-verify?code=${code}`);
      } else {
        // No code, redirect to regular login
        navigate("/login?next=/discord-verify");
      }
    }
  }, [user, navigate, code]);

  // Auto-verify once user is authenticated
  useEffect(() => {
    // Case 1: Code in URL and user is now authenticated
    if (user && code && verificationCode && !isLoading) {
      handleVerify(verificationCode);
    }
    // Case 2: Code in sessionStorage (from redirect back from login) and user is now authenticated
    else if (user && !code && !isLoading) {
      const storedCode = sessionStorage.getItem("discord_verification_code");
      if (storedCode) {
        setVerificationCode(storedCode);
        handleVerify(storedCode);
        sessionStorage.removeItem("discord_verification_code");
      }
    }
  }, [user, isLoading]);

  const handleVerify = async (codeToVerify: string) => {
    if (!codeToVerify.trim()) {
      setError("Please enter a verification code");
      return;
    }

    setIsLoading(true);
    setError(null);
    setDiscordUser(null);

    try {
      const response = await fetch(`${API_BASE}/api/discord/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verification_code: codeToVerify.trim(),
          user_id: user?.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Verification failed. Please try again.");
        setIsLoading(false);
        return;
      }

      // Success
      setDiscordUser(data.discord_user);
      setSuccess(true);
      setVerificationCode("");

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        navigate("/dashboard?tab=connections");
      }, 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again.",
      );
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <SEO
        title="Link Discord Account | AeThex"
        description="Link your Discord account to your AeThex profile"
      />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-indigo-950/10 pt-20 pb-12">
        <div className="max-w-lg mx-auto px-4">
          <Card className="bg-gradient-to-br from-card/60 to-card/30 border border-indigo-500/30 backdrop-blur-sm hover:border-indigo-500/50 transition-all duration-300 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border-b border-indigo-500/20 pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                <div className="p-2 rounded-lg bg-indigo-500/20 border border-indigo-400/40">
                  <svg
                    className="w-6 h-6 text-indigo-300"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M20.317 4.3671a19.8062 19.8062 0 0 0-4.8851-1.5152.074.074 0 0 0-.0784.0371c-.211.3754-.444.8635-.607 1.2491-1.798-.2704-3.5915-.2704-5.3719 0-.163-.3856-.405-.8737-.62-1.2491a.077.077 0 0 0-.0784-.037 19.7363 19.7363 0 0 0-4.888 1.5152.07.07 0 0 0-.0325.0277C1.618 8.443.134 12.4693 1.981 16.4267a.0842.0842 0 0 0 .0313.0355c1.555.8679 3.064 1.3975 4.555 1.7031a.083.083 0 0 0 .09-.0395c.23-.4354.435-.8888.607-1.3518a.083.083 0 0 0-.046-.1159c-.606-.2324-1.184-.5255-1.738-.8614a.084.084 0 0 1-.008-.1404c.117-.0877.234-.1783.346-.2716a.083.083 0 0 1 .088-.0105c3.646 1.6956 7.596 1.6956 11.182 0a.083.083 0 0 1 .088.009c.112.0933.23.1839.347.2717a.083.083 0 0 1-.006.1404c-.557.3359-1.135.6291-1.742.8615a.084.084 0 0 0-.046.1159c.173.4647.377.9189.607 1.3518a.083.083 0 0 0 .09.0395c1.494-.3066 3.003-.8352 4.555-1.7031a.083.083 0 0 0 .035-.0355c2.0037-4.0016.6248-8.0511-2.607-11.3586a.06.06 0 0 0-.031-.0277ZM8.02 13.3328c-.983 0-1.79-.9015-1.79-2.0074 0-1.1059.795-2.0074 1.79-2.0074 1.001 0 1.799.9039 1.79 2.0074 0 1.1059-.795 2.0074-1.79 2.0074Zm7.975 0c-.984 0-1.79-.9015-1.79-2.0074 0-1.1059.795-2.0074 1.79-2.0074.999 0 1.799.9039 1.789 2.0074 0 1.1059-.79 2.0074-1.789 2.0074Z" />
                  </svg>
                </div>
                Link Discord Account
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 p-6">
              {success && discordUser ? (
                // Success State
                <div className="space-y-5 animate-fade-in">
                  <Alert className="border-green-500/50 bg-gradient-to-r from-green-600/10 to-emerald-600/10 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <AlertTitle className="text-green-300 font-semibold">Successfully Linked!</AlertTitle>
                    <AlertDescription className="text-green-200/80">
                      Your Discord account has been connected to your AeThex profile.
                    </AlertDescription>
                  </Alert>

                  <div className="p-5 rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 space-y-3">
                    <p className="text-xs font-semibold text-indigo-300 uppercase tracking-widest">
                      Discord Account
                    </p>
                    <p className="text-lg font-bold text-indigo-100">
                      {discordUser.username}
                      <span className="text-indigo-400/60">#{discordUser.discriminator || "0000"}</span>
                    </p>
                  </div>

                  <p className="text-sm text-center text-muted-foreground animate-pulse">
                    Redirecting to your profile settings...
                  </p>

                  <Button
                    onClick={() => navigate("/dashboard?tab=connections")}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold hover-lift transition-all duration-200"
                  >
                    View Connections
                  </Button>
                </div>
              ) : (
                // Input State
                <div className="space-y-5">
                  <div className="p-5 rounded-lg bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-indigo-500/30 space-y-3">
                    <p className="text-sm font-bold text-indigo-300 flex items-center gap-2">
                      <span className="text-lg">📋</span>
                      How to get your code:
                    </p>
                    <ol className="text-sm text-muted-foreground space-y-2 list-inside">
                      <li className="flex gap-2">
                        <span className="text-indigo-400 font-bold">1.</span>
                        <span>Open Discord</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-indigo-400 font-bold">2.</span>
                        <span>Go to any server where the AeThex bot is installed</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-indigo-400 font-bold">3.</span>
                        <span>Type <code className="bg-background/60 px-2 py-1 rounded text-indigo-300 font-mono text-xs">/verify</code></span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-indigo-400 font-bold">4.</span>
                        <span>Copy the 6-digit code from the bot's response</span>
                      </li>
                    </ol>
                  </div>

                  {error && (
                    <Alert className="border-red-500/50 bg-gradient-to-r from-red-600/10 to-rose-600/10 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                      <AlertTitle className="text-red-300 font-semibold">Verification Failed</AlertTitle>
                      <AlertDescription className="text-red-200/80">{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-3">
                    <Label htmlFor="code" className="text-sm font-bold text-foreground">
                      Verification Code
                    </Label>
                    <Input
                      id="code"
                      type="text"
                      placeholder="000000"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                      disabled={isLoading}
                      className="text-center text-3xl font-bold tracking-[0.5em] border-2 border-indigo-500/50 focus:border-indigo-500 bg-background/60 hover:bg-background/80 transition-colors"
                    />
                    <p className="text-xs text-muted-foreground text-center">
                      Enter the 6-digit code from Discord
                    </p>
                  </div>

                  <Button
                    onClick={() => handleVerify(verificationCode)}
                    disabled={isLoading || !verificationCode.trim()}
                    className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed hover-lift transition-all duration-200"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify & Link Account"
                    )}
                  </Button>

                  <Button
                    onClick={() => navigate("/dashboard")}
                    variant="outline"
                    className="w-full h-11 border-border/50 hover:border-indigo-400/50 hover:bg-indigo-500/5 transition-all duration-200"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info Box */}
          <div className="mt-8 p-5 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 backdrop-blur-sm animate-fade-in">
            <p className="text-sm text-muted-foreground flex items-start gap-3">
              <span className="text-lg">💡</span>
              <span>
                <strong className="text-indigo-300">Tip:</strong> You can also sign in directly with
                Discord on the login page if you're creating a new account.
              </span>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
