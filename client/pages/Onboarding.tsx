import { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import LoadingScreen from "@/components/LoadingScreen";
import { SkeletonOnboardingStep } from "@/components/Skeleton";

// API Base URL for fetch requests
const API_BASE = import.meta.env.VITE_API_BASE || "";
import UserTypeSelection from "@/components/onboarding/UserTypeSelection";
import PersonalInfo from "@/components/onboarding/PersonalInfo";
import Experience from "@/components/onboarding/Experience";
import Interests from "@/components/onboarding/Interests";
import RealmSelection from "@/components/onboarding/RealmSelection";
import FollowArms from "@/components/onboarding/FollowArms";
import CreatorProfile from "@/components/onboarding/CreatorProfile";
import Welcome from "@/components/onboarding/Welcome";
import { useAuth } from "@/contexts/AuthContext";
import {
  aethexUserService,
  aethexAchievementService,
  aethexNotificationService,
  type AethexUserProfile,
  type AethexAchievement,
} from "@/lib/aethex-database-adapter";
import { aethexToast } from "@/lib/aethex-toast";

export type UserType = "game-developer" | "client" | "member" | "customer";

export interface OnboardingData {
  userType: UserType | null;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    confirmPassword?: string;
    company?: string;
  };
  experience: {
    level: string;
    skills: string[];
    previousProjects?: string;
  };
  interests: {
    primaryGoals: string[];
    preferredServices: string[];
  };
  followedArms: string[];
  creatorProfile: {
    bio?: string;
    skills: string[];
    primaryArm?: string;
  };
}

const initialData: OnboardingData = {
  userType: null,
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
  },
  experience: {
    level: "",
    skills: [],
    previousProjects: "",
  },
  interests: {
    primaryGoals: [],
    preferredServices: [],
  },
  followedArms: [],
  creatorProfile: {
    bio: "",
    skills: [],
    primaryArm: "",
  },
};

