import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import { getAdminClient } from "../../_supabase.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-11-20",
});

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
    const { opportunityId, creatorId, amount, contractType } = req.body;

    if (!opportunityId || !creatorId || !amount || !contractType) {
      return res.status(400).json({
        error:
          "Missing required fields: opportunityId, creatorId, amount, contractType",
      });
    }

    // Verify the user is the client who posted the opportunity
    const { data: opportunity, error: oppError } = await admin
      .from("nexus_opportunities")
      .select("posted_by, title")
      .eq("id", opportunityId)
      .single();

    if (oppError || !opportunity || opportunity.posted_by !== user.id) {
      return res.status(403).json({
        error: "Not authorized to post contracts for this opportunity",
      });
    }

    // Verify the creator has applied
    const { data: application, error: appError } = await admin
      .from("nexus_applications")
      .select("id, status")
      .eq("opportunity_id", opportunityId)
      .eq("creator_id", creatorId)
      .single();

    if (appError || !application || application.status !== "accepted") {
      return res
        .status(400)
        .json({ error: "Creator application not accepted" });
    }

    // Calculate commission (20% to AeThex)
    const commissionPercent = 20;
    const commissionAmount = Math.round((amount * commissionPercent) / 100);
    const creatorPayout = Math.round(amount - commissionAmount);

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      metadata: {
        opportunityId,
        creatorId,
        clientId: user.id,
        contractType,
      },
      description: `NEXUS Contract: ${opportunity.title}`,
    });

    // Create contract record
    const { data: contract, error: contractError } = await admin
      .from("nexus_contracts")
      .insert({
        opportunity_id: opportunityId,
        creator_id: creatorId,
        client_id: user.id,
        title: opportunity.title,
        contract_type: contractType,
        total_amount: amount,
        aethex_commission_percent: commissionPercent,
        aethex_commission_amount: commissionAmount,
        creator_payout_amount: creatorPayout,
        status: "pending",
      })
      .select()
      .single();

    if (contractError) {
      return res.status(500).json({ error: contractError.message });
    }

    // Store payment intent ID in contract
    await admin
      .from("nexus_contracts")
      .update({ stripe_payment_intent_id: paymentIntent.id })
      .eq("id", contract.id);

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      contractId: contract.id,
      paymentIntentId: paymentIntent.id,
      amount,
      commissionAmount,
      creatorPayout,
    });
  } catch (error: any) {
    console.error("Payment intent error:", error);
    return res.status(500).json({ error: error?.message || "Server error" });
  }
}
