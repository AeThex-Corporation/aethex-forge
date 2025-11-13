import { supabase } from "@/lib/supabase";
import type {
  Database,
  UserProfile,
  Project,
  Achievement,
  CommunityPost,
} from "./database.types";

// API Base URL for fetch requests
const API_BASE = import.meta.env.VITE_API_BASE || "";

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

// Helper function for timeouts
function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  label: string,
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timeout after ${ms}ms`)), ms),
    ),
  ]);
}

// Community Services
export const communityService = {
  async getPosts(limit = 10): Promise<CommunityPost[]> {
    const DEFAULT_TIMEOUT = 8000; // 8 seconds per attempt

    // 1) Try relational select with embedded author profile (with timeout)
    try {
      const { data, error } = await withTimeout(
        supabase
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
          .limit(limit),
        DEFAULT_TIMEOUT,
        "Relational select",
      );

      if (!error) {
        return (Array.isArray(data) ? data : []) as CommunityPost[];
      }
      console.warn(
        "Supabase getPosts relational select failed:",
        (error as any)?.message || error,
      );
    } catch (e) {
      console.warn(
        "Supabase getPosts relational select threw:",
        (e as any)?.message || e,
      );
    }

    // 2) Fallback to simple posts select, then hydrate author profiles manually (with timeout)
    try {
      const { data: posts, error: postsErr } = await withTimeout(
        supabase
          .from("community_posts")
          .select("*")
          .eq("is_published", true)
          .order("created_at", { ascending: false })
          .limit(limit),
        DEFAULT_TIMEOUT,
        "Simple posts select",
      );
      if (!postsErr && Array.isArray(posts) && posts.length) {
        const authorIds = Array.from(
          new Set(posts.map((p: any) => p.author_id).filter(Boolean)),
        );
        let profilesById: Record<string, any> = {};
        if (authorIds.length) {
          try {
            const { data: profiles, error: profErr } = await withTimeout(
              supabase
                .from("user_profiles")
                .select("id, username, full_name, avatar_url")
                .in("id", authorIds),
              DEFAULT_TIMEOUT,
              "Profile hydration",
            );
            if (!profErr && Array.isArray(profiles)) {
              profilesById = Object.fromEntries(
                profiles.map((u: any) => [
                  u.id,
                  {
                    username: u.username,
                    full_name: u.full_name,
                    avatar_url: u.avatar_url,
                  },
                ]),
              );
            }
          } catch (profError) {
            console.warn(
              "Profile hydration timeout/error:",
              (profError as any)?.message || profError,
            );
          }
        }
        return posts.map((p: any) => ({
          ...p,
          user_profiles: profilesById[p.author_id] || null,
        })) as CommunityPost[];
      }
      if (postsErr)
        console.warn(
          "Supabase getPosts simple select failed:",
          (postsErr as any)?.message || postsErr,
        );
    } catch (e2) {
      console.warn(
        "Supabase getPosts simple select threw:",
        (e2 as any)?.message || e2,
      );
    }

    // 3) Final fallback to API if available (with timeout)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

      const resp = await fetch(
        `${API_BASE}/api/posts?limit=${encodeURIComponent(String(limit))}`,
        { signal: controller.signal },
      );
      clearTimeout(timeoutId);

      if (resp.ok) {
        const ct = resp.headers.get("content-type") || "";
        if (ct.includes("application/json") || ct.includes("json")) {
          const payload = await resp.json();
          return (Array.isArray(payload) ? payload : []) as CommunityPost[];
        } else {
          const text = await resp.text();
          console.warn(
            "API fallback returned non-JSON content-type:",
            ct,
            text.slice(0, 120),
          );
        }
      } else {
        console.warn(
          "API fallback /api/posts not ok:",
          resp.status,
          resp.statusText,
        );
      }
    } catch (apiErr) {
      console.error(
        "API fallback for getPosts failed:",
        (apiErr as any)?.message || apiErr,
      );
    }

    // Return actual empty array (no demo/mocks)
    return [] as CommunityPost[];
  },

  async createPost(
    post: Omit<
      CommunityPost,
      "id" | "created_at" | "updated_at" | "likes_count" | "comments_count"
    >,
  ): Promise<CommunityPost> {
    try {
      const resp = await fetch(`${API_BASE}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      });
      if (resp.ok) {
        return (await resp.json()) as CommunityPost;
      }
      if (resp.status >= 400) {
        const payload = await resp.json().catch(() => ({}));
        throw new Error(payload?.error || `API responded with ${resp.status}`);
      }
    } catch (error) {
      console.warn("Falling back to Supabase insert for post:", error);
    }

    const { data, error } = await supabase
      .from("community_posts")
      .insert(post)
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message || "Unable to publish post");
    }

    return data as CommunityPost;
  },

  async getUserPosts(userId: string): Promise<CommunityPost[]> {
    const { data, error } = await supabase
      .from("community_posts")
      .select("*")
      .eq("author_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (Array.isArray(data) ? data : []) as CommunityPost[];
  },

  async likePost(postId: string, userId: string): Promise<number | null> {
    try {
      const resp = await fetch(
        `${API_BASE}/api/community/posts/${encodeURIComponent(postId)}/like`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId }),
        },
      );
      if (resp.ok) {
        const json = await resp.json();
        return typeof json?.likes === "number" ? json.likes : null;
      }
    } catch {}
    return null;
  },

  async unlikePost(postId: string, userId: string): Promise<number | null> {
    try {
      const resp = await fetch(
        `${API_BASE}/api/community/posts/${encodeURIComponent(postId)}/unlike`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId }),
        },
      );
      if (resp.ok) {
        const json = await resp.json();
        return typeof json?.likes === "number" ? json.likes : null;
      }
    } catch {}
    return null;
  },

  async listComments(postId: string): Promise<any[]> {
    try {
      const resp = await fetch(
        `${API_BASE}/api/community/posts/${encodeURIComponent(postId)}/comments`,
      );
      if (!resp.ok) return [];
      return await resp.json();
    } catch {
      return [];
    }
  },

  async addComment(
    postId: string,
    userId: string,
    content: string,
  ): Promise<any | null> {
    const resp = await fetch(
      `${API_BASE}/api/community/posts/${encodeURIComponent(postId)}/comments`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, content }),
      },
    );
    if (!resp.ok) return null;
    return await resp.json();
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
