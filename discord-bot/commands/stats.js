const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("View your AeThex statistics and activity"),

  async execute(interaction, supabase) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const { data: link } = await supabase
        .from("discord_links")
        .select("user_id, primary_arm, created_at")
        .eq("discord_id", interaction.user.id)
        .single();

      if (!link) {
        const embed = new EmbedBuilder()
          .setColor(0xff6b6b)
          .setTitle("❌ Not Linked")
          .setDescription(
            "You must link your Discord account to AeThex first.\nUse `/verify` to get started."
          );

        return await interaction.editReply({ embeds: [embed] });
      }

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", link.user_id)
        .single();

      const { count: postCount } = await supabase
        .from("community_posts")
        .select("*", { count: "exact", head: true })
        .eq("user_id", link.user_id);

      const { count: likeCount } = await supabase
        .from("community_likes")
        .select("*", { count: "exact", head: true })
        .eq("user_id", link.user_id);

      const { count: commentCount } = await supabase
        .from("community_comments")
        .select("*", { count: "exact", head: true })
        .eq("user_id", link.user_id);

      const { data: creatorProfile } = await supabase
        .from("aethex_creators")
        .select("verified, featured, total_projects")
        .eq("user_id", link.user_id)
        .single();

      const armEmojis = {
        labs: "🧪",
        gameforge: "🎮",
        corp: "💼",
        foundation: "🤝",
        devlink: "💻",
      };

      const linkedDate = new Date(link.created_at);
      const daysSinceLinked = Math.floor(
        (Date.now() - linkedDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      const embed = new EmbedBuilder()
        .setColor(0x7289da)
        .setTitle(`📊 ${profile?.full_name || interaction.user.username}'s Stats`)
        .setThumbnail(profile?.avatar_url || interaction.user.displayAvatarURL())
        .addFields(
          {
            name: `${armEmojis[link.primary_arm] || "⚔️"} Primary Realm`,
            value: link.primary_arm || "Not set",
            inline: true,
          },
          {
            name: "👤 Account Type",
            value: profile?.user_type || "community_member",
            inline: true,
          },
          {
            name: "📅 Days Linked",
            value: `${daysSinceLinked} days`,
            inline: true,
          }
        )
        .addFields(
          {
            name: "📝 Posts",
            value: `${postCount || 0}`,
            inline: true,
          },
          {
            name: "❤️ Likes Given",
            value: `${likeCount || 0}`,
            inline: true,
          },
          {
            name: "💬 Comments",
            value: `${commentCount || 0}`,
            inline: true,
          }
        );

      if (creatorProfile) {
        embed.addFields({
          name: "🎨 Creator Status",
          value: [
            creatorProfile.verified ? "✅ Verified Creator" : "⏳ Pending Verification",
            creatorProfile.featured ? "⭐ Featured" : "",
            `📁 ${creatorProfile.total_projects || 0} Projects`,
          ]
            .filter(Boolean)
            .join("\n"),
        });
      }

      embed
        .addFields({
          name: "🔗 Full Profile",
          value: `[View on AeThex](https://aethex.dev/creators/${profile?.username || link.user_id})`,
        })
        .setFooter({ text: "AeThex | Your Creative Hub" })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Stats command error:", error);
      const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("❌ Error")
        .setDescription("Failed to fetch stats. Please try again.");

      await interaction.editReply({ embeds: [embed] });
    }
  },
};
