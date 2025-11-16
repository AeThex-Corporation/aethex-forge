import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import { getAdminClient } from "../../_supabase.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-11-20",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const admin = getAdminClient();
  const sig = req.headers["stripe-signature"] as string;
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) {
      return res
        .status(400)
        .json({ error: "Missing webhook signature or secret" });
    }

    const body =
      typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (error: any) {
    console.error("Webhook signature verification failed:", error.message);
    return res
      .status(400)
      .json({ error: "Webhook signature verification failed" });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const { opportunityId, creatorId, clientId } = paymentIntent.metadata;

        // Find contract by payment intent ID
        const { data: contract } = await admin
          .from("nexus_contracts")
          .select("*")
          .eq("stripe_payment_intent_id", paymentIntent.id)
          .single();

        if (contract) {
          // Update contract status
          await admin
            .from("nexus_contracts")
            .update({
              status: "active",
              start_date: new Date().toISOString(),
            })
            .eq("id", contract.id);

          // Create payment record if not already created
          const { data: existingPayment } = await admin
            .from("nexus_payments")
            .select("id")
            .eq("stripe_payment_intent_id", paymentIntent.id)
            .single();

          if (!existingPayment) {
            await admin.from("nexus_payments").insert({
              contract_id: contract.id,
              amount: contract.total_amount,
              creator_payout: contract.creator_payout_amount,
              aethex_commission: contract.aethex_commission_amount,
              payment_method: "stripe",
              payment_status: "completed",
              payment_date: new Date().toISOString(),
              stripe_payment_intent_id: paymentIntent.id,
            });
          }

          // Update creator earnings
          const { data: creatorProfile } = await admin
            .from("nexus_creator_profiles")
            .select("total_earnings")
            .eq("user_id", creatorId)
            .single();

          const newEarnings =
            (creatorProfile?.total_earnings || 0) +
            contract.creator_payout_amount;

          await admin
            .from("nexus_creator_profiles")
            .update({ total_earnings: newEarnings })
            .eq("user_id", creatorId);

          // Update opportunity status
          await admin
            .from("nexus_opportunities")
            .update({ status: "filled", selected_creator_id: creatorId })
            .eq("id", opportunityId);

          // Update application status
          await admin
            .from("nexus_applications")
            .update({ status: "hired" })
            .eq("opportunity_id", opportunityId)
            .eq("creator_id", creatorId);
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        // Find and update contract
        const { data: contract } = await admin
          .from("nexus_contracts")
          .select("*")
          .eq("stripe_payment_intent_id", paymentIntent.id)
          .single();

        if (contract) {
          // Update contract to cancelled
          await admin
            .from("nexus_contracts")
            .update({ status: "cancelled" })
            .eq("id", contract.id);

          // Create failed payment record
          await admin.from("nexus_payments").insert({
            contract_id: contract.id,
            amount: contract.total_amount,
            creator_payout: 0,
            aethex_commission: 0,
            payment_method: "stripe",
            payment_status: "failed",
            stripe_payment_intent_id: paymentIntent.id,
          });
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;

        // Find payment by stripe charge ID
        const { data: payment } = await admin
          .from("nexus_payments")
          .select("*")
          .eq("stripe_charge_id", charge.id)
          .single();

        if (payment) {
          // Update payment status
          await admin
            .from("nexus_payments")
            .update({ payment_status: "refunded" })
            .eq("id", payment.id);

          // Update contract status
          await admin
            .from("nexus_contracts")
            .update({ status: "cancelled" })
            .eq("id", payment.contract_id);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return res
      .status(500)
      .json({ error: error?.message || "Webhook processing failed" });
  }
}
