const TopGG = require(`${process.cwd()}/src/database/TopGG`);

module.exports = {
  name: "profile",
  description: "Display user's voting streak and voter status",
  run: async (client, interaction) => {
    try {
      const userId = interaction.user.id;

      const hasVoted = await client.topgg.hasVoted(userId);

      let userStats = await TopGG.findOne({ userID: userId });

      if (!userStats) {
        userStats = new TopGG({
          userID: userId,
          remindersEnabled: true,
          lastVoteTimestamp: 0,
          totalVotes: 0,
          purchasedRoles: [],
        });
          await userStats.save()
      }

      const embed = new client.discord.EmbedBuilder()
        .setTitle(`Here Is Your Profile Info!`)
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: "Voting Streak", value: `${userStats ? userStats.totalVotes || 0 : 0}/14`, inline: true },
          { name: "Is Voter?", value: `${hasVoted ? "Yes" : "No"}`, inline: true }
        )
        .setColor('0fffc0')
        .setTimestamp()
        .setFooter({ text: "Top.gg Bot", iconURL: client.user.displayAvatarURL() });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      client.slash_err(client, interaction, error);
    }
  }
};