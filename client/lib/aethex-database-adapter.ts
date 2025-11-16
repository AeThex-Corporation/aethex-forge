// Maps existing schema to our application needs

import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Database } from "./database.types";

// Use the existing database user profile type directly
import type { UserProfile } from "./database.types";

// API Base URL for fetch requests
const API_BASE = import.meta.env.VITE_API_BASE || "";

// Extended type that matches the existing shared database
export interface AethexUserProfile extends UserProfile {
  email?: string;
  username: string | null;
  onboarded?: boolean;
  role?: string;
  loyalty_points?: number;
  current_streak?: number | null;
  longest_streak?: number | null;
  last_streak_at?: string | null;
  social_links?: any;
  skills?: string[];
  wallet_address?: string | null;
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

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const startOfUTC = (date: Date) =>
  new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );

const isoDate = (date: Date) => date.toISOString().slice(0, 10);

const normalizeDateInput = (value?: string | null) => {
  if (!value) return null;
  const normalized = value.includes("T") ? value : `${value}T00:00:00Z`;
  return startOfUTC(new Date(normalized));
};

const normalizeProfile = (
  row: any,
  email?: string | null,
): AethexUserProfile => ({
  ...(row as AethexUserProfile),
  email: email ?? (row as any)?.email,
  username: (row as any)?.username ?? email?.split("@")[0] ?? "user",
  onboarded: (row as any)?.onboarded ?? false,
  role: (row as any)?.role ?? "developer",
  loyalty_points: (row as any)?.loyalty_points ?? 0,
  current_streak: (row as any)?.current_streak ?? 0,
  longest_streak:
    (row as any)?.longest_streak ??
    Math.max((row as any)?.current_streak ?? 0, 0),
  last_streak_at: (row as any)?.last_streak_at ?? null,
  wallet_address: (row as any)?.wallet_address ?? null,
});

const ensureDailyStreakForProfile = async (
  profile: AethexUserProfile,
): Promise<AethexUserProfile> => {
  try {
    ensureSupabase();
  } catch {
    return {
      ...profile,
      current_streak: profile.current_streak ?? 0,
      longest_streak: profile.longest_streak ?? profile.current_streak ?? 0,
      last_streak_at: profile.last_streak_at ?? null,
    };
  }

  const today = startOfUTC(new Date());
  const isoToday = isoDate(today);
  const lastRecorded = normalizeDateInput(profile.last_streak_at);
  let current = profile.current_streak ?? 0;
  let longest = profile.longest_streak ?? 0;
  let lastValue = profile.last_streak_at ?? null;
  let needsUpdate = false;

  if (!lastRecorded) {
    current = Math.max(current, 1);
    longest = Math.max(longest, current);
    lastValue = isoToday;
    needsUpdate = true;
  } else {
    const diffDays = Math.floor(
      (today.getTime() - lastRecorded.getTime()) / MS_PER_DAY,
    );

    if (diffDays === 1) {
      current = current + 1;
      longest = Math.max(longest, current);
      lastValue = isoToday;
      needsUpdate = true;
    } else if (diffDays > 1 || diffDays < 0) {
      current = 1;
      longest = Math.max(longest, current);
      lastValue = isoToday;
      needsUpdate = true;
    }
  }

  if (needsUpdate) {
    const { data, error } = await supabase
      .from("user_profiles")
      .update({
        current_streak: current,
        longest_streak: longest,
        last_streak_at: isoToday,
      })
      .eq("id", profile.id)
      .select()
      .single();

    if (!error && data) {
      return normalizeProfile(data, profile.email);
    }

    console.warn("Failed to persist streak update:", error);
    return {
      ...profile,
      current_streak: current,
      longest_streak: longest,
      last_streak_at: lastValue,
    };
  }

  return {
    ...profile,
    current_streak: current,
    longest_streak: longest,
    last_streak_at: lastValue,
  };
};

