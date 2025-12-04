const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("View the top AeThex contributors")
    .addStringOption((option) =>
      option
        .setName("category")
        .setDescription("Leaderboard category")
        .setRequired(false)
        .addChoices(
          { name: "🔥 Most Active (Posts)", value: "posts" },
          { name: "❤️ Most Liked", value: "likes" },
          { name: "🎨 Top Creators", value: "creators" }
        )
    ),

  async execute(interaction, supabase) {
    await interaction.deferReply();

    try {
      const category = interaction.options.getString("category") || "posts";

      let leaderboardData = [];
      let title = "";
      let emoji = "";

      if (category === "posts") {
        title = "Most Active Posters";
        emoji = "🔥";

        const { data: posts } = await supabase
          .from("community_posts")
          .select("user_id")
          .not("user_id", "is", null);

        const postCounts = {};
        posts?.forEach((post) => {
          postCounts[post.user_id] = (postCounts[post.user_id] || 0) + 1;
        });

        const sortedUsers = Object.entries(postCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10);

        for (const [userId, count] of sortedUsers) {
          const { data: profile } = await supabase
            .from("user_profiles")
            .select("username, full_name, avatar_url")
            .eq("id", userId)
            .single();

          if (profile) {
            leaderboardData.push({
              name: profile.full_name || profile.username || "Anonymous",
              value: `${count} posts`,
              username: profile.username,
            });
          }
        }
      } else if (category === "likes") {
        title = "Most Liked Users";
        emoji = "❤️";

        const { data: posts } = await supabase
          .from("community_posts")
          .select("user_id, likes_count")
          .not("user_id", "is", null)
          .order("likes_count", { ascending: false });

        const likeCounts = {};
        posts?.forEach((post) => {
          likeCounts[post.user_id] =
            (likeCounts[post.user_id] || 0) + (post.likes_count || 0);
        });

        const sortedUsers = Object.entries(likeCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10);

        for (const [userId, count] of sortedUsers) {
          const { data: profile } = await supabase
            .from("user_profiles")
            .select("username, full_name, avatar_url")
            .eq("id", userId)
            .single();

          if (profile) {
            leaderboardData.push({
              name: profile.full_name || profile.username || "Anonymous",
              value: `${count} likes received`,
              username: profile.username,
            });
          }
        }
      } else if (category === "creators") {
        title = "Top Creators";
        emoji = "🎨";

        const { data: creators } = await supabase
          .from("aethex_creators")
          .select("user_id, total_projects, verified, featured")
          .order("total_projects", { ascending: false })
          .limit(10);

        for (const creator of creators || []) {
          const { data: profile } = await supabase
            .from("user_profiles")
            .select("username, full_name, avatar_url")
            .eq("id", creator.user_id)
            .single();

          if (profile) {
            const badges = [];
            if (creator.verified) badges.push("✅");
            if (creator.featured) badges.push("⭐");

            leaderboardData.push({
              name: profile.full_name || profile.username || "Anonymous",
              value: `${creator.total_projects || 0} projects ${badges.join(" ")}`,
              username: profile.username,
            });
          }
        }
      }

      const embed = new EmbedBuilder()
        .setColor(0x7289da)
        .setTitle(`${emoji} ${title}`)
        .setDescription(
          leaderboardData.length > 0
            ? leaderboardData
                .map(
                  (user, index) =>
                    `**${index + 1}.** ${user.name} - ${user.value}`
                )
                .join("\n")
            : "No data available yet. Be the first to contribute!"
        )
        .setFooter({ text: "AeThex Leaderboard | Updated in real-time" })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Leaderboard command error:", error);
      const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("❌ Error")
        .setDescription("Failed to fetch leaderboard. Please try again.");

      await interaction.editReply({ embeds: [embed] });
    }
  },
};
