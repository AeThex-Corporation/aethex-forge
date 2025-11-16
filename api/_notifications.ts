import { getAdminClient } from "./_supabase.js";

export async function createNotification(
  userId: string,
  type: string,
  title: string,
  message: string,
): Promise<void> {
  try {
    const admin = getAdminClient();
    await admin.from("notifications").insert({
      user_id: userId,
      type,
      title,
      message,
    });
  } catch (error) {
    console.warn("Failed to create notification:", error);
    // Non-blocking - don't throw
  }
}

export async function notifyAccountLinked(
  userId: string,
  provider: string,
): Promise<void> {
  await createNotification(
    userId,
    "success",
    `🔗 Account Linked: ${provider}`,
    `Your ${provider} account has been successfully linked.`,
  );
}

export async function notifyOnboardingComplete(userId: string): Promise<void> {
  await createNotification(
    userId,
    "success",
    "🎉 Welcome to AeThex!",
    "You've completed your profile setup. Let's get started!",
  );
}

// Dummy default export for Vercel (this file is a utility, not a handler)
import type { VercelRequest, VercelResponse } from "@vercel/node";
export default async function handler(req: VercelRequest, res: VercelResponse) {
  return res.status(501).json({ error: "Not a handler" });
}
