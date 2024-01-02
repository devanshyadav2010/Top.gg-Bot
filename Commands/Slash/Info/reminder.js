const { ApplicationCommandType } = require('discord.js');
const UserReminder = require(`${process.cwd()}/src/database/TopGG`);

module.exports = {
  name: "reminder",
  description: "vote reminder",
  usage: "",
  category: "",
  userPerms: [""],
  botPerms: [""],
  cooldown: 5,
  guildOnly: false,
  ownerOnly: false,
  toggleOff: false,
  nsfwOnly: false,
  maintenance: false,
  type: ApplicationCommandType.ChatInput,
  run: async (client, interaction) => {
    try {
      const userID = interaction.user.id;
      const userReminder = await UserReminder.findOne({ userID });

      if (!userReminder) {
        const newUserReminder = new UserReminder({ userID, remindersEnabled: true });
        await newUserReminder.save();
        return interaction.reply({ content: "Vote reminders enabled!", ephemeral: true });
      }

      userReminder.remindersEnabled = !userReminder.remindersEnabled;
      await userReminder.save();

      if (userReminder.remindersEnabled) {
        interaction.reply({ content: "Vote reminders enabled!", ephemeral: true });
      } else {
        interaction.reply({ content: "Vote reminders disabled!", ephemeral: true });
      }
    } catch (error) {
      client.slash_err(client, interaction, error);
    }
  }
};