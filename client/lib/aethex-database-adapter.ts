// Database adapter for existing AeThex community platform
// Maps existing schema to our application needs

import { supabase } from "./supabase";
import type { Database } from "./database.types";
import { aethexToast } from "./aethex-toast";

// Extended user profile type that matches existing + new schema
export interface AethexUserProfile {
  id: string;
  username: string;
  email?: string;
  role: string;
  onboarded: boolean;
  bio?: string;
  skills?: string[];
  avatar_url?: string;
  banner_url?: string;
  social_links?: any;
  loyalty_points: number;
  created_at: string;
  updated_at: string;
  // New AeThex app fields
  user_type?: "game_developer" | "client" | "community_member" | "customer";
  experience_level?: "beginner" | "intermediate" | "advanced" | "expert";
  full_name?: string;
  location?: string;
  website_url?: string;
  github_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  total_xp?: number;
  level?: number;
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
      console.error("Error fetching user profile:", error);
      return null;
    }

    return data as AethexUserProfile;
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
      console.error("Error updating profile:", error);
      throw error;
    }

    return data as AethexUserProfile;
  },

  async createInitialProfile(
    userId: string,
    profileData: Partial<AethexUserProfile>,
  ): Promise<AethexUserProfile | null> {
    const { data, error } = await supabase
      .from("user_profiles")
      .insert({
        id: userId,
        username: profileData.username || `user_${Date.now()}`,
        user_type: profileData.user_type || "community_member",
        experience_level: profileData.experience_level || "beginner",
        full_name: profileData.full_name,
        email: profileData.email,
        ...profileData,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating profile:", error);
      throw error;
    }

    return data as AethexUserProfile;
  },

  async addUserInterests(userId: string, interests: string[]): Promise<void> {
    // First, delete existing interests
    await supabase.from("user_interests").delete().eq("user_id", userId);

    // Insert new interests
    const interestRows = interests.map((interest) => ({
      user_id: userId,
      interest,
    }));

    const { error } = await supabase
      .from("user_interests")
      .insert(interestRows);

    if (error) {
      console.error("Error adding interests:", error);
      throw error;
    }
  },

  async getUserInterests(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from("user_interests")
      .select("interest")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching interests:", error);
      return [];
    }

    return data.map((item) => item.interest);
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
      console.error("Error fetching projects:", error);
      return [];
    }

    return data as AethexProject[];
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
      console.error("Error creating project:", error);
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
      console.error("Error updating project:", error);
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
      console.error("Error deleting project:", error);
      return false;
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
      console.error("Error fetching all projects:", error);
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
      console.error("Error fetching achievements:", error);
      return [];
    }

    return data as AethexAchievement[];
  },

  async getUserAchievements(userId: string): Promise<AethexAchievement[]> {
    const { data, error } = await supabase
      .from("user_achievements")
      .select(
        `
        unlocked_at,
        achievements (*)
      `,
      )
      .eq("user_id", userId)
      .order("unlocked_at", { ascending: false });

    if (error) {
      console.error("Error fetching user achievements:", error);
      return [];
    }

    return data
      .map((item) => item.achievements)
      .filter(Boolean) as AethexAchievement[];
  },

  async awardAchievement(userId: string, achievementId: string): Promise<void> {
    const { error } = await supabase.from("user_achievements").insert({
      user_id: userId,
      achievement_id: achievementId,
    });

    if (error && error.code !== "23505") {
      // Ignore duplicate key error
      console.error("Error awarding achievement:", error);
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
        description: `${achievement.icon} ${achievement.name} - ${achievement.description}`,
        duration: 8000,
      });

      // Update user's total XP and level
      await this.updateUserXPAndLevel(userId, achievement.xp_reward);
    }
  },

  async updateUserXPAndLevel(userId: string, xpGained: number): Promise<void> {
    // Get current user data
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("total_xp, level, loyalty_points")
      .eq("id", userId)
      .single();

    if (!profile) return;

    const newTotalXP = (profile.total_xp || 0) + xpGained;
    const newLevel = Math.floor(newTotalXP / 1000) + 1; // 1000 XP per level
    const newLoyaltyPoints = (profile.loyalty_points || 0) + xpGained;

    // Update profile
    await supabase
      .from("user_profiles")
      .update({
        total_xp: newTotalXP,
        level: newLevel,
        loyalty_points: newLoyaltyPoints,
      })
      .eq("id", userId);

    // Check for level-up achievements
    if (newLevel > (profile.level || 1)) {
      if (newLevel >= 5) {
        const levelUpAchievement = await supabase
          .from("achievements")
          .select("id")
          .eq("name", "Level Master")
          .single();

        if (levelUpAchievement.data) {
          await this.awardAchievement(userId, levelUpAchievement.data.id);
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
      await this.awardAchievement(userId, achievement.id);
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
        await this.awardAchievement(userId, achievement.id);
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
        await this.awardAchievement(userId, achievement.id);
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
      console.error("Error fetching notifications:", error);
      return [];
    }

    return data;
  },

  async markAsRead(notificationId: string): Promise<void> {
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);
  },

  async createNotification(
    userId: string,
    type: string,
    data: any,
  ): Promise<void> {
    await supabase.from("notifications").insert({
      user_id: userId,
      type,
      data,
    });
  },
};

// Real-time subscriptions
export const aethexRealtimeService = {
  subscribeToUserNotifications(
    userId: string,
    callback: (notification: any) => void,
  ) {
    return supabase
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
    return supabase
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
