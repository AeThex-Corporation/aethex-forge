import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import { getAdminClient } from "../_supabase.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-04-10",
});

const webhookSecret = process.env.STRIPE_SUBSCRIPTION_WEBHOOK_SECRET || "";

async function getUserIdBySubscription(admin: any, subscriptionId: string): Promise<string | null> {
  const { data } = await admin
    .from("user_profiles")
    .select("id")
    .eq("stripe_subscription_id", subscriptionId)
    .single();
  return data?.id || null;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(req: VercelRequest): Promise<string> {
  if (typeof req.body === "string") {
    return req.body;
  }
  
  const chunks: Buffer[] = [];
  for await (const chunk of req as any) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const admin = getAdminClient();
  const sig = req.headers["stripe-signature"] as string;
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) {
      console.warn("Missing webhook signature or secret");
      return res
        .status(400)
        .json({ error: "Missing webhook signature or secret" });
    }

    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (error: any) {
    console.error("Webhook signature verification failed:", error.message);
    return res
      .status(400)
      .json({ error: "Webhook signature verification failed" });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const { userId, tier } = session.metadata || {};

        if (userId && tier && session.subscription) {
          await admin
            .from("user_profiles")
            .update({
              tier: tier,
              stripe_subscription_id: session.subscription as string,
            })
            .eq("id", userId);

          console.log(
            `[Subscription] User ${userId} upgraded to ${tier} tier`
          );
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        let { userId, tier } = subscription.metadata || {};

        if (!userId) {
          userId = await getUserIdBySubscription(admin, subscription.id);
        }

        if (userId) {
          const newStatus = subscription.status;

          if (newStatus === "active") {
            await admin
              .from("user_profiles")
              .update({
                tier: tier || "pro",
                stripe_subscription_id: subscription.id,
              })
              .eq("id", userId);
            
            console.log(
              `[Subscription] User ${userId} subscription active, tier: ${tier || "pro"}`
            );
          } else if (
            newStatus === "canceled" ||
            newStatus === "unpaid" ||
            newStatus === "past_due"
          ) {
            await admin
              .from("user_profiles")
              .update({
                tier: "free",
              })
              .eq("id", userId);

            console.log(
              `[Subscription] User ${userId} subscription ${newStatus}, downgraded to free`
            );
          }
        } else {
          console.warn(
            `[Subscription] Could not find user for subscription ${subscription.id}`
          );
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        let { userId } = subscription.metadata || {};

        if (!userId) {
          userId = await getUserIdBySubscription(admin, subscription.id);
        }

        if (userId) {
          await admin
            .from("user_profiles")
            .update({
              tier: "free",
              stripe_subscription_id: null,
            })
            .eq("id", userId);

          console.log(
            `[Subscription] User ${userId} subscription deleted, downgraded to free`
          );
        } else {
          console.warn(
            `[Subscription] Could not find user for deleted subscription ${subscription.id}`
          );
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const { userId } = subscription.metadata || {};

          if (userId) {
            console.log(
              `[Subscription] Payment succeeded for user ${userId}, subscription ${subscriptionId}`
            );
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const { userId } = subscription.metadata || {};

          if (userId) {
            console.warn(
              `[Subscription] Payment failed for user ${userId}, subscription ${subscriptionId}`
            );
          }
        }
        break;
      }

      default:
        console.log(`[Subscription Webhook] Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error: any) {
    console.error("Subscription webhook processing error:", error);
    return res
      .status(500)
      .json({ error: error?.message || "Webhook processing failed" });
  }
}
