const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE,
);

const API_BASE = process.env.VITE_API_BASE || "https://api.aethex.dev";

// Channel IDs for syncing
const ANNOUNCEMENT_CHANNELS = process.env.DISCORD_ANNOUNCEMENT_CHANNELS
  ? process.env.DISCORD_ANNOUNCEMENT_CHANNELS.split(",")
  : ["1435667453244866702"]; // Default to feed channel if env not set

// Arm affiliation mapping based on guild/channel name
const getArmAffiliation = (message) => {
  const guildName = message.guild?.name?.toLowerCase() || "";
  const channelName = message.channel?.name?.toLowerCase() || "";

  const searchString = `${guildName} ${channelName}`.toLowerCase();

  if (searchString.includes("gameforge")) return "gameforge";
  if (searchString.includes("corp")) return "corp";
  if (searchString.includes("foundation")) return "foundation";
  if (searchString.includes("devlink") || searchString.includes("dev-link"))
    return "devlink";
  if (searchString.includes("nexus")) return "nexus";
  if (searchString.includes("staff")) return "staff";

  return "labs"; // Default
};

module.exports = {
  name: "messageCreate",
  async execute(message, client, supabase) {
    try {
      // Ignore bot messages
      if (message.author.bot) return;

      // Only process messages in announcement channels
      if (!ANNOUNCEMENT_CHANNELS.includes(message.channelId)) {
        return;
      }

      // Skip empty messages
      if (!message.content && message.attachments.size === 0) {
        return;
      }

      console.log(
        `[Announcements Sync] Processing message from ${message.author.tag} in #${message.channel.name}`,
      );

      // Get or create system admin user for announcements
      let adminUser = await supabase
        .from("user_profiles")
        .select("id")
        .eq("username", "aethex-announcements")
        .single();

      let authorId = adminUser.data?.id;

      if (!authorId) {
        // Create a system user if it doesn't exist
        const { data: newUser } = await supabase
          .from("user_profiles")
          .insert({
            username: "aethex-announcements",
            full_name: "AeThex Announcements",
            avatar_url: "https://aethex.dev/logo.png",
          })
          .select("id");

        authorId = newUser?.[0]?.id;
      }

      if (!authorId) {
        console.error("[Announcements Sync] Could not get author ID");
        return;
      }

      // Prepare message content
      let content = message.content || "Announcement from Discord";

      // Handle embeds (convert to text)
      if (message.embeds.length > 0) {
        const embed = message.embeds[0];
        if (embed.title) content = embed.title + "\n\n" + content;
        if (embed.description) content += "\n\n" + embed.description;
      }

      // Handle attachments (images, videos)
      let mediaUrl = null;
      let mediaType = "none";

      if (message.attachments.size > 0) {
        const attachment = message.attachments.first();
        if (attachment) {
          mediaUrl = attachment.url;

          const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
          const videoExtensions = [".mp4", ".webm", ".mov", ".avi"];

          const attachmentLower = attachment.name.toLowerCase();

          if (imageExtensions.some((ext) => attachmentLower.endsWith(ext))) {
            mediaType = "image";
          } else if (
            videoExtensions.some((ext) => attachmentLower.endsWith(ext))
          ) {
            mediaType = "video";
          }
        }
      }

      // Determine arm affiliation
      const armAffiliation = getArmAffiliation(message);

      // Prepare post content JSON
      const postContent = JSON.stringify({
        text: content,
        mediaUrl: mediaUrl,
        mediaType: mediaType,
        source: "discord",
        discord_message_id: message.id,
        discord_author: message.author.tag,
      });

      // Create post in AeThex
      const { data: createdPost, error: insertError } = await supabase
        .from("community_posts")
        .insert({
          title: content.substring(0, 100) || "Discord Announcement",
          content: postContent,
          arm_affiliation: armAffiliation,
          author_id: authorId,
          tags: ["discord", "announcement"],
          category: "announcement",
          is_published: true,
          likes_count: 0,
          comments_count: 0,
        })
        .select(
          `id, title, content, arm_affiliation, author_id, created_at, likes_count, comments_count,
           user_profiles!community_posts_author_id_fkey (id, username, full_name, avatar_url)`,
        );

      if (insertError) {
        console.error(
          "[Announcements Sync] Failed to create post:",
          insertError,
        );
        try {
          await message.react("❌");
        } catch (reactionError) {
          console.warn(
            "[Announcements Sync] Could not add reaction:",
            reactionError,
          );
        }
        return;
      }

      // Sync to Discord feed webhook if configured
      if (process.env.DISCORD_FEED_WEBHOOK_URL && createdPost?.[0]) {
        try {
          const post = createdPost[0];
          const armColors = {
            labs: 0xfbbf24,
            gameforge: 0x22c55e,
            corp: 0x3b82f6,
            foundation: 0xef4444,
            devlink: 0x06b6d4,
            nexus: 0xa855f7,
            staff: 0x6366f1,
          };

          const embed = {
            title: post.title,
            description: content.substring(0, 1024),
            color: armColors[armAffiliation] || 0x8b5cf6,
            author: {
              name: `${message.author.username} (${armAffiliation.toUpperCase()})`,
              icon_url: message.author.displayAvatarURL(),
            },
            footer: {
              text: "Synced from Discord",
            },
            timestamp: new Date().toISOString(),
          };

          await fetch(process.env.DISCORD_FEED_WEBHOOK_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: "AeThex Community Feed",
              embeds: [embed],
            }),
          });
        } catch (webhookError) {
          console.warn(
            "[Announcements Sync] Failed to sync to webhook:",
            webhookError,
          );
        }
      }

      console.log(
        `[Announcements Sync] ✅ Posted announcement from Discord to AeThex (${armAffiliation})`,
      );

      // React with success emoji
      try {
        await message.react("✅");
      } catch (reactionError) {
        console.warn(
          "[Announcements Sync] Could not add success reaction:",
          reactionError,
        );
      }
    } catch (error) {
      console.error("[Announcements Sync] Unexpected error:", error);

      try {
        await message.react("⚠️");
      } catch (reactionError) {
        console.warn(
          "[Announcements Sync] Could not add warning reaction:",
          reactionError,
        );
      }
    }
  },
};
