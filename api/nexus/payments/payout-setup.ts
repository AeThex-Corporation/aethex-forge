import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import { getAdminClient } from "../../_supabase.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-11-20",
});

const apiBase = process.env.VITE_API_BASE || "https://aethex.dev";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const admin = getAdminClient();

  // Only authenticated requests
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
    const { type } = req.body;

    if (!type || !["create", "complete"].includes(type)) {
      return res.status(400).json({
        error: "Invalid type. Must be 'create' or 'complete'",
      });
    }

    if (type === "create") {
      // Check if creator already has a Stripe Connect account
      const { data: creatorProfile } = await admin
        .from("nexus_creator_profiles")
        .select("stripe_connect_account_id")
        .eq("user_id", user.id)
        .single();

      let accountId = creatorProfile?.stripe_connect_account_id;

      if (!accountId) {
        // Create a new Stripe Connect account
        const account = await stripe.accounts.create({
          type: "express",
          country: "US",
          email: user.email || "",
          metadata: {
            aethex_user_id: user.id,
          },
        });
        accountId = account.id;

        // Save account ID
        await admin
          .from("nexus_creator_profiles")
          .update({ stripe_connect_account_id: accountId })
          .eq("user_id", user.id);
      }

      // Create onboarding link
      const onboardingLink = await stripe.accountLinks.create({
        account: accountId,
        type: "account_onboarding",
        refresh_url: `${apiBase}/dashboard/nexus?tab=profile&stripe_refresh=true`,
        return_url: `${apiBase}/dashboard/nexus?tab=profile&stripe_complete=true`,
      });

      return res.status(200).json({
        onboardingUrl: onboardingLink.url,
        accountId,
      });
    }

    if (type === "complete") {
      // Verify onboarding is complete
      const { data: creatorProfile } = await admin
        .from("nexus_creator_profiles")
        .select("stripe_connect_account_id")
        .eq("user_id", user.id)
        .single();

      if (!creatorProfile?.stripe_connect_account_id) {
        return res
          .status(400)
          .json({ error: "No Stripe Connect account found" });
      }

      const account = await stripe.accounts.retrieve(
        creatorProfile.stripe_connect_account_id,
      );

      if (!account.charges_enabled || !account.payouts_enabled) {
        return res.status(400).json({
          error:
            "Account setup not complete. Please complete all required steps.",
          chargesEnabled: account.charges_enabled,
          payoutsEnabled: account.payouts_enabled,
        });
      }

      // Update creator profile to mark as verified
      await admin
        .from("nexus_creator_profiles")
        .update({ verified: true, stripe_account_verified: true })
        .eq("user_id", user.id);

      return res.status(200).json({
        success: true,
        verified: true,
        message: "Stripe Connect account setup complete",
      });
    }
  } catch (error: any) {
    console.error("Payout setup error:", error);
    return res.status(500).json({ error: error?.message || "Server error" });
  }
}
