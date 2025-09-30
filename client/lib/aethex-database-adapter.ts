// Maps existing schema to our application needs

import { supabase, isSupabaseConfigured } from "./supabase";
import type { Database } from "./database.types";
import { aethexToast } from "./aethex-toast";

// Use the existing database user profile type directly
import type { UserProfile } from "./database.types";

// Extended type that matches the existing shared database
export interface AethexUserProfile extends UserProfile {
  email?: string;
  username: string | null;
  onboarded?: boolean;
  role?: string;
  loyalty_points?: number;
  social_links?: any;
  skills?: string[];
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const ensureSupabase = () => {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
    );
  }
};

export function checkProfileComplete(p?: AethexUserProfile | null): boolean {
  if (!p) return false;

  if ((p as any).onboarded === true) {
    return true;
  }

  const hasIdentity =
    isNonEmptyString(p.username) || isNonEmptyString(p.full_name);
  const hasProfileCore =
    isNonEmptyString(p.full_name) &&
    isNonEmptyString((p as any).user_type) &&
    isNonEmptyString((p as any).experience_level);
  const hasStory = isNonEmptyString(p.bio) || isNonEmptyString(p.location);
  const hasPresence =
    isNonEmptyString(p.avatar_url) ||
    isNonEmptyString((p as any).banner_url) ||
    isNonEmptyString((p as any).website_url) ||
    isNonEmptyString(p.github_url) ||
    isNonEmptyString(p.linkedin_url) ||
    isNonEmptyString(p.twitter_url);

  if (hasIdentity && hasProfileCore) {
    return true;
  }

  if (hasIdentity && hasStory && hasPresence) {
    return true;
  }

  return false;
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
    ensureSupabase();

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
      if ((error as any)?.code === "PGRST116") {
        return await this.createInitialProfile(user.id, {
          username: user.email?.split("@")[0] || "user",
          full_name: user.email?.split("@")[0] || "user",
        });
      }

      if (isTableMissing(error)) {
        throw new Error(
          "Supabase table \"user_profiles\" is missing. Please run the required migrations.",
        );
      }

      throw error;
    }

    if (!data || Object.keys(data || {}).length === 0) {
      return await this.createInitialProfile(user.id, {
        username: user.email?.split("@")[0] || "user",
        full_name: user.email?.split("@")[0] || "user",
      });
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

  async getProfileById(userId: string): Promise<AethexUserProfile | null> {
    if (!userId) return null;
    ensureSupabase();

    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      if ((error as any)?.code === "PGRST116") {
        return null;
      }

      if (isTableMissing(error)) {
        throw new Error(
          "Supabase table \"user_profiles\" is missing. Please run the required migrations.",
        );
      }

      throw error;
    }

    return data as AethexUserProfile;
  },

  async listProfiles(limit = 50): Promise<AethexUserProfile[]> {
    ensureSupabase();

    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(limit);

    if (error) {
      if (isTableMissing(error)) {
        throw new Error(
          "Supabase table \"user_profiles\" is missing. Please run the required migrations.",
        );
      }
      throw error;
    }

    return ((data as any[]) || []).map((row) =>
      ({
        ...(row as AethexUserProfile),
        user_type: (row as any).user_type || "community_member",
        experience_level: (row as any).experience_level || "beginner",
      }) as AethexUserProfile,
    );
  },

  async updateProfile(
    userId: string,
    updates: Partial<AethexUserProfile>,
  ): Promise<AethexUserProfile | null> {
    ensureSupabase();

    const { data, error } = await supabase
      .from("user_profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
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

      if (isTableMissing(error)) {
        throw new Error(
          "Supabase table \"user_profiles\" is missing. Please run the required migrations.",
        );
      }

      throw error;
    }

    return data as AethexUserProfile;
  },

  async createInitialProfile(
    userId: string,
    profileData: Partial<AethexUserProfile>,
  ): Promise<AethexUserProfile | null> {
    ensureSupabase();

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
      if (isTableMissing(error)) {
        throw new Error(
          "Supabase table \"user_profiles\" is missing. Please run the required migrations.",
        );
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
    if (!isSupabaseConfigured) {
      try {
        localStorage.setItem(
          `mock_interests_${userId}`,
          JSON.stringify(interests || []),
        );
      } catch {}
      return;
    }
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
    if (!isSupabaseConfigured) {
      try {
        return JSON.parse(
          localStorage.getItem(`mock_interests_${userId}`) || "[]",
        );
      } catch {
        return [];
      }
    }
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

// Achievement Services (maps to existing achievements table) with robust local fallbacks
export const aethexAchievementService = {
  defaultAchievements(): AethexAchievement[] {
    return [
      {
        id: "ach_welcome",
        name: "Welcome to AeThex",
        description: "Completed onboarding and set up your profile",
        icon: "👋",
        xp_reward: 100,
        badge_color: "#10b981",
        created_at: new Date().toISOString(),
      },
      {
        id: "ach_explorer",
        name: "AeThex Explorer",
        description: "Visited key sections and explored the app",
        icon: "🧭",
        xp_reward: 150,
        badge_color: "#3b82f6",
        created_at: new Date().toISOString(),
      },
      {
        id: "ach_level_master",
        name: "Level Master",
        description: "Reached level 5",
        icon: "🏆",
        xp_reward: 250,
        badge_color: "#f59e0b",
        created_at: new Date().toISOString(),
      },
      {
        id: "ach_portfolio",
        name: "Portfolio Creator",
        description: "Created your first project",
        icon: "📁",
        xp_reward: 200,
        badge_color: "#8b5cf6",
        created_at: new Date().toISOString(),
      },
      {
        id: "ach_project_master",
        name: "Project Master",
        description: "Completed 10 projects",
        icon: "🛠️",
        xp_reward: 500,
        badge_color: "#ef4444",
        created_at: new Date().toISOString(),
      },
    ];
  },

  loadLocalAchievements(): AethexAchievement[] {
    try {
      const raw = localStorage.getItem("demo_achievements");
      if (raw) return JSON.parse(raw);
    } catch {}
    const defaults = this.defaultAchievements();
    try {
      localStorage.setItem("demo_achievements", JSON.stringify(defaults));
    } catch {}
    return defaults;
  },

  saveUserAchievement(userId: string, achievementId: string) {
    try {
      const key = `demo_user_achievements_${userId}`;
      const raw = localStorage.getItem(key);
      const ids: string[] = raw ? JSON.parse(raw) : [];
      if (!ids.includes(achievementId)) ids.push(achievementId);
      localStorage.setItem(key, JSON.stringify(ids));
    } catch {}
  },

  async getAllAchievements(): Promise<AethexAchievement[]> {
    try {
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .order("xp_reward", { ascending: false });
      if (!error && Array.isArray(data) && data.length) {
        return data as AethexAchievement[];
      }
    } catch {}
    return this.loadLocalAchievements();
  },

  async getUserAchievements(userId: string): Promise<AethexAchievement[]> {
    try {
      const { data, error } = await supabase
        .from("user_achievements")
        .select(
          `
        achievement_id,
        achievements (*)
      `,
        )
        .eq("user_id", userId);
      if (!error && Array.isArray(data)) {
        const list = (data as any[])
          .map((item) => (item as any).achievements)
          .filter(Boolean) as AethexAchievement[];
        if (list.length) return list;
      }
    } catch {}

    // Local fallback
    const key = `demo_user_achievements_${userId}`;
    let ids: string[] = [];
    try {
      ids = JSON.parse(localStorage.getItem(key) || "[]");
    } catch {}
    const all = await this.getAllAchievements();
    const byId = new Map(all.map((a) => [a.id, a] as const));
    return ids.map((id) => byId.get(id)).filter(Boolean) as AethexAchievement[];
  },

  async awardAchievement(userId: string, achievementId: string): Promise<void> {
    let usedLocal = false;
    try {
      const { error } = await supabase.from("user_achievements").insert({
        user_id: userId,
        achievement_id: achievementId,
      });
      if (error && error.code !== "23505") {
        if (!isTableMissing(error)) throw error;
        usedLocal = true;
      }
    } catch {
      usedLocal = true;
    }

    let achievement: AethexAchievement | null = null;
    if (!usedLocal) {
      try {
        const { data } = await supabase
          .from("achievements")
          .select("*")
          .eq("id", achievementId)
          .single();
        achievement = (data as any) || null;
      } catch {}
    }

    if (usedLocal || !achievement) {
      this.saveUserAchievement(userId, achievementId);
      const all = await this.getAllAchievements();
      achievement = all.find((a) => a.id === achievementId) || null;
    }

    if (achievement) {
      aethexToast.aethex({
        title: "Achievement Unlocked! 🎉",
        description: `${achievement.icon || "🏅"} ${achievement.name} - ${achievement.description}`,
        duration: 8000,
      });
      await this.updateUserXPAndLevel(userId, achievement.xp_reward);
    }
  },

  async updateUserXPAndLevel(userId: string, xpGained: number): Promise<void> {
    try {
      const { data: profile, error } = await supabase
        .from("user_profiles")
        .select("total_xp, level, loyalty_points")
        .eq("id", userId)
        .single();

      if (!error && profile) {
        const newTotalXP = ((profile as any).total_xp || 0) + xpGained;
        const newLevel = Math.floor(newTotalXP / 1000) + 1;
        const newLoyaltyPoints =
          ((profile as any).loyalty_points || 0) + xpGained;

        const updates: any = {};
        if ("total_xp" in (profile as any)) updates.total_xp = newTotalXP;
        if ("level" in (profile as any)) updates.level = newLevel;
        if ("loyalty_points" in (profile as any))
          updates.loyalty_points = newLoyaltyPoints;

        if (Object.keys(updates).length > 0) {
          await supabase.from("user_profiles").update(updates).eq("id", userId);
        }

        if (newLevel > ((profile as any).level || 1) && newLevel >= 5) {
          // Try to find Level Master by name, fall back to default id
          try {
            const { data } = await supabase
              .from("achievements")
              .select("id")
              .eq("name", "Level Master")
              .single();
            const id = (data as any)?.id || "ach_level_master";
            await this.awardAchievement(userId, id);
          } catch {
            await this.awardAchievement(userId, "ach_level_master");
          }
        }
        return;
      }
    } catch {}

    // Local fallback using mock profile persistence
    try {
      const current = await mockAuth.getUserProfile(userId as any);
      const total_xp = ((current as any)?.total_xp || 0) + xpGained;
      const level = Math.floor(total_xp / 1000) + 1;
      const loyalty_points = ((current as any)?.loyalty_points || 0) + xpGained;
      await mockAuth.updateProfile(
        userId as any,
        {
          total_xp,
          level,
          loyalty_points,
        } as any,
      );
      if (level > ((current as any)?.level || 1) && level >= 5) {
        await this.awardAchievement(userId, "ach_level_master");
      }
    } catch {}
  },

  async checkAndAwardOnboardingAchievement(userId: string): Promise<void> {
    let awarded = false;
    try {
      const resp = await fetch(`/api/achievements/award`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          achievement_names: ["Welcome to AeThex", "AeThex Explorer"],
        }),
      });
      awarded = resp.ok;
    } catch {}

    if (!awarded) {
      const all = await this.getAllAchievements();
      const byName = new Map(all.map((a) => [a.name, a.id] as const));
      const ids = [
        byName.get("Welcome to AeThex") || "ach_welcome",
        byName.get("AeThex Explorer") || "ach_explorer",
      ];
      for (const id of ids) await this.awardAchievement(userId, id);
    }

    aethexToast.aethex({
      title: "Achievement Unlocked! 🎉",
      description: "Welcome to AeThex - Profile setup complete",
      duration: 8000,
    });
  },

  async checkAndAwardProjectAchievements(userId: string): Promise<void> {
    const projects = await aethexProjectService.getUserProjects(userId);

    if (projects.length >= 1) {
      // Portfolio Creator
      try {
        const { data } = await supabase
          .from("achievements")
          .select("id")
          .eq("name", "Portfolio Creator")
          .single();
        const id = (data as any)?.id || "ach_portfolio";
        await this.awardAchievement(userId, id);
      } catch {
        await this.awardAchievement(userId, "ach_portfolio");
      }
    }

    const completed = projects.filter((p) => p.status === "completed");
    if (completed.length >= 10) {
      try {
        const { data } = await supabase
          .from("achievements")
          .select("id")
          .eq("name", "Project Master")
          .single();
        const id = (data as any)?.id || "ach_project_master";
        await this.awardAchievement(userId, id);
      } catch {
        await this.awardAchievement(userId, "ach_project_master");
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
    // Try roles via join (role_id -> roles.name)
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role_id, roles ( name )")
        .eq("user_id", userId);
      if (!error && Array.isArray(data) && data.length) {
        const names = (data as any[])
          .map((r) => (r as any).roles?.name)
          .filter(Boolean);
        if (names.length) return names;
      }
    } catch {}

    // Try legacy text column 'role'
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);
      if (!error && Array.isArray(data) && data.length) {
        return (data as any[]).map((r) => (r as any).role);
      }
    } catch {}

    // Owner email fallback
    try {
      const { data: authData } = await supabase.auth.getUser();
      const email = authData?.user?.email?.toLowerCase();
      if (email === "mrpiglr@gmail.com") return ["owner", "admin", "founder"];
    } catch {}

    // Mock/local fallback
    try {
      const raw = localStorage.getItem("mock_roles");
      const map = raw ? JSON.parse(raw) : {};
      if (map[userId]) return map[userId];
    } catch {}

    return ["member"];
  },

  async setUserRoles(userId: string, roles: string[]): Promise<void> {
    // Prefer normalized roles table if present
    try {
      // Ensure roles exist and fetch their ids
      const wanted = Array.from(new Set(roles.map((r) => r.toLowerCase())));
      // Insert missing roles
      await supabase
        .from("roles")
        .upsert(
          wanted.map((name) => ({ name }) as any) as any,
          { onConflict: "name" } as any,
        )
        .catch(() => undefined);
      // Fetch role ids
      const { data: roleRows } = await supabase
        .from("roles")
        .select("id, name")
        .in("name", wanted as any);
      const idRows = (roleRows || []).map((r: any) => ({
        user_id: userId,
        role_id: r.id,
      }));
      if (idRows.length) {
        await supabase.from("user_roles").upsert(
          idRows as any,
          {
            onConflict: "user_id,role_id" as any,
          } as any,
        );
        return;
      }
    } catch {}

    // Legacy text column fallback
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

    // Local fallback
    try {
      const raw = localStorage.getItem("mock_roles");
      const map = raw ? JSON.parse(raw) : {};
      map[userId] = roles;
      localStorage.setItem("mock_roles", JSON.stringify(map));
    } catch {}
  },
};
