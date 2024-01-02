const UserReminder = require(`${process.cwd()}/src/database/TopGG`);
const schedule = require('node-schedule');
const Discord = require("discord.js");

module.exports = {
  async execute(client) {
    try {
      const checkAndSendReminders = async () => {
        const usersWithReminders = await UserReminder.find({ remindersEnabled: true });

        for (const user of usersWithReminders) {
          const userID = user.userID;
          const userReminder = await UserReminder.findOne({ userID });

          if (userReminder && userReminder.lastVoteTimestamp) {
            const lastVoteTimestamp = userReminder.lastVoteTimestamp;
            const currentTime = Date.now();
            const timeElapsed = currentTime - lastVoteTimestamp;

            if (timeElapsed >= 12 * 60 * 60 * 1000) {
              const fetchedUser = await client.users.fetch(userID);
              if (fetchedUser) {
                const roleToAdd = fetchedUser.guild.roles.cache.get(client.config.TOPGG.VOTE_REWARD_ROLE);
                if (!roleToAdd) {
                  return console.log("Role not found. Please contact an admin.");
                } else {
                  await fetchedUser.roles.remove(roleToAdd);
                }

                await fetchedUser.send({
                  content: `🌟 Hello there, ${fetchedUser}! 🌟
Just a friendly reminder to brighten your day! Have you had a chance to support our community by voting for us on top.gg? Your vote means the world to us and helps us grow! 🌹✨
Your support is invaluable, and every vote makes a huge difference. Don't hesitate to spread the love! 💖
Thank you so much for being a fantastic part of our community. Your contribution is truly appreciated! 🌟
Warm regards,
Treo`,
                  components: [
                    new Discord.ActionRowBuilder().addComponents(
                      new Discord.ButtonBuilder()
                        .setLabel("Vote")
                        .setStyle(Discord.ButtonStyle.Link)
                        .setURL("https://top.gg/bot/1016392200516550736/vote")
                    )
                  ]
                });
                client.logger(`Reminder sent to ${userID} to vote.`);
              }
            }
          }
        }
      };

      const setupReminderJob = () => {
        const job = schedule.scheduleJob('0 */12 * * *', () => {
          checkAndSendReminders();
        });

        if (job) {
          client.logger("Loaded Reminder");
        } else {
          client.logger(("Error setting up reminder job.").red);
        }
      };

      setupReminderJob();

    } catch (error) {
          console.log("Error while handling reminders:", error);
    }
  }
};