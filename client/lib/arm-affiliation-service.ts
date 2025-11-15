import { supabase } from "./supabase";

export interface ArmAffiliation {
  arm: "foundation" | "gameforge" | "labs" | "corp" | "devlink";
  detected: boolean;
  reason: string;
  activityCount: number;
}

/**
 * Detects which arms a user is affiliated with based on their activities
 */
export const armAffiliationService = {
  /**
   * Check if user has enrolled in any Foundation courses
   */
  async hasFoundationActivity(
    userId: string,
  ): Promise<{ detected: boolean; count: number }> {
    try {
      const { data: enrollments, error } = await supabase
        .from("course_enrollments")
        .select("id", { count: "exact" })
        .eq("user_id", userId)
        .limit(1);

      if (error) throw error;
      return {
        detected: (enrollments?.length ?? 0) > 0,
        count: enrollments?.length ?? 0,
      };
    } catch (error) {
      console.error("Error checking Foundation activity:", error);
      return { detected: false, count: 0 };
    }
  },

  /**
   * Check if user has GameForge projects/teams
   */
  async hasGameForgeActivity(
    userId: string,
  ): Promise<{ detected: boolean; count: number }> {
    try {
      const { data: projects, error: projectError } = await supabase
        .from("gameforge_projects")
        .select("id", { count: "exact" })
        .eq("user_id", userId)
        .limit(1);

      if (projectError) throw projectError;

      const { data: teams, error: teamError } = await supabase
        .from("gameforge_team_members")
        .select("id", { count: "exact" })
        .eq("user_id", userId)
        .limit(1);

      if (teamError) throw teamError;

      const totalCount = (projects?.length ?? 0) + (teams?.length ?? 0);
      return { detected: totalCount > 0, count: totalCount };
    } catch (error) {
      console.error("Error checking GameForge activity:", error);
      return { detected: false, count: 0 };
    }
  },

  /**
   * Check if user has Labs research activities
   */
  async hasLabsActivity(
    userId: string,
  ): Promise<{ detected: boolean; count: number }> {
    try {
      const { data: research, error } = await supabase
        .from("labs_research_tracks")
        .select("id", { count: "exact" })
        .eq("user_id", userId)
        .limit(1);

      if (error) throw error;
      return {
        detected: (research?.length ?? 0) > 0,
        count: research?.length ?? 0,
      };
    } catch (error) {
      console.error("Error checking Labs activity:", error);
      return { detected: false, count: 0 };
    }
  },

  /**
   * Check if user has Corp-related activities
   */
  async hasCorpActivity(
    userId: string,
  ): Promise<{ detected: boolean; count: number }> {
    try {
      // Corp activities could include partnerships, investments, or business accounts
      const { data: accounts, error } = await supabase
        .from("corp_accounts")
        .select("id", { count: "exact" })
        .eq("user_id", userId)
        .limit(1);

      if (error) throw error;
      return {
        detected: (accounts?.length ?? 0) > 0,
        count: accounts?.length ?? 0,
      };
    } catch (error) {
      // Corp table may not exist yet, return false
      return { detected: false, count: 0 };
    }
  },

  /**
   * Check if user has DevLink/Roblox development activity
   */
  async hasDevLinkActivity(
    userId: string,
  ): Promise<{ detected: boolean; count: number }> {
    try {
      const { data: devLinkProfiles, error } = await supabase
        .from("devlink_profiles")
        .select("id", { count: "exact" })
        .eq("user_id", userId)
        .limit(1);

      if (error && error.code !== "42P01") throw error; // Ignore table not found errors
      return {
        detected: (devLinkProfiles?.length ?? 0) > 0,
        count: devLinkProfiles?.length ?? 0,
      };
    } catch (error) {
      // Table may not exist yet
      return { detected: false, count: 0 };
    }
  },

  /**
   * Detect all arm affiliations for a user
   */
  async detectAffiliations(userId: string): Promise<ArmAffiliation[]> {
    const [foundation, gameforge, labs, corp, devlink] = await Promise.all([
      this.hasFoundationActivity(userId),
      this.hasGameForgeActivity(userId),
      this.hasLabsActivity(userId),
      this.hasCorpActivity(userId),
      this.hasDevLinkActivity(userId),
    ]);

    return [
      {
        arm: "foundation",
        detected: foundation.detected,
        reason: foundation.detected
          ? `${foundation.count} course(s) enrolled`
          : "No courses enrolled",
        activityCount: foundation.count,
      },
      {
        arm: "gameforge",
        detected: gameforge.detected,
        reason: gameforge.detected
          ? `${gameforge.count} project(s) and team(s)`
          : "No projects or teams",
        activityCount: gameforge.count,
      },
      {
        arm: "labs",
        detected: labs.detected,
        reason: labs.detected
          ? `${labs.count} research track(s)`
          : "No research tracks",
        activityCount: labs.count,
      },
      {
        arm: "corp",
        detected: corp.detected,
        reason: corp.detected
          ? `${corp.count} corp account(s)`
          : "No corp accounts",
        activityCount: corp.count,
      },
      {
        arm: "devlink",
        detected: devlink.detected,
        reason: devlink.detected
          ? "DevLink profile created"
          : "No DevLink profile",
        activityCount: devlink.count,
      },
    ];
  },

  /**
   * Sync detected affiliations to user_arm_affiliations table
   */
  async syncDetectedAffiliations(userId: string, token: string): Promise<void> {
    try {
      const detectedArms = await this.detectAffiliations(userId);

      for (const affiliation of detectedArms) {
        if (affiliation.detected) {
          await fetch(
            `${import.meta.env.VITE_API_BASE}/api/user/arm-affiliations`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                arm: affiliation.arm,
                affiliation_type: "courses", // Generic type for auto-detected
                affiliation_data: {
                  detected: true,
                  reason: affiliation.reason,
                },
                confirmed: false,
              }),
            },
          );
        }
      }
    } catch (error) {
      console.error("Error syncing arm affiliations:", error);
    }
  },
};
