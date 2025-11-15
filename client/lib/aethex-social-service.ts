import { supabase } from "@/lib/supabase";

// API Base URL for fetch requests
const API_BASE = import.meta.env.VITE_API_BASE || "";

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
        console.error(
          "Failed to load recommended profiles:",
          (error as any)?.message || error,
        );
        return [];
      }

      return (data || []) as any[];
    } catch (error) {
      console.error(
        "Unexpected error loading recommended profiles:",
        (error as any)?.message || error,
      );
      return [];
    }
  },

  async getFollowing(userId: string): Promise<string[]> {
    try {
      const resp = await fetch(
        `${API_BASE}/api/social/following?userId=${encodeURIComponent(userId)}`,
      );

      if (!resp.ok) {
        console.error(
          "Failed to load following list: HTTP",
          resp.status,
          await resp.text(),
        );
        return [];
      }

      const result = await resp.json();
      return result.data || [];
    } catch (error) {
      console.error(
        "Unexpected error loading following list:",
        (error as any)?.message || error,
      );
      return [];
    }
  },

  async getFollowers(userId: string): Promise<string[]> {
    try {
      const resp = await fetch(
        `${API_BASE}/api/social/followers?userId=${encodeURIComponent(userId)}`,
      );

      if (!resp.ok) {
        console.error(
          "Failed to load followers list: HTTP",
          resp.status,
          await resp.text(),
        );
        return [];
      }

      const result = await resp.json();
      return result.data || [];
    } catch (error) {
      console.error("Unexpected error loading followers list:", error);
      return [];
    }
  },

  async followUser(followerId: string, followingId: string): Promise<void> {
    const resp = await fetch(`${API_BASE}/api/social/follow`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        follower_id: followerId,
        following_id: followingId,
      }),
    });
    if (!resp.ok) throw new Error(await resp.text());
  },

  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    const resp = await fetch(`${API_BASE}/api/social/unfollow`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        follower_id: followerId,
        following_id: followingId,
      }),
    });
    if (!resp.ok) throw new Error(await resp.text());
  },

  async sendInvite(inviterId: string, email: string, message?: string | null) {
    const resp = await fetch(`${API_BASE}/api/invites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        inviter_id: inviterId,
        invitee_email: email,
        message,
      }),
    });
    if (!resp.ok) {
      const err = await resp.text();
      throw new Error(err || "Failed to send invite");
    }
    return (await resp.json()) as {
      ok: boolean;
      inviteUrl: string;
      token: string;
    };
  },

  async listInvites(inviterId: string) {
    const resp = await fetch(
      `${API_BASE}/api/invites?inviter_id=${encodeURIComponent(inviterId)}`,
    );
    if (!resp.ok) return [];
    return await resp.json();
  },

  async acceptInvite(token: string, acceptorId: string) {
    const resp = await fetch(`${API_BASE}/api/invites/accept`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, acceptor_id: acceptorId }),
    });
    if (!resp.ok) {
      const err = await resp.text();
      throw new Error(err || "Failed to accept invite");
    }
    return await resp.json();
  },

  async applyReward(userId: string, action: string, amount?: number) {
    const resp = await fetch(`${API_BASE}/api/rewards/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, action, amount }),
    });
    if (!resp.ok) return false;
    return true;
  },

  async getConnections(userId: string) {
    const { data, error } = await supabase
      .from("user_connections")
      .select(
        `connection_id, created_at, user_profiles:connection_id ( id, full_name, username, avatar_url, bio )`,
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) return [] as any[];
    return (data || []) as any[];
  },

  async getEndorsements(userId: string) {
    const { data, error } = await supabase
      .from("endorsements")
      .select("endorser_id, skill, created_at")
      .eq("endorsed_id", userId)
      .order("created_at", { ascending: false });
    if (error) return [] as any[];
    return (data || []) as any[];
  },

  async endorseSkill(endorserId: string, endorsedId: string, skill: string) {
    const resp = await fetch(`${API_BASE}/api/social/endorse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        endorser_id: endorserId,
        endorsed_id: endorsedId,
        skill,
      }),
    });
    if (!resp.ok) throw new Error(await resp.text());
  },

  // Mentorship
  async listMentors(params?: {
    expertise?: string[];
    q?: string;
    available?: boolean;
    limit?: number;
  }) {
    const qs = new URLSearchParams();
    if (params?.expertise?.length)
      qs.set("expertise", params.expertise.join(","));
    if (params?.q) qs.set("q", params.q);
    if (typeof params?.available === "boolean")
      qs.set("available", String(params.available));
    if (params?.limit) qs.set("limit", String(params.limit));
    const resp = await fetch(
      `${API_BASE}/api/mentors${qs.toString() ? `?${qs.toString()}` : ""}`,
    );
    if (!resp.ok) return [] as any[];
    return (await resp.json()) as any[];
  },

  async applyToBeMentor(
    userId: string,
    input: {
      bio?: string | null;
      expertise: string[];
      hourlyRate?: number | null;
      available?: boolean;
    },
  ) {
    const resp = await fetch(`${API_BASE}/api/mentors/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        bio: input.bio ?? null,
        expertise: input.expertise || [],
        hourly_rate:
          typeof input.hourlyRate === "number" ? input.hourlyRate : null,
        available:
          typeof input.available === "boolean" ? input.available : true,
      }),
    });
    if (!resp.ok) throw new Error(await resp.text());
    return await resp.json();
  },

  async requestMentorship(
    menteeId: string,
    mentorId: string,
    message?: string,
  ) {
    const resp = await fetch(`${API_BASE}/api/mentorship/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mentee_id: menteeId,
        mentor_id: mentorId,
        message: message || null,
      }),
    });
    if (!resp.ok) throw new Error(await resp.text());
    return await resp.json();
  },

  async listMentorshipRequests(userId: string, role?: "mentor" | "mentee") {
    const qs = new URLSearchParams({ user_id: userId });
    if (role) qs.set("role", role);
    const resp = await fetch(
      `${API_BASE}/api/mentorship/requests?${qs.toString()}`,
    );
    if (!resp.ok) return [] as any[];
    return (await resp.json()) as any[];
  },

  async updateMentorshipRequestStatus(
    id: string,
    actorId: string,
    status: "accepted" | "rejected" | "cancelled",
  ) {
    const resp = await fetch(
      `${API_BASE}/api/mentorship/requests/${encodeURIComponent(id)}/status`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actor_id: actorId, status }),
      },
    );
    if (!resp.ok) throw new Error(await resp.text());
    return await resp.json();
  },
};
