const { EmbedBuilder, Collection, PermissionsBitField } = require('discord.js')
const ms = require('ms')
const cooldown = new Collection()
const { msg } = require(`${process.cwd()}/src/functions/onCoolDown.js`);
const config = require(`${process.cwd()}/Assets/Config/config.js`);
const embed = require(`${process.cwd()}/Assets/Config/embed.js`);
const emojis = require(`${process.cwd()}/Assets/Config/emotes.js`);
require("colors")
// ================================================================================
module.exports = {
  async execute(client) {
    client.on('messageCreate', async message => {
      try {
        // ==============================< Command Handling >=============================\\	
        const prefix = client.prefix;
        if (message.author.bot) return;
        if (message.channel.type !== 0) return;
        const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})`);
        if (!prefixRegex.test(message.content)) return;
        const [mPrefix] = message.content.match(prefixRegex);
        const args = message.content.slice(mPrefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();
        let command = client.commands.get(cmd) || client.commands.find(c => c.aliases && c.aliases.includes(cmd)) //|| client.commands.get(client.aliases.get(cmd));
        // ==============================< If command doesn't found >=============================\\         
        if (cmd.length === 0) {
          if (mPrefix.includes(client.user.id))
            return message.reply({
              components: [client.linksButtons],
              embeds: [new EmbedBuilder()
                .setColor(client.embed.color)
                .setDescription(`${client.emotes.MESSAGE.y} **To see my commands list type \`/help\`**`)
              ],
            }).catch(() => { });
          return;
        }
        // ==============================< If !command return >=============================\\
        if (!command) {
          return message.reply({
            embeds: [
              client.Embed(false)
                .setColor(client.embed.wrongcolor)
                .setDescription(`${client.emotes.MESSAGE.i}Prefix Commands Has Been Removed By The Developes`)
            ]
          }).then(m => setTimeout(() => m.delete(), 6000));
        }
        if (command) {
          // ==============================< Toggle off >=============================\\
          if (command.toggleOff) {
            return await message.reply({
              embeds: [new EmbedBuilder()
                .setDescription(`${emojis.MESSAGE.x} **That Command Has Been Disabled By The Developers! Please Try Later.**`)
                .setColor(client.embed.wrongcolor)
              ]
            }).then(msg => {
              setTimeout(() => {
                msg.delete().catch((e) => {
                  console.log(String(e).grey)
                })
              }, 6000)
            }).catch((e) => {
              console.log(String(e).grey)
            });
          }
          // ==============================< On Mainenance Mode >============================= \\
          if (command.maintenance) {
            return await message.reply({
              content: `${emojis.MESSAGE.x} **${command.name} command is on __Maintenance Mode__** try again later!`
            })
          }
          // ==============================< Owner Only >============================= \\
          if (command.ownerOnly) {
            const owners = client.config.DEV.OWNER.concat(
              client.config.DEV.CO_OWNER
            );
            if (!owners.includes(message.author.id)) return await message.reply({
              embeds: [new EmbedBuilder()
                .setDescription(`${emojis.MESSAGE.x} **You cannot use \`${prefix}${command.name}\` command as this is a developer command.**`).setColor(client.embed.wrongcolor)
              ]
            }).then(msg => {
              setTimeout(() => {
                msg.delete().catch((e) => {
                  console.log(String(e).grey)
                })
              }, 6000)
            }).catch((e) => {
              console.log(String(e).grey)
            });
          }
          // ==============================< Permissions checking >============================= \\
          if (command.userPerms || command.botPerms) {
            if (!message.member.permissions.has(PermissionsBitField.resolve(command.userPerms || []))) {
              const userPerms = new EmbedBuilder()
                .setDescription(`${emojis.MESSAGE.x} ${message.author}, You don't have \`${command.userPerms}\` permissions to use this command!`)
                .setColor(client.embed.wrongcolor)
              return message.reply({ embeds: [userPerms] })
            }
            if (!message.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(command.botPerms || []))) {
              const botPerms = new EmbedBuilder()
                .setDescription(`${emojis.MESSAGE.x} ${message.author}, I don't have \`${command.botPerms}\` permissions to use this command!`)
                .setColor(client.embed.wrongcolor)
              return message.reply({ embeds: [botPerms] })
            }
          }
          // ==============================< Music Command >============================= \\
          if (command.music) {
            const { member, guild } = message, { channel } = member.voice, VC = member.voice.channel;
            if (!VC) return message.reply({
              embeds: [new EmbedBuilder()
                .setColor(client.embed.wrongcolor)
                .setDescription(`Please Join a Voice Channel`)
              ]
            });
            if (channel.userLimit != 0 && channel.full)
              return message.reply({
                embeds: [new EmbedBuilder()
                  .setColor(client.embed.wrongcolor)
                  .setDescription(`Your Voice Channel is full, I can't join!`)
                ]
              });
            if (guild.members.me.voice.channel && VC !== guild.members.me.voice.channel) return message.reply({
              embeds: [new EmbedBuilder()
                .setColor(client.embed.wrongcolor)
                .setDescription(`Join my channel ${guild.members.me.voice.channel}`)
              ]
            });
          }

          // ==============================< NSFW checking >============================= \\
          if (command.nsfwOnly && !message.channel.nsfw) {
            return message.reply({
              embeds: [
                new EmbedBuilder()
                  .setTitle(`${emojis.MESSAGE.x} ${message.author.username} This command only works in NSFW channels!`)
                  .setDescription(`Please go to the NSFW channel to use this command!`)
                  .setColor(client.embed.wrongcolor)
              ]

            }).then(m => setTimeout(() => m.delete(), 6000));
          }
          // ==============================< Only for offical guilds >============================= \\
          if (command.guildOnly) {
            const private = client.config.SERVER.OFFICIAL.Guild_ID_1
              .concat(client.config.SERVER.Guild_ID_2);
            if (!private.includes(message.guild.id)) {
              return message.reply({
                embeds: [
                  new EmbedBuilder()
                    .setTitle(`${emojis.MESSAGE.x} ${message.author.username} You have entered an invalid command!`)
                    .setDescription(`The command \`${command.name}\` can only be used in the official server.`)
                    .setColor(client.embed.wrongcolor)
                ]
              }).then(m => setTimeout(() => m.delete(), 6000));
            }
          }
          // ==============================< CoolDown checking >============================= \\
          if (command.cooldown) {
            if (msg(message, command)) {
              return await message.reply({
                embeds: [
                  new EmbedBuilder()
                    .setTitle(`${emojis.MESSAGE.x} ${message.author.username}, You have been cooldown for \`${command.cooldown}\` seconds!`)
                    .setDescription(`Please wait \`${msg(message, command).toFixed(1)}\` Before using the \`${command.name}\` command again!`)
                    .setColor(client.embed.wrongcolor)
                ]
              }).then(m => setTimeout(() => m.delete(), msg(message, command) * 1000));
            }
          }
          // ==============================< Start The Command >============================= \\
          await command.run(client, message, args)
          const commandLogsChannel = client.channels.cache.get(client.config.SETTINGS.CommandLogs);
          if (!commandLogsChannel) return;
          commandLogsChannel.send({
            embeds: [new EmbedBuilder()
              .setColor(client.embed.color)
              .setAuthor({
                name: message.guild.name, iconURL: message.guild.iconURL({
                  dynamic: true
                })
              })
              .setTitle(`Prefix Command`)
              .addFields([
                { name: "**Author**", value: `\`\`\`yml\n${message.author.tag} [${message.author.id}]\`\`\`` },
                { name: "**Command Name**", value: `\`\`\`yml\n${command.name}\`\`\`` },
                { name: `**Guild**`, value: `\`\`\`yml\n${message.guild.name} [${message.guild.id}]\`\`\`` }
              ])
            ]
          });
        }
        // ==============================< On Error >============================= \\
      } catch (error) {
        client.msg_err(client, message, error);
      }
    });
  }
}

// escapeRegex
function escapeRegex(str) {
  try {
    return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
  } catch (e) {
    console.log(String(e.stack).grey.bgRed)
  }
}