import { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import LoadingScreen from "@/components/LoadingScreen";
import { SkeletonOnboardingStep } from "@/components/Skeleton";
import UserTypeSelection from "@/components/onboarding/UserTypeSelection";
import PersonalInfo from "@/components/onboarding/PersonalInfo";
import Experience from "@/components/onboarding/Experience";
import Interests from "@/components/onboarding/Interests";
import Welcome from "@/components/onboarding/Welcome";
import { useAuth } from "@/contexts/AuthContext";
import {
  aethexUserService,
  aethexAchievementService,
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
}

const initialData: OnboardingData = {
  userType: null,
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
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
};

export default function Onboarding() {
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
      let restored = false;

      if (typeof window !== "undefined") {
        try {
          const raw = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw) as {
              data?: OnboardingData;
              step?: number;
            };
            if (parsed?.data) {
              nextData = {
                ...initialData,
                ...parsed.data,
                personalInfo: {
                  ...initialData.personalInfo,
                  ...parsed.data.personalInfo,
                },
                experience: {
                  ...initialData.experience,
                  ...parsed.data.experience,
                },
                interests: {
                  ...initialData.interests,
                  ...parsed.data.interests,
                },
              };
              if (typeof parsed.step === "number") {
                nextStep = Math.max(0, Math.min(parsed.step, steps.length - 1));
              }
              restored = true;
            }
          }
        } catch (error) {
          console.warn("Unable to restore onboarding progress:", error);
        }
      }

      if (!restored && user?.id) {
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
    if (!hydrated || isFinishing) return;
    if (typeof window === "undefined") return;
    try {
      const payload = {
        data,
        step: currentStep,
      };
      window.localStorage.setItem(
        ONBOARDING_STORAGE_KEY,
        JSON.stringify(payload),
      );
    } catch (error) {
      console.warn("Unable to persist onboarding progress:", error);
    }
  }, [data, currentStep, hydrated, isFinishing]);

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
    }));
  }, []);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep((prev) => prev - 1);
        setIsTransitioning(false);
      }, 300);
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
          (userTypeMap[data.userType || "member"] as any) || "community_member",
        experience_level: (data.experience.level as any) || "beginner",
        bio: data.experience.previousProjects?.trim() || undefined,
      } as any;

      // Ensure profile via server (uses service role)
      const ensureResp = await fetch(`/api/profile/ensure`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, profile: payload }),
      });

      // If server endpoint missing (404) or returns server error, fallback to direct Supabase client
      if (!ensureResp.ok) {
        // If endpoint not found, attempt client-side upsert via Supabase SDK
        if (ensureResp.status === 404) {
          try {
            await aethexUserService.updateProfile(user.id, payload as any);
          } catch (err) {
            const text = await ensureResp.text().catch(() => "");
            let parsedError: any = undefined;
            try {
              parsedError = JSON.parse(text);
            } catch {}
            const message =
              parsedError?.error || text || `HTTP ${ensureResp.status}`;
            throw new Error(
              `Server endpoint missing and client fallback failed: ${message}`,
            );
          }
        } else {
          const text = await ensureResp.text().catch(() => "");
          let parsedError: any = undefined;
          try {
            parsedError = JSON.parse(text);
          } catch {}
          const message =
            parsedError?.error || text || `HTTP ${ensureResp.status}`;
          throw new Error(message);
        }
      }

      // Fire-and-forget interests via server
      const interests = Array.from(
        new Set([
          ...(data.interests.primaryGoals || []),
          ...(data.interests.preferredServices || []),
        ]),
      );

      Promise.allSettled([
        interests.length
          ? fetch(`/api/interests`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ user_id: user.id, interests }),
            })
          : Promise.resolve(),
        aethexAchievementService.checkAndAwardOnboardingAchievement(user.id),
      ]).catch(() => undefined);

      // Mark onboarding complete locally (UI fallback)
      try {
        localStorage.setItem("onboarding_complete", "1");
        localStorage.removeItem(ONBOARDING_STORAGE_KEY);
      } catch {}

      // Refresh profile so UI updates immediately
      await refreshProfile();

      // Success toast
      aethexToast.success({
        title: "You're all set!",
        description: "Profile setup complete. Welcome to your dashboard.",
      });

      // Navigate after success (with hard redirect fallback)
      navigate("/dashboard", { replace: true });
      setTimeout(() => {
        if (location.pathname.includes("onboarding")) {
          window.location.replace("/dashboard");
        }
      }, 400);
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
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gradient animate-pulse-glow">
                Join AeThex
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground animate-fade-in">
                  Step {currentStep + 1} of {steps.length}
                </span>
                <div className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-aethex-400 hover:text-aethex-300 underline transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-aethex-500 to-neon-blue h-2 rounded-full transition-all duration-700 ease-out glow-blue motion-reduce:transition-none"
                style={{
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                }}
              />
            </div>
            {/* Step Indicators */}
            <div className="flex justify-between mt-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 motion-reduce:transition-none ${
                    index <= currentStep
                      ? "bg-aethex-400 glow-blue animate-pulse motion-reduce:animate-none"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 animate-scale-in motion-reduce:animate-none">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-2 animate-slide-right">
                {steps[currentStep].title}
              </h2>
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
