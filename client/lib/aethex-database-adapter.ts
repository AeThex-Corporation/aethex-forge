// Maps existing schema to our application needs

import { supabase } from "./supabase";
import type { Database } from "./database.types";
import { aethexToast } from "./aethex-toast";
import { mockAuth } from "./mock-auth";

// Use the existing database user profile type directly
import type { UserProfile } from "./database.types";

// Extended type that matches the existing shared database
export interface AethexUserProfile extends UserProfile {
  email?: string;
  username: string | null;
  onboarded?: boolean;
  role?: string;
  loyalty_points?: number;
  banner_url?: string;
  social_links?: any;
  skills?: string[];
}

export function checkProfileComplete(p?: AethexUserProfile | null): boolean {
  if (!p) return false;
  const hasUsername = typeof p.username === "string" && p.username.trim().length > 0;
  const hasFullName = typeof p.full_name === "string" && p.full_name.trim().length > 0;
  const hasUserType = typeof (p as any).user_type === "string" && (p as any).user_type.trim().length > 0;
  const hasExperience = typeof (p as any).experience_level === "string" && (p as any).experience_level.trim().length > 0;
  return hasUsername && hasFullName && hasUserType && hasExperience;
}

export interface AethexProject {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  status: "planning" | "in_progress" | "completed" | "on_hold";
  technologies?: string[];
  github_url?: string;
  live_url?: string;
  image_url?: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface AethexAchievement {
  id: string;
  name: string;
  description: string;
  icon?: string;
  xp_reward: number;
  badge_color?: string;
  created_at: string;
}

export interface AethexUserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
}

function isTableMissing(err: any): boolean {
  const msg = String(err?.message || err?.hint || err?.details || "");
  return (
    err?.code === "42P01" || // undefined_table
    msg.includes('relation "') ||
    msg.includes("does not exist") ||
    msg.includes("table")
  );
}

// User Profile Services
export const aethexUserService = {
  async getCurrentUser(): Promise<AethexUserProfile | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      // If table missing, fall back to mock for local dev only
      if (isTableMissing(error)) {
        const mock = await mockAuth.getUserProfile(user.id as any);
        if (mock)
          return { ...(mock as any), email: user.email } as AethexUserProfile;
        const created = await mockAuth.updateProfile(
          user.id as any,
          {
            username: user.email?.split("@")[0] || "user",
            email: user.email || "",
            role: "member",
            onboarded: true,
          } as any,
        );
        return { ...(created as any), email: user.email } as AethexUserProfile;
      }
      // If no row, create initial DB profile instead of mock
      if ((error as any)?.code === "PGRST116") {
        const created = await this.createInitialProfile(user.id, {
          username: user.email?.split("@")[0] || "user",
          full_name: user.email?.split("@")[0] || "user",
        });
        return created;
      }
      throw error;
    }

    if (!data || Object.keys(data || {}).length === 0) {
      const created = await this.createInitialProfile(user.id, {
        username: user.email?.split("@")[0] || "user",
        full_name: user.email?.split("@")[0] || "user",
      });
      return created;
    }

    return {
      ...data,
      email: user.email,
      username: (data as any).username || user.email?.split("@")[0] || "user",
      onboarded: true,
      role: "member",
      loyalty_points: 0,
    } as AethexUserProfile;
  },

  async updateProfile(
    userId: string,
    updates: Partial<AethexUserProfile>,
  ): Promise<AethexUserProfile | null> {
    const { data, error } = await supabase
      .from("user_profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      if (isTableMissing(error)) {
        const mock = await mockAuth.updateProfile(
          userId as any,
          updates as any,
        );
        return mock as unknown as AethexUserProfile;
      }
      if ((error as any)?.code === "PGRST116") {
        const { data: upserted, error: upsertError } = await supabase
          .from("user_profiles")
          .upsert(
            { id: userId, user_type: "community_member", ...updates } as any,
            { onConflict: "id" },
          )
          .select()
          .single();
        if (upsertError) throw upsertError;
        return upserted as AethexUserProfile;
      }
      throw error;
    }

    return data as AethexUserProfile;
  },

  async createInitialProfile(
    userId: string,
    profileData: Partial<AethexUserProfile>,
  ): Promise<AethexUserProfile | null> {
    // Only insert fields that exist in the actual database schema
    const { data, error } = await supabase
      .from("user_profiles")
      .insert({
        id: userId,
        username: profileData.username || `user_${Date.now()}`,
        user_type: (profileData as any).user_type || "community_member",
        experience_level: (profileData as any).experience_level || "beginner",
        full_name: profileData.full_name,
        bio: profileData.bio,
        location: profileData.location,
        website_url: (profileData as any).website_url,
        github_url: profileData.github_url,
        twitter_url: profileData.twitter_url,
        linkedin_url: profileData.linkedin_url,
        banner_url: (profileData as any).banner_url,
        level: 1,
        total_xp: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.warn("Error creating profile, attempting mock fallback:", error);
      if (isTableMissing(error)) {
        const mock = await mockAuth.updateProfile(
          userId as any,
          {
            username: profileData.username || `user_${Date.now()}`,
            full_name: profileData.full_name,
            bio: profileData.bio,
            location: profileData.location,
            linkedin_url: profileData.linkedin_url as any,
            github_url: profileData.github_url as any,
            twitter_url: profileData.twitter_url as any,
            level: 1,
            total_xp: 0,
          } as any,
        );

        return {
          ...(mock as any),
          onboarded: true,
          role: "member",
          loyalty_points: 0,
        } as any;
      }
      throw error;
    }

    return {
      ...data,
      onboarded: true,
      role: "member",
      loyalty_points: 0,
    } as AethexUserProfile;
  },

  async addUserInterests(userId: string, interests: string[]): Promise<void> {
    // First, delete existing interests (ignore failures when table missing)
    await supabase
      .from("user_interests")
      .delete()
      .eq("user_id", userId)
      .catch(() => undefined);

    // Insert new interests
    const interestRows = interests.map((interest) => ({
      user_id: userId,
      interest,
    }));

    const { error } = await supabase
      .from("user_interests")
      .insert(interestRows);

    if (error) {
      if (isTableMissing(error)) return;
      throw error;
    }
  },

  async getUserInterests(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from("user_interests")
      .select("interest")
      .eq("user_id", userId);

    if (error) {
      console.warn("Error fetching interests:", error);
      return [];
    }

    return (data as any[]).map((item: any) => item.interest);
  },
};

