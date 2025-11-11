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

  async addedToTeam(
    userId: string,
    teamName: string,
    role: string,
  ): Promise<void> {
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

  async addedToProject(
    userId: string,
    projectName: string,
    role: string,
  ): Promise<void> {
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
      await aethexNotificationService.createNotification(
        userId,
        type,
        title,
        message,
      );
    } catch (error) {
      console.warn("Failed to create custom notification:", error);
    }
  },

  async taskAssigned(
    userId: string,
    taskTitle: string,
    assignerName: string,
  ): Promise<void> {
    try {
      await aethexNotificationService.createNotification(
        userId,
        "info",
        "📋 Task assigned to you",
        `${assignerName} assigned you a task: "${taskTitle}"`,
      );
    } catch (error) {
      console.warn("Failed to create task notification:", error);
    }
  },

  async postLiked(userId: string, likerName: string): Promise<void> {
    try {
      await aethexNotificationService.createNotification(
        userId,
        "info",
        "❤️ Your post was liked",
        `${likerName} liked your post.`,
      );
    } catch (error) {
      console.warn("Failed to create like notification:", error);
    }
  },

  async postCommented(
    userId: string,
    commenterName: string,
    preview: string,
  ): Promise<void> {
    try {
      await aethexNotificationService.createNotification(
        userId,
        "info",
        "💬 New comment on your post",
        `${commenterName} commented: "${preview}"`,
      );
    } catch (error) {
      console.warn("Failed to create comment notification:", error);
    }
  },

  async applicationReceived(
    userId: string,
    creatorName: string,
    opportunityTitle: string,
  ): Promise<void> {
    try {
      await aethexNotificationService.createNotification(
        userId,
        "info",
        `📋 New Application: ${opportunityTitle}`,
        `${creatorName} applied for your opportunity.`,
      );
    } catch (error) {
      console.warn("Failed to create application notification:", error);
    }
  },

  async applicationStatusChanged(
    userId: string,
    status: "accepted" | "rejected" | "reviewed",
    message?: string,
  ): Promise<void> {
    const statusEmoji =
      status === "accepted" ? "✅" : status === "rejected" ? "❌" : "📝";
    const statusMessage =
      status === "accepted"
        ? "accepted"
        : status === "rejected"
          ? "rejected"
          : "reviewed";

    try {
      await aethexNotificationService.createNotification(
        userId,
        status === "accepted"
          ? "success"
          : status === "rejected"
            ? "error"
            : "info",
        `${statusEmoji} Application ${statusMessage}`,
        message || `Your application has been ${statusMessage}.`,
      );
    } catch (error) {
      console.warn("Failed to create application status notification:", error);
    }
  },

  async newDeviceLogin(
    userId: string,
    deviceName: string,
    location?: string,
  ): Promise<void> {
    try {
      await aethexNotificationService.createNotification(
        userId,
        "warning",
        "🔐 New device login detected",
        `New login from ${deviceName}${location ? ` at ${location}` : ""}. If this wasn't you, please secure your account.`,
      );
    } catch (error) {
      console.warn("Failed to create security notification:", error);
    }
  },

  async moderationReportSubmitted(
    userId: string,
    reportType: string,
  ): Promise<void> {
    try {
      await aethexNotificationService.createNotification(
        userId,
        "warning",
        "🚨 New moderation report",
        `A ${reportType} report has been submitted. Please review.`,
      );
    } catch (error) {
      console.warn("Failed to create moderation notification:", error);
    }
  },
};
