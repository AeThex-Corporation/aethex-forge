const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unlink")
    .setDescription("Unlink your Discord account from AeThex"),

  async execute(interaction, supabase) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const { data: link } = await supabase
        .from("discord_links")
        .select("*")
        .eq("discord_id", interaction.user.id)
        .single();

      if (!link) {
        const embed = new EmbedBuilder()
          .setColor(0xff6b6b)
          .setTitle("ℹ️ Not Linked")
          .setDescription("Your Discord account is not linked to AeThex.");

        return await interaction.editReply({ embeds: [embed] });
      }

      // Delete the link
      await supabase
        .from("discord_links")
        .delete()
        .eq("discord_id", interaction.user.id);

      // Remove Discord roles from user
      const guild = interaction.guild;
      const member = await guild.members.fetch(interaction.user.id);

      // Find and remove all AeThex-related roles
      const rolesToRemove = member.roles.cache.filter(
        (role) =>
          role.name.includes("Labs") ||
          role.name.includes("GameForge") ||
          role.name.includes("Corp") ||
          role.name.includes("Foundation") ||
          role.name.includes("Dev-Link") ||
          role.name.includes("Premium") ||
          role.name.includes("Creator"),
      );

      for (const [, role] of rolesToRemove) {
        try {
          await member.roles.remove(role);
        } catch (e) {
          console.warn(`Could not remove role ${role.name}`);
        }
      }

      const embed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle("✅ Account Unlinked")
        .setDescription(
          "Your Discord account has been unlinked from AeThex.\nAll associated roles have been removed.",
        );

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Unlink command error:", error);
      const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("❌ Error")
        .setDescription("Failed to unlink account. Please try again.");

      await interaction.editReply({ embeds: [embed] });
    }
  },
};
