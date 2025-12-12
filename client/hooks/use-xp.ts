import { useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  aethexXPService,
  XPEventType,
  XPAwardResult,
  calculateLevel,
  levelProgress,
  xpForNextLevel,
} from "@/lib/aethex-database-adapter";
import { aethexToast } from "@/lib/aethex-toast";

export interface UseXPReturn {
  awardXP: (eventType: XPEventType, multiplier?: number) => Promise<XPAwardResult>;
  awardCustomXP: (amount: number, reason?: string) => Promise<XPAwardResult>;
  awardStreakBonus: (streakDays: number) => Promise<XPAwardResult>;
  calculateLevel: typeof calculateLevel;
  levelProgress: typeof levelProgress;
  xpForNextLevel: typeof xpForNextLevel;
}

export function useXP(): UseXPReturn {
  const { user } = useAuth();

  const showLevelUpToast = useCallback((result: XPAwardResult) => {
    if (result.leveledUp) {
      aethexToast.aethex({
        title: `Level Up! Level ${result.newLevel}`,
        description: `You've earned ${result.xpAwarded} XP and reached level ${result.newLevel}!`,
        duration: 6000,
      });
    } else if (result.success && result.xpAwarded > 0) {
      aethexToast.success({
        title: `+${result.xpAwarded} XP`,
        description: `Total: ${result.newTotalXp} XP`,
        duration: 3000,
      });
    }
  }, []);

  const awardXP = useCallback(
    async (eventType: XPEventType, multiplier: number = 1): Promise<XPAwardResult> => {
      if (!user?.id) {
        return {
          success: false,
          xpAwarded: 0,
          newTotalXp: 0,
          previousLevel: 1,
          newLevel: 1,
          leveledUp: false,
          error: "Not logged in",
        };
      }

      const result = await aethexXPService.awardXP(user.id, eventType, multiplier);
      showLevelUpToast(result);
      return result;
    },
    [user?.id, showLevelUpToast]
  );

  const awardCustomXP = useCallback(
    async (amount: number, reason?: string): Promise<XPAwardResult> => {
      if (!user?.id) {
        return {
          success: false,
          xpAwarded: 0,
          newTotalXp: 0,
          previousLevel: 1,
          newLevel: 1,
          leveledUp: false,
          error: "Not logged in",
        };
      }

      const result = await aethexXPService.awardCustomXP(user.id, amount, reason);
      showLevelUpToast(result);
      return result;
    },
    [user?.id, showLevelUpToast]
  );

  const awardStreakBonus = useCallback(
    async (streakDays: number): Promise<XPAwardResult> => {
      if (!user?.id) {
        return {
          success: false,
          xpAwarded: 0,
          newTotalXp: 0,
          previousLevel: 1,
          newLevel: 1,
          leveledUp: false,
          error: "Not logged in",
        };
      }

      const result = await aethexXPService.awardStreakBonus(user.id, streakDays);
      showLevelUpToast(result);
      return result;
    },
    [user?.id, showLevelUpToast]
  );

  return {
    awardXP,
    awardCustomXP,
    awardStreakBonus,
    calculateLevel,
    levelProgress,
    xpForNextLevel,
  };
}