// Project Services
export const aethexProjectService = {
  async getUserProjects(userId: string): Promise<AethexProject[]> {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      if (isTableMissing(error)) return [];
      throw error;
    }

    return (data as AethexProject[]) || [];
  },

  async createProject(
    project: Omit<AethexProject, "id" | "created_at" | "updated_at">,
  ): Promise<AethexProject | null> {
    const { data, error } = await supabase
      .from("projects")
      .insert(project)
      .select()
      .single();

    if (error) {
      if (isTableMissing(error)) return null;
      throw error;
    }

    return data as AethexProject;
  },

  async updateProject(
    projectId: string,
    updates: Partial<AethexProject>,
  ): Promise<AethexProject | null> {
    const { data, error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", projectId)
      .select()
      .single();

    if (error) {
      if (isTableMissing(error)) return null;
      throw error;
    }

    return data as AethexProject;
  },

  async deleteProject(projectId: string): Promise<boolean> {
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (error) {
      if (isTableMissing(error)) return false;
      throw error;
    }

    return true;
  },

  async getAllProjects(limit = 10): Promise<AethexProject[]> {
    const { data, error } = await supabase
      .from("projects")
      .select(
        `
        *,
        profiles!projects_user_id_fkey (
          username,
          full_name,
          avatar_url
        )
      `,
      )
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.warn("Error fetching all projects:", error);
      return [];
    }

    return data as AethexProject[];
  },
};

