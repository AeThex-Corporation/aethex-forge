import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAethexToast } from "@/hooks/use-aethex-toast";
import Layout from "@/components/Layout";
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
} from "lucide-react";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();
  const { signIn, signUp, signInWithOAuth, user, loading, profile } = useAuth();
  const { success: toastSuccess, error: toastError } = useAethexToast();

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      if (profile) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/onboarding", { replace: true });
      }
    }
  }, [user, profile, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, {
          id: "", // Will be set by Supabase
          full_name: fullName,
          user_type: "game_developer", // Default, can be changed in onboarding
          username: email.split("@")[0], // Generate username from email
        });
        toastSuccess({
          title: "Account created!",
          description:
            "Please check your email to verify your account, then sign in.",
        });
        setIsSignUp(false);
      } else {
        await signIn(email, password);
        // Navigation is handled by the auth redirect effect based on profile existence
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "github" | "google") => {
    setIsLoading(true);
    try {
      await signInWithOAuth(provider);
    } catch (error: any) {
      console.error(`${provider} authentication error:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading screen only during form submission, not during auth context loading
  if (isLoading && !loading) {
    return (
      <LoadingScreen
        message="Authenticating your account..."
        showProgress={true}
        duration={2000}
      />
    );
  }

  // If auth context is still loading, show a different loading state
  if (loading) {
    return (
      <LoadingScreen
        message="Initializing AeThex OS..."
        showProgress={true}
        duration={3000}
      />
    );
  }

  return (
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
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-gradient-to-r from-aethex-500/20 to-neon-blue/20 border border-aethex-400/20">
                  <Shield className="h-8 w-8 text-aethex-400 animate-pulse-glow" />
                </div>
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl text-gradient-purple">
                  {isSignUp ? "Create Account" : "Welcome Back"}
                </CardTitle>
                <CardDescription>
                  {isSignUp
                    ? "Create your AeThex account to get started"
                    : "Sign in to your AeThex account to access the dashboard"}
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className="border-aethex-400/50 text-aethex-400"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Secure Login
              </Badge>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Social Login Buttons */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full hover-lift interactive-scale"
                  onClick={() => handleSocialLogin("github")}
                >
                  <Github className="h-4 w-4 mr-2" />
                  Continue with GitHub
                </Button>
                <Button
                  variant="outline"
                  className="w-full hover-lift interactive-scale"
                  onClick={() => handleSocialLogin("google")}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Continue with Google
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
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
                      <span className="text-muted-foreground">Remember me</span>
                    </label>
                    <button
                      type="button"
                      className="text-aethex-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90 hover-lift interactive-scale glow-blue"
                  disabled={
                    !email || !password || (isSignUp && !fullName) || isLoading
                  }
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  {isSignUp ? "Create Account" : "Sign In to Dashboard"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </form>

              <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground">
                  {isSignUp
                    ? "Already have an account?"
                    : "Don't have an account?"}{" "}
                  <button
                    onClick={() => setIsSignUp(!isSignUp)}
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
  );
}
