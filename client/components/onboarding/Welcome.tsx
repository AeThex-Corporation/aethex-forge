import { OnboardingData } from "@/pages/Onboarding";
import { Button } from "@/components/ui/button";

const API_BASE = import.meta.env.VITE_API_BASE || "";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  MailCheck,
  MailWarning,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import type { AethexAchievement } from "@/lib/aethex-database-adapter";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useAethexToast } from "@/hooks/use-aethex-toast";

interface WelcomeProps {
  data: OnboardingData;
  onFinish?: () => void;
  isFinishing?: boolean;
  achievement?: AethexAchievement;
}

export default function Welcome({
  data,
  onFinish,
  isFinishing,
  achievement,
}: WelcomeProps) {
  const { user, refreshProfile } = useAuth();
  const {
    success: toastSuccess,
    error: toastError,
    warning: toastWarning,
    info: toastInfo,
  } = useAethexToast();

  const emailAddress = data.personalInfo.email || user?.email || "";
  const deriveConfirmed = (source?: any) =>
    Boolean(source?.email_confirmed_at || source?.confirmed_at);

  const [isVerified, setIsVerified] = useState<boolean>(() =>
    deriveConfirmed(user),
  );
  const [isCheckingVerification, setIsCheckingVerification] = useState(false);

  const fullNameValue =
    `${(data.personalInfo.firstName || "").trim()} ${(data.personalInfo.lastName || "").trim()}`.trim() ||
    ((user as any)?.user_metadata?.full_name as string | undefined);

  useEffect(() => {
    const confirmed = deriveConfirmed(user);
    setIsVerified(confirmed);
  }, [user]);

  const handleCheckVerification = async () => {
    setIsCheckingVerification(true);
    try {
      const { data: authData, error } = await supabase.auth.getUser();
      if (error) throw error;

      const confirmed = deriveConfirmed(authData?.user);
      if (confirmed) {
        setIsVerified(true);
        toastSuccess({
          title: "Email verified",
          description: "You're all set. You can sign in with this email.",
        });
        try {
          await refreshProfile();
        } catch (refreshError) {
          console.warn(
            "Unable to refresh profile after verification",
            refreshError,
          );
        }
      } else {
        toastInfo({
          title: "Verification pending",
          description:
            "We still don't see the confirmation. Check your inbox or resend the email.",
        });
      }
    } catch (error: any) {
      console.error("Check verification failed", error);

      // If the client has no active session (common in signup flows), fall back
      // to a server-side check using the admin Supabase client.
      const isSessionMissing =
        (error &&
          ((error.name && error.name.includes("AuthSessionMissing")) ||
            (error.message &&
              error.message.includes("Auth session missing")))) ||
        false;

      if (isSessionMissing && emailAddress) {
        try {
          const resp = await fetch(`${API_BASE}/api/auth/check-verification`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: emailAddress }),
          });

          const payload = await resp.json().catch(() => ({}) as any);
          if (!resp.ok) {
            const serverMessage =
              payload?.error ||
              payload?.message ||
              (Object.keys(payload || {}).length
                ? JSON.stringify(payload)
                : "Server check failed");
            console.error("Server check-verification failed:", serverMessage);
            toastError({
              title: "Unable to verify",
              description: serverMessage,
            });
          } else {
            const confirmed = Boolean(payload?.verified);
            if (confirmed) {
              setIsVerified(true);
              toastSuccess({
                title: "Email verified",
                description: "You're all set. You can sign in with this email.",
              });
              try {
                await refreshProfile();
              } catch (refreshError) {
                console.warn(
                  "Unable to refresh profile after verification",
                  refreshError,
                );
              }
            } else {
              toastInfo({
                title: "Verification pending",
                description:
                  "We still don't see the confirmation. Check your inbox or resend the email.",
              });

              // If the server returned a verification link (manual fallback), surface it.
              if (
                payload?.user &&
                payload?.user?.email &&
                payload?.user?.confirmation_sent_at &&
                !payload?.verified
              ) {
                // nothing specific to do here other than logging
                console.debug("User found but not verified", payload.user);
              }
            }
          }
        } catch (e: any) {
          console.error("Server-side check failed", e);
          toastError({
            title: "Unable to verify",
            description: e?.message || "Server verification failed",
          });
        } finally {
          setIsCheckingVerification(false);
        }

        return;
      }

      toastError({
        title: "Unable to verify",
        description:
          error?.message || "We couldn't confirm your email status yet.",
      });
    } finally {
      setIsCheckingVerification(false);
    }
  };

  const VerificationIcon = isVerified ? MailCheck : MailWarning;
  const verificationBorderClass = isVerified
    ? "border-emerald-500/40"
    : "border-amber-500/40";
  const verificationIconBg = isVerified
    ? "bg-emerald-500 text-white"
    : "bg-amber-500 text-white";
  const verificationBadgeClass = isVerified
    ? "bg-emerald-500/20 text-emerald-100 border border-emerald-500/40"
    : "bg-amber-500/20 text-amber-100 border border-amber-500/40";
  const verificationDescriptionClass = isVerified
    ? "text-emerald-100/80"
    : "text-amber-100/80";

  const getUserTypeLabel = () => {
    switch (data.userType) {
      case "game-developer":
        return "Game Development";
      case "client":
        return "Consulting";
      case "member":
        return "Community";
      case "customer":
        return "Get Started";
      default:
        return "User";
    }
  };

  const getNextSteps = () => {
    switch (data.userType) {
      case "game-developer":
        return [
          {
            title: "Access Development Tools",
            description:
              "Get started with our development toolkit and resources",
          },
          {
            title: "Join Mentorship Program",
            description: "Connect with experienced developers for guidance",
          },
          {
            title: "Explore Projects",
            description: "Browse collaborative projects and opportunities",
          },
          {
            title: "Attend Workshops",
            description: "Join our next technical workshop or boot camp",
          },
        ];
      case "client":
        return [
          {
            title: "Schedule Consultation",
            description: "Book a free consultation to discuss your project",
          },
          {
            title: "View Our Portfolio",
            description: "Explore our previous work and case studies",
          },
          {
            title: "Get Project Quote",
            description: "Receive a detailed quote for your development needs",
          },
          {
            title: "Meet Your Team",
            description: "Connect with our development specialists",
          },
        ];
      case "member":
        return [
          {
            title: "Explore Research",
            description: "Access our latest research and publications",
          },
          {
            title: "Join Community",
            description: "Connect with other members in our forums",
          },
          {
            title: "Upcoming Events",
            description: "Register for community events and workshops",
          },
          {
            title: "Innovation Labs",
            description: "Participate in cutting-edge research projects",
          },
        ];
      case "customer":
        return [
          {
            title: "Browse Products",
            description: "Explore our games, tools, and digital products",
          },
          {
            title: "Join Beta Programs",
            description: "Get early access to new releases and features",
          },
          {
            title: "Community Hub",
            description: "Connect with other users and share feedback",
          },
          {
            title: "Support Center",
            description: "Access documentation and customer support",
          },
        ];
      default:
        return [];
    }
  };

  const nextSteps = getNextSteps();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-gradient-to-r from-aethex-500 to-neon-blue">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gradient-purple">
            Welcome to AeThex, {data.personalInfo.firstName}!
          </h2>
          <p className="text-muted-foreground">
            Your {getUserTypeLabel().toLowerCase()} account has been
            successfully set up
          </p>
        </div>
      </div>

      {/* User Summary */}
      <Card className="max-w-2xl mx-auto bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-aethex-400" />
            <span>Your AeThex Profile</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong className="text-foreground">Role:</strong>
              <p className="text-muted-foreground">{getUserTypeLabel()}</p>
            </div>
            <div>
              <strong className="text-foreground">Experience:</strong>
              <p className="text-muted-foreground capitalize">
                {data.experience.level}
              </p>
            </div>
            <div>
              <strong className="text-foreground">Skills:</strong>
              <p className="text-muted-foreground">
                {data.experience.skills.slice(0, 3).join(", ")}
                {data.experience.skills.length > 3 ? "..." : ""}
              </p>
            </div>
            <div>
              <strong className="text-foreground">Primary Goals:</strong>
              <p className="text-muted-foreground">
                {data.interests.primaryGoals.length} selected
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Verification Reminder */}
      <Card
        className={`max-w-2xl mx-auto bg-background/40 backdrop-blur ${verificationBorderClass}`}
      >
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-full ${verificationIconBg}`}
            >
              <VerificationIcon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">
                {isVerified
                  ? "Email verified"
                  : "Verify your email to continue"}
              </CardTitle>
              <CardDescription className={verificationDescriptionClass}>
                {isVerified
                  ? `You're verified with ${emailAddress || "your email address"}.`
                  : `Confirm ${emailAddress || "your email"} so you can sign back in after onboarding.`}
              </CardDescription>
            </div>
          </div>
          <Badge className={verificationBadgeClass}>
            {isVerified ? "Verified" : "Action required"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {isVerified ? (
            <p className="text-foreground/80">
              You're good to go. Keep this email handy for account recovery and
              notifications.
            </p>
          ) : (
            <>
              <p className="text-foreground/80">
                Check your inbox for the AeThex confirmation email we sent
                during sign-up. Click the verification link in that email to
                confirm your account.
              </p>
              <ul className="list-disc space-y-1 pl-5 text-foreground/70">
                <li>Check your email inbox and spam folder.</li>
                <li>
                  The confirmation email is from
                  <span className="mx-1 font-mono text-xs text-foreground/80">
                    support@aethex.tech
                  </span>
                </li>
                <li>Once verified, click the button below to continue.</li>
              </ul>
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="bg-aethex-500/20 text-aethex-100 border border-aethex-500/40"
                  onClick={handleCheckVerification}
                  disabled={isCheckingVerification}
                >
                  {isCheckingVerification && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  I verified, check status
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Achievement Badge */}
      {achievement && (
        <Card className="max-w-2xl mx-auto border border-emerald-500/40 bg-emerald-500/10">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-2xl">
                {achievement.icon || "🎖️"}
              </div>
              <div>
                <CardTitle className="text-base text-emerald-50">
                  Achievement Unlocked
                </CardTitle>
                <CardDescription className="text-xs text-emerald-100/80">
                  {achievement.name}
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-emerald-600/90 text-white border border-emerald-500/40">
              AeThex Passport
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-emerald-100/90">
            {achievement.description && <p>{achievement.description}</p>}
            {typeof achievement.xp_reward === "number" &&
              achievement.xp_reward > 0 && (
                <div className="text-xs uppercase tracking-wider text-emerald-200">
                  +{achievement.xp_reward} XP added to your passport progression
                </div>
              )}
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="border-emerald-500/40 text-emerald-100"
              >
                <ShieldCheck className="mr-1 h-3.5 w-3.5" /> Profile Verified
              </Badge>
              <Badge
                variant="outline"
                className="border-emerald-500/40 text-emerald-100"
              >
                <Sparkles className="mr-1 h-3.5 w-3.5" /> Passport Updated
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      <div className="max-w-2xl mx-auto space-y-4">
        <h3 className="text-lg font-semibold text-center">What's Next?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {nextSteps.map((step, index) => (
            <Card
              key={index}
              className="bg-background/30 border-border/50 hover:border-aethex-400/50 transition-all duration-200"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs">
                  {step.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
        <Button
          onClick={onFinish}
          disabled={isFinishing}
          variant="default"
          className="bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90"
        >
          {isFinishing ? "Finishing..." : "Finish & Go to Dashboard"}
        </Button>
        <Button
          asChild
          variant="secondary"
          className="bg-aethex-500/20 text-aethex-100 border border-aethex-500/40"
        >
          <Link
            to={
              user
                ? "/dashboard?tab=connections"
                : `/login?next=${encodeURIComponent("/dashboard?tab=connections")}`
            }
            className="flex items-center gap-2"
          >
            <ShieldCheck className="h-4 w-4" />
            Link OAuth Accounts
          </Link>
        </Button>
      </div>

      <div className="text-center pt-4">
        <p className="text-xs text-muted-foreground">
          Need help getting started?{" "}
          <Link to="/support" className="text-aethex-400 hover:underline">
            Contact our support team
          </Link>
        </p>
      </div>
    </div>
  );
}
