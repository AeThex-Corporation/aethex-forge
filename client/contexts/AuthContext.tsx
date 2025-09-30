import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { UserProfile } from "@/lib/database.types";
import { aethexToast } from "@/lib/aethex-toast";
import {
  aethexUserService,
  aethexRoleService,
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
};

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

  useEffect(() => {
    // Add timeout to ensure loading doesn't get stuck
    const loadingTimeout = setTimeout(() => {
      console.log("Auth loading timeout - forcing loading to false");
      setLoading(false);
    }, 5000);

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

  const refreshAuthState = useCallback(async () => {
    try {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user ?? null);
    } catch (error) {
      console.warn("Failed to refresh auth state:", error);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // Wait for auth state change to update context
      try {
        await supabase.auth.getSession();
      } catch {}
    } catch (error: any) {
      console.error("SignIn error details:", error);

      let errorMessage = error.message;
      if (
        error.message?.includes("Failed to fetch") ||
        error.name === "AuthRetryableFetchError"
      ) {
        errorMessage =
          "Unable to connect to authentication service. Please check your internet connection and try again.";
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        aethexToast.success({
          title: "Account created!",
          description:
            "Please check your email to verify your account, then sign in.",
        });
      }
    } catch (error: any) {
      aethexToast.error({
        title: "Sign up failed",
        description: error.message,
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

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      aethexToast.error({
        title: "Sign out failed",
        description: error.message,
      });
      throw error;
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
      aethexToast.error({
        title: "Update failed",
        description: error.message,
      });
      throw error;
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

  const computedComplete =
    checkProfileComplete(profile) ||
    (typeof window !== "undefined" &&
      window.localStorage.getItem("onboarding_complete") === "1");

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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
