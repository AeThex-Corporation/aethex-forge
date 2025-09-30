import { supabase } from "./supabase";
export const aethexSocialService = {
  async listRecommended(userId: string, limit = 10) {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("id, username, full_name, avatar_url, bio")
        .neq("id", userId)
        .order("updated_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Failed to load recommended profiles:", error);
        return [];
      }

      return (data || []) as any[];
    } catch (error) {
      console.error("Unexpected error loading recommended profiles:", error);
      return [];
    }
  },

  async getFollowing(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from("user_follows")
        .select("following_id")
        .eq("follower_id", userId);

      if (error) {
        console.error("Failed to load following list:", error);
        return [];
      }

      return (data as any[]).map((r: any) => r.following_id);
    } catch (error) {
      console.error("Unexpected error loading following list:", error);
      return [];
    }
  },

  async followUser(followerId: string, followingId: string): Promise<void> {
    const { error } = await supabase.from("user_follows").insert({
      follower_id: followerId,
      following_id: followingId,
    });

    if (error) {
      throw new Error(error.message || "Unable to follow user");
    }
  },

  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    const { error } = await supabase
      .from("user_follows")
      .delete()
      .eq("follower_id", followerId)
      .eq("following_id", followingId);

    if (error) {
      throw new Error(error.message || "Unable to unfollow user");
    }
  },
};
