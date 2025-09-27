import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { UserProfile } from "@/lib/database.types";
import { aethexToast } from "@/lib/aethex-toast";
import {
  aethexUserService,
  aethexRoleService,
  type AethexUserProfile,
} from "@/lib/aethex-database-adapter";

interface AuthContextType {
  user: User | null;
  profile: AethexUserProfile | null;
  roles: string[];
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    userData?: Partial<AethexUserProfile>,
  ) => Promise<void>;
  signInWithOAuth: (provider: "github" | "google") => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<AethexUserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
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
          const seeded = Array.from(new Set(["owner", "admin", "founder", ...r]));
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

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
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
      throw new Error(errorMessage);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    userData?: Partial<AethexUserProfile>,
  ) => {
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
    }
  };

  const signInWithOAuth = async (provider: "github" | "google") => {
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
      setProfile(updatedProfile);
      aethexToast.success({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error: any) {
      aethexToast.error({
        title: "Update failed",
        description: error.message,
      });
      throw error;
    }
  };

  const value = {
    user,
    profile,
    roles,
    session,
    loading,
    signIn,
    signUp,
    signInWithOAuth,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
