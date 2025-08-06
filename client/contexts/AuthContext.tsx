import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { UserProfile } from "@/lib/database.types";
import { aethexToast } from "@/lib/aethex-toast";
import {
  aethexUserService,
  aethexAchievementService,
  type AethexUserProfile,
} from "@/lib/aethex-database-adapter";

interface AuthContextType {
  user: User | null;
  profile: AethexUserProfile | null;
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
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserProfile(session.user.id);
        }
        setLoading(false);
      })
      .catch((error) => {
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
        const profile = await fetchUserProfile(session.user.id);

        // Create profile for new OAuth users
        if (!profile && session.user.app_metadata?.provider) {
          try {
            await aethexUserService.createInitialProfile(session.user.id, {
              username:
                session.user.user_metadata?.user_name ||
                session.user.user_metadata?.preferred_username ||
                session.user.email?.split("@")[0] ||
                `user_${Date.now()}`,
              full_name:
                session.user.user_metadata?.full_name ||
                session.user.user_metadata?.name ||
                session.user.email?.split("@")[0],
              email: session.user.email,
              avatar_url: session.user.user_metadata?.avatar_url,
              user_type: "community_member", // Default for OAuth users
              experience_level: "beginner",
            });

            // Fetch the newly created profile
            await fetchUserProfile(session.user.id);

            // Award onboarding achievement for OAuth users
            await aethexAchievementService.checkAndAwardOnboardingAchievement(
              session.user.id,
            );
          } catch (error) {
            console.error("Error creating OAuth user profile:", error);
          }
        }
      } else {
        setProfile(null);
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
      return userProfile;
    } catch (error) {
      console.error("Error fetching user profile:", error);
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
      aethexToast.error({
        title: "Sign in failed",
        description: error.message,
      });
      throw error;
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

      if (data.user && userData) {
        // Create user profile using AeThex adapter
        await aethexUserService.createInitialProfile(data.user.id, {
          ...userData,
          email,
        });

        aethexToast.success({
          title: "Account created!",
          description: "Please check your email to verify your account",
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
          redirectTo: `${window.location.origin}/dashboard`,
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
