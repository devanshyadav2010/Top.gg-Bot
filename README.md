# Discord Bot Voting and Reminder System

![GitHub repo size](https://img.shields.io/github/repo-size/devanshyadav2010/top.gg-bot)
![GitHub issues](https://img.shields.io/github/issues/devanshyadav2010/top.gg-bot)
![GitHub pull requests](https://img.shields.io/github/issues-pr/devanshyadav2010/top.gg-bot)
![GitHub last commit](https://img.shields.io/github/last-commit/devanshyadav2010/top.gg-bot)
![GitHub stars](https://img.shields.io/github/stars/devanshyadav2010/top.gg-bot?style=social)
![GitHub forks](https://img.shields.io/github/forks/devanshyadav2010/top.gg-bot?style=social)

## Introduction

This repository contains a Discord bot code that implements a feature-rich voting and reminder system using the Top.gg API. The bot tracks votes, provides reminders, and includes additional commands for users to explore their voting statistics and trade votes for server roles.

## Repository Stats

![GitHub repo size](https://img.shields.io/github/repo-size/devanshyadav2010/top.gg-bot)
![GitHub issues](https://img.shields.io/github/issues/devanshyadav2010/top.gg-bot)
![GitHub pull requests](https://img.shields.io/github/issues-pr/devanshyadav2010/top.gg-bot)
![GitHub last commit](https://img.shields.io/github/last-commit/devanshyadav2010/top.gg-bot)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/devanshyadav2010/top.gg-bot.git
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure the bot:**
   - Open `Assets/Config/config.js` and fill in the required details.

   ```javascript
   // Assets/Config/config.js
   
   module.exports = {
     "TOKEN": "YOUR_DISCORD_BOT_TOKEN",
     "MONGO_DB": "YOUR_MONGODB_CONNECTION_STRING",
     "CLIENT_ID": "YOUR_DISCORD_CLIENT_ID",
     "OWNERS": ["YOUR_DISCORD_USER_ID"],
     "SUPPORT_SERVER": "YOUR_DISCORD_SUPPORT_SERVER_ID",
     "CHANNELS": {
       "COMMANDS_LOGS": "YOUR_COMMANDS_LOG_CHANNEL_ID",
       "ERROR_COMMAND_LOGS": "YOUR_ERROR_COMMAND_LOG_CHANNEL_ID"
     },
     "TOPGG": {
       "TOKEN": "YOUR_TOPGG_API_TOKEN",
       "WEBHOOK_AUTH": "YOUR_TOPGG_WEBHOOK_AUTH",
       "WEBHOOK_PORT": "YOUR_TOPGG_WEBHOOK_PORT",
       "VOTE_LOG_CHANNEL": "YOUR_DISCORD_VOTE_LOG_CHANNEL_ID",
       "VOTE_REWARD_ROLE": "YOUR_DISCORD_VOTE_REWARD_ROLE_ID"
     }
   };
   ```

4. **Run the bot:**
   ```bash
   node .
   ```

## Features

- **Top.gg Vote Tracking:**
  - Log your Top.gg votes seamlessly.
  - Set reminders to notify users every 12 hours to encourage voting.

- **User Commands:**
  - Check vote counts.
  - View voting streak.
  - Explore your voter profile.
  - Reminder for voting.

- **Shop System:**
  - Trade votes for exclusive server roles.

## Commands

- `/votes`: Check your vote counts.
- `/profile`: Display your voter profile.
- `/shop`: Explore the vote trading shop.
- `/reminder`: Enabled the reminder for voting.

## Contribution

Contributions are welcome! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/new-feature`.
3. Make your changes and commit: `git commit -m 'Add new feature'`.
4. Push to the branch: `git push origin feature/new-feature`.
5. Submit a pull request.

## Support

Join our [Discord server](https://discord.gg/ugFeSdVxBh) for assistance and updates.

## License

This project is licensed under the [MIT License](LICENSE).
