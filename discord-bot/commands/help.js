const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("View all AeThex bot commands and features"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x7289da)
      .setTitle("🤖 AeThex Bot Commands")
      .setDescription("Here are all the commands you can use with the AeThex Discord bot.")
      .addFields(
        {
          name: "🔗 Account Linking",
          value: [
            "`/verify` - Link your Discord account to AeThex",
            "`/unlink` - Disconnect your Discord from AeThex",
            "`/profile` - View your linked AeThex profile",
          ].join("\n"),
        },
        {
          name: "⚔️ Realm Management",
          value: [
            "`/set-realm` - Choose your primary realm (Labs, GameForge, Corp, Foundation, Dev-Link)",
            "`/verify-role` - Check your assigned Discord roles",
          ].join("\n"),
        },
        {
          name: "📊 Community",
          value: [
            "`/stats` - View your AeThex statistics and activity",
            "`/leaderboard` - See the top contributors",
            "`/post` - Create a post in the AeThex community feed",
          ].join("\n"),
        },
        {
          name: "ℹ️ Information",
          value: "`/help` - Show this help message",
        },
      )
      .addFields({
        name: "🔗 Quick Links",
        value: [
          "[AeThex Platform](https://aethex.dev)",
          "[Creator Directory](https://aethex.dev/creators)",
          "[Community Feed](https://aethex.dev/community/feed)",
        ].join(" | "),
      })
      .setFooter({ text: "AeThex | Build. Create. Connect." })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
