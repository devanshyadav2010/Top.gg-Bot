const colors = require('colors');
const fs = require('fs');
module.exports = (client) => {
  let ammount = 0;
  fs.readdirSync(`${process.cwd()}/Commands/Prefix/`).forEach(dir => {
    const files = fs.readdirSync(`${process.cwd()}/Commands/Prefix/${dir}/`).filter(file => file.endsWith('.js'));
    if (!files || files.legnth <= 0) console.log(("Commands - 0").red)
    files.forEach((file) => {
      let command = require(`${process.cwd()}/Commands/Prefix/${dir}/${file}`)
      if (command) {
        client.commands.set(command.name, command)
        ammount++;
        if (command.aliases && Array.isArray(command.aliases)) {
          command.aliases.forEach(alias => {
            client.aliases.set(alias, command.name)
          })
        }
      } else {
        client.logger(`Command Error: ${command.name || file.split('.js')[0] || "Missing Name"}`.brightRed)
      }
    });
  });
  setTimeout(() => {
    client.logger(`Loaded ${ammount} Prefix Commands`.bold)
  }, 1500)
};
