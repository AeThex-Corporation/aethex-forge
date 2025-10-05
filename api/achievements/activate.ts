import type { VercelRequest, VercelResponse } from "@vercel/node";
import { randomUUID } from "crypto";
import { getAdminClient } from "../../api/_supabase";

const CORE_ACHIEVEMENTS = [
  {
    id: "welcome-to-aethex",
    name: "Welcome to AeThex",
    description: "Completed onboarding and joined the AeThex network.",
    icon: "🎉",
    badgeColor: "#7C3AED",
    xpReward: 250,
  },
  {
    id: "aethex-explorer",
    name: "AeThex Explorer",
    description: "Engaged with community initiatives and posted first update.",
    icon: "🧭",
    badgeColor: "#0EA5E9",
    xpReward: 400,
  },
  {
    id: "community-champion",
    name: "Community Champion",
    description: "Contributed feedback, resolved bugs, and mentored squads.",
    icon: "🏆",
    badgeColor: "#22C55E",
    xpReward: 750,
  },
  {
    id: "workshop-architect",
    name: "Workshop Architect",
    description: "Published a high-impact mod or toolkit adopted by teams.",
    icon: "🛠️",
    badgeColor: "#F97316",
    xpReward: 1200,
  },
  {
    id: "god-mode",
    name: "GOD Mode",
    description: "Legendary status awarded by AeThex studio leadership.",
    icon: "⚡",
    badgeColor: "#FACC15",
    xpReward: 5000,
  },
] as const;

const DEFAULT_TARGET_EMAIL = "mrpiglr@gmail.com";
const DEFAULT_TARGET_USERNAME = "mrpiglr";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { targetEmail, targetUsername } = (req.body || {}) as {
    targetEmail?: string;
    targetUsername?: string;
  };

  try {
    const admin = getAdminClient();
    const nowIso = new Date().toISOString();

    // Ensure core achievements exist
    const achievementResults = await Promise.all(
      CORE_ACHIEVEMENTS.map(async (achievement) => {
        const { error } = await admin
          .from("achievements")
          .upsert(
            {
              id: achievement.id,
              name: achievement.name,
              description: achievement.description,
              icon: achievement.icon,
              badge_color: achievement.badgeColor,
              xp_reward: achievement.xpReward,
              created_at: nowIso,
            },
            { onConflict: "id" },
          );

        if (error) {
          throw error;
        }
        return achievement.id;
      }),
    );

    // Normalise profile progression defaults
    await Promise.all([
      admin
        .from("user_profiles")
        .update({ level: 1 })
        .is("level", null),
      admin
        .from("user_profiles")
        .update({ total_xp: 0 })
        .is("total_xp", null),
      admin
        .from("user_profiles")
        .update({ user_type: "game_developer" })
        .neq("user_type", "game_developer"),
    ]);

    // Locate target user
    const normalizedEmail = (targetEmail || DEFAULT_TARGET_EMAIL).toLowerCase();
    const normalizedUsername = (targetUsername || DEFAULT_TARGET_USERNAME).toLowerCase();

    let targetUserId: string | null = null;

    try {
      const { data, error } = await (admin.auth as any).admin.listUsers({
        email: normalizedEmail,
      });
      if (!error && data?.users?.length) {
        const match = data.users.find(
          (user: any) => user.email?.toLowerCase() === normalizedEmail,
        );
        if (match) {
          targetUserId = match.id;
        }
      }
    } catch (error) {
      console.warn("Failed to query auth users for GOD mode activation", error);
    }

    if (!targetUserId) {
      const { data: profileRow } = await admin
        .from("user_profiles")
        .select("id, username")
        .ilike("username", `${normalizedUsername}%`)
        .maybeSingle();

      if (profileRow?.id) {
        targetUserId = profileRow.id;
      }
    }

    const awardedAchievementIds: string[] = [];
    let godModeAwarded = false;

    if (targetUserId) {
      const progressStats = {
        level: 100,
        total_xp: 99000,
        loyalty_points: 99000,
        current_streak: 365,
        longest_streak: 365,
      };

      await admin
        .from("user_profiles")
        .update({
          user_type: "game_developer",
          ...progressStats,
          last_streak_at: nowIso.split("T")[0],
          updated_at: nowIso,
        })
        .eq("id", targetUserId);

      const { data: existingRows, error: existingError } = await admin
        .from("user_achievements")
        .select("achievement_id")
        .eq("user_id", targetUserId);

      if (existingError) {
        throw existingError;
      }

      const existingIds = new Set((existingRows ?? []).map((row: any) => row.achievement_id));

      for (const achievement of CORE_ACHIEVEMENTS) {
        if (existingIds.has(achievement.id)) {
          if (achievement.id === "god-mode") {
            godModeAwarded = true;
          }
          continue;
        }

        const { error: insertError } = await admin
          .from("user_achievements")
          .insert({
            id: randomUUID(),
            user_id: targetUserId,
            achievement_id: achievement.id,
            earned_at: nowIso,
          });

        if (insertError && insertError.code !== "23505") {
          throw insertError;
        }

        awardedAchievementIds.push(achievement.id);
        if (achievement.id === "god-mode") {
          godModeAwarded = true;
        }
      }

      if (!godModeAwarded && existingIds.has("god-mode")) {
        godModeAwarded = true;
      }
    }

    return res.json({
      ok: true,
      achievementsSeeded: achievementResults.length,
      godModeAwarded,
      awardedAchievementIds,
      targetUserId,
    });
  } catch (error: any) {
    console.error("activate achievements error", error);
    return res.status(500).json({
      error: error?.message || "Failed to activate achievements",
    });
  }
}
