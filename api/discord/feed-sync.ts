export const config = {
  runtime: "nodejs",
};

const webhookUrl = process.env.DISCORD_FEED_WEBHOOK_URL;

interface FeedPost {
  id: string;
  title: string;
  content: string;
  author_name: string;
  author_avatar?: string | null;
  arm_affiliation: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

export default async function handler(req: any, res: any) {
  // Only accept POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Validate webhook is configured
    if (!webhookUrl) {
      console.warn(
        "[Discord Feed Sync] No webhook URL configured. Skipping Discord post.",
      );
      return res.status(200).json({
        success: true,
        message: "Discord webhook not configured, post skipped",
      });
    }

    const post: FeedPost = req.body;

    // Validate required fields
    if (
      !post.id ||
      !post.title ||
      !post.content ||
      !post.author_name ||
      !post.arm_affiliation
    ) {
      return res.status(400).json({
        error:
          "Missing required fields: id, title, content, author_name, arm_affiliation",
      });
    }

    // Truncate content if too long (Discord has limits)
    const description =
      post.content.length > 1024
        ? post.content.substring(0, 1021) + "..."
        : post.content;

    // Build Discord embed
    const armColors: Record<string, number> = {
      labs: 0xfbbf24, // yellow
      gameforge: 0x22c55e, // green
      corp: 0x3b82f6, // blue
      foundation: 0xef4444, // red
      devlink: 0x06b6d4, // cyan
      nexus: 0xa855f7, // purple
      staff: 0x6366f1, // indigo
    };

    const embed = {
      title: post.title,
      description: description,
      color: armColors[post.arm_affiliation] || 0x8b5cf6,
      author: {
        name: post.author_name,
        icon_url: post.author_avatar || undefined,
      },
      fields: [
        {
          name: "Arm",
          value:
            post.arm_affiliation.charAt(0).toUpperCase() +
            post.arm_affiliation.slice(1),
          inline: true,
        },
        {
          name: "Engagement",
          value: `👍 ${post.likes_count} • 💬 ${post.comments_count}`,
          inline: true,
        },
      ],
      footer: {
        text: "AeThex Community Feed",
      },
      timestamp: post.created_at,
    };

    // Send to Discord webhook
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "AeThex Community Feed",
        avatar_url: "https://aethex.dev/logo.png", // Update with your logo URL
        embeds: [embed],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "[Discord Feed Sync] Webhook failed:",
        response.status,
        errorText,
      );
      return res.status(500).json({
        success: false,
        error: "Failed to post to Discord",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post sent to Discord feed",
    });
  } catch (error: any) {
    console.error("[Discord Feed Sync] Error:", error);
    return res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
}
