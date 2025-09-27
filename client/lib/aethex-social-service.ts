import { supabase } from "./supabase";

export const aethexSocialService = {
  async listRecommended(userId: string, limit = 10) {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("id, username, full_name, avatar_url, bio")
        .neq("id", userId)
        .limit(limit);
      if (!error && data) return data as any[];
    } catch {}
    try {
      const raw = localStorage.getItem("demo_profiles");
      const profiles = raw ? JSON.parse(raw) : [];
      return profiles.filter((p:any)=>p.id!==userId).slice(0, limit);
    } catch { return [] as any[]; }
  },

  async getFollowing(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from("user_follows")
        .select("following_id")
        .eq("follower_id", userId);
      if (!error && data)
        return (data as any[]).map((r: any) => r.following_id);
    } catch {}
    try {
      const raw = localStorage.getItem("mock_follows");
      const map = raw ? JSON.parse(raw) : {};
      return map[userId] || [];
    } catch {}
    return [];
  },

  async followUser(followerId: string, followingId: string): Promise<void> {
    try {
      const { error } = await supabase.from("user_follows").insert({
        follower_id: followerId,
        following_id: followingId,
      });
      if (!error) return;
    } catch {}
    const raw = localStorage.getItem("mock_follows");
    const map = raw ? JSON.parse(raw) : {};
    const set: string[] = Array.from(
      new Set([...(map[followerId] || []), followingId]),
    );
    map[followerId] = set;
    localStorage.setItem("mock_follows", JSON.stringify(map));
  },

  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    try {
      await supabase
        .from("user_follows")
        .delete()
        .eq("follower_id", followerId)
        .eq("following_id", followingId);
      return;
    } catch {}
    const raw = localStorage.getItem("mock_follows");
    const map = raw ? JSON.parse(raw) : {};
    const list: string[] = (map[followerId] || []).filter(
      (id: string) => id !== followingId,
    );
    map[followerId] = list;
    localStorage.setItem("mock_follows", JSON.stringify(map));
  },
};
