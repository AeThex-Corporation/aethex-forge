const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE,
);

const FEED_CHANNEL_ID = process.env.DISCORD_FEED_CHANNEL_ID;
const FEED_GUILD_ID = process.env.DISCORD_FEED_GUILD_ID;

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    // Ignore bot messages
    if (message.author.bot) return;

    // Only listen to messages in the feed channel
    if (FEED_CHANNEL_ID && message.channelId !== FEED_CHANNEL_ID) {
      return;
    }

    // Only listen to the correct guild
    if (FEED_GUILD_ID && message.guildId !== FEED_GUILD_ID) {
      return;
    }

    try {
      // Get user's linked AeThex account
      const { data: linkedAccount, error } = await supabase
        .from("discord_links")
        .select("user_id")
        .eq("discord_user_id", message.author.id)
        .single();

      if (error || !linkedAccount) {
        // Optionally, send a DM asking them to link their account
        try {
          await message.author.send(
            "To have your message posted to AeThex, please link your Discord account! Use `/verify` command.",
          );
        } catch (dmError) {
          console.warn("[Feed Sync] Could not send DM to user:", dmError);
        }
        return;
      }

      // Get user profile for author info
      const { data: userProfile, error: profileError } = await supabase
        .from("user_profiles")
        .select("id, username, full_name, avatar_url")
        .eq("id", linkedAccount.user_id)
        .single();

      if (profileError || !userProfile) {
        console.error(
          "[Feed Sync] Could not fetch user profile:",
          profileError,
        );
        return;
      }

      // Prepare message content and media
      let content = message.content || "Shared a message on Discord";

      // Handle embeds and attachments
      let mediaUrl = null;
      let mediaType = "none";

      // Check for attachments (images, videos)
      if (message.attachments.size > 0) {
        const attachment = message.attachments.first();
        if (attachment) {
          mediaUrl = attachment.url;

          // Detect media type
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

      // Prepare post content JSON
      const postContent = JSON.stringify({
        text: content,
        mediaUrl: mediaUrl,
        mediaType: mediaType,
      });

      // Determine arm affiliation from guild name or default to 'labs'
      let armAffiliation = "labs";
      const guild = message.guild;
      if (guild) {
        const guildNameLower = guild.name.toLowerCase();

        if (guildNameLower.includes("gameforge")) armAffiliation = "gameforge";
        else if (guildNameLower.includes("corp")) armAffiliation = "corp";
        else if (guildNameLower.includes("foundation"))
          armAffiliation = "foundation";
        else if (guildNameLower.includes("devlink")) armAffiliation = "devlink";
        else if (guildNameLower.includes("nexus")) armAffiliation = "nexus";
        else if (guildNameLower.includes("staff")) armAffiliation = "staff";
      }

      // Create post in AeThex
      const { data: createdPost, error: insertError } = await supabase
        .from("community_posts")
        .insert({
          title: content.substring(0, 100) || "Discord Shared Message",
          content: postContent,
          arm_affiliation: armAffiliation,
          author_id: userProfile.id,
          tags: ["discord"],
          category: null,
          is_published: true,
          likes_count: 0,
          comments_count: 0,
        })
        .select(
          `id, title, content, arm_affiliation, author_id, created_at, updated_at, likes_count, comments_count,
           user_profiles!community_posts_author_id_fkey (id, username, full_name, avatar_url)`,
        );

      if (insertError) {
        console.error("[Feed Sync] Failed to create post:", insertError);
        try {
          await message.react("❌");
        } catch (reactionError) {
          console.warn("[Feed Sync] Could not add reaction:", reactionError);
        }
        return;
      }

      console.log(
        `[Feed Sync] ✅ Posted message from ${message.author.tag} to AeThex`,
      );

      // React with success emoji
      try {
        await message.react("✅");
      } catch (reactionError) {
        console.warn(
          "[Feed Sync] Could not add success reaction:",
          reactionError,
        );
      }

      // Send confirmation DM
      try {
        await message.author.send(
          `✅ Your message was posted to AeThex Community Feed! Check it out at https://aethex.dev/feed`,
        );
      } catch (dmError) {
        console.warn("[Feed Sync] Could not send confirmation DM:", dmError);
      }
    } catch (error) {
      console.error("[Feed Sync] Unexpected error:", error);

      try {
        await message.react("⚠️");
      } catch (reactionError) {
        console.warn(
          "[Feed Sync] Could not add warning reaction:",
          reactionError,
        );
      }
    }
  },
};
