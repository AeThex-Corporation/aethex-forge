import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { UserProfile } from "@/lib/database.types";
import { aethexToast } from "@/lib/aethex-toast";
import {
  aethexUserService,
  aethexRoleService,
  aethexAchievementService,
  type AethexUserProfile,
  checkProfileComplete,
} from "@/lib/aethex-database-adapter";

type SupportedOAuthProvider = "github" | "google";

interface LinkedProvider {
  provider: SupportedOAuthProvider;
  identityId?: string;
  linkedAt?: string;
  lastSignInAt?: string;
}

interface AuthContextType {
  user: User | null;
  profile: AethexUserProfile | null;
  roles: string[];
  session: Session | null;
  loading: boolean;
  profileComplete: boolean;
  linkedProviders: LinkedProvider[];
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    userData?: Partial<AethexUserProfile>,
  ) => Promise<void>;
  signInWithOAuth: (provider: SupportedOAuthProvider) => Promise<void>;
  linkProvider: (provider: SupportedOAuthProvider) => Promise<void>;
  unlinkProvider: (provider: SupportedOAuthProvider) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<AethexUserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
let warnedMissingProvider = false;

const missingProviderFallback: AuthContextType = {
  user: null,
  profile: null,
  roles: [],
  session: null,
  loading: true,
  profileComplete: false,
  linkedProviders: [],
  signIn: async () => {
    throw new Error(
      "AuthProvider is not mounted. Please ensure your app is wrapped with <AuthProvider>.",
    );
  },
  signUp: async () => {
    throw new Error(
      "AuthProvider is not mounted. Please ensure your app is wrapped with <AuthProvider>.",
    );
  },
  signInWithOAuth: async () => {
    throw new Error(
      "AuthProvider is not mounted. Please ensure your app is wrapped with <AuthProvider>.",
    );
  },
  linkProvider: async () => {
    throw new Error(
      "AuthProvider is not mounted. Please ensure your app is wrapped with <AuthProvider>.",
    );
  },
  unlinkProvider: async () => {
    throw new Error(
      "AuthProvider is not mounted. Please ensure your app is wrapped with <AuthProvider>.",
    );
  },
  signOut: async () => {
    throw new Error(
      "AuthProvider is not mounted. Please ensure your app is wrapped with <AuthProvider>.",
    );
  },
  updateProfile: async () => {
    throw new Error(
      "AuthProvider is not mounted. Please ensure your app is wrapped with <AuthProvider>.",
    );
  },
  refreshProfile: async () => {
    throw new Error(
      "AuthProvider is not mounted. Please ensure your app is wrapped with <AuthProvider>.",
    );
  },
  requestPasswordReset: async () => {
    throw new Error(
      "AuthProvider is not mounted. Please ensure your app is wrapped with <AuthProvider>.",
    );
  },
  updatePassword: async () => {
    throw new Error(
      "AuthProvider is not mounted. Please ensure your app is wrapped with <AuthProvider>.",
    );
  },
};

const SIGN_OUT_TIMEOUT_MS = 4000;

