const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE,
);

// Only sync messages from this specific channel
const FEED_CHANNEL_ID = process.env.DISCORD_MAIN_CHAT_CHANNELS
  ? process.env.DISCORD_MAIN_CHAT_CHANNELS.split(",")[0].trim()
  : null;

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

async function syncMessageToFeed(message) {
  try {
    console.log(
      `[Feed Sync] Processing from ${message.author.tag} in #${message.channel.name}`,
    );

    const { data: linkedAccount } = await supabase
      .from("discord_links")
      .select("user_id")
      .eq("discord_id", message.author.id)
      .single();

    let authorId = linkedAccount?.user_id;
    let authorInfo = null;

    if (authorId) {
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("id, username, full_name, avatar_url")
        .eq("id", authorId)
        .single();
      authorInfo = profile;
    }

    if (!authorId) {
      const discordUsername = `discord-${message.author.id}`;
      let { data: guestProfile } = await supabase
        .from("user_profiles")
        .select("id, username, full_name, avatar_url")
        .eq("username", discordUsername)
        .single();

      if (!guestProfile) {
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
          console.error("[Feed Sync] Could not create guest profile:", createError);
          return;
        }
        guestProfile = newProfile;
      }

      authorId = guestProfile?.id;
      authorInfo = guestProfile;
    }

    if (!authorId) {
      console.error("[Feed Sync] Could not get author ID");
      return;
    }

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

    const armAffiliation = getArmAffiliation(message);

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

    const { error: insertError } = await supabase
      .from("community_posts")
      .insert({
        title: content.substring(0, 100) || "Discord Message",
        content: postContent,
        arm_affiliation: armAffiliation,
        author_id: authorId,
        tags: ["discord", "feed"],
        category: "discord",
        is_published: true,
        likes_count: 0,
        comments_count: 0,
      });

    if (insertError) {
      console.error("[Feed Sync] Post creation failed:", insertError);
      return;
    }

    console.log(
      `[Feed Sync] ✅ Synced message from ${message.author.tag} to AeThex feed`,
    );
  } catch (error) {
    console.error("[Feed Sync] Error:", error);
  }
}

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    // Ignore bot messages
    if (message.author.bot) return;
    
    // Ignore empty messages
    if (!message.content && message.attachments.size === 0) return;

    // Only process messages from the configured feed channel
    if (!FEED_CHANNEL_ID) {
      return; // No channel configured
    }

    if (message.channelId !== FEED_CHANNEL_ID) {
      return; // Not the feed channel
    }

    // Sync this message to AeThex feed
    await syncMessageToFeed(message);
  },
};
