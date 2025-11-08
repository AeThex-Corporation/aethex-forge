const {
  SlashCommandBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
} = require("discord.js");
const { assignRoleByArm } = require("../utils/roleManager");

const REALMS = [
  { value: "labs", label: "🧪 Labs", description: "Research & Development" },
  {
    value: "gameforge",
    label: "🎮 GameForge",
    description: "Game Development",
  },
  { value: "corp", label: "💼 Corp", description: "Enterprise Solutions" },
  {
    value: "foundation",
    label: "🤝 Foundation",
    description: "Community & Education",
  },
  {
    value: "devlink",
    label: "💻 Dev-Link",
    description: "Professional Networking",
  },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("set-realm")
    .setDescription("Set your primary AeThex realm/arm"),

  async execute(interaction, supabase, client) {
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

      const select = new StringSelectMenuBuilder()
        .setCustomId("select_realm")
        .setPlaceholder("Choose your primary realm")
        .addOptions(
          REALMS.map((realm) => ({
            label: realm.label,
            description: realm.description,
            value: realm.value,
            default: realm.value === link.primary_arm,
          })),
        );

      const row = new ActionRowBuilder().addComponents(select);

      const embed = new EmbedBuilder()
        .setColor(0x7289da)
        .setTitle("⚔️ Choose Your Realm")
        .setDescription(
          "Select your primary AeThex realm. This determines your main Discord role.",
        )
        .addFields({
          name: "Current Realm",
          value: link.primary_arm || "Not set",
        });

      await interaction.editReply({ embeds: [embed], components: [row] });

      const filter = (i) =>
        i.user.id === interaction.user.id && i.customId === "select_realm";
      const collector = interaction.channel.createMessageComponentCollector({
        filter,
        time: 60000,
      });

      collector.on("collect", async (i) => {
        const selectedRealm = i.values[0];

        await supabase
          .from("discord_links")
          .update({ primary_arm: selectedRealm })
          .eq("discord_id", interaction.user.id);

        const realm = REALMS.find((r) => r.value === selectedRealm);

        // Assign Discord role based on selected realm
        const roleAssigned = await assignRoleByArm(
          interaction.guild,
          interaction.user.id,
          selectedRealm,
          supabase,
        );

        const roleStatus = roleAssigned
          ? "✅ Discord role assigned!"
          : "⚠️ No role mapping found for this realm in this server.";

        const confirmEmbed = new EmbedBuilder()
          .setColor(0x00ff00)
          .setTitle("✅ Realm Set")
          .setDescription(
            `Your primary realm is now **${realm.label}**\n\n${roleStatus}`,
          );

        await i.update({ embeds: [confirmEmbed], components: [] });
      });

      collector.on("end", (collected) => {
        if (collected.size === 0) {
          interaction.editReply({
            content: "Realm selection timed out.",
            components: [],
          });
        }
      });
    } catch (error) {
      console.error("Set-realm command error:", error);
      const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("❌ Error")
        .setDescription("Failed to update realm. Please try again.");

      await interaction.editReply({ embeds: [embed] });
    }
  },
};
