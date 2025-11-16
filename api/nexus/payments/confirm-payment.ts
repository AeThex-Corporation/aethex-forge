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
    const { paymentIntentId, contractId } = req.body;

    if (!paymentIntentId || !contractId) {
      return res.status(400).json({
        error: "Missing required fields: paymentIntentId, contractId",
      });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({
        error: `Payment not succeeded. Status: ${paymentIntent.status}`,
      });
    }

    // Verify contract belongs to user
    const { data: contract, error: contractError } = await admin
      .from("nexus_contracts")
      .select("*")
      .eq("id", contractId)
      .eq("client_id", user.id)
      .single();

    if (contractError || !contract) {
      return res
        .status(403)
        .json({ error: "Contract not found or unauthorized" });
    }

    // Update contract status to active
    const { error: updateError } = await admin
      .from("nexus_contracts")
      .update({
        status: "active",
        start_date: new Date().toISOString(),
      })
      .eq("id", contractId);

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }

    // Create payment record
    const { data: payment, error: paymentError } = await admin
      .from("nexus_payments")
      .insert({
        contract_id: contractId,
        amount: contract.total_amount,
        creator_payout: contract.creator_payout_amount,
        aethex_commission: contract.aethex_commission_amount,
        payment_method: "stripe",
        payment_status: "completed",
        payment_date: new Date().toISOString(),
        stripe_payment_intent_id: paymentIntentId,
      })
      .select()
      .single();

    if (paymentError) {
      return res.status(500).json({ error: paymentError.message });
    }

    // Update creator profile with new earnings
    const { data: creatorProfile } = await admin
      .from("nexus_creator_profiles")
      .select("total_earnings")
      .eq("user_id", contract.creator_id)
      .single();

    const newEarnings =
      (creatorProfile?.total_earnings || 0) + contract.creator_payout_amount;

    await admin
      .from("nexus_creator_profiles")
      .update({ total_earnings: newEarnings })
      .eq("user_id", contract.creator_id);

    // Update opportunity to mark as filled
    await admin
      .from("nexus_opportunities")
      .update({ status: "filled", selected_creator_id: contract.creator_id })
      .eq("id", contract.opportunity_id);

    // Update application status to hired
    await admin
      .from("nexus_applications")
      .update({ status: "hired" })
      .eq("opportunity_id", contract.opportunity_id)
      .eq("creator_id", contract.creator_id);

    return res.status(200).json({
      success: true,
      contractId,
      paymentId: payment.id,
      status: "active",
      message: "Contract activated and payment processed",
    });
  } catch (error: any) {
    console.error("Confirm payment error:", error);
    return res.status(500).json({ error: error?.message || "Server error" });
  }
}
