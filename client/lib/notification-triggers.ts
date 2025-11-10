import { aethexNotificationService } from "./aethex-database-adapter";

export const notificationTriggers = {
  async achievementUnlocked(
    userId: string,
    achievementName: string,
    xpReward: number,
  ): Promise<void> {
    try {
      await aethexNotificationService.createNotification(
        userId,
        "success",
        `🏆 Achievement Unlocked: ${achievementName}`,
        `You've earned ${xpReward} XP!`,
      );
    } catch (error) {
      console.warn("Failed to create achievement notification:", error);
    }
  },

  async teamCreated(userId: string, teamName: string): Promise<void> {
    try {
      await aethexNotificationService.createNotification(
        userId,
        "success",
        `🎯 Team Created: ${teamName}`,
        `Your team "${teamName}" is ready to go!`,
      );
    } catch (error) {
      console.warn("Failed to create team notification:", error);
    }
  },

  async addedToTeam(userId: string, teamName: string, role: string): Promise<void> {
    try {
      await aethexNotificationService.createNotification(
        userId,
        "info",
        `👥 Added to Team: ${teamName}`,
        `You've been added as a ${role} to the team.`,
      );
    } catch (error) {
      console.warn("Failed to create team member notification:", error);
    }
  },

  async projectCreated(userId: string, projectName: string): Promise<void> {
    try {
      await aethexNotificationService.createNotification(
        userId,
        "success",
        `🚀 Project Created: ${projectName}`,
        "Your new project is ready to go!",
      );
    } catch (error) {
      console.warn("Failed to create project notification:", error);
    }
  },

  async addedToProject(userId: string, projectName: string, role: string): Promise<void> {
    try {
      await aethexNotificationService.createNotification(
        userId,
        "info",
        `📌 Added to Project: ${projectName}`,
        `You've been added as a ${role} to the project.`,
      );
    } catch (error) {
      console.warn("Failed to create project member notification:", error);
    }
  },

  async projectCompleted(userId: string, projectName: string): Promise<void> {
    try {
      await aethexNotificationService.createNotification(
        userId,
        "success",
        `✅ Project Completed: ${projectName}`,
        "Congratulations on finishing your project!",
      );
    } catch (error) {
      console.warn("Failed to create project completion notification:", error);
    }
  },

  async projectStarted(userId: string, projectName: string): Promise<void> {
    try {
      await aethexNotificationService.createNotification(
        userId,
        "info",
        `⏱️ Project Started: ${projectName}`,
        "You've started working on this project.",
      );
    } catch (error) {
      console.warn("Failed to create project start notification:", error);
    }
  },

  async levelUp(userId: string, newLevel: number): Promise<void> {
    try {
      await aethexNotificationService.createNotification(
        userId,
        "success",
        "⬆️ Level Up!",
        `You've reached level ${newLevel}! Keep it up!`,
      );
    } catch (error) {
      console.warn("Failed to create level up notification:", error);
    }
  },

  async onboardingComplete(userId: string): Promise<void> {
    try {
      await aethexNotificationService.createNotification(
        userId,
        "success",
        "🎉 Welcome to AeThex!",
        "You've completed your profile setup. Let's get started!",
      );
    } catch (error) {
      console.warn("Failed to create onboarding notification:", error);
    }
  },

  async accountLinked(userId: string, provider: string): Promise<void> {
    try {
      await aethexNotificationService.createNotification(
        userId,
        "success",
        `🔗 Account Linked: ${provider}`,
        `Your ${provider} account has been successfully linked.`,
      );
    } catch (error) {
      console.warn("Failed to create account link notification:", error);
    }
  },

  async emailVerified(userId: string): Promise<void> {
    try {
      await aethexNotificationService.createNotification(
        userId,
        "success",
        "✉️ Email Verified",
        "Your email address has been verified successfully.",
      );
    } catch (error) {
      console.warn("Failed to create email verification notification:", error);
    }
  },

  async customNotification(
    userId: string,
    type: "success" | "info" | "warning" | "error",
    title: string,
    message: string,
  ): Promise<void> {
    try {
      await aethexNotificationService.createNotification(userId, type, title, message);
    } catch (error) {
      console.warn("Failed to create custom notification:", error);
    }
  },
};
