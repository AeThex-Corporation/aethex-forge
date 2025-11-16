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

const API_BASE = import.meta.env.VITE_API_BASE || "";
import {
  aethexUserService,
  aethexRoleService,
  aethexAchievementService,
  type AethexUserProfile,
  checkProfileComplete,
} from "@/lib/aethex-database-adapter";

type SupportedOAuthProvider = "github" | "google" | "discord";

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
    let sessionRestored = false;

    // Add timeout to ensure loading doesn't get stuck
    // Increased from 3s to 5s to allow more time for session restoration after OAuth
    const loadingTimeout = setTimeout(() => {
      console.log("Auth loading timeout - forcing loading to false");
      if (!sessionRestored) {
        setLoading(false);
      }
    }, 5000);

    if (!storageClearedRef.current && typeof window !== "undefined") {
      try {
        // ONLY clear mock/demo data, NOT actual Supabase auth session
        [
          "mock_user",
          "mock_profile",
          "mock_linked_provider_map",
          "demo_profiles",
          "demo_posts",
          "demo_seed_v1",
          "aethex_onboarding_progress_v1",
        ].forEach((key) => window.localStorage.removeItem(key));

        // NOTE: We deliberately DO NOT clear:
        // - sb-* keys (Supabase session tokens)
        // - auth-token keys
        // - IndexedDB (where Supabase stores sessions)
        // Clearing these breaks session persistence across page reloads/redirects!

        storageClearedRef.current = true;
      } catch {
        storageClearedRef.current = true;
      }
    }

    // Helper to check if auth tokens exist in localStorage
    const hasAuthTokens = () => {
      if (typeof window === "undefined") return false;
      const keys = Object.keys(window.localStorage);
      return keys.some(
        (key) =>
          key.includes("auth-token") ||
          (key.includes("sb-") && key.includes("-auth")),
      );
    };

    // Get initial session with persistence recovery
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        // If no session but tokens exist, the session might not have restored yet
        // Wait for onAuthStateChange to trigger
        if (!session && hasAuthTokens()) {
          // Don't set loading to false yet - wait for onAuthStateChange
          return;
        }

        if (session?.user) {
          sessionRestored = true;
          setSession(session);
          setUser(session.user);
          await fetchUserProfile(session.user.id);
        } else {
          sessionRestored = true;
          setLoading(false);
        }
      } catch (error) {
        console.error("Error getting session:", error);
        sessionRestored = true;
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes - this is the source of truth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, !!session?.user);

      sessionRestored = true;
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Fetch profile but also set loading to false after a timeout
        // This ensures the UI shows even if profile fetch is slow
        const profileTimeout = setTimeout(() => {
          setLoading(false);
        }, 1000);

        await fetchUserProfile(session.user.id);
        clearTimeout(profileTimeout);
      } else {
        // User logged out - clear everything and ensure loading is false
        setProfile(null);
        setRoles([]);
        setLoading(false);
        // Extra safety: ensure loading is false even if this callback is called multiple times
        setTimeout(() => {
          setLoading(false);
        }, 50);
      }

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

    return () => {
      clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (
    userId: string,
  ): Promise<AethexUserProfile | null> => {
    try {
      // Fetch user profile with a 10-second timeout to prevent hanging
      const profilePromise = aethexUserService.getCurrentUser();
      const timeoutPromise = new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), 10000),
      );
      const userProfile = await Promise.race([profilePromise, timeoutPromise]);

      if (!userProfile) {
        console.warn("Profile fetch timed out or returned null");
        setProfile(null);
        return null;
      }

      setProfile(userProfile);

      // Fetch roles in parallel (non-blocking) - don't await here
      const rolesPromise = aethexRoleService
        .getUserRoles(userId)
        .then((r) => {
          // Auto-seed owner roles if logging in as site owner
          const normalizedEmail = userProfile?.email?.toLowerCase();
          if (normalizedEmail === "mrpiglr@gmail.com" && !r.includes("owner")) {
            const seeded = Array.from(
              new Set(["owner", "admin", "founder", ...r]),
            );
            return aethexRoleService
              .setUserRoles(userId, seeded)
              .then(() => seeded)
              .catch(() => r);
          }
          if (
            normalizedEmail &&
            /@aethex\.dev$/i.test(normalizedEmail) &&
            !r.includes("staff")
          ) {
            const seeded = Array.from(new Set(["staff", ...r]));
            return aethexRoleService
              .setUserRoles(userId, seeded)
              .then(() => seeded)
              .catch(() => r);
          }
          return r;
        })
        .then((r) => {
          setRoles(r);
        })
        .catch((error) => {
          console.warn("Error fetching roles:", error);
          setRoles([]);
        });

      // Don't wait for rolesPromise - continue immediately
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

    // Only attempt to activate if this is the admin user
    if (
      profile?.email === "mrpiglr@gmail.com" ||
      profile?.username === "mrpiglr"
    ) {
      aethexAchievementService
        .activateCommunityRewards({
          email: profile?.email,
          username: profile?.username,
        })
        .then((response) => {
          if (response?.godModeAwarded) {
            try {
              aethexToast.success({
                title: "GOD mode activated",
                description: "Legendary rewards synced.",
              });
            } catch (toastError) {
              console.warn("Failed to show activation toast", toastError);
            }
          }
        })
        .catch((error) => {
          console.warn(
            "activateCommunityRewards invocation failed",
            error?.message || error,
          );
          rewardsActivatedRef.current = false;
        });
    }
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

      // First attempt: try signing in with the provided email
      let { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // If invalid credentials and it might be a linked email, try to resolve it
      if (
        error &&
        (error.message?.includes("Invalid login credentials") ||
          error.message?.includes("invalid email"))
      ) {
        try {
          // Check if this email is linked to another account
          const response = await fetch(
            `${API_BASE}/api/user/resolve-linked-email`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email }),
            },
          );

          if (response.ok) {
            const { primaryEmail } = await response.json();
            if (primaryEmail && primaryEmail !== email) {
              // Try signing in with the primary email
              const retryResult = await supabase.auth.signInWithPassword({
                email: primaryEmail,
                password,
              });

              if (!retryResult.error) {
                data = retryResult.data;
                error = null;
              }
            }
          }
        } catch (e) {
          // If email resolution fails, continue with original error
          console.error("Email resolution failed:", e);
        }
      }

      if (error) throw error;

      try {
        await supabase.auth.getSession();
      } catch (e) {
        // ignore
      }

      // Return user data for caller to use (e.g., Login.tsx)
      return { user: data?.user ?? null };
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

      // Send verification email via custom SMTP (fallback: Supabase auth email)
      let emailSent = false;
      let verificationUrl: string | undefined;

      if (data.user) {
        try {
          // Try to send via custom SMTP server
          const verifyResponse = await fetch(
            `${API_BASE}/api/auth/send-verification-email`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email,
                redirectTo,
                fullName: metadata.full_name || null,
              }),
            },
          );

          const verifyPayload = await verifyResponse.json().catch(() => ({}));

          if (verifyResponse.ok && verifyPayload?.sent) {
            emailSent = true;
            aethexToast.success({
              title: "Verify your email",
              description: `We sent a confirmation to ${email}.`,
            });
          } else {
            // Custom SMTP failed, but provide manual link if available
            verificationUrl = verifyPayload?.verificationUrl || undefined;
            if (verificationUrl) {
              aethexToast.warning({
                title: "Verify your email",
                description: `We couldn't send the email automatically. Use the manual verification link in your account settings.`,
              });
            } else {
              aethexToast.info({
                title: "Account created",
                description: `Please check your email to verify your account.`,
              });
            }
          }
        } catch (emailErr) {
          console.warn("[Auth] Failed to send verification email:", emailErr);
          aethexToast.info({
            title: "Account created",
            description: `Please check your email to verify your account.`,
          });
        }
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

  const signInWithOAuth = async (
    provider: SupportedOAuthProvider,
    redirectTo?: string,
  ) => {
    try {
      // Store the intended redirect destination for after OAuth completes
      if (redirectTo) {
        sessionStorage.setItem("oauth_redirect_to", redirectTo);
      }

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

      // Special handling for Discord - use custom OAuth endpoint
      if (provider === "discord") {
        try {
          // Get current auth session to get auth token
          const { data: sessionData, error: sessionError } =
            await supabase.auth.getSession();

          if (sessionError || !sessionData?.session?.access_token) {
            console.error(
              "[Discord Link] Failed to get session:",
              sessionError || "No access token",
            );
            aethexToast.error({
              title: "Auth failed",
              description:
                "Unable to get authentication token. Please refresh and try again.",
            });
            return;
          }

          console.log("[Discord Link] Creating linking session...");

          // Create temporary linking session
          const sessionRes = await fetch(
            `${API_BASE}/api/discord/create-linking-session`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${sessionData.session.access_token}`,
                "Content-Type": "application/json",
              },
            },
          );

          if (!sessionRes.ok) {
            const errorText = await sessionRes.text().catch(() => "");
            console.error(
              "[Discord Link] Session creation failed:",
              sessionRes.status,
              errorText,
            );
            throw new Error(
              `Session creation failed (${sessionRes.status}). Please try again.`,
            );
          }

          const sessionJson = await sessionRes.json().catch(() => null);
          const sessionToken = sessionJson?.token;

          if (!sessionToken) {
            console.error(
              "[Discord Link] No session token in response:",
              sessionJson,
            );
            throw new Error("Invalid session response from server");
          }

          console.log("[Discord Link] Redirecting to Discord OAuth...");

          const u = new URL("/api/discord/oauth/start", apiBase);
          u.searchParams.set(
            "state",
            encodeURIComponent(
              JSON.stringify({
                action: "link",
                sessionToken: sessionToken,
                redirectTo: `${window.location.origin}/dashboard?tab=connections`,
              }),
            ),
          );
          window.location.href = u.toString();
          return;
        } catch (error: any) {
          console.error("[Discord Link] Error:", error);
          aethexToast.error({
            title: "Link failed",
            description:
              error?.message ||
              "Unable to link Discord right now. Please try again.",
          });
        }
      }

      // For other providers (GitHub, Google), use Supabase's built-in linking
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
        ["github", "google", "discord"].includes(item.provider),
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
          key.includes("auth-token") ||
          key.startsWith("mock_") ||
          key.startsWith("demo_");

        Object.keys(window.localStorage)
          .filter(shouldRemove)
          .forEach((key) => {
            window.localStorage.removeItem(key);
          });

        // Clear IndexedDB
        if (window.indexedDB) {
          const dbs = [
            "supabase",
            "sb_" + (process.env.VITE_SUPABASE_URL || "").split("/").pop(),
          ];
          dbs.forEach((dbName) => {
            try {
              const req = window.indexedDB.deleteDatabase(dbName);
              req.onsuccess = () => console.log(`Cleared IndexedDB: ${dbName}`);
            } catch {}
          });
        }
      } catch {}
    }
  }, []);

  // Global handler to catch auth refresh failures (e.g. Invalid Refresh Token)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onAuthError = (ev: any) => {
      // Get message from various possible sources
      const reason = ev?.reason || ev?.error || ev?.message || ev;
      const messageStr = String(
        reason?.message ?? reason ?? ev?.toString?.() ?? "",
      ).toLowerCase();

      // Also check the error source (for Builder errors)
      const source = String(ev?.filename || ev?.source || "").toLowerCase();
      const fullMessage = messageStr + " " + source;

      // IGNORE non-auth errors from known sources:
      // - Discord SDK ("agent source", "discord", "@discord")
      // - Builder/CMS ("host", "read", "@import", "construct-stylesheets", "wix")
      // - Cross-origin issues ("frame_id", "cross-origin")
      // - Storage/misc issues
      const nonAuthPatterns = [
        "agent source",
        "discord",
        "@discord",
        "wix",
        "frame_id",
        "cross-origin",
        "host validation",
        "host is not",
        "host is not supported",
        "host is not valid",
        "insights whitelist",
        "read -",
        "read event",
        "@import rules",
        "construct-stylesheets",
        "quota exceeded",
        "storage quota",
        "security/strict-origin-when-cross-origin",
      ];

      if (nonAuthPatterns.some((pattern) => fullMessage.includes(pattern))) {
        // Just log but don't clear session
        console.debug("Non-auth error (ignoring):", fullMessage);
        return;
      }

      // Only clear session for actual auth errors
      const authErrorPatterns = [
        "invalid refresh token",
        "session expired",
        "revoked",
        "unauthorized",
        "auth/",
      ];

      if (authErrorPatterns.some((pattern) => messageStr.includes(pattern))) {
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
    console.log("=== SIGN OUT CALLED ===");

    // Step 1: Clear auth state in React
    console.log("Clearing React state...");
    setUser(null);
    setProfile(null);
    setRoles([]);
    setSession(null);
    setLoading(false);

    // Step 2: Clear localStorage and IndexedDB
    console.log("Clearing localStorage and IndexedDB...");
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem("onboarding_complete");
        window.localStorage.removeItem("aethex_onboarding_progress_v1");
        Object.keys(window.localStorage)
          .filter(
            (key) =>
              key.startsWith("sb-") ||
              key.includes("supabase") ||
              key.includes("auth-token") ||
              key.startsWith("mock_") ||
              key.startsWith("demo_"),
          )
          .forEach((key) => window.localStorage.removeItem(key));
        console.log("localStorage cleared");

        // Clear IndexedDB (where Supabase stores sessions)
        if (window.indexedDB) {
          const dbs = [
            "supabase",
            "sb_" + (process.env.VITE_SUPABASE_URL || "").split("/").pop(),
          ];
          dbs.forEach((dbName) => {
            try {
              const req = window.indexedDB.deleteDatabase(dbName);
              req.onsuccess = () => console.log(`Cleared IndexedDB: ${dbName}`);
              req.onerror = (e) =>
                console.warn(`Failed to clear IndexedDB: ${dbName}`, e);
            } catch {}
          });
        }
      } catch (e) {
        console.warn("Storage clear failed:", e);
      }
    }

    // Step 3: Call Supabase signOut (non-blocking)
    console.log("Calling Supabase signOut...");
    try {
      await supabase.auth.signOut({ scope: "local" });
      console.log("Local signOut complete");
    } catch (error) {
      console.warn("Local signOut error:", error);
    }

    // Step 4: Global sign-out in background
    supabase.auth
      .signOut({ scope: "global" })
      .then(() => {
        console.log("Global signOut complete");
      })
      .catch((error) => {
        console.warn("Global signOut error:", error);
      });

    console.log("=== SIGN OUT COMPLETE ===");
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
    const supported: SupportedOAuthProvider[] = ["github", "google", "discord"];
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
    () => checkProfileComplete(profile, roles),
    [profile, roles],
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
