const { EmbedBuilder } = require("discord.js");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE,
);

const FEED_CHANNEL_ID = process.env.DISCORD_MAIN_CHAT_CHANNELS
  ? process.env.DISCORD_MAIN_CHAT_CHANNELS.split(",")[0].trim()
  : null;

const POLL_INTERVAL = 5000; // Check every 5 seconds

let discordClient = null;
let lastCheckedTime = null;
let pollInterval = null;

function getArmColor(arm) {
  const colors = {
    labs: 0x00d4ff,
    gameforge: 0xff6b00,
    corp: 0x9945ff,
    foundation: 0x14f195,
    devlink: 0xf7931a,
    nexus: 0xff00ff,
    staff: 0xffd700,
  };
  return colors[arm] || 0x5865f2;
}

function getArmEmoji(arm) {
  const emojis = {
    labs: "🔬",
    gameforge: "🎮",
    corp: "🏢",
    foundation: "🎓",
    devlink: "🔗",
    nexus: "🌐",
    staff: "⭐",
  };
  return emojis[arm] || "📝";
}

async function sendPostToDiscord(post, authorInfo = null) {
  if (!discordClient || !FEED_CHANNEL_ID) {
    console.log("[Feed Bridge] No Discord client or channel configured");
    return { success: false, error: "No Discord client or channel configured" };
  }

  try {
    const channel = await discordClient.channels.fetch(FEED_CHANNEL_ID);
    if (!channel || !channel.isTextBased()) {
      console.error("[Feed Bridge] Could not find text channel:", FEED_CHANNEL_ID);
      return { success: false, error: "Could not find text channel" };
    }

    let content = {};
    try {
      content = typeof post.content === "string" ? JSON.parse(post.content) : post.content;
    } catch {
      content = { text: post.content };
    }

    if (content.source === "discord") {
      return { success: true, skipped: true, reason: "Discord-sourced post" };
    }

    let author = authorInfo;
    if (!author && post.author_id) {
      const { data } = await supabase
        .from("user_profiles")
        .select("username, full_name, avatar_url")
        .eq("id", post.author_id)
        .single();
      author = data;
    }

    const authorName = author?.full_name || author?.username || "AeThex User";
    const authorAvatar = author?.avatar_url || "https://aethex.dev/logo.png";
    const arm = post.arm_affiliation || "labs";

    const embed = new EmbedBuilder()
      .setColor(getArmColor(arm))
      .setAuthor({
        name: `${getArmEmoji(arm)} ${authorName}`,
        iconURL: authorAvatar,
        url: `https://aethex.dev/creators/${author?.username || post.author_id}`,
      })
      .setDescription(content.text || post.title || "New post")
      .setTimestamp(post.created_at ? new Date(post.created_at) : new Date())
      .setFooter({
        text: `Posted from AeThex • ${arm.charAt(0).toUpperCase() + arm.slice(1)}`,
        iconURL: "https://aethex.dev/logo.png",
      });

    if (content.mediaUrl) {
      if (content.mediaType === "image") {
        embed.setImage(content.mediaUrl);
      } else if (content.mediaType === "video") {
        embed.addFields({
          name: "🎬 Video",
          value: `[Watch Video](${content.mediaUrl})`,
        });
      }
    }

    if (post.tags && post.tags.length > 0) {
      const tagString = post.tags
        .filter((t) => t !== "discord" && t !== "main-chat")
        .map((t) => `#${t}`)
        .join(" ");
      if (tagString) {
        embed.addFields({ name: "Tags", value: tagString, inline: true });
      }
    }

    const postUrl = `https://aethex.dev/community/feed?post=${post.id}`;
    embed.addFields({
      name: "🔗 View on AeThex",
      value: `[Open Post](${postUrl})`,
      inline: true,
    });

    await channel.send({ embeds: [embed] });
    console.log(`[Feed Bridge] ✅ Sent post ${post.id} to Discord`);
    return { success: true };
  } catch (error) {
    console.error("[Feed Bridge] Error sending to Discord:", error);
    return { success: false, error: error.message };
  }
}

async function checkForNewPosts() {
  if (!discordClient || !FEED_CHANNEL_ID) return;

  try {
    const { data: posts, error } = await supabase
      .from("community_posts")
      .select("*")
      .gt("created_at", lastCheckedTime.toISOString())
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[Feed Bridge] Error fetching new posts:", error);
      return;
    }

    if (posts && posts.length > 0) {
      console.log(`[Feed Bridge] Found ${posts.length} new post(s)`);
      
      for (const post of posts) {
        let content = {};
        try {
          content = typeof post.content === "string" ? JSON.parse(post.content) : post.content;
        } catch {
          content = { text: post.content };
        }

        if (content.source === "discord") {
          console.log(`[Feed Bridge] Skipping Discord-sourced post ${post.id}`);
          continue;
        }

        console.log(`[Feed Bridge] Bridging post ${post.id} to Discord...`);
        await sendPostToDiscord(post);
      }

      lastCheckedTime = new Date(posts[posts.length - 1].created_at);
    }
  } catch (error) {
    console.error("[Feed Bridge] Poll error:", error);
  }
}

function setupFeedListener(client) {
  discordClient = client;

  if (!FEED_CHANNEL_ID) {
    console.log("[Feed Bridge] No DISCORD_MAIN_CHAT_CHANNELS configured - bridge disabled");
    return;
  }

  lastCheckedTime = new Date();

  console.log("[Feed Bridge] Starting polling for new posts (every 5 seconds)...");
  
  pollInterval = setInterval(checkForNewPosts, POLL_INTERVAL);

  console.log("[Feed Bridge] ✅ Feed bridge ready (channel: " + FEED_CHANNEL_ID + ")");
}

function getDiscordClient() {
  return discordClient;
}

function getFeedChannelId() {
  return FEED_CHANNEL_ID;
}

function cleanup() {
  if (pollInterval) {
    clearInterval(pollInterval);
    console.log("[Feed Bridge] Stopped polling");
  }
}

module.exports = { setupFeedListener, sendPostToDiscord, getDiscordClient, getFeedChannelId, cleanup };