export function checkProfileComplete(
  p?: AethexUserProfile | null,
  roles?: string[],
): boolean {
  if (!p) return false;

  // Admins/owners are always considered complete
  if (
    roles?.some((r) =>
      ["owner", "admin", "founder", "staff"].includes(r.toLowerCase()),
    )
  ) {
    return true;
  }

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

export interface ActivateRewardsResponse {
  ok: boolean;
  achievementsSeeded: number;
  godModeAwarded: boolean;
  awardedAchievementIds?: string[];
  targetUserId?: string | null;
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
        return await this.createInitialProfile(
          user.id,
          {
            username: user.email?.split("@")[0] || "user",
            full_name: user.email?.split("@")[0] || "user",
          },
          user.email,
        );
      }

      if (isTableMissing(error)) {
        throw new Error(
          'Supabase table "user_profiles" is missing. Please run the required migrations.',
        );
      }

      throw error;
    }

    if (!data || Object.keys(data || {}).length === 0) {
      return await this.createInitialProfile(
        user.id,
        {
          username: user.email?.split("@")[0] || "user",
          full_name: user.email?.split("@")[0] || "user",
        },
        user.email,
      );
    }

    const normalized = normalizeProfile(data, user.email);

    // Auto-populate username for mrpiglr if empty
    if (
      normalized &&
      user.email === "mrpiglr@gmail.com" &&
      !normalized.username
    ) {
      await this.updateProfile(user.id, {
        username: "mrpiglr",
      }).catch((err) => {
        console.warn(
          "[Profile] Failed to auto-populate mrpiglr username:",
          err,
        );
      });
      normalized.username = "mrpiglr";
    }

    return await ensureDailyStreakForProfile(normalized);
  },

  async profileExists(userId: string): Promise<boolean> {
    if (!userId) return false;

    ensureSupabase();

    const { data, error } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("id", userId)
      .single();

    if (error) {
      if ((error as any)?.code === "PGRST116") {
        return false;
      }
      // Log other errors but don't throw
      console.warn("[Profile] Error checking profile existence:", error);
      return false;
    }

    return !!data?.id;
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
          'Supabase table "user_profiles" is missing. Please run the required migrations.',
        );
      }

      throw error;
    }

    return normalizeProfile(data);
  },

  async getProfileByUsername(
    username: string,
  ): Promise<AethexUserProfile | null> {
    const normalized = username?.trim();
    if (!normalized) return null;

    ensureSupabase();

    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("username", normalized)
      .maybeSingle();

    if (error) {
      if ((error as any)?.code !== "PGRST116") {
        if (isTableMissing(error)) {
          throw new Error(
            'Supabase table "user_profiles" is missing. Please run the required migrations.',
          );
        }
        throw error;
      }
    }

    if (data) {
      return normalizeProfile(data);
    }

    const { data: fallback, error: fallbackError } = await supabase
      .from("user_profiles")
      .select("*")
      .ilike("username", normalized)
      .maybeSingle();

    if (fallbackError) {
      if ((fallbackError as any)?.code === "PGRST116") {
        return null;
      }
      if (isTableMissing(fallbackError)) {
        throw new Error(
          'Supabase table "user_profiles" is missing. Please run the required migrations.',
        );
      }
      throw fallbackError;
    }

    if (fallback) {
      return normalizeProfile(fallback);
    }

    return null;
  },

  async listProfiles(limit = 50): Promise<AethexUserProfile[]> {
    ensureSupabase();

    let data: any[] | null = null;
    try {
      let resp = await supabase
        .from("user_profiles")
        .select(
          `
        *,
        user_achievements (
          achievements ( xp_reward )
        )
      `,
        )
        .order("updated_at", { ascending: false })
        .limit(limit);
      // resp may be { data, error }
      if (!resp) throw new Error("Empty response from Supabase");
      let anyResp: any = resp as any;
      let err = anyResp.error;
      if (err) {
        const message = String(err?.message || err);
        if (
          message.includes("relationship") ||
          message.includes("schema cache")
        ) {
          // Fallback: fetch profiles, then batch-fetch achievements and map xp rewards
          const { data: profilesOnly, error: profilesErr } = await supabase
            .from("user_profiles")
            .select("*")
            .order("updated_at", { ascending: false })
            .limit(limit);

          if (profilesErr) {
            if (isTableMissing(profilesErr)) {
              throw new Error(
                'Supabase table "user_profiles" is missing. Please run the required migrations.',
              );
            }
            throw new Error(profilesErr?.message || String(profilesErr));
          }

          const ids = Array.isArray(profilesOnly)
            ? profilesOnly.map((p: any) => p.id).filter(Boolean)
            : [];

          let uaRows: any[] = [];
          if (ids.length) {
            const { data: uaData, error: uaErr } = await supabase
              .from("user_achievements")
              .select("user_id, achievement_id")
              .in("user_id", ids);
            if (uaErr && (uaErr as any)?.code !== "PGRST116") {
              // if user_achievements missing, ignore and continue without earned xp
              throw uaErr;
            }
            uaRows = Array.isArray(uaData) ? uaData : [];
          }

          const achievementIds = Array.from(
            new Set(uaRows.map((r) => r.achievement_id).filter(Boolean)),
          );
          let achievementMap: Record<string, number> = {};
          if (achievementIds.length) {
            const { data: achData, error: achErr } = await supabase
              .from("achievements")
              .select("id, xp_reward")
              .in("id", achievementIds);
            if (achErr && (achErr as any)?.code !== "PGRST116") {
              throw achErr;
            }
            (achData || []).forEach((a: any) => {
              achievementMap[a.id] = Number(a.xp_reward || 0);
            });
          }

          // build user_achievements array in the same shape expected by mapping logic
          const enrichedProfiles = (profilesOnly || []).map((p: any) => {
            const userAchievements = uaRows
              .filter((r) => r.user_id === p.id)
              .map((r) => ({
                achievements: {
                  xp_reward: achievementMap[r.achievement_id] || 0,
                },
              }));
            return { ...p, user_achievements: userAchievements };
          });

          anyResp = { data: enrichedProfiles, error: null } as any;
          err = null;
        }
        if (err) {
          if (isTableMissing(err)) {
            throw new Error(
              'Supabase table "user_profiles" is missing. Please run the required migrations.',
            );
          }
          throw new Error(err?.message || String(err));
        }
      }
      data = anyResp.data as any[];
    } catch (e: any) {
      const msg = e?.message || JSON.stringify(e);
      throw new Error(`Failed to list profiles: ${msg}`);
    }

    return ((data as any[]) || []).map((row) => {
      const achievements = Array.isArray((row as any)?.user_achievements)
        ? ((row as any).user_achievements as any[])
        : [];
      const earnedXp = achievements.reduce<number>((total, entry) => {
        const reward = Number((entry as any)?.achievements?.xp_reward ?? 0);
        return total + (Number.isFinite(reward) ? reward : 0);
      }, 0);

      const rawTotalXp = Number((row as any)?.total_xp ?? earnedXp);
      const totalXp = Number.isFinite(rawTotalXp) ? Math.max(rawTotalXp, 0) : 0;
      const derivedLevel = Math.max(1, Math.floor(totalXp / 1000) + 1);
      const levelValue = Number.isFinite((row as any)?.level)
        ? Math.max(Number((row as any)?.level), 1)
        : derivedLevel;
      const loyaltyFromRow = Number((row as any)?.loyalty_points);
      const loyaltyPoints = Number.isFinite(loyaltyFromRow)
        ? Math.max(loyaltyFromRow, 0)
        : totalXp;

      const normalized = normalizeProfile({
        ...(row as AethexUserProfile),
        user_type: (row as any).user_type || "game_developer",
        experience_level: (row as any).experience_level || "beginner",
      });

      delete (normalized as any).user_achievements;

      return {
        ...normalized,
        total_xp: totalXp,
        level: levelValue,
        loyalty_points: loyaltyPoints,
      } as AethexUserProfile;
    });
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
            { id: userId, user_type: "game_developer", ...updates } as any,
            { onConflict: "id" },
          )
          .select()
          .single();
        if (upsertError) throw upsertError;

        if (upserted && updates.onboarded === true) {
          try {
            await aethexNotificationService.createNotification(
              userId,
              "success",
              "🎉 Welcome to AeThex!",
              "You've completed your profile setup. Let's get started!",
            );
          } catch (notifError) {
            console.warn(
              "Failed to create onboarding notification:",
              notifError,
            );
          }
        }

        return upserted as AethexUserProfile;
      }

      if (isTableMissing(error)) {
        throw new Error(
          'Supabase table "user_profiles" is missing. Please run the required migrations.',
        );
      }

      throw error;
    }

    if (data && updates.onboarded === true) {
      try {
        await aethexNotificationService.createNotification(
          userId,
          "success",
          "🎉 Welcome to AeThex!",
          "You've completed your profile setup. Let's get started!",
        );
      } catch (notifError) {
        console.warn("Failed to create onboarding notification:", notifError);
      }
    }

    return normalizeProfile(data);
  },

  async createInitialProfile(
    userId: string,
    profileData: Partial<AethexUserProfile>,
    email?: string | null,
  ): Promise<AethexUserProfile | null> {
    ensureSupabase();

    const now = new Date();
    const nowIso = now.toISOString();
    const todayIso = isoDate(startOfUTC(now));

    const { data, error } = await supabase
      .from("user_profiles")
      .insert({
        id: userId,
        username:
          profileData.username ||
          (email ? email.split("@")[0] : undefined) ||
          `user_${Date.now()}`,
        user_type: (profileData as any).user_type || "game_developer",
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
        current_streak: 1,
        longest_streak: 1,
        last_streak_at: todayIso,
        created_at: nowIso,
        updated_at: nowIso,
      })
      .select()
      .single();

    if (error) {
      if (isTableMissing(error)) {
        throw new Error(
          'Supabase table "user_profiles" is missing. Please run the required migrations.',
        );
      }
      throw error;
    }

    return normalizeProfile(data, email);
  },

  async addUserInterests(userId: string, interests: string[]): Promise<void> {
    ensureSupabase();

    await supabase
      .from("user_interests")
      .delete()
      .eq("user_id", userId)
      .catch(() => undefined);

    const interestRows = interests.map((interest) => ({
      user_id: userId,
      interest,
    }));

    const { error } = await supabase
      .from("user_interests")
      .insert(interestRows);

    if (error) {
      if (isTableMissing(error)) {
        throw new Error(
          'Supabase table "user_interests" is missing. Please run the required migrations.',
        );
      }
      throw error;
    }
  },

  async getUserInterests(userId: string): Promise<string[]> {
    ensureSupabase();

    const { data, error } = await supabase
      .from("user_interests")
      .select("interest")
      .eq("user_id", userId);

    if (error) {
      if (isTableMissing(error)) {
        throw new Error(
          'Supabase table "user_interests" is missing. Please run the required migrations.',
        );
      }
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

    if (data && project.user_id) {
      try {
        await aethexNotificationService.createNotification(
          project.user_id,
          "success",
          `🚀 Project Created: ${project.name || "Untitled"}`,
          "Your new project is ready to go!",
        );
      } catch (notifError) {
        console.warn("Failed to create project notification:", notifError);
      }
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

    if (data && data.user_id) {
      try {
        if (updates.status === "completed") {
          await aethexNotificationService.createNotification(
            data.user_id,
            "success",
            `✅ Project Completed: ${data.name || "Untitled"}`,
            "Congratulations on finishing your project!",
          );
        } else if (updates.status === "in_progress") {
          await aethexNotificationService.createNotification(
            data.user_id,
            "info",
            `⏱️ Project Started: ${data.name || "Untitled"}`,
            "You've started working on this project.",
          );
        }
      } catch (notifError) {
        console.warn(
          "Failed to create project status notification:",
          notifError,
        );
      }
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

// Achievement Services (Supabase only)
export const aethexAchievementService = {
  async getAllAchievements(): Promise<AethexAchievement[]> {
    ensureSupabase();

    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .order("xp_reward", { ascending: false });

    if (error) {
      throw error;
    }

    return (Array.isArray(data) ? data : []) as AethexAchievement[];
  },

  async getUserAchievements(userId: string): Promise<AethexAchievement[]> {
    ensureSupabase();

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
      throw error;
    }

    return ((Array.isArray(data) ? data : []) as any[])
      .map((item) => (item as any).achievements)
      .filter(Boolean) as AethexAchievement[];
  },

  async awardAchievement(userId: string, achievementId: string): Promise<void> {
    ensureSupabase();

    const { data: achievement, error: fetchError } = await supabase
      .from("achievements")
      .select("id, name, xp_reward")
      .eq("id", achievementId)
      .maybeSingle();

    if (fetchError) {
      throw fetchError;
    }

    if (!achievement) {
      return;
    }

    const { error } = await supabase.from("user_achievements").insert({
      user_id: userId,
      achievement_id: achievementId,
    });

    if (error && error.code !== "23505") {
      throw error;
    }

    if (!error && achievement?.xp_reward) {
      await this.updateUserXPAndLevel(userId, achievement.xp_reward ?? 0);

      try {
        await aethexNotificationService.createNotification(
          userId,
          "success",
          `�� Achievement Unlocked: ${achievement.name}`,
          `You've earned ${achievement.xp_reward} XP!`,
        );
      } catch (notifError) {
        console.warn("Failed to create achievement notification:", notifError);
      }
    }
  },

  async updateUserXPAndLevel(
    userId: string,
    xpGained: number | null = null,
  ): Promise<void> {
    ensureSupabase();

    const { data: profile, error } = await supabase
      .from("user_profiles")
      .select("total_xp, level, loyalty_points")
      .eq("id", userId)
      .single();

    if (error) {
      throw error;
    }

    if (!profile) {
      return;
    }

    const currentProfile: any = profile;
    const xpDelta = xpGained ?? 0;
    const newTotalXP = (currentProfile.total_xp || 0) + xpDelta;
    const newLevel = Math.floor(newTotalXP / 1000) + 1;
    const newLoyaltyPoints = (currentProfile.loyalty_points || 0) + xpDelta;
    const oldLevel = currentProfile.level || 1;

    const updates: Record<string, number> = {};
    if ("total_xp" in currentProfile) updates.total_xp = newTotalXP;
    if ("level" in currentProfile) updates.level = newLevel;
    if ("loyalty_points" in currentProfile)
      updates.loyalty_points = newLoyaltyPoints;

    if (Object.keys(updates).length > 0) {
      const { error: updateError } = await supabase
        .from("user_profiles")
        .update(updates)
        .eq("id", userId);

      if (updateError) throw updateError;

      if (newLevel > oldLevel) {
        try {
          await aethexNotificationService.createNotification(
            userId,
            "success",
            `⬆️ Level Up!`,
            `You've reached level ${newLevel}! Keep it up!`,
          );
        } catch (notifError) {
          console.warn("Failed to create level up notification:", notifError);
        }
      }
    }
  },

  async checkAndAwardOnboardingAchievement(userId: string): Promise<void> {
    ensureSupabase();

    try {
      const baseUrl =
        typeof window !== "undefined" ? window.location.origin : "";
      if (!baseUrl) {
        console.warn("[Achievement] Cannot award - no origin available");
        return;
      }

      const resp = await fetch(`${baseUrl}/api/achievements/award`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          achievement_names: ["Welcome to AeThex", "AeThex Explorer"],
        }),
      });

      if (resp.ok) {
        return;
      }
    } catch (error) {
      console.warn(
        "Edge function award failed, attempting direct Supabase insert",
        error,
      );
    }

    const achievements = await this.getAllAchievements();
    const byName = new Map(
      achievements.map((item) => [item.name, item.id] as const),
    );
    const names = ["Welcome to AeThex", "AeThex Explorer"];

    for (const name of names) {
      const id = byName.get(name);
      if (!id) continue;
      await this.awardAchievement(userId, id);
    }
  },

  async checkAndAwardProjectAchievements(userId: string): Promise<void> {
    const projects = await aethexProjectService.getUserProjects(userId);

    if (projects.length >= 1) {
      const { data, error } = await supabase
        .from("achievements")
        .select("id")
        .eq("name", "Portfolio Creator")
        .maybeSingle();

      if (error) throw error;
      if (data?.id) {
        await this.awardAchievement(userId, data.id);
      }
    }

    const completed = projects.filter((p) => p.status === "completed");
    if (completed.length >= 10) {
      const { data, error } = await supabase
        .from("achievements")
        .select("id")
        .eq("name", "Project Master")
        .maybeSingle();

      if (error) throw error;
      if (data?.id) {
        await this.awardAchievement(userId, data.id);
      }
    }
  },

  async activateCommunityRewards(target?: {
    email?: string;
    username?: string;
  }): Promise<ActivateRewardsResponse | null> {
    try {
      const payload = {
        targetEmail: target?.email,
        targetUsername: target?.username,
      };

      // Always use the current origin for API calls since the API is served from the same origin
      // This works for both development (localhost:8080) and production (aethex.dev)
      const baseUrl =
        typeof window !== "undefined" ? window.location.origin : "";

      if (!baseUrl) {
        console.warn("[Rewards] Cannot activate - no origin available");
        return null;
      }

      const url = `${baseUrl}/api/achievements/activate`;
      console.log("[Rewards] Activating at:", url);

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(
          "[Rewards] Activation failed:",
          response.status,
          errorText,
        );
        return null;
      }

      const result = (await response.json()) as ActivateRewardsResponse;
      console.log("[Rewards] Activation succeeded:", result);
      return result;
    } catch (error: any) {
      console.warn("[Rewards] Activation error:", error?.message || error);
      return null;
    }
  },
};

export interface AethexApplicationSubmission {
  type: "contributor" | "career";
  full_name: string;
  email: string;
  location?: string | null;
  role_interest?: string | null;
  primary_skill?: string | null;
  experience_level?: string | null;
  availability?: string | null;
  portfolio_url?: string | null;
  resume_url?: string | null;
  interests?: string[] | null;
  message?: string | null;
}

export const aethexApplicationService = {
  async submitApplication(
    submission: AethexApplicationSubmission,
  ): Promise<void> {
    ensureSupabase();

    const sanitizeString = (value?: string | null) => {
      if (typeof value !== "string") return null;
      const trimmed = value.trim();
      return trimmed.length ? trimmed : null;
    };

    const normalizeEmail = (value: string) => value.trim().toLowerCase();
    const normalizeUrl = (value?: string | null) => {
      const trimmed = sanitizeString(value);
      if (!trimmed) return null;
      if (/^https?:\/\//i.test(trimmed)) return trimmed;
      return `https://${trimmed}`;
    };

    const normalizedInterests = Array.isArray(submission.interests)
      ? submission.interests
          .map((item) => (typeof item === "string" ? item.trim() : ""))
          .filter((item) => item.length > 0)
      : [];

    const payload = {
      type: submission.type,
      full_name: sanitizeString(submission.full_name) ?? "Anonymous", // fallback for Supabase constraint
      email: normalizeEmail(submission.email),
      location: sanitizeString(submission.location),
      role_interest: sanitizeString(submission.role_interest),
      primary_skill: sanitizeString(submission.primary_skill),
      availability: sanitizeString(submission.availability),
      experience_level: sanitizeString(submission.experience_level),
      portfolio_url: normalizeUrl(submission.portfolio_url),
      resume_url: normalizeUrl(submission.resume_url),
      interests: normalizedInterests.length ? normalizedInterests : null,
      message: sanitizeString(submission.message),
      status: "new",
      submitted_at: new Date().toISOString(),
    } as const;

    const { error } = await supabase
      .from("applications")
      .insert(payload as any);

    if (error) {
      if (isTableMissing(error)) {
        throw new Error(
          'Supabase table "applications" is missing. Please create it or adjust the application handler.',
        );
      }
      throw error;
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
      .limit(20);

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
    } catch (error) {
      console.warn("Failed to persist user roles:", error);
    }
  },
};