export default function Onboarding() {
  // Helper: link to existing account to avoid accidental new account creation
  // Show a small banner that sends users to login with a next param back to onboarding
  const signInExistingHref = "/login?next=/onboarding";
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();

  const steps = [
    { title: "Choose Your Path", component: UserTypeSelection },
    { title: "Personal Information", component: PersonalInfo },
    { title: "Experience Level", component: Experience },
    { title: "Interests & Goals", component: Interests },
    { title: "Choose Your Realm", component: RealmSelection },
    { title: "Follow Arms", component: FollowArms },
    { title: "Creator Profile Setup", component: CreatorProfile },
    { title: "Welcome to AeThex", component: Welcome },
  ];

  const ONBOARDING_STORAGE_KEY = "aethex_onboarding_progress_v1";
  const [hydrated, setHydrated] = useState(false);
  const [achievementPreview, setAchievementPreview] =
    useState<AethexAchievement | null>(null);

  const mapProfileToOnboardingData = useCallback(
    (
      profile: AethexUserProfile | null,
      interests: string[],
    ): OnboardingData => {
      const email = profile?.email || user?.email || "";
      const fullName = profile?.full_name?.trim() || "";
      const nameParts = fullName ? fullName.split(/\s+/).filter(Boolean) : [];
      const firstName = nameParts.shift() || "";
      const lastName = nameParts.join(" ");
      const normalizedType = (() => {
        const value = (profile as any)?.user_type;
        switch (value) {
          case "game_developer":
            return "game-developer";
          case "client":
            return "client";
          case "community_member":
            return "member";
          case "customer":
            return "customer";
          default:
            return null;
        }
      })();

      const storedPreferred =
        Array.isArray((profile as any)?.preferred_services) &&
        ((profile as any)?.preferred_services as string[]).length > 0
          ? ((profile as any)?.preferred_services as string[])
          : [];

      const normalizedInterests = Array.isArray(interests) ? interests : [];

      const profileSkills =
        Array.isArray((profile as any)?.skills) &&
        ((profile as any)?.skills as string[]).length > 0
          ? ((profile as any)?.skills as string[])
          : [];

      return {
        userType: normalizedType,
        personalInfo: {
          firstName:
            firstName || (profile?.username ?? email.split("@")[0] ?? ""),
          lastName,
          email,
          company: (profile as any)?.company || "",
        },
        experience: {
          level: ((profile as any)?.experience_level as string) || "",
          skills: profileSkills,
          previousProjects: profile?.bio || "",
        },
        interests: {
          primaryGoals: normalizedInterests,
          preferredServices:
            storedPreferred.length > 0 ? storedPreferred : normalizedInterests,
        },
        followedArms: [],
      };
    },
    [user?.email],
  );

  useEffect(() => {
    let active = true;

    const hydrate = async () => {
      const achievementsPromise = aethexAchievementService
        .getAllAchievements()
        .catch(() => [] as AethexAchievement[]);

      let nextData: OnboardingData = {
        ...initialData,
        personalInfo: {
          ...initialData.personalInfo,
          email: user?.email || "",
        },
      };
      let nextStep = 0;

      // Do not restore from localStorage; clear any legacy key
      if (typeof window !== "undefined") {
        try {
          window.localStorage.removeItem(ONBOARDING_STORAGE_KEY);
        } catch {}
      }

      if (user?.id) {
        try {
          const [profile, interests] = await Promise.all([
            aethexUserService.getCurrentUser(),
            aethexUserService.getUserInterests(user.id),
          ]);
          nextData = mapProfileToOnboardingData(profile, interests || []);
        } catch (error) {
          console.warn("Unable to hydrate onboarding profile:", error);
        }
      }

      const achievements = await achievementsPromise;
      if (!active) return;

      const welcomeBadge =
        achievements.find(
          (achievement) =>
            achievement.id === "ach_welcome" ||
            achievement.name === "Welcome to AeThex",
        ) || null;

      setData(nextData);
      setCurrentStep(nextStep);
      setAchievementPreview(welcomeBadge);
      setHydrated(true);
      setIsLoading(false);
    };

    hydrate();

    return () => {
      active = false;
    };
  }, [user, steps.length, mapProfileToOnboardingData]);

  useEffect(() => {
    // Disable local persistence for onboarding (but not while finishing)
    if (typeof window === "undefined" || isFinishing) return;
    try {
      window.localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    } catch {}
  }, [hydrated, isFinishing]);

  const updateData = useCallback((newData: Partial<OnboardingData>) => {
    setData((prev) => ({
      ...prev,
      ...newData,
      personalInfo: {
        ...prev.personalInfo,
        ...(newData.personalInfo ?? {}),
      },
      experience: {
        ...prev.experience,
        ...(newData.experience ?? {}),
      },
      interests: {
        ...prev.interests,
        ...(newData.interests ?? {}),
      },
      creatorProfile: {
        ...prev.creatorProfile,
        ...(newData.creatorProfile ?? {}),
      },
    }));
  }, []);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep((prev) => prev - 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  // Precompute decorative particles using useMemo at top-level to avoid hooks in JSX
  const particles = useMemo(() => {
    if (typeof window === "undefined") return [];
    return Array.from({ length: 8 }).map(() => ({
      left: `${Math.floor(Math.random() * 100)}%`,
      top: `${Math.floor(Math.random() * 100)}%`,
      delay: `${Math.random().toFixed(2)}s`,
      duration: `${3 + Math.floor(Math.random() * 2)}s`,
    }));
  }, []);

  const finishOnboarding = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setIsFinishing(true);
    try {
      const userTypeMap: Record<string, string> = {
        "game-developer": "game_developer",
        client: "client",
        member: "community_member",
        customer: "customer",
      };

      const normalizedFirst =
        data.personalInfo.firstName?.trim() ||
        user.email?.split("@")[0] ||
        "user";
      const normalizedLast = data.personalInfo.lastName?.trim() || "";
      const payload = {
        username: normalizedFirst.replace(/\s+/g, "_"),
        full_name: `${normalizedFirst} ${normalizedLast}`.trim(),
        user_type:
          (userTypeMap[data.userType || "member"] as any) || "game_developer",
        experience_level: (data.experience.level as any) || "beginner",
        bio: data.experience.previousProjects?.trim() || undefined,
        onboarded: true,
      } as any;

      // Ensure profile via server (uses service role)
      const ensureResp = await fetch(`${API_BASE}/api/profile/ensure`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, profile: payload }),
      });

      if (!ensureResp.ok) {
        const text = await ensureResp.text().catch(() => "");
        let parsedError: any;
        try {
          parsedError = JSON.parse(text);
        } catch {}
        const primaryMessage =
          parsedError?.error || text || `HTTP ${ensureResp.status}`;

        try {
          await aethexUserService.updateProfile(user.id, payload as any);
        } catch (fallbackError: any) {
          const fallbackMessage =
            fallbackError?.message || fallbackError?.toString?.() || "";
          const combined = [primaryMessage, fallbackMessage]
            .filter(Boolean)
            .join(" | ");
          throw new Error(
            combined || "Unable to complete profile setup. Please try again.",
          );
        }
      }

      // Fire-and-forget interests via server
      const interests = Array.from(
        new Set([
          ...(data.interests.primaryGoals || []),
          ...(data.interests.preferredServices || []),
        ]),
      );

      // Create creator profile if they provided primary arm
      const creatorProfilePromise = data.creatorProfile.primaryArm
        ? fetch(`${API_BASE}/api/creators`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: user.id,
              username: payload.username,
              bio: data.creatorProfile.bio || null,
              avatar_url: null, // Can be added later in profile settings
              experience_level: data.experience.level || "junior",
              primary_arm: data.creatorProfile.primaryArm,
              arm_affiliations: [data.creatorProfile.primaryArm],
              skills: data.creatorProfile.skills || [],
              is_discoverable: true,
            }),
          })
        : Promise.resolve();

      // Save followed arms
      const followedArmsPromises = (data.followedArms || []).map((armId) =>
        fetch(`${API_BASE}/api/user/followed-arms`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            arm_id: armId,
            action: "follow",
          }),
        })
      );

      Promise.allSettled([
        interests.length
          ? fetch(`${API_BASE}/api/interests`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ user_id: user.id, interests }),
            })
          : Promise.resolve(),
        aethexAchievementService.checkAndAwardOnboardingAchievement(user.id),
        creatorProfilePromise,
        ...followedArmsPromises,
        aethexNotificationService.createNotification(
          user.id,
          "success",
          "🎉 Welcome to AeThex!",
          "You've completed your profile setup. Let's get started!",
        ),
      ]).catch(() => undefined);

      // Mark onboarding complete locally (UI fallback)
      try {
        localStorage.setItem("onboarding_complete", "1");
        localStorage.removeItem(ONBOARDING_STORAGE_KEY);
      } catch {}

      // Refresh profile in background (don't block on this)
      // If it fails, the dashboard will handle showing stale data temporarily
      refreshProfile().catch((err) => {
        console.warn("Profile refresh failed after onboarding:", err);
      });

      // Success toast
      aethexToast.success({
        title: "You're all set!",
        description: "Profile setup complete. Welcome to your dashboard.",
      });

      // Navigate immediately (don't wait for profile refresh)
      navigate("/dashboard", { replace: true });

      // Ensure we navigate away even if React routing has issues
      if (typeof window !== "undefined") {
        setTimeout(() => {
          if (window.location.pathname.includes("onboarding")) {
            window.location.href = "/dashboard";
          }
        }, 500);
      }
    } catch (e) {
      function formatError(err: any) {
        if (!err) return "Unknown error";
        if (typeof err === "string") return err;
        if (err instanceof Error)
          return err.message + (err.stack ? `\n${err.stack}` : "");
        if ((err as any).message) return (err as any).message;
        try {
          return JSON.stringify(err);
        } catch {
          return String(err);
        }
      }

      const formatted = formatError(e as any);
      console.error("Finalize onboarding failed:", formatted, e);
      aethexToast.error({
        title: "Onboarding failed",
        description: formatted || "Please try again",
      });
    } finally {
      setIsFinishing(false);
    }
  };

  if (isLoading) {
    return (
      <LoadingScreen
        message="Preparing your onboarding experience..."
        showProgress={true}
        duration={1200}
      />
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Progress Bar */}
          <div className="mb-8 animate-slide-down">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-aethex-300 via-neon-blue to-aethex-400 bg-clip-text text-transparent animate-pulse-glow">
                  Welcome to AeThex
                </h1>
                <p className="text-muted-foreground">
                  Complete your profile setup and unlock your potential
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm">
                <div className="px-4 py-2 rounded-full bg-aethex-500/10 border border-aethex-400/40">
                  <p className="text-aethex-300 font-semibold">
                    Step <span className="text-lg">{currentStep + 1}</span> of <span className="text-lg">{steps.length}</span>
                  </p>
                </div>
                <Link
                  to="/login?next=/onboarding"
                  className="text-aethex-400 hover:text-aethex-300 underline transition-colors font-medium"
                >
                  Already have an account? Sign In
                </Link>
              </div>
            </div>
            <div className="w-full space-y-3">
              <div className="w-full bg-muted/40 rounded-full h-2 overflow-hidden border border-border/40">
                <div
                  className="bg-gradient-to-r from-aethex-500 via-neon-blue to-aethex-400 h-2 rounded-full transition-all duration-700 ease-out glow-blue shadow-lg shadow-aethex-500/50 motion-reduce:transition-none"
                  style={{
                    width: `${((currentStep + 1) / steps.length) * 100}%`,
                  }}
                />
              </div>
              {/* Step Indicators */}
              <div className="flex justify-between gap-1">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="flex-1 h-1 rounded-full transition-all duration-300 motion-reduce:transition-none overflow-hidden"
                  >
                    <div
                      className={`h-full transition-all duration-300 ${
                        index <= currentStep
                          ? "bg-gradient-to-r from-aethex-500 to-neon-blue glow-blue"
                          : "bg-border/40"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-gradient-to-br from-card/60 to-card/30 backdrop-blur-sm border border-aethex-400/30 rounded-2xl p-8 md:p-10 shadow-2xl hover:shadow-3xl hover:border-aethex-400/50 transition-all duration-500 animate-scale-in motion-reduce:animate-none">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1 h-8 rounded bg-gradient-to-b from-aethex-500 to-neon-blue"></div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-aethex-300 to-neon-blue bg-clip-text text-transparent animate-slide-right">
                  {steps[currentStep].title}
                </h2>
              </div>
              <p className="text-muted-foreground text-sm pl-4">
                {currentStep === 0 && "Choose your path and let's begin your journey"}
                {currentStep === 1 && "Help us know you better"}
                {currentStep === 2 && "Tell us about your experience"}
                {currentStep === 3 && "What are your interests?"}
                {currentStep === 4 && "Select your primary focus area"}
                {currentStep === 5 && "Follow the arms you want to see in your feed"}
                {currentStep === 6 && "Set up your creator profile"}
                {currentStep === 7 && "You're ready to go!"}
              </p>
            </div>

            {isTransitioning ? (
              <SkeletonOnboardingStep />
            ) : (
              <div className="animate-fade-in">
                {currentStep === steps.length - 1 ? (
                  <Welcome
                    data={data}
                    onFinish={finishOnboarding}
                    isFinishing={isFinishing}
                    achievement={achievementPreview ?? undefined}
                  />
                ) : steps[currentStep].title === "Choose Your Realm" ? (
                  <RealmSelection
                    selectedRealm={data.creatorProfile.primaryArm || ""}
                    onSelect={(realm) =>
                      updateData({
                        creatorProfile: {
                          ...data.creatorProfile,
                          primaryArm: realm,
                        },
                      })
                    }
                    onNext={nextStep}
                  />
                ) : steps[currentStep].title === "Follow Arms" ? (
                  <FollowArms
                    selectedArms={data.followedArms || []}
                    onUpdate={(arms) => updateData({ followedArms: arms })}
                    nextStep={nextStep}
                    prevStep={prevStep}
                  />
                ) : (
                  <CurrentStepComponent
                    data={data}
                    updateData={updateData}
                    nextStep={nextStep}
                    prevStep={prevStep}
                    currentStep={currentStep}
                    totalSteps={steps.length}
                  />
                )}
              </div>
            )}
          </div>

          {/* Floating particles effect (performance-friendly) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10 hidden md:block motion-reduce:hidden">
            {particles.map((p, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-aethex-400 rounded-full animate-float motion-reduce:animate-none"
                style={{
                  left: p.left,
                  top: p.top,
                  animationDelay: p.delay,
                  animationDuration: p.duration,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
