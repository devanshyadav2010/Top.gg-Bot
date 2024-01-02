const UserReminder = require(`${process.cwd()}/src/database/TopGG`);

module.exports = {
  async execute(client) {
    try {
      const performMondayCleanup = async () => {
        try {
          const usersToUpdate = await UserReminder.find({
            remindersEnabled: true,
            lastVoteTimestamp: { $gt: 0 },
            totalVotes: { $gt: 0 },
            purchasedRoles: { $exists: true, $not: { $size: 0 } },
          });

          const updatePromises = usersToUpdate.map(async (user) => {
            user.totalVotes = 0;
            user.purchasedRoles = [];
            return user.save();
          });

          await Promise.all(updatePromises);

          client.logger('Monday cleanup complete.');
        } catch (error) {
          console.error('Error during Monday cleanup:', error);
        }
      };

      const intervalId = setInterval(performMondayCleanup, 1000 * 60 * 60 * 24 * 7);

    } catch (error) {
      console.error('Error setting up the Monday cleanup:', error);
    }
  },
};