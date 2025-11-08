const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { syncRolesAcrossGuilds } = require("../utils/roleManager");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("verify")
    .setDescription("Link your Discord account to your AeThex account"),

  async execute(interaction, supabase, client) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const { data: existingLink } = await supabase
        .from("discord_links")
        .select("*")
        .eq("discord_id", interaction.user.id)
        .single();

      if (existingLink) {
        const embed = new EmbedBuilder()
          .setColor(0x00ff00)
          .setTitle("✅ Already Linked")
          .setDescription(
            `Your Discord account is already linked to AeThex (User ID: ${existingLink.user_id})`,
          );

        return await interaction.editReply({ embeds: [embed] });
      }

      // Generate verification code
      const verificationCode = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      // Store verification code
      await supabase.from("discord_verifications").insert({
        discord_id: interaction.user.id,
        verification_code: verificationCode,
        expires_at: expiresAt.toISOString(),
      });

      const verifyUrl = `https://aethex.dev/discord-verify?code=${verificationCode}`;

      const embed = new EmbedBuilder()
        .setColor(0x7289da)
        .setTitle("🔗 Link Your AeThex Account")
        .setDescription(
          "Click the button below to link your Discord account to AeThex.",
        )
        .addFields(
          { name: "⏱️ Expires In", value: "15 minutes" },
          { name: "📝 Verification Code", value: `\`${verificationCode}\`` },
        )
        .setFooter({ text: "Your security code will expire in 15 minutes" });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Link Account")
          .setStyle(ButtonStyle.Link)
          .setURL(verifyUrl),
      );

      await interaction.editReply({ embeds: [embed], components: [row] });
    } catch (error) {
      console.error("Verify command error:", error);
      const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("❌ Error")
        .setDescription(
          "Failed to generate verification code. Please try again.",
        );

      await interaction.editReply({ embeds: [embed] });
    }
  },
};
