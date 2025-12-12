import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import { getAdminClient } from "../_supabase.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-04-10",
});

const SUBSCRIPTION_TIERS = {
  pro: {
    name: "Pro",
    priceMonthly: 900,
    priceId: process.env.STRIPE_PRO_PRICE_ID || "",
  },
  council: {
    name: "Council",
    priceMonthly: 2900,
    priceId: process.env.STRIPE_COUNCIL_PRICE_ID || "",
  },
} as const;

type TierKey = keyof typeof SUBSCRIPTION_TIERS;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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

  try {
    const { tier, successUrl, cancelUrl } = req.body;

    if (!tier || !["pro", "council"].includes(tier)) {
      return res.status(400).json({
        error: "Invalid tier. Must be 'pro' or 'council'",
      });
    }

    const tierKey = tier as TierKey;
    const tierConfig = SUBSCRIPTION_TIERS[tierKey];

    const { data: profile } = await admin
      .from("user_profiles")
      .select("stripe_customer_id, tier, full_name")
      .eq("id", user.id)
      .single();

    if (profile?.tier === tier || profile?.tier === "council") {
      return res.status(400).json({
        error:
          profile?.tier === "council"
            ? "You already have the highest tier"
            : "You already have this subscription",
      });
    }

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: profile?.full_name || user.email,
        metadata: {
          userId: user.id,
        },
      });
      customerId = customer.id;

      await admin
        .from("user_profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    const baseUrl =
      process.env.VITE_APP_URL || process.env.REPLIT_DEV_DOMAIN
        ? `https://${process.env.REPLIT_DEV_DOMAIN}`
        : "https://aethex.dev";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `AeThex ${tierConfig.name} Subscription`,
              description: `Monthly ${tierConfig.name} tier subscription for AeThex`,
            },
            unit_amount: tierConfig.priceMonthly,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      success_url: successUrl || `${baseUrl}/dashboard?subscription=success`,
      cancel_url: cancelUrl || `${baseUrl}/pricing?subscription=cancelled`,
      metadata: {
        userId: user.id,
        tier: tierKey,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          tier: tierKey,
        },
      },
    });

    return res.status(200).json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error("Checkout session error:", error);
    return res.status(500).json({ error: error?.message || "Server error" });
  }
}
