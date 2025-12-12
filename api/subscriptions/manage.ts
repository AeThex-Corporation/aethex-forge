import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import { getAdminClient } from "../_supabase.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-04-10",
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const admin = getAdminClient();

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user },
    error: authError,
  } = await admin.auth.getUser(token);

  if (authError || !user) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const { data: profile } = await admin
    .from("user_profiles")
    .select("tier, stripe_customer_id, stripe_subscription_id")
    .eq("id", user.id)
    .single();

  if (req.method === "GET") {
    try {
      let subscription = null;

      if (profile?.stripe_subscription_id) {
        try {
          const stripeSubscription = await stripe.subscriptions.retrieve(
            profile.stripe_subscription_id
          );
          subscription = {
            id: stripeSubscription.id,
            status: stripeSubscription.status,
            currentPeriodEnd: stripeSubscription.current_period_end,
            cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
          };
        } catch (err) {
          console.warn("Failed to fetch Stripe subscription:", err);
        }
      }

      return res.status(200).json({
        tier: profile?.tier || "free",
        subscription,
      });
    } catch (error: any) {
      console.error("Get subscription error:", error);
      return res.status(500).json({ error: error?.message || "Server error" });
    }
  }

  if (req.method === "POST") {
    const { action } = req.body;

    if (action === "cancel") {
      try {
        if (!profile?.stripe_subscription_id) {
          return res.status(400).json({ error: "No active subscription" });
        }

        const subscription = await stripe.subscriptions.update(
          profile.stripe_subscription_id,
          { cancel_at_period_end: true }
        );

        return res.status(200).json({
          message: "Subscription will be cancelled at period end",
          cancelAt: subscription.current_period_end,
        });
      } catch (error: any) {
        console.error("Cancel subscription error:", error);
        return res.status(500).json({ error: error?.message || "Server error" });
      }
    }

    if (action === "resume") {
      try {
        if (!profile?.stripe_subscription_id) {
          return res.status(400).json({ error: "No active subscription" });
        }

        const subscription = await stripe.subscriptions.update(
          profile.stripe_subscription_id,
          { cancel_at_period_end: false }
        );

        return res.status(200).json({
          message: "Subscription resumed",
          status: subscription.status,
        });
      } catch (error: any) {
        console.error("Resume subscription error:", error);
        return res.status(500).json({ error: error?.message || "Server error" });
      }
    }

    if (action === "portal") {
      try {
        if (!profile?.stripe_customer_id) {
          return res.status(400).json({ error: "No Stripe customer found" });
        }

        const baseUrl =
          process.env.VITE_APP_URL || process.env.REPLIT_DEV_DOMAIN
            ? `https://${process.env.REPLIT_DEV_DOMAIN}`
            : "https://aethex.dev";

        const portalSession = await stripe.billingPortal.sessions.create({
          customer: profile.stripe_customer_id,
          return_url: `${baseUrl}/dashboard`,
        });

        return res.status(200).json({
          url: portalSession.url,
        });
      } catch (error: any) {
        console.error("Portal session error:", error);
        return res.status(500).json({ error: error?.message || "Server error" });
      }
    }

    return res.status(400).json({
      error: "Invalid action. Must be 'cancel', 'resume', or 'portal'",
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
