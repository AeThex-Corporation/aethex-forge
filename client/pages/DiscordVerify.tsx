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

            <CardContent className="space-y-6">
              {success && discordUser ? (
                // Success State
                <div className="space-y-4">
                  <Alert className="border-green-500/30 bg-green-500/10">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle>Successfully Linked!</AlertTitle>
                    <AlertDescription>
                      Your Discord account ({discordUser.username}) has been
                      linked to your AeThex profile.
                    </AlertDescription>
                  </Alert>

                  <div className="p-4 rounded-lg bg-secondary/30 space-y-2">
                    <p className="text-sm font-semibold text-foreground">
                      Discord User
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {discordUser.username}#
                      {discordUser.discriminator || "0000"}
                    </p>
                  </div>

                  <p className="text-sm text-center text-muted-foreground">
                    Redirecting to your profile settings...
                  </p>

                  <Button
                    onClick={() => navigate("/dashboard?tab=connections")}
                    className="w-full"
                  >
                    View Connections
                  </Button>
                </div>
              ) : (
                // Input State
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-secondary/30 space-y-2">
                    <p className="text-sm font-semibold text-foreground">
                      How to get your code:
                    </p>
                    <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                      <li>Open Discord</li>
                      <li>
                        Go to any server where the AeThex bot is installed
                      </li>
                      <li>
                        Type{" "}
                        <code className="bg-background/50 px-2 py-1 rounded">
                          /verify
                        </code>
                      </li>
                      <li>Copy the 6-digit code from the bot's response</li>
                    </ol>
                  </div>

                  {error && (
                    <Alert className="border-red-500/30 bg-red-500/10">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertTitle>Verification Failed</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="code" className="text-sm font-medium">
                      Verification Code
                    </Label>
                    <Input
                      id="code"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      maxLength={6}
                      disabled={isLoading}
                      className="text-center text-lg tracking-widest"
                    />
                  </div>

                  <Button
                    onClick={() => handleVerify(verificationCode)}
                    disabled={isLoading || !verificationCode.trim()}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify Code"
                    )}
                  </Button>

                  <Button
                    onClick={() => navigate("/dashboard")}
                    variant="outline"
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info Box */}
          <div className="mt-6 p-4 rounded-lg bg-secondary/20 border border-border/50">
            <p className="text-xs text-muted-foreground">
              💡 <strong>Tip:</strong> You can also sign in directly with
              Discord on the login page if you're creating a new account.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
