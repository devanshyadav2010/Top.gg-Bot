const TopGG = require(`${process.cwd()}/src/database/TopGG`);
const { TopGGCard } = require("topggcard");

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
        await userStats.save();
      }

      const progressPercentage = (userStats.totalVotes / 14) * 100;

      const currentStreak = calculateCurrentStreak(userStats.lastVoteTimestamp, userStats.totalVotes);

      const card = new TopGGCard()
        .setName(interaction.user.username)
        .setVotes(userStats.totalVotes)
        .setColor("auto")
        .setBrightness(100)
        .setAvatar(interaction.user.displayAvatarURL({ forceStatic: true }))
        .setProgress(progressPercentage)
        .setStreak(currentStreak.toString())
        .setCurrentStreak(currentStreak.toString())
        .setRequiredStreak("14")
        .setShowStreak(true);

      const cardBuffer = await card.build();

      const embed = new client.discord.EmbedBuilder()
        .setTitle(`Here Is Your Profile Info!`)
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: "Voting Streak", value: `${userStats.totalVotes || 0}/14`, inline: true },
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

function calculateCurrentStreak(lastVoteTimestamp, totalVotes) {
  const currentDate = new Date();
  const lastVoteDate = new Date(lastVoteTimestamp);

  const isStreakBroken = Math.abs(currentDate - lastVoteDate) > 24 * 60 * 60 * 1000;

  if (isStreakBroken) {
    return 0;
  }

  const streak = Math.floor((currentDate - lastVoteDate) / (24 * 60 * 60 * 1000));

  return streak + totalVotes;
                 }
