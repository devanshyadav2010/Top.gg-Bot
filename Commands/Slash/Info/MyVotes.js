const TopGG = require(`${process.cwd()}/src/database/TopGG`);

module.exports = {
  name: "votes",
  description: "View your current vote count",
  run: async (client, interaction) => {
    const user = interaction.user;
    if (!user) {
      return interaction.reply({ content: "You must be logged in to check your votes.", ephemeral: true });
    }

    let totalVotes = await TopGG.findOne({ userID: user.id });

    if (!totalVotes) {
      totalVotes = new TopGG({
        userID: user.id,
        remindersEnabled: true,
        lastVoteTimestamp: 0,
        totalVotes: 0,
        purchasedRoles: [],
      });
        await totalVotes.save()
    }

    const embed = new client.discord.EmbedBuilder()
      .setColor('0fffc0')
      .setTitle(`${user.username}'s Vote Count`)
      .setAuthor({ name: 'Top.gg Bot', iconURL: client.user.displayAvatarURL() })
      .setDescription(`${user} You have ${totalVotes.totalVotes} Votes`)
      .setThumbnail(user.displayAvatarURL())
      .setTimestamp()
      .setFooter({ text: "Top.gg Bot", iconURL: client.user.displayAvatarURL() });

    interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