function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage = "Operation timed out",
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(timeoutMessage));
    }, timeoutMs);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    if (!warnedMissingProvider) {
      console.warn(
        "useAuth called without an AuthProvider. Falling back to safe defaults.",
      );
      warnedMissingProvider = true;
    }
    return missingProviderFallback;
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AethexUserProfile | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const rewardsActivatedRef = useRef(false);
  const storageClearedRef = useRef(false);

  useEffect(() => {
    // Add timeout to ensure loading doesn't get stuck
    const loadingTimeout = setTimeout(() => {
      console.log("Auth loading timeout - forcing loading to false");
      setLoading(false);
    }, 5000);

    if (!storageClearedRef.current && typeof window !== "undefined") {
      try {
        [
          "mock_user",
          "mock_profile",
          "mock_linked_provider_map",
          "demo_profiles",
          "demo_posts",
          "demo_seed_v1",
          "aethex_onboarding_progress_v1",
          "onboarding_complete",
        ].forEach((key) => window.localStorage.removeItem(key));
        storageClearedRef.current = true;
      } catch {
        storageClearedRef.current = true;
      }
    }

    // Get initial session
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        clearTimeout(loadingTimeout);
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserProfile(session.user.id);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        clearTimeout(loadingTimeout);
        console.error("Error getting session:", error);
        setLoading(false);
      });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setProfile(null);
        setRoles([]);
      }
      setLoading(false);

      // Handle token refresh failures specifically
      if (event === "TOKEN_REFRESH_FAILED") {
        console.warn("Token refresh failed - clearing local session");
        try {
          clearClientAuthState();
        } catch (e) {
          /* ignore */
        }
        try {
          aethexToast.error({
            title: "Session expired",
            description:
              "Your session could not be refreshed and has been cleared. Please sign in again.",
          });
        } catch (e) {
          /* ignore */
        }
        return;
      }

      // Show toast notifications for auth events
      if (event === "SIGNED_IN") {
        aethexToast.success({
          title: "Welcome back!",
          description: "Successfully signed in to AeThex OS",
        });
      } else if (event === "SIGNED_OUT") {
        aethexToast.info({
          title: "Signed out",
          description: "Come back soon!",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (
    userId: string,
  ): Promise<AethexUserProfile | null> => {
    try {
      const userProfile = await aethexUserService.getCurrentUser();
      setProfile(userProfile);
      try {
        let r = await aethexRoleService.getUserRoles(userId);
        // Auto-seed owner roles if logging in as site owner
        const ownerEmail = userProfile?.email?.toLowerCase();
        if (ownerEmail === "mrpiglr@gmail.com" && !r.includes("owner")) {
          const seeded = Array.from(
            new Set(["owner", "admin", "founder", ...r]),
          );
          await aethexRoleService.setUserRoles(userId, seeded);
          r = seeded;
        }
        setRoles(r);
      } catch {
        setRoles([]);
      }
      setLoading(false);
      return userProfile;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setLoading(false);
      return null;
    }
  };

  useEffect(() => {
    if (!user || !profile) return;
    if (!roles.length) return;
    if (rewardsActivatedRef.current) return;

    const hasAdminRole = roles.some((role) =>
      ["owner", "admin", "founder"].includes(role.toLowerCase()),
    );

    if (!hasAdminRole) {
      return;
    }

    rewardsActivatedRef.current = true;

    aethexAchievementService
      .activateCommunityRewards({
        email: "mrpiglr@gmail.com",
        username: "mrpiglr",
      })
      .then((response) => {
        if (response?.godModeAwarded) {
          try {
            aethexToast.success({
              title: "GOD mode activated",
              description: "Legendary rewards synced for mrpiglr.",
            });
          } catch (toastError) {
            console.warn("Failed to show activation toast", toastError);
          }
        }
      })
      .catch((error) => {
        console.warn("activateCommunityRewards invocation failed", error);
        rewardsActivatedRef.current = false;
      });
  }, [user, profile, roles]);

  const inviteProcessedRef = useRef(false);
  useEffect(() => {
    if (inviteProcessedRef.current) return;
    if (!user) return;
    try {
      const qs =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search)
          : null;
      const token = qs?.get("invite");
      if (!token) return;
      inviteProcessedRef.current = true;
      import("@/lib/aethex-social-service").then(async (mod) => {
        try {
          await mod.aethexSocialService.acceptInvite(token, user.id);
          try {
            aethexToast.success({
              title: "Invitation accepted",
              description: "You're now connected.",
            });
          } catch {}
        } catch (e) {
          console.warn("Invite accept failed", e);
        } finally {
          try {
            const url = new URL(window.location.href);
            url.searchParams.delete("invite");
            window.history.replaceState({}, "", url.toString());
          } catch {}
        }
      });
    } catch {}
  }, [user]);

  const refreshAuthState = useCallback(async () => {
    try {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user ?? null);
    } catch (error: any) {
      console.warn("Failed to refresh auth state:", error);
      const msg = String(error?.message ?? error).toLowerCase();
      if (
        msg.includes("invalid refresh token") ||
        msg.includes("session expired") ||
        msg.includes("revoked")
      ) {
        try {
          clearClientAuthState();
        } catch (e) {
          /* ignore */
        }
        try {
          aethexToast.error({
            title: "Session expired",
            description:
              "Your session has expired or was revoked. Please sign in again.",
          });
        } catch (e) {
          /* ignore */
        }
      }
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Basic client-side validation
      if (!email || !password) {
        throw new Error("Please provide both email and password.");
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      try {
        await supabase.auth.getSession();
      } catch (e) {
        // ignore
      }
    } catch (error: any) {
      console.error("SignIn error details:", error);

      let errorMessage = String(error?.message ?? error ?? "Sign in failed");

      // Network / fetch errors
      if (
        errorMessage?.toLowerCase().includes("failed to fetch") ||
        error?.name === "AuthRetryableFetchError"
      ) {
        errorMessage =
          "Unable to connect to authentication service. Please check your internet connection and try again.";
      }

      // Supabase specific invalid credentials message -> make it actionable
      if (errorMessage.toLowerCase().includes("invalid login credentials")) {
        errorMessage =
          "Invalid email or password. If you forgot your password, use the 'Forgot password' flow or reset your password via email. If you recently signed up, check your inbox to verify your account.";
      }

      // Generic 400/401 response mapping
      if (
        (error?.status === 400 || error?.status === 401) &&
        !errorMessage.toLowerCase().includes("invalid")
      ) {
        errorMessage = "Invalid email or password.";
      }

      aethexToast.error({
        title: "Sign in failed",
        description: errorMessage,
      });

      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    userData?: Partial<AethexUserProfile>,
  ) => {
    setLoading(true);
    try {
      const metadata: Record<string, unknown> = {};
      if (userData?.full_name || (userData as any)?.fullName) {
        metadata.full_name = (userData.full_name || (userData as any).fullName)!
          .toString()
          .trim();
      }
      if (userData?.username) {
        metadata.username = userData.username;
      }
      if ((userData as any)?.user_type || (userData as any)?.userType) {
        metadata.user_type =
          (userData as any)?.user_type ?? (userData as any)?.userType;
      }

      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/login?verified=1`
          : undefined;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo,
          data: metadata,
        },
      });

      if (error) throw error;

      // Supabase sends the confirmation email automatically (SMTP or default provider)
      let emailSent = true;
      let verificationUrl: string | undefined;

      if (data.user) {
        aethexToast.success({
          title: "Verify your email",
          description: `We sent a confirmation to ${email}.`,
        });
      }

      return { emailSent, verificationUrl } as const;
    } catch (error: any) {
      aethexToast.error({
        title: "Sign up failed",
        description: error?.message || "Unable to create your account.",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithOAuth = async (provider: SupportedOAuthProvider) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) throw error;

      aethexToast.success({
        title: "Redirecting...",
        description: `Signing in with ${provider}`,
      });
    } catch (error: any) {
      aethexToast.error({
        title: `${provider} sign in failed`,
        description: error.message,
      });
      throw error;
    }
  };

  const linkProvider = useCallback(
    async (provider: SupportedOAuthProvider) => {
      if (!user) {
        aethexToast.error({
          title: "Link failed",
          description: "You need to be signed in before linking providers.",
        });
        return;
      }

      const alreadyLinked = user.identities?.some(
        (identity: any) => identity.provider === provider,
      );
      if (alreadyLinked) {
        aethexToast.info({
          title: "Already linked",
          description: `Your ${provider} account is already connected.`,
        });
        return;
      }
      try {
        const { data, error } = (await supabase.auth.linkIdentity({
          provider,
          redirectTo: `${window.location.origin}/dashboard?tab=connections`,
        })) as any;
        if (error) throw error;
        const linkUrl = data?.url;
        if (linkUrl) {
          window.location.href = linkUrl;
          return;
        }
        await refreshAuthState();
        aethexToast.success({
          title: "Account linked",
          description: `Your ${provider} account is now connected.`,
        });
      } catch (error: any) {
        console.error("linkProvider error:", error);
        aethexToast.error({
          title: "Link failed",
          description:
            error?.message || "Unable to link this provider right now.",
        });
      }
    },
    [user, refreshAuthState],
  );

  const unlinkProvider = useCallback(
    async (provider: SupportedOAuthProvider) => {
      if (!user) {
        aethexToast.error({
          title: "Unlink failed",
          description: "You need to be signed in to manage linked accounts.",
        });
        return;
      }
      const identity = user.identities?.find(
        (item: any) => item.provider === provider,
      );
      if (!identity) {
        aethexToast.info({
          title: "Not linked",
          description: `No ${provider} account is linked to this profile.`,
        });
        return;
      }

      const identities = (user.identities ?? []) as any[];
      const supportedLinkedCount = identities.filter((item: any) =>
        ["github", "google"].includes(item.provider),
      ).length;
      const hasEmailIdentity = identities.some(
        (item: any) => item.provider === "email",
      );
      if (!hasEmailIdentity && supportedLinkedCount <= 1) {
        aethexToast.error({
          title: "Cannot unlink provider",
          description:
            "Add another sign-in method before removing this connection.",
        });
        return;
      }
      try {
        const { error } = (await supabase.auth.unlinkIdentity({
          identity_id: identity.identity_id,
          provider,
        })) as any;
        if (error) throw error;
        await refreshAuthState();
        aethexToast.success({
          title: "Account unlinked",
          description: `Your ${provider} connection has been removed.`,
        });
      } catch (error: any) {
        console.error("unlinkProvider error:", error);
        aethexToast.error({
          title: "Unlink failed",
          description:
            error?.message || "Unable to unlink this provider right now.",
        });
      }
    },
    [user, refreshAuthState],
  );

  const clearClientAuthState = useCallback(() => {
    setUser(null);
    setProfile(null);
    setRoles([]);
    setSession(null);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem("onboarding_complete");
        window.localStorage.removeItem("aethex_onboarding_progress_v1");
        const shouldRemove = (key: string) =>
          key.startsWith("sb-") ||
          key.includes("supabase") ||
          key.startsWith("mock_") ||
          key.startsWith("demo_");

        Object.keys(window.localStorage)
          .filter(shouldRemove)
          .forEach((key) => {
            window.localStorage.removeItem(key);
          });
      } catch {}
    }
  }, []);

  // Global handler to catch auth refresh failures (e.g. Invalid Refresh Token)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onAuthError = (ev: any) => {
      const reason = ev?.reason || ev?.error || ev?.message || ev;
      const message = String(
        reason?.message ?? reason ?? ev?.toString?.() ?? "",
      ).toLowerCase();

      if (
        message.includes("invalid refresh token") ||
        message.includes("session expired") ||
        message.includes("revoked")
      ) {
        console.warn("Captured auth error (clearing local session):", reason);
        try {
          clearClientAuthState();
        } catch (e) {
          /* ignore */
        }
        try {
          aethexToast.error({
            title: "Session expired",
            description:
              "Your session has expired or was revoked. Please sign in again.",
          });
        } catch (e) {
          /* ignore */
        }
      }
    };

    window.addEventListener("unhandledrejection", onAuthError as any);
    window.addEventListener("error", onAuthError as any);

    return () => {
      window.removeEventListener("unhandledrejection", onAuthError as any);
      window.removeEventListener("error", onAuthError as any);
    };
  }, [clearClientAuthState]);

  const signOut = async () => {
    setLoading(true);
    const issues: string[] = [];

    try {
      const { error: localError } = await supabase.auth.signOut({
        scope: "local",
      });
      if (localError?.message && !/session/i.test(localError.message)) {
        issues.push(localError.message);
      }
    } catch (error: any) {
      const message = error?.message ?? "Unable to clear local session.";
      if (!/session/i.test(message)) {
        issues.push(message);
      }
    } finally {
      clearClientAuthState();
      setLoading(false);
    }

    try {
      const { error: globalError } = await withTimeout(
        supabase.auth.signOut({ scope: "global" }),
        SIGN_OUT_TIMEOUT_MS,
        "Supabase sign out timed out",
      );
      if (globalError) {
        const status = (globalError as any)?.status;
        if (status !== 401) {
          issues.push(
            globalError.message ?? "Unable to reach authentication service.",
          );
        }
      }
    } catch (error: any) {
      const message =
        error?.message ?? "Unable to reach authentication service.";
      issues.push(message);
      console.warn("Supabase global sign-out issue:", error);
    }

    const uniqueIssues = Array.from(new Set(issues)).filter(Boolean);
    if (uniqueIssues.length) {
      const hasTimeout = uniqueIssues.some((msg) =>
        msg.toLowerCase().includes("timed out"),
      );
      aethexToast.error({
        title: "Sign out issue",
        description: hasTimeout
          ? "We couldn't reach Supabase to finish signing out, but your local session was cleared."
          : uniqueIssues[0],
      });
    } else {
      aethexToast.info({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    }
  };

  const updateProfile = async (updates: Partial<AethexUserProfile>) => {
    if (!user) throw new Error("No user logged in");

    try {
      const updatedProfile = await aethexUserService.updateProfile(
        user.id,
        updates,
      );
      setProfile(
        (prev) =>
          ({
            ...(prev || ({} as any)),
            ...(updatedProfile || ({} as any)),
            ...updates,
          }) as any,
      );
      aethexToast.success({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error: any) {
      setProfile((prev) => ({ ...(prev || ({} as any)), ...updates }) as any);
      const extractErrorMessage = (err: any) => {
        if (!err) return "Failed to update profile. Please try again.";
        if (typeof err === "string") return err;
        if (err.message) return err.message;
        try {
          return JSON.stringify(err);
        } catch (e) {
          return String(err);
        }
      };
      const msg = extractErrorMessage(error);
      aethexToast.error({
        title: "Update failed",
        description: msg,
      });
      // Throw a normalized Error to give callers a searchable message
      throw new Error(msg);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) await fetchUserProfile(user.id);
  };

  const linkedProviders = useMemo<LinkedProvider[]>(() => {
    const supported: SupportedOAuthProvider[] = ["github", "google"];
    if (!user?.identities) return [];
    return (user.identities as any[])
      .filter((identity) =>
        supported.includes(identity.provider as SupportedOAuthProvider),
      )
      .map((identity) => ({
        provider: identity.provider as SupportedOAuthProvider,
        identityId: identity.identity_id,
        linkedAt: identity.created_at,
        lastSignInAt: identity.last_sign_in_at,
      }));
  }, [user]);

  const profileCompletedByData = useMemo(
    () => checkProfileComplete(profile),
    [profile],
  );

  const localOnboardingComplete =
    typeof window !== "undefined" &&
    window.localStorage.getItem("onboarding_complete") === "1";

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (profileCompletedByData) {
      window.localStorage.setItem("onboarding_complete", "1");
    } else if (window.localStorage.getItem("onboarding_complete") === "1") {
      window.localStorage.removeItem("onboarding_complete");
    }
  }, [profileCompletedByData]);

  const computedComplete = profileCompletedByData || localOnboardingComplete;

  const value = {
    user,
    profile,
    roles,
    session,
    loading,
    profileComplete: computedComplete,
    linkedProviders,
    signIn,
    signUp,
    signInWithOAuth,
    linkProvider,
    unlinkProvider,
    signOut,
    updateProfile,
    refreshProfile,
    requestPasswordReset: async (email: string) => {
      if (!email) throw new Error("Email is required");
      try {
        const redirectTo =
          typeof window !== "undefined"
            ? `${window.location.origin}/reset-password`
            : undefined;
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo,
        });
        if (error) throw error;
        aethexToast.info({
          title: "Check your email",
          description: `We sent a password reset link to ${email}.`,
        });
      } catch (error: any) {
        const msg = String(
          error?.message || error || "Failed to send reset email",
        );
        aethexToast.error({ title: "Reset failed", description: msg });
        throw new Error(msg);
      }
    },
    updatePassword: async (newPassword: string) => {
      if (!newPassword || newPassword.length < 6) {
        throw new Error("Password must be at least 6 characters long.");
      }
      try {
        // Ensure session from recovery link is present
        try {
          await supabase.auth.getSession();
        } catch {}
        const { data, error } = await withTimeout(
          supabase.auth.updateUser({ password: newPassword }),
          8000,
          "Password update timed out",
        );
        if (error) throw error;
        if (data?.user) {
          aethexToast.success({
            title: "Password updated",
            description: "You can now sign in with your new password.",
          });
        }
      } catch (error: any) {
        const msg = String(
          error?.message || error || "Failed to update password",
        );
        aethexToast.error({ title: "Update failed", description: msg });
        throw new Error(msg);
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
