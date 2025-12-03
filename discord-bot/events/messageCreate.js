const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE,
);

const FEED_CHANNEL_ID = process.env.DISCORD_FEED_CHANNEL_ID;
const FEED_GUILD_ID = process.env.DISCORD_FEED_GUILD_ID;
const API_BASE = process.env.VITE_API_BASE || "https://api.aethex.dev";

// Announcement channels to sync to feed
const ANNOUNCEMENT_CHANNELS = process.env.DISCORD_ANNOUNCEMENT_CHANNELS
  ? process.env.DISCORD_ANNOUNCEMENT_CHANNELS.split(",").map((id) => id.trim())
  : [];

// Main chat channels - sync ALL messages from these channels to the feed
const MAIN_CHAT_CHANNELS = process.env.DISCORD_MAIN_CHAT_CHANNELS
  ? process.env.DISCORD_MAIN_CHAT_CHANNELS.split(",").map((id) => id.trim())
  : [];

// Helper: Get arm affiliation from message context
function getArmAffiliation(message) {
  const guildName = message.guild?.name?.toLowerCase() || "";
  const channelName = message.channel?.name?.toLowerCase() || "";
  const searchString = `${guildName} ${channelName}`;

  if (searchString.includes("gameforge")) return "gameforge";
  if (searchString.includes("corp")) return "corp";
  if (searchString.includes("foundation")) return "foundation";
  if (searchString.includes("devlink") || searchString.includes("dev-link"))
    return "devlink";
  if (searchString.includes("nexus")) return "nexus";
  if (searchString.includes("staff")) return "staff";

  return "labs";
}

// Handle main chat messages - sync ALL messages to feed
async function handleMainChatSync(message) {
  try {
    console.log(
      `[Main Chat] Processing from ${message.author.tag} in #${message.channel.name}`,
    );

    // Check if user has linked account
    const { data: linkedAccount } = await supabase
      .from("discord_links")
      .select("user_id")
      .eq("discord_id", message.author.id)
      .single();

    let authorId = linkedAccount?.user_id;
    let authorInfo = null;

    if (authorId) {
      // Get linked user's profile
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("id, username, full_name, avatar_url")
        .eq("id", authorId)
        .single();
      authorInfo = profile;
    }

    // If no linked account, use or create a Discord guest profile
    if (!authorId) {
      // Check if we have a discord guest profile for this user
      const discordUsername = `discord-${message.author.id}`;
      let { data: guestProfile } = await supabase
        .from("user_profiles")
        .select("id, username, full_name, avatar_url")
        .eq("username", discordUsername)
        .single();

      if (!guestProfile) {
        // Create guest profile
        const { data: newProfile, error: createError } = await supabase
          .from("user_profiles")
          .insert({
            username: discordUsername,
            full_name: message.author.displayName || message.author.username,
            avatar_url: message.author.displayAvatarURL({ size: 256 }),
          })
          .select("id, username, full_name, avatar_url")
          .single();

        if (createError) {
          console.error("[Main Chat] Could not create guest profile:", createError);
          return;
        }
        guestProfile = newProfile;
      }

      authorId = guestProfile?.id;
      authorInfo = guestProfile;
    }

    if (!authorId) {
      console.error("[Main Chat] Could not get author ID");
      return;
    }

    // Prepare content
    let content = message.content || "Shared a message on Discord";
    let mediaUrl = null;
    let mediaType = "none";

    if (message.attachments.size > 0) {
      const attachment = message.attachments.first();
      if (attachment) {
        mediaUrl = attachment.url;
        const attachmentLower = attachment.name.toLowerCase();

        if (
          [".jpg", ".jpeg", ".png", ".gif", ".webp"].some((ext) =>
            attachmentLower.endsWith(ext),
          )
        ) {
          mediaType = "image";
        } else if (
          [".mp4", ".webm", ".mov", ".avi"].some((ext) =>
            attachmentLower.endsWith(ext),
          )
        ) {
          mediaType = "video";
        }
      }
    }

    // Determine arm affiliation
    const armAffiliation = getArmAffiliation(message);

    // Prepare post content with Discord metadata
    const postContent = JSON.stringify({
      text: content,
      mediaUrl: mediaUrl,
      mediaType: mediaType,
      source: "discord",
      discord_message_id: message.id,
      discord_channel_id: message.channelId,
      discord_channel_name: message.channel.name,
      discord_guild_id: message.guildId,
      discord_guild_name: message.guild?.name,
      discord_author_id: message.author.id,
      discord_author_tag: message.author.tag,
      discord_author_avatar: message.author.displayAvatarURL({ size: 256 }),
      is_linked_user: !!linkedAccount,
    });

    // Create post
    const { data: createdPost, error: insertError } = await supabase
      .from("community_posts")
      .insert({
        title: content.substring(0, 100) || "Discord Message",
        content: postContent,
        arm_affiliation: armAffiliation,
        author_id: authorId,
        tags: ["discord", "main-chat"],
        category: "discord",
        is_published: true,
        likes_count: 0,
        comments_count: 0,
      })
      .select("id");

    if (insertError) {
      console.error("[Main Chat] Post creation failed:", insertError);
      return;
    }

    console.log(
      `[Main Chat] ✅ Synced message from ${message.author.tag} to AeThex feed`,
    );
  } catch (error) {
    console.error("[Main Chat] Error:", error);
  }
}

