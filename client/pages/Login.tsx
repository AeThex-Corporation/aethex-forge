import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { aethexUserService } from "@/lib/aethex-database-adapter";
import { useAuth } from "@/contexts/AuthContext";
import { useDiscordActivity } from "@/contexts/DiscordActivityContext";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import LoadingScreen from "@/components/LoadingScreen";
import {
  LogIn,
  ArrowRight,
  Shield,
  Sparkles,
  Github,
  Mail,
  Lock,
  User,
  Info,
  Wallet,
} from "lucide-react";

const DiscordIcon = () => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.317 4.3671a19.8062 19.8062 0 0 0-4.8851-1.5152.074.074 0 0 0-.0784.0371c-.211.3754-.444.8635-.607 1.2491-1.798-.2704-3.5915-.2704-5.3719 0-.163-.3856-.405-.8737-.62-1.2491a.077.077 0 0 0-.0784-.037 19.7363 19.7363 0 0 0-4.888 1.5152.07.07 0 0 0-.0325.0277C1.618 8.443.134 12.4693 1.981 16.4267a.0842.0842 0 0 0 .0313.0355c1.555.8679 3.064 1.3975 4.555 1.7031a.083.083 0 0 0 .09-.0395c.23-.4354.435-.8888.607-1.3518a.083.083 0 0 0-.046-.1159c-.606-.2324-1.184-.5255-1.738-.8614a.084.084 0 0 1-.008-.1404c.117-.0877.234-.1783.346-.2716a.083.083 0 0 1 .088-.0105c3.646 1.6956 7.596 1.6956 11.182 0a.083.083 0 0 1 .088.009c.112.0933.23.1839.347.2717a.083.083 0 0 1-.006.1404c-.557.3359-1.135.6291-1.742.8615a.084.084 0 0 0-.046.1159c.173.4647.377.9189.607 1.3518a.083.083 0 0 0 .09.0395c1.494-.3066 3.003-.8352 4.555-1.7031a.083.083 0 0 0 .035-.0355c2.0037-4.0016.6248-8.0511-2.607-11.3586a.06.06 0 0 0-.031-.0277ZM8.02 13.3328c-.983 0-1.79-.9015-1.79-2.0074 0-1.1059.795-2.0074 1.79-2.0074 1.001 0 1.799.9039 1.79 2.0074 0 1.1059-.795 2.0074-1.79 2.0074Zm7.975 0c-.984 0-1.79-.9015-1.79-2.0074 0-1.1059.795-2.0074 1.79-2.0074.999 0 1.799.9039 1.789 2.0074 0 1.1059-.79 2.0074-1.789 2.0074Z" />
  </svg>
);
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [manualVerificationLink, setManualVerificationLink] = useState<
    string | null
  >(null);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [errorFromUrl, setErrorFromUrl] = useState<string | null>(null);
  const [discordLinkedEmail, setDiscordLinkedEmail] = useState<string | null>(
    null,
  );
  const navigate = useNavigate();
  const location = useLocation();
  const {
    signIn,
    signUp,
    signInWithOAuth,
    user,
    profile,
    loading,
    profileComplete,
    requestPasswordReset,
  } = useAuth();
  const { info: toastInfo, error: toastError } = useAethexToast();
  const { isActivity } = useDiscordActivity();

  // Check for error messages and success messages from URL query parameters (e.g., from OAuth callbacks)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorType = params.get("error");
    const errorMessage = params.get("message");
    const discordLinked = params.get("discord_linked");
    const discordEmail = params.get("email");

    // Handle Discord linking success
    if (discordLinked === "true" && discordEmail) {
      setDiscordLinkedEmail(decodeURIComponent(discordEmail));
      toastInfo({
        title: "Discord Linked!",
        description: `Discord account linked to ${decodeURIComponent(discordEmail)}. Please sign in to continue.`,
      });
    }

    if (errorType && errorMessage) {
      setErrorFromUrl(decodeURIComponent(errorMessage));
      // Show in toast as well
      if (errorType === "account_exists") {
        toastError({
          title: "Account Already Exists",
          description: errorMessage,
        });
      } else if (errorType === "auth_create") {
        toastError({
          title: "Authentication Error",
          description: errorMessage,
        });
      } else if (errorType === "discord_no_match") {
        toastError({
          title: "Discord Email Not Found",
          description:
            decodeURIComponent(errorMessage) ||
            "Your Discord email doesn't match any existing AeThex account. Please sign in with your email first.",
        });
      }
    }
  }, [location.search, toastError, toastInfo]);

  // After auth resolves and a user exists, navigate to next path or dashboard
  useEffect(() => {
    if (!loading && user) {
      const params = new URLSearchParams(location.search);
      const next = params.get("next");

      // Check if there's an OAuth redirect destination stored (e.g., from staff login)
      const oauthRedirect = sessionStorage.getItem("oauth_redirect_to");

      // New logic: if profile exists (even if incomplete), go to Dashboard
      // Otherwise send to Onboarding for new users
      const profileExists = profile !== null;
      const redirectDest =
        (next && next.startsWith("/") ? next : null) ||
        oauthRedirect ||
        (profileExists ? "/dashboard" : "/onboarding");

      // Clear the stored redirect after using it
      if (oauthRedirect) {
        sessionStorage.removeItem("oauth_redirect_to");
      }

      navigate(redirectDest, {
        replace: true,
      });
    }
  }, [user, profile, loading, navigate, location.search]);

  // Pre-fill email if Discord was just linked
  useEffect(() => {
    if (discordLinkedEmail) {
      setEmail(discordLinkedEmail);
    }
  }, [discordLinkedEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const result = await signUp(email, password, {
          data: {
            full_name: fullName,
          },
        });
        if (result?.user) {
          toastInfo({
            title: "Account created",
            description:
              result?.identities?.length === 0
                ? "Please verify your email to log in"
                : "Redirecting to onboarding...",
          });
          await aethexUserService.ensureUserProfile(result.user);
          navigate("/onboarding", { replace: true });
        }
      } else {
        // Sign in with email/password
        const result = await signIn(email, password);
        if (result?.user) {
          // Don't navigate immediately - let Auth context update and the useEffect below handle redirect
          // This ensures profile data is fetched and profileComplete is properly calculated
          toastInfo({
            title: "Signing you in",
            description: "Redirecting...",
          });
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      const message =
        error?.message ||
        (isSignUp ? "Failed to create account" : "Failed to sign in");
      toastError({
        title: isSignUp ? "Signup failed" : "Login failed",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    try {
      await signInWithOAuth(provider);
    } catch (error) {
      console.error("OAuth error:", error);
    }
  };

  const handleWeb3Login = async () => {
    try {
      const nonce = await fetch(`${API_BASE}/api/web3/nonce`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: "",
        }),
      })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null);

      if (!nonce?.nonce) {
        toastError({
          title: "Web3 login unavailable",
          description: "Please try again later",
        });
        return;
      }

      const message = `Sign this message to verify your Ethereum wallet:\n\nNonce: ${nonce.nonce}`;
      const address = (window as any).ethereum?.selectedAddress;

      if (!address || !(window as any).ethereum) {
        toastError({
          title: "Wallet not connected",
          description:
            "Please install MetaMask or another Ethereum wallet extension",
        });
        return;
      }

      const signature = await (window as any).ethereum.request({
        method: "personal_sign",
        params: [message, address],
      });

      const result = await fetch(`${API_BASE}/api/web3/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          nonce: nonce.nonce,
          signature,
          redirectTo:
            window.location.origin + (profile ? "/dashboard" : "/onboarding"),
        }),
      })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null);

      if (result?.url) {
        window.location.href = result.url;
      }
    } catch (error: any) {
      console.error("Web3 error:", error);
      toastError({
        title: "Web3 verification failed",
        description: error?.message || "Could not verify your wallet signature",
      });
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <SEO
        title="Sign In to AeThex"
        description="Create or access your AeThex creator account"
        image={window.location.href ? window.location.href : (undefined as any)}
      />
      <Layout>
        <div className="min-h-screen bg-aethex-gradient py-12 flex items-center justify-center">
          <div className="container mx-auto px-4 max-w-md">
            {/* Floating particles effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-aethex-400 rounded-full animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${3 + Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>

            <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-2xl animate-scale-in relative z-10">
              <CardHeader className="text-center space-y-4 pb-6">
                <div className="flex justify-center animate-bounce-slow">
                  <div className="p-4 rounded-full bg-gradient-to-br from-aethex-500/30 to-neon-blue/30 border border-aethex-400/40 shadow-lg shadow-aethex-400/20">
                    <Shield className="h-8 w-8 text-aethex-300 animate-pulse-glow" />
                  </div>
                </div>
                <div className="space-y-3">
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-aethex-300 via-neon-blue to-aethex-400 bg-clip-text text-transparent">
                    {isSignUp ? "Create Account" : "Welcome Back"}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {isSignUp
                      ? "Join AeThex and unlock your creative potential"
                      : "Access your dashboard and continue your journey"}
                  </CardDescription>
                </div>
                <div className="flex justify-center gap-2 pt-2">
                  <Badge
                    variant="outline"
                    className="border-aethex-400/50 text-aethex-300 bg-aethex-500/10"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    Secure Login
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-neon-blue/50 text-neon-blue bg-neon-blue/10"
                  >
                    End-to-End Encrypted
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {errorFromUrl ? (
                  <Alert className="border-red-500/30 bg-red-500/10 text-foreground">
                    <Info className="h-4 w-4 text-red-400" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{errorFromUrl}</AlertDescription>
                  </Alert>
                ) : null}
                {manualVerificationLink ? (
                  <Alert className="border-aethex-400/30 bg-aethex-500/10 text-foreground">
                    <Info className="h-4 w-4 text-aethex-300" />
                    <AlertTitle>Manual verification required</AlertTitle>
                    <AlertDescription>
                      <p>
                        We couldn't send the verification email automatically.
                        Use the link below to confirm your account:
                      </p>
                      <p className="mt-2 break-all rounded bg-background/60 px-3 py-2 font-mono text-xs text-foreground/90">
                        {manualVerificationLink}
                      </p>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="mt-3 border-aethex-400/40"
                        onClick={() =>
                          window.open(
                            manualVerificationLink,
                            "_blank",
                            "noopener",
                          )
                        }
                      >
                        Open verification link
                      </Button>
                    </AlertDescription>
                  </Alert>
                ) : null}
                {/* Social Login Buttons */}
                <div className="space-y-3">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Quick Sign In
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        className="w-full hover-lift interactive-scale border-border/50 hover:border-aethex-400/50 hover:bg-aethex-500/10 transition-all duration-200"
                        onClick={() => handleSocialLogin("github")}
                      >
                        <Github className="h-4 w-4" />
                        <span className="hidden sm:inline ml-1">GitHub</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full hover-lift interactive-scale border-border/50 hover:border-neon-blue/50 hover:bg-neon-blue/10 transition-all duration-200"
                        onClick={() => handleSocialLogin("google")}
                      >
                        <Mail className="h-4 w-4" />
                        <span className="hidden sm:inline ml-1">Google</span>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Connect with
                    </p>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full hover-lift interactive-scale border-border/50 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-200"
                        onClick={() => {
                          const u = new URL(
                            "/api/roblox/oauth/start",
                            API_BASE,
                          );
                          const next = new URLSearchParams(
                            window.location.search,
                          ).get("next");
                          if (next && next.startsWith("/"))
                            u.searchParams.set("state", next);
                          window.location.href = u.toString();
                        }}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Roblox Account
                      </Button>
                      {!isActivity && (
                        <Button
                          variant="outline"
                          className="w-full hover-lift interactive-scale border-border/50 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-200"
                          onClick={() => {
                            const u = new URL(
                              "/api/discord/oauth/start",
                              API_BASE,
                            );
                            const next = new URLSearchParams(
                              window.location.search,
                            ).get("next");
                            if (next && next.startsWith("/"))
                              u.searchParams.set("state", next);
                            window.location.href = u.toString();
                          }}
                        >
                          <DiscordIcon />
                          <span className="ml-2">Discord</span>
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        className="w-full hover-lift interactive-scale border-border/50 hover:border-amber-500/50 hover:bg-amber-500/10 transition-all duration-200"
                        onClick={handleWeb3Login}
                      >
                        <Wallet className="h-4 w-4 mr-2" />
                        Ethereum Wallet
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/30"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="px-2 bg-card/50 text-muted-foreground">
                      Or continue with email
                    </span>
                  </div>
                </div>

                {/* Email/Password Form */}
                <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                  {isSignUp && (
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-sm font-medium">
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="fullName"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Enter your full name"
                          className="pl-10 bg-background/50 border-border/50 focus:border-aethex-400"
                          required={isSignUp}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="pl-10 bg-background/50 border-border/50 focus:border-aethex-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={
                          isSignUp ? "Create a password" : "Enter your password"
                        }
                        className="pl-10 bg-background/50 border-border/50 focus:border-aethex-400"
                        required
                        minLength={isSignUp ? 6 : undefined}
                      />
                    </div>
                    {isSignUp && (
                      <p className="text-xs text-muted-foreground">
                        Password must be at least 6 characters long
                      </p>
                    )}
                  </div>

                  {!isSignUp && (
                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-border/50"
                        />
                        <span className="text-muted-foreground">
                          Remember me
                        </span>
                      </label>
                      <button
                        type="button"
                        className="text-aethex-400 hover:underline"
                        onClick={() => {
                          setResetEmail(email || "");
                          setShowReset(true);
                        }}
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90 hover-lift interactive-scale glow-blue"
                    disabled={
                      !email ||
                      !password ||
                      (isSignUp && !fullName) ||
                      isLoading
                    }
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    {isSignUp ? "Create Account" : "Sign In"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </form>

                <div className="text-center pt-4">
                  <p className="text-sm text-muted-foreground">
                    {isSignUp
                      ? "Already have an account?"
                      : "Don't have an account?"}{" "}
                    <button
                      onClick={() => {
                        setIsSignUp((prev) => !prev);
                        setManualVerificationLink(null);
                      }}
                      className="text-aethex-400 hover:underline font-medium"
                    >
                      {isSignUp ? "Sign In" : "Join AeThex"}
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <div className="mt-6 text-center animate-fade-in">
              <p className="text-xs text-muted-foreground">
                🔒 Your data is protected with enterprise-grade security
              </p>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
