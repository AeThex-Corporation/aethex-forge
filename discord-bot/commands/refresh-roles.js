const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { assignRoleByArm, getUserArm } = require("../utils/roleManager");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("refresh-roles")
    .setDescription(
      "Refresh your Discord roles based on your current AeThex settings",
    ),

  async execute(interaction, supabase, client) {
    await interaction.deferReply({ ephemeral: true });

    try {
      // Check if user is linked
      const { data: link } = await supabase
        .from("discord_links")
        .select("primary_arm")
        .eq("discord_id", interaction.user.id)
        .maybeSingle();

      if (!link) {
        const embed = new EmbedBuilder()
          .setColor(0xff6b6b)
          .setTitle("❌ Not Linked")
          .setDescription(
            "You must link your Discord account to AeThex first.\nUse `/verify` to get started.",
          );

        return await interaction.editReply({ embeds: [embed] });
      }

      if (!link.primary_arm) {
        const embed = new EmbedBuilder()
          .setColor(0xffaa00)
          .setTitle("⚠️ No Realm Set")
          .setDescription(
            "You haven't set your primary realm yet.\nUse `/set-realm` to choose one.",
          );

        return await interaction.editReply({ embeds: [embed] });
      }

      // Assign role based on current primary arm
      const roleAssigned = await assignRoleByArm(
        interaction.guild,
        interaction.user.id,
        link.primary_arm,
        supabase,
      );

      const embed = new EmbedBuilder()
        .setColor(roleAssigned ? 0x00ff00 : 0xffaa00)
        .setTitle("✅ Roles Refreshed")
        .setDescription(
          roleAssigned
            ? `Your Discord roles have been synced with your AeThex account.\n\nPrimary Realm: **${link.primary_arm}**`
            : `Your roles could not be automatically assigned.\n\nPrimary Realm: **${link.primary_arm}**\n\n⚠️ Please contact an admin to set up the role mapping for this server.`,
        );

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Refresh-roles command error:", error);
      const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("❌ Error")
        .setDescription("Failed to refresh roles. Please try again.");

      await interaction.editReply({ embeds: [embed] });
    }
  },
};
