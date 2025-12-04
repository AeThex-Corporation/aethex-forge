const {
  SlashCommandBuilder,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("post")
    .setDescription("Create a post in the AeThex community feed")
    .addStringOption((option) =>
      option
        .setName("content")
        .setDescription("Your post content")
        .setRequired(true)
        .setMaxLength(500)
    )
    .addStringOption((option) =>
      option
        .setName("category")
        .setDescription("Post category")
        .setRequired(false)
        .addChoices(
          { name: "💬 General", value: "general" },
          { name: "🚀 Project Update", value: "project_update" },
          { name: "❓ Question", value: "question" },
          { name: "💡 Idea", value: "idea" },
          { name: "🎉 Announcement", value: "announcement" }
        )
    )
    .addAttachmentOption((option) =>
      option
        .setName("image")
        .setDescription("Attach an image to your post")
        .setRequired(false)
    ),

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
            "You must link your Discord account to AeThex first.\nUse `/verify` to get started."
          );

        return await interaction.editReply({ embeds: [embed] });
      }

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("username, full_name, avatar_url")
        .eq("id", link.user_id)
        .single();

      const content = interaction.options.getString("content");
      const category = interaction.options.getString("category") || "general";
      const attachment = interaction.options.getAttachment("image");

      let imageUrl = null;
      if (attachment && attachment.contentType?.startsWith("image/")) {
        imageUrl = attachment.url;
      }

      const categoryLabels = {
        general: "General",
        project_update: "Project Update",
        question: "Question",
        idea: "Idea",
        announcement: "Announcement",
      };

      const { data: post, error } = await supabase
        .from("community_posts")
        .insert({
          user_id: link.user_id,
          content: content,
          category: category,
          arm_affiliation: link.primary_arm || "general",
          image_url: imageUrl,
          source: "discord",
          discord_message_id: interaction.id,
          discord_author_id: interaction.user.id,
          discord_author_name: interaction.user.username,
          discord_author_avatar: interaction.user.displayAvatarURL(),
        })
        .select()
        .single();

      if (error) throw error;

      const successEmbed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle("✅ Post Created!")
        .setDescription(content.length > 100 ? content.slice(0, 100) + "..." : content)
        .addFields(
          {
            name: "📁 Category",
            value: categoryLabels[category],
            inline: true,
          },
          {
            name: "⚔️ Realm",
            value: link.primary_arm || "general",
            inline: true,
          }
        );

      if (imageUrl) {
        successEmbed.setImage(imageUrl);
      }

      successEmbed
        .addFields({
          name: "🔗 View Post",
          value: `[Open in AeThex](https://aethex.dev/community/feed)`,
        })
        .setFooter({ text: "Your post is now live on AeThex!" })
        .setTimestamp();

      await interaction.editReply({ embeds: [successEmbed] });
    } catch (error) {
      console.error("Post command error:", error);
      const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("❌ Error")
        .setDescription("Failed to create post. Please try again.");

      await interaction.editReply({ embeds: [embed] });
    }
  },
};
