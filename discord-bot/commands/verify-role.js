const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("verify-role")
    .setDescription("Check your AeThex-assigned Discord roles"),

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
        .select("user_type")
        .eq("id", link.user_id)
        .single();

      const { data: mappings } = await supabase
        .from("discord_role_mappings")
        .select("discord_role")
        .eq("arm", link.primary_arm)
        .eq("user_type", profile?.user_type || "community_member");

      const member = await interaction.guild.members.fetch(interaction.user.id);
      const aethexRoles = member.roles.cache.filter(
        (role) =>
          role.name.includes("Labs") ||
          role.name.includes("GameForge") ||
          role.name.includes("Corp") ||
          role.name.includes("Foundation") ||
          role.name.includes("Dev-Link") ||
          role.name.includes("Premium") ||
          role.name.includes("Creator"),
      );

      const embed = new EmbedBuilder()
        .setColor(0x7289da)
        .setTitle("🔐 Your AeThex Roles")
        .addFields(
          {
            name: "⚔️ Primary Realm",
            value: link.primary_arm || "Not set",
            inline: true,
          },
          {
            name: "👤 User Type",
            value: profile?.user_type || "community_member",
            inline: true,
          },
          {
            name: "🎭 Discord Roles",
            value:
              aethexRoles.size > 0
                ? aethexRoles.map((r) => r.name).join(", ")
                : "None assigned yet",
          },
          {
            name: "📋 Expected Roles",
            value:
              mappings?.length > 0
                ? mappings.map((m) => m.discord_role).join(", ")
                : "No mappings found",
          },
        )
        .setFooter({
          text: "Roles are assigned automatically based on your AeThex profile",
        });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Verify-role command error:", error);
      const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("❌ Error")
        .setDescription("Failed to verify roles. Please try again.");

      await interaction.editReply({ embeds: [embed] });
    }
  },
};