// Achievement Services (maps to existing achievements table)
export const aethexAchievementService = {
  async getAllAchievements(): Promise<AethexAchievement[]> {
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .order("xp_reward", { ascending: false });

    if (error) {
      console.warn("Error fetching achievements:", error);
      return [];
    }

    return data as AethexAchievement[];
  },

  async getUserAchievements(userId: string): Promise<AethexAchievement[]> {
    const { data, error } = await supabase
      .from("user_achievements")
      .select(
        `
        achievement_id,
        achievements (*)
      `,
      )
      .eq("user_id", userId);

    if (error) {
      console.warn("Error fetching user achievements:", error);
      return [];
    }

    return (data as any[])
      .map((item) => (item as any).achievements)
      .filter(Boolean) as AethexAchievement[];
  },

  async awardAchievement(userId: string, achievementId: string): Promise<void> {
    const { error } = await supabase.from("user_achievements").insert({
      user_id: userId,
      achievement_id: achievementId,
    });

    if (error && error.code !== "23505") {
      // Ignore duplicate key error
      if (isTableMissing(error)) return;
      console.warn("Error awarding achievement:", error);
      throw error;
    }

    // Get achievement details for toast
    const { data: achievement } = await supabase
      .from("achievements")
      .select("*")
      .eq("id", achievementId)
      .single();

    if (achievement) {
      aethexToast.aethex({
        title: "Achievement Unlocked! 🎉",
        description: `${(achievement as any).icon} ${(achievement as any).name} - ${(achievement as any).description}`,
        duration: 8000,
      });

      // Update user's total XP and level
      await this.updateUserXPAndLevel(userId, (achievement as any).xp_reward);
    }
  },

  async updateUserXPAndLevel(userId: string, xpGained: number): Promise<void> {
    // Get current user data
    const { data: profile, error } = await supabase
      .from("user_profiles")
      .select("total_xp, level, loyalty_points")
      .eq("id", userId)
      .single();

    if (error || !profile) {
      if (isTableMissing(error)) return;
      console.log("Profile not found or missing XP fields, skipping XP update");
      return;
    }

    const newTotalXP = ((profile as any).total_xp || 0) + xpGained;
    const newLevel = Math.floor(newTotalXP / 1000) + 1; // 1000 XP per level
    const newLoyaltyPoints = ((profile as any).loyalty_points || 0) + xpGained;

    // Update profile (only update existing fields)
    const updates: any = {};
    if ("total_xp" in (profile as any)) updates.total_xp = newTotalXP;
    if ("level" in (profile as any)) updates.level = newLevel;
    if ("loyalty_points" in (profile as any))
      updates.loyalty_points = newLoyaltyPoints;

    if (Object.keys(updates).length > 0) {
      await supabase.from("user_profiles").update(updates).eq("id", userId);
    }

    // Check for level-up achievements
    if (newLevel > ((profile as any).level || 1)) {
      if (newLevel >= 5) {
        const levelUpAchievement = await supabase
          .from("achievements")
          .select("id")
          .eq("name", "Level Master")
          .single();

        if (levelUpAchievement.data) {
          await this.awardAchievement(
            userId,
            (levelUpAchievement.data as any).id,
          );
        }
      }
    }
  },

  async checkAndAwardOnboardingAchievement(userId: string): Promise<void> {
    const { data: achievement } = await supabase
      .from("achievements")
      .select("id")
      .eq("name", "AeThex Explorer")
      .single();

    if (achievement) {
      await this.awardAchievement(userId, (achievement as any).id);
    }
  },

  async checkAndAwardProjectAchievements(userId: string): Promise<void> {
    const projects = await aethexProjectService.getUserProjects(userId);

    // First project achievement
    if (projects.length >= 1) {
      const { data: achievement } = await supabase
        .from("achievements")
        .select("id")
        .eq("name", "Portfolio Creator")
        .single();

      if (achievement) {
        await this.awardAchievement(userId, (achievement as any).id);
      }
    }

    // Project master achievement
    const completedProjects = projects.filter((p) => p.status === "completed");
    if (completedProjects.length >= 10) {
      const { data: achievement } = await supabase
        .from("achievements")
        .select("id")
        .eq("name", "Project Master")
        .single();

      if (achievement) {
        await this.awardAchievement(userId, (achievement as any).id);
      }
    }
  },
};

// Notification Service (uses existing notifications table)
export const aethexNotificationService = {
  async getUserNotifications(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.warn("Error fetching notifications:", error);
      return [];
    }

    return data as any[];
  },

  async markAsRead(notificationId: string): Promise<void> {
    try {
      await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId);
    } catch {}
  },

  async createNotification(
    userId: string,
    type: string,
    title: string,
    message: string,
  ): Promise<void> {
    try {
      await supabase.from("notifications").insert({
        user_id: userId,
        type,
        title,
        message,
      });
    } catch {}
  },
};

// Real-time subscriptions
export const aethexRealtimeService = {
  subscribeToUserNotifications(
    userId: string,
    callback: (notification: any) => void,
  ) {
    const client: any = supabase as any;
    if (!client || typeof client.channel !== "function") {
      return { unsubscribe: () => {} } as any;
    }
    return client
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        callback,
      )
      .subscribe();
  },

  subscribeToProjects(callback: (project: any) => void) {
    const client: any = supabase as any;
    if (!client || typeof client.channel !== "function") {
      return { unsubscribe: () => {} } as any;
    }
    return client
      .channel("projects")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "projects",
        },
        callback,
      )
      .subscribe();
  },
};

// Role Services (with Supabase table fallback)
export const aethexRoleService = {
  async getUserRoles(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);
      if (!error && Array.isArray(data) && data.length) {
        return (data as any[]).map((r) => (r as any).role);
      }
    } catch {}

    try {
      const { data: authData } = await supabase.auth.getUser();
      const email = authData?.user?.email?.toLowerCase();
      if (email === "mrpiglr@gmail.com") return ["owner", "admin", "founder"];
    } catch {}

    try {
      const raw = localStorage.getItem("mock_roles");
      const map = raw ? JSON.parse(raw) : {};
      if (map[userId]) return map[userId];
    } catch {}

    return ["member"];
  },

  async setUserRoles(userId: string, roles: string[]): Promise<void> {
    try {
      const rows = roles.map((role) => ({ user_id: userId, role }));
      const { error } = await supabase.from("user_roles").upsert(
        rows as any,
        {
          onConflict: "user_id,role",
        } as any,
      );
      if (!error) return;
    } catch {}

    try {
      const raw = localStorage.getItem("mock_roles");
      const map = raw ? JSON.parse(raw) : {};
      map[userId] = roles;
      localStorage.setItem("mock_roles", JSON.stringify(map));
    } catch {}
  },
};
