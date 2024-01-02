const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require('discord.js');
const UserReminder = require(`${process.cwd()}/src/database/TopGG`);

module.exports = {
  name: "shop",
  description: "View and purchase available roles",
  run: async (client, interaction) => {
    const user = interaction.user;
    if (!user) {
      return interaction.reply("You must be logged in to use the shop.");
    }
    const userReminder = await UserReminder.findOne({ userID: user.id });

    if (!userReminder) {
      return interaction.reply("User data not found. Please try again.");
    }

    const availableRoles = {
      "VIP": { id: "1191758468915396819", cost: 4 },
      "VVIP": { id: "1191758400619544768", cost: 8 },
      "MVP": { id: "1191758278779211927", cost: 14 },
    };

    const shopEmbed = new EmbedBuilder()
      .setAuthor({ name: 'Top.gg Bot', iconURL: client.user.displayAvatarURL() })
      .setTitle("Roles Shop")
      .setDescription(`Click the button to buy roles.\n${Object.entries(availableRoles).map(([role, details]) => `<@&${details.id}> - ${details.cost} votes`).join('\n')}`)
      .setThumbnail(user.displayAvatarURL())
      .setTimestamp()
      .setFooter({ text: "Top.gg Bot", iconURL: client.user.displayAvatarURL() });

    const roleButtons = Object.entries(availableRoles).map(([role, details]) =>
      new ButtonBuilder()
        .setCustomId(details.id)
        .setLabel(`Buy ${role} - ${details.cost} votes`)
        .setStyle(ButtonStyle.Secondary)
    );

    const buttonRow = new ActionRowBuilder().addComponents(...roleButtons);
    interaction.reply({ embeds: [shopEmbed], components: [buttonRow] });

    const filter = (i) => i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
    });

    collector.on("collect", async (i) => {
      const selectedRoleID = i.customId;
      const selectedRoleDetails = Object.values(availableRoles).find(details => details.id === selectedRoleID);

      if (!selectedRoleDetails) return;

      i.deferUpdate();

      const selectedRoleCost = selectedRoleDetails.cost;

      if (userReminder.totalVotes < selectedRoleCost) {
        await interaction.followUp({ content: "You do not have enough votes to purchase this role.", ephemeral: true });
      } else {
        userReminder.totalVotes -= selectedRoleCost;
        const guild = client.guilds.cache.get(client.config.SUPPORT_SERVER);
        const roleId = guild.roles.cache.get(selectedRoleID);
        const buyer = guild.members.cache.get(i.user.id);
        await buyer.roles.add(roleId);
        userReminder.purchasedRoles.push(selectedRoleID);
        await userReminder.save();
        interaction.followUp({ content: `You have purchased ${roleId} role successfully!`, ephemeral: true });
      }
    });
  }
};