// Handle announcements from designated channels
async function handleAnnouncementSync(message) {
  try {
    console.log(
      `[Announcements] Processing from ${message.author.tag} in #${message.channel.name}`,
    );

    // Get or create system announcement user
    let { data: adminUser } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("username", "aethex-announcements")
      .single();

    let authorId = adminUser?.id;

    if (!authorId) {
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
      console.error("[Announcements] Could not get author ID");
      await message.react("❌");
      return;
    }

    // Prepare content
    let content = message.content || "Announcement from Discord";

    // Handle embeds
    if (message.embeds.length > 0) {
      const embed = message.embeds[0];
      if (embed.title) content = `**${embed.title}**\n\n${content}`;
      if (embed.description) content += `\n\n${embed.description}`;
    }

    // Handle attachments
    let mediaUrl = null;
    let mediaType = "none";

    if (message.attachments.size > 0) {
      const attachment = message.attachments.first();
      if (attachment) {
        mediaUrl = attachment.url;
        const attachmentLower = attachment.name.toLowerCase();

        if (
          [".jpg", ".jpeg", ".png", ".gif", ".webp"].some((ext) =>
            attachmentLower.endsWith(ext),
          )
        ) {
          mediaType = "image";
        } else if (
          [".mp4", ".webm", ".mov", ".avi"].some((ext) =>
            attachmentLower.endsWith(ext),
          )
        ) {
          mediaType = "video";
        }
      }
    }

    // Determine arm
    const armAffiliation = getArmAffiliation(message);

    // Prepare post content
    const postContent = JSON.stringify({
      text: content,
      mediaUrl: mediaUrl,
      mediaType: mediaType,
      source: "discord",
      discord_message_id: message.id,
      discord_channel: message.channel.name,
    });

    // Create post
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
      console.error("[Announcements] Post creation failed:", insertError);
      await message.react("❌");
      return;
    }

    console.log(`[Announcements] ✅ Synced to AeThex (${armAffiliation} arm)`);

    await message.react("✅");
  } catch (error) {
    console.error("[Announcements] Error:", error);
    try {
      await message.react("⚠️");
    } catch (e) {
      console.warn("[Announcements] Could not react:", e);
    }
  }
}

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    // Ignore bot messages and empty messages
    if (message.author.bot) return;
    if (!message.content && message.attachments.size === 0) return;

    // Check if this is an announcement to sync
    if (
      ANNOUNCEMENT_CHANNELS.length > 0 &&
      ANNOUNCEMENT_CHANNELS.includes(message.channelId)
    ) {
      return handleAnnouncementSync(message);
    }

    // Check if this is a main chat channel - sync ALL messages
    if (
      MAIN_CHAT_CHANNELS.length > 0 &&
      MAIN_CHAT_CHANNELS.includes(message.channelId)
    ) {
      return handleMainChatSync(message);
    }

    // Check if this is in the feed channel (for user-generated posts)
    if (FEED_CHANNEL_ID && message.channelId !== FEED_CHANNEL_ID) {
      return;
    }

    if (FEED_GUILD_ID && message.guildId !== FEED_GUILD_ID) {
      return;
    }

    try {
      // Get user's linked AeThex account
      const { data: linkedAccount, error } = await supabase
        .from("discord_links")
        .select("user_id")
        .eq("discord_id", message.author.id)
        .single();

      if (error || !linkedAccount) {
        try {
          await message.author.send(
            "To have your message posted to AeThex, please link your Discord account! Use `/verify` command.",
          );
        } catch (dmError) {
          console.warn("[Feed Sync] Could not send DM to user:", dmError);
        }
        return;
      }

      // Get user profile
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

      // Prepare content
      let content = message.content || "Shared a message on Discord";
      let mediaUrl = null;
      let mediaType = "none";

      if (message.attachments.size > 0) {
        const attachment = message.attachments.first();
        if (attachment) {
          mediaUrl = attachment.url;
          const attachmentLower = attachment.name.toLowerCase();

          if (
            [".jpg", ".jpeg", ".png", ".gif", ".webp"].some((ext) =>
              attachmentLower.endsWith(ext),
            )
          ) {
            mediaType = "image";
          } else if (
            [".mp4", ".webm", ".mov", ".avi"].some((ext) =>
              attachmentLower.endsWith(ext),
            )
          ) {
            mediaType = "video";
          }
        }
      }

      // Determine arm affiliation
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

      // Prepare post content
      const postContent = JSON.stringify({
        text: content,
        mediaUrl: mediaUrl,
        mediaType: mediaType,
      });

      // Create post
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
        } catch (e) {
          console.warn("[Feed Sync] Could not add reaction:", e);
        }
        return;
      }

      console.log(`[Feed Sync] ✅ Posted from ${message.author.tag} to AeThex`);

      try {
        await message.react("✅");
      } catch (reactionError) {
        console.warn(
          "[Feed Sync] Could not add success reaction:",
          reactionError,
        );
      }

      try {
        await message.author.send(
          `✅ Your message was posted to AeThex! Check it out at https://aethex.dev/feed`,
        );
      } catch (dmError) {
        console.warn("[Feed Sync] Could not send confirmation DM:", dmError);
      }
    } catch (error) {
      console.error("[Feed Sync] Unexpected error:", error);

      try {
        await message.react("⚠️");
      } catch (e) {
        console.warn("[Feed Sync] Could not add warning reaction:", e);
      }
    }
  },
};
