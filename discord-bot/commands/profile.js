const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("View your AeThex profile in Discord"),

  async execute(interaction, supabase) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const { data: link } = await supabase
        .from("discord_links")
        .select("user_id, primary_arm")
        .eq("discord_id", interaction.user.id)
        .single();

      if (!link) {
        const embed = new EmbedBuilder()
          .setColor(0xff6b6b)
          .setTitle("❌ Not Linked")
          .setDescription(
            "You must link your Discord account to AeThex first.\nUse `/verify` to get started.",
          );

        return await interaction.editReply({ embeds: [embed] });
      }

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", link.user_id)
        .single();

      if (!profile) {
        const embed = new EmbedBuilder()
          .setColor(0xff6b6b)
          .setTitle("❌ Profile Not Found")
          .setDescription("Your AeThex profile could not be found.");

        return await interaction.editReply({ embeds: [embed] });
      }

      const armEmojis = {
        labs: "🧪",
        gameforge: "🎮",
        corp: "💼",
        foundation: "🤝",
        devlink: "💻",
      };

      const embed = new EmbedBuilder()
        .setColor(0x7289da)
        .setTitle(`${profile.full_name || "AeThex User"}'s Profile`)
        .setThumbnail(
          profile.avatar_url || "https://aethex.dev/placeholder.svg",
        )
        .addFields(
          {
            name: "👤 Username",
            value: profile.username || "N/A",
            inline: true,
          },
          {
            name: `${armEmojis[link.primary_arm] || "⚔️"} Primary Realm`,
            value: link.primary_arm || "Not set",
            inline: true,
          },
          {
            name: "📊 Role",
            value: profile.user_type || "community_member",
            inline: true,
          },
          { name: "📝 Bio", value: profile.bio || "No bio set", inline: false },
        )
        .addFields({
          name: "🔗 Links",
          value: `[Visit Full Profile](https://aethex.dev/creators/${profile.username})`,
        })
        .setFooter({ text: "AeThex | Your Web3 Creator Hub" });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Profile command error:", error);
      const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("❌ Error")
        .setDescription("Failed to fetch profile. Please try again.");

      await interaction.editReply({ embeds: [embed] });
    }
  },
};
