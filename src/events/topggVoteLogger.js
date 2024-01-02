const express = require("express");
const { Webhook } = require("@top-gg/sdk");
const app = express();
const TopGG = require(`${process.cwd()}/src/database/TopGG`);

module.exports = {
  async execute(client) {
    const webhook = new Webhook(client.config.TOPGG.WEBHOOK_AUTH);
    app.post(
      "/dblwebhook",
      webhook.listener(async (vote) => {
        try {
          const userId = vote.user;
          let TOPGG = await TopGG.findOne({ userID: userId });

          if (!TOPGG) {
            TOPGG = new TopGG({
              userID: userId,
              remindersEnabled: true,
              lastVoteTimestamp: 0,
              totalVotes: 0,
              purchasedRoles: [],
            });
          }

          const VoteUser = await client.users.fetch(vote.user);
          const guild = client.guilds.cache.get(client.config.SUPPORT_SERVER);
          const USER = guild.members.cache.get(vote.user);
          const channel = client.channels.cache.get(client.config.TOPGG.VOTE_LOG_CHANNEL);

          const roleToAdd = guild.roles.cache.get(client.config.TOPGG.VOTE_REWARD_ROLE);
          const thankYouMessage = `🎉 Thank you, ${VoteUser.tag}, for your vote! 🙌 Your support means a lot to us! 🥳 You can [vote](https://top.gg/bot/1016392200516550736/vote) again in 12 hours.`;

          console.log(`${VoteUser.tag} Just Voted On Top.gg`);

          TOPGG.lastVoteTimestamp = Date.now();
          TOPGG.totalVotes += 1;

          await TOPGG.save();

          if (channel && roleToAdd && guild) {
            await VoteUser.send(`**> Thank you ${VoteUser.tag} for voting me on top.gg.\n> You can now access vote-required commands for 12 hours.\n>You can [vote](https://top.gg/bot/1016392200516550736/vote) again in 12 hours.**`);

            await channel.send(thankYouMessage);

            if (!roleToAdd) {
              return console.log("Role not found. Please contact an admin.");
            } else {
              await USER.roles.add(roleToAdd);
            }
          } else {
            console.log("Invalid Vote Log Channel");
          }

        } catch (error) {
          console.error(error);
        }
      })
    );

    app.listen(client.config.TOPGG.WEBHOOK_PORT, () => {
      client.logger(`Server is listening on port ${client.config.TOPGG.WEBHOOK_PORT}`);
    });
  }
};
