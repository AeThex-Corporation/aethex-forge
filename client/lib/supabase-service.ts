import { supabase } from "./supabase";
import { ensureDemoSeed } from "./demo-feed";
import type {
  Database,
  UserProfile,
  Project,
  Achievement,
  CommunityPost,
} from "./database.types";

// User Profile Services
export const userProfileService = {
  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return data;
  },

  async updateProfile(
    userId: string,
    updates: Partial<UserProfile>,
  ): Promise<UserProfile> {
    const { data, error } = await supabase
      .from("user_profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async createProfile(
    profile: Omit<UserProfile, "created_at" | "updated_at">,
  ): Promise<UserProfile> {
    const { data, error } = await supabase
      .from("user_profiles")
      .insert(profile)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async addInterests(userId: string, interests: string[]): Promise<void> {
    const interestRows = interests.map((interest) => ({
      user_id: userId,
      interest,
    }));

    const { error } = await supabase
      .from("user_interests")
      .insert(interestRows);

    if (error) throw error;
  },

  async getUserInterests(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from("user_interests")
      .select("interest")
      .eq("user_id", userId);

    if (error) throw error;
    return data.map((item) => item.interest);
  },
};

// Project Services
export const projectService = {
  async getUserProjects(userId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async createProject(
    project: Omit<Project, "id" | "created_at" | "updated_at">,
  ): Promise<Project> {
    const { data, error } = await supabase
      .from("projects")
      .insert(project)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateProject(
    projectId: string,
    updates: Partial<Project>,
  ): Promise<Project> {
    const { data, error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", projectId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteProject(projectId: string): Promise<void> {
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (error) throw error;
  },

  async getAllProjects(limit = 10): Promise<Project[]> {
    const { data, error } = await supabase
      .from("projects")
      .select(
        `
        *,
        user_profiles (
          username,
          full_name,
          avatar_url
        )
      `,
      )
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },
};

// Achievement Services
export const achievementService = {
  async getAllAchievements(): Promise<Achievement[]> {
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .order("xp_reward", { ascending: false });

    if (error) throw error;
    return data;
  },

  async getUserAchievements(userId: string): Promise<Achievement[]> {
    const { data, error } = await supabase
      .from("user_achievements")
      .select(
        `
        earned_at,
        achievements (*)
      `,
      )
      .eq("user_id", userId)
      .order("earned_at", { ascending: false });

    if (error) throw error;
    return data
      .map((item) => item.achievements)
      .filter(Boolean) as Achievement[];
  },

  async awardAchievement(userId: string, achievementId: string): Promise<void> {
    const { error } = await supabase.from("user_achievements").insert({
      user_id: userId,
      achievement_id: achievementId,
    });

    if (error && error.code !== "23505") {
      // Ignore duplicate key error
      throw error;
    }
  },

  async checkAndAwardAchievements(userId: string): Promise<void> {
    // Check for various achievement conditions
    const profile = await userProfileService.getProfile(userId);
    const projects = await projectService.getUserProjects(userId);

    if (!profile) return;

    const achievements = await this.getAllAchievements();

    // Welcome achievement
    if (profile.full_name && profile.user_type) {
      const welcomeAchievement = achievements.find(
        (a) => a.name === "Welcome to AeThex",
      );
      if (welcomeAchievement) {
        await this.awardAchievement(userId, welcomeAchievement.id);
      }
    }

    // First project achievement
    if (projects.length >= 1) {
      const firstProjectAchievement = achievements.find(
        (a) => a.name === "First Project",
      );
      if (firstProjectAchievement) {
        await this.awardAchievement(userId, firstProjectAchievement.id);
      }
    }

    // Experienced developer achievement
    const completedProjects = projects.filter((p) => p.status === "completed");
    if (completedProjects.length >= 5) {
      const experiencedAchievement = achievements.find(
        (a) => a.name === "Experienced Developer",
      );
      if (experiencedAchievement) {
        await this.awardAchievement(userId, experiencedAchievement.id);
      }
    }
  },
};

// Community Services
export const communityService = {
  async getPosts(limit = 10): Promise<CommunityPost[]> {
    // Prefer server API (service role) to avoid RLS issues
    try {
      const resp = await fetch(`/api/posts?limit=${limit}`);
      if (resp.ok) {
        const data = await resp.json();
        if (Array.isArray(data) && data.length) return data;
      }
    } catch {}
    try {
      const { data, error } = await supabase
        .from("community_posts")
        .select(
          `
          *,
          user_profiles (
            username,
            full_name,
            avatar_url
          )
        `,
        )
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(limit);
      if (!error && data && data.length) return data;
    } catch {}
    // Fallback to demo posts with auto-seed
    try {
      let raw = localStorage.getItem("demo_posts");
      let posts = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(posts) || posts.length === 0) {
        ensureDemoSeed();
        raw = localStorage.getItem("demo_posts");
        posts = raw ? JSON.parse(raw) : [];
      }
      return (Array.isArray(posts) ? posts : []).slice(0, limit);
    } catch {
      try {
        ensureDemoSeed();
        const raw = localStorage.getItem("demo_posts");
        const posts = raw ? JSON.parse(raw) : [];
        return (Array.isArray(posts) ? posts : []).slice(0, limit);
      } catch {
        return [];
      }
    }
  },

  async createPost(
    post: Omit<
      CommunityPost,
      "id" | "created_at" | "updated_at" | "likes_count" | "comments_count"
    >,
  ): Promise<CommunityPost> {
    try {
      const resp = await fetch(`/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      });
      if (resp.ok) return await resp.json();
    } catch {}
    try {
      const { data, error } = await supabase
        .from("community_posts")
        .insert(post)
        .select()
        .single();
      if (!error && data) return data;
    } catch {}
    // Fallback to local demo store
    const fallback: any = {
      ...post,
      id: `demo_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      likes_count: 0,
      comments_count: 0,
      user_profiles: (function () {
        try {
          const profiles = JSON.parse(
            localStorage.getItem("demo_profiles") || "[]",
          );
          return profiles.find((p: any) => p.id === post.author_id) || null;
        } catch {
          return null;
        }
      })(),
    };
    const raw = localStorage.getItem("demo_posts");
    const list = raw ? JSON.parse(raw) : [];
    list.unshift(fallback);
    localStorage.setItem("demo_posts", JSON.stringify(list));
    return fallback;
  },

  async getUserPosts(userId: string): Promise<CommunityPost[]> {
    try {
      const resp = await fetch(`/api/user/${userId}/posts`);
      if (resp.ok) return await resp.json();
    } catch {}
    try {
      const { data, error } = await supabase
        .from("community_posts")
        .select("*")
        .eq("author_id", userId)
        .order("created_at", { ascending: false });
      if (!error && data) return data;
    } catch {}
    try {
      const raw = localStorage.getItem("demo_posts");
      const posts = raw ? JSON.parse(raw) : [];
      return posts.filter((p: any) => p.author_id === userId);
    } catch {
      return [];
    }
  },
};

// Notification Services
export const notificationService = {
  async getUserNotifications(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) throw error;
    return data;
  },

  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId);

    if (error) throw error;
  },

  async createNotification(
    userId: string,
    title: string,
    message?: string,
    type = "info",
  ): Promise<void> {
    const { error } = await supabase.from("notifications").insert({
      user_id: userId,
      title,
      message,
      type,
    });

    if (error) throw error;
  },
};

// Real-time subscriptions
export const realtimeService = {
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

  subscribeToCommunityPosts(callback: (post: any) => void) {
    const client: any = supabase as any;
    if (!client || typeof client.channel !== "function") {
      return { unsubscribe: () => {} } as any;
    }
    return client
      .channel("community_posts")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "community_posts",
          filter: "is_published=eq.true",
        },
        callback,
      )
      .subscribe();
  },
};
