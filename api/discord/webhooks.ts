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

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    try {
      const { user_id } = req.query;

      if (!user_id) {
        return res.status(400).json({ error: "Missing user_id" });
      }

      const { data, error } = await supabase
        .from("discord_post_webhooks")
        .select(
          "id, guild_id, channel_id, webhook_id, arm_affiliation, auto_post, created_at",
        )
        .eq("user_id", user_id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("[Webhooks API] Query error:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({
        webhooks: data || [],
      });
    } catch (error: any) {
      console.error("[Webhooks API GET] Unexpected error:", error);
      return res
        .status(500)
        .json({ error: error.message || "Internal server error" });
    }
  }

  if (req.method === "POST") {
    try {
      const {
        user_id,
        guild_id,
        channel_id,
        webhook_url,
        webhook_id,
        arm_affiliation,
        auto_post,
      } = req.body;

      if (
        !user_id ||
        !guild_id ||
        !channel_id ||
        !webhook_url ||
        !webhook_id ||
        !arm_affiliation
      ) {
        return res.status(400).json({
          error:
            "Missing required fields: user_id, guild_id, channel_id, webhook_url, webhook_id, arm_affiliation",
        });
      }

      // Validate arm_affiliation
      const validArms = [
        "labs",
        "gameforge",
        "corp",
        "foundation",
        "devlink",
        "nexus",
        "staff",
      ];
      if (!validArms.includes(arm_affiliation)) {
        return res.status(400).json({
          error: `Invalid arm_affiliation. Must be one of: ${validArms.join(", ")}`,
        });
      }

      // Test webhook by sending a test message
      try {
        const testPayload = {
          username: "AeThex Community Feed",
          content:
            "✅ Webhook successfully configured for AeThex Community Posts!",
        };

        const testResponse = await fetch(webhook_url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(testPayload),
        });

        if (!testResponse.ok) {
          return res.status(400).json({
            error: "Webhook URL is invalid or unreachable",
          });
        }
      } catch (webhookError) {
        return res.status(400).json({
          error: "Failed to test webhook connection",
        });
      }

      // Insert webhook configuration
      const { data, error } = await supabase
        .from("discord_post_webhooks")
        .insert({
          user_id,
          guild_id,
          channel_id,
          webhook_url,
          webhook_id,
          arm_affiliation,
          auto_post: auto_post !== false, // Default to true
        })
        .select(
          "id, guild_id, channel_id, webhook_id, arm_affiliation, auto_post, created_at",
        );

      if (error) {
        console.error("[Webhooks API] Insert error:", error);
        if (error.code === "23505") {
          return res.status(409).json({
            error: "Webhook already configured for this arm and channel",
          });
        }
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json({
        webhook: data?.[0],
      });
    } catch (error: any) {
      console.error("[Webhooks API POST] Unexpected error:", error);
      return res
        .status(500)
        .json({ error: error.message || "Internal server error" });
    }
  }

  if (req.method === "PUT") {
    try {
      const { id, user_id, auto_post } = req.body;

      if (!id || !user_id) {
        return res.status(400).json({ error: "Missing id or user_id" });
      }

      // Verify ownership
      const { data: webhook, error: fetchError } = await supabase
        .from("discord_post_webhooks")
        .select("user_id")
        .eq("id", id)
        .single();

      if (fetchError || !webhook) {
        return res.status(404).json({ error: "Webhook not found" });
      }

      if (webhook.user_id !== user_id) {
        return res
          .status(403)
          .json({ error: "You can only manage your own webhooks" });
      }

      // Update webhook
      const { data, error } = await supabase
        .from("discord_post_webhooks")
        .update({ auto_post })
        .eq("id", id)
        .select(
          "id, guild_id, channel_id, webhook_id, arm_affiliation, auto_post, created_at",
        );

      if (error) {
        console.error("[Webhooks API] Update error:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({
        webhook: data?.[0],
      });
    } catch (error: any) {
      console.error("[Webhooks API PUT] Unexpected error:", error);
      return res
        .status(500)
        .json({ error: error.message || "Internal server error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { id, user_id } = req.body;

      if (!id || !user_id) {
        return res.status(400).json({ error: "Missing id or user_id" });
      }

      // Verify ownership
      const { data: webhook, error: fetchError } = await supabase
        .from("discord_post_webhooks")
        .select("user_id")
        .eq("id", id)
        .single();

      if (fetchError || !webhook) {
        return res.status(404).json({ error: "Webhook not found" });
      }

      if (webhook.user_id !== user_id) {
        return res
          .status(403)
          .json({ error: "You can only delete your own webhooks" });
      }

      // Delete webhook
      const { error } = await supabase
        .from("discord_post_webhooks")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("[Webhooks API] Delete error:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({
        success: true,
        message: "Webhook deleted successfully",
      });
    } catch (error: any) {
      console.error("[Webhooks API DELETE] Unexpected error:", error);
      return res
        .status(500)
        .json({ error: error.message || "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
