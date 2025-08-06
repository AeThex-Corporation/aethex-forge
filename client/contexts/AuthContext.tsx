import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { UserProfile } from '@/lib/database.types';
import { aethexToast } from '@/lib/aethex-toast';
import { DemoStorageService } from '@/lib/demo-storage';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData?: Partial<UserProfile>) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if Supabase is configured
    if (!isSupabaseConfigured) {
      console.warn('Supabase is not configured. Please set up your environment variables.');
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    }).catch((error) => {
      console.error('Error getting session:', error);
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
      }
      setLoading(false);

      // Show toast notifications for auth events
      if (event === 'SIGNED_IN') {
        aethexToast.success({
          title: 'Welcome back!',
          description: 'Successfully signed in to AeThex OS'
        });
      } else if (event === 'SIGNED_OUT') {
        aethexToast.info({
          title: 'Signed out',
          description: 'Come back soon!'
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    if (!isSupabaseConfigured) {
      // Initialize demo data and get profile
      DemoStorageService.initializeDemoData();
      const demoProfile = DemoStorageService.getUserProfile();
      setProfile(demoProfile);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      aethexToast.warning({
        title: 'Demo Mode',
        description: 'Supabase not configured. This is a demo - please set up your Supabase project.'
      });
      // Simulate successful login for demo
      setTimeout(() => {
        setUser({ id: 'demo-user', email } as User);
        setSession({ user: { id: 'demo-user', email } } as Session);
      }, 500);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error: any) {
      aethexToast.error({
        title: 'Sign in failed',
        description: error.message
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData?: Partial<UserProfile>) => {
    if (!isSupabaseConfigured) {
      aethexToast.warning({
        title: 'Demo Mode',
        description: 'Supabase not configured. This is a demo - please set up your Supabase project.'
      });
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user && userData) {
        // Create user profile after successful signup
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            ...userData,
          });

        if (profileError) throw profileError;

        aethexToast.success({
          title: 'Account created!',
          description: 'Please check your email to verify your account'
        });
      }
    } catch (error: any) {
      aethexToast.error({
        title: 'Sign up failed',
        description: error.message
      });
      throw error;
    }
  };

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      setUser(null);
      setSession(null);
      setProfile(null);
      aethexToast.info({
        title: 'Signed out',
        description: 'Demo session ended'
      });
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      aethexToast.error({
        title: 'Sign out failed',
        description: error.message
      });
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');

    if (!isSupabaseConfigured) {
      // Use demo storage
      const updatedProfile = DemoStorageService.updateUserProfile(updates);
      setProfile(updatedProfile);
      aethexToast.success({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully'
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      aethexToast.success({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully'
      });
    } catch (error: any) {
      aethexToast.error({
        title: 'Update failed',
        description: error.message
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
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
