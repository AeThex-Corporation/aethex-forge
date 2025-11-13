export const config = {
  runtime: "nodejs",
};

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE;

if (!supabaseUrl || !supabaseServiceRole) {
  throw new Error("Missing Supabase configuration");
}

const supabase = createClient(supabaseUrl, supabaseServiceRole);

interface WebhookPayload {
  username: string;
  avatar_url?: string;
  embeds: Array<{
    title: string;
    description: string;
    color: number;
    author: {
      name: string;
      icon_url?: string;
    };
    fields?: Array<{
      name: string;
      value: string;
      inline: boolean;
    }>;
    footer: {
      text: string;
    };
  }>;
}

const ARM_COLORS: Record<string, number> = {
  labs: 0xfbbf24,
  gameforge: 0x22c55e,
  corp: 0x3b82f6,
  foundation: 0xef4444,
  devlink: 0x06b6d4,
  nexus: 0xa855f7,
  staff: 0x7c3aed,
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      post_id,
      title,
      content,
      arm_affiliation,
      author_id,
      tags,
      category,
    } = req.body;

    if (!post_id || !title || !content || !arm_affiliation || !author_id) {
      return res.status(400).json({
        error:
          "Missing required fields: post_id, title, content, arm_affiliation, author_id",
      });
    }

    // Get author details
    const { data: author, error: authorError } = await supabase
      .from("user_profiles")
      .select("username, full_name, avatar_url")
      .eq("id", author_id)
      .single();

    if (authorError || !author) {
      console.error("[Discord Post API] Author not found:", authorError);
      return res.status(404).json({ error: "Author not found" });
    }

    // Get user's Discord webhooks for this arm
    const { data: webhooks, error: webhooksError } = await supabase
      .from("discord_post_webhooks")
      .select("webhook_url")
      .eq("user_id", author_id)
      .eq("arm_affiliation", arm_affiliation)
      .eq("auto_post", true);

    if (webhooksError) {
      console.error("[Discord Post API] Webhooks query error:", webhooksError);
      return res.status(500).json({ error: webhooksError.message });
    }

    if (!webhooks || webhooks.length === 0) {
      // No webhooks configured, just return success
      return res.status(200).json({
        success: true,
        message: "Post created (no Discord webhooks configured)",
        webhooksSent: 0,
      });
    }

    // Build Discord embed
    const contentPreview =
      content.substring(0, 500) + (content.length > 500 ? "..." : "");
    const color = ARM_COLORS[arm_affiliation] || 0x6366f1;

    const embedPayload: WebhookPayload = {
      username: "AeThex Community Feed",
      avatar_url:
        "https://raw.githubusercontent.com/aethex/brand-assets/main/logo.png",
      embeds: [
        {
          title,
          description: contentPreview,
          color,
          author: {
            name: author.full_name || author.username || "Anonymous",
            icon_url: author.avatar_url,
          },
          fields: [],
          footer: {
            text: `Posted in ${arm_affiliation.toUpperCase()} • AeThex Community`,
          },
        },
      ],
    };

    // Add optional fields
    if (category) {
      embedPayload.embeds[0].fields!.push({
        name: "Category",
        value: category,
        inline: true,
      });
    }

    if (tags && tags.length > 0) {
      embedPayload.embeds[0].fields!.push({
        name: "Tags",
        value: tags.map((tag: string) => `#${tag}`).join(" "),
        inline: true,
      });
    }

    // Send to all webhooks
    const webhookResults = await Promise.allSettled(
      webhooks.map(async (webhook: any) => {
        try {
          const response = await fetch(webhook.webhook_url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(embedPayload),
          });

          if (!response.ok) {
            const error = await response.text();
            console.error(
              `[Discord Post API] Webhook failed:`,
              response.status,
              error,
            );
            throw new Error(`Discord webhook error: ${response.status}`);
          }

          return { success: true, webhookUrl: webhook.webhook_url };
        } catch (error: any) {
          console.error(
            `[Discord Post API] Error sending to webhook:`,
            error.message,
          );
          return {
            success: false,
            webhookUrl: webhook.webhook_url,
            error: error.message,
          };
        }
      }),
    );

    const successful = webhookResults.filter(
      (r) => r.status === "fulfilled" && r.value.success,
    ).length;

    return res.status(200).json({
      success: true,
      message: `Post sent to ${successful} Discord webhook(s)`,
      webhooksSent: successful,
      totalWebhooks: webhooks.length,
    });
  } catch (error: any) {
    console.error("[Discord Post API] Unexpected error:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error" });
  }
}
