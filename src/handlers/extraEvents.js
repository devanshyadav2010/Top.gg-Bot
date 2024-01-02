const boxConsole = require('box-console');
const set = require(`${process.cwd()}/Assets/Config/settings`)
module.exports = {
  async execute(client) {
    let djs = `Welcome to ${'Server Handler'.bold.blue} by ${'ALL IN ONE | Development & Devansh Yadav'.red}`;
    let djs_support = `Support:- ${`https://discord.gg/ugFeSdVxBh`.brightGreen}`
    let djs_devs = `Handler By ${`uoaio`.brightCyan.bold}`
      let djs_devs2 = `Coded By ${`deviladam`.brightCyan.bold}`;
      
    console.clear()
    boxConsole([djs, djs_support, djs_devs, djs_devs2]);
    // Console Logger
    client.logger = (data) => {
      var currentdate = new Date();
      let logstring = ` ${`${`${currentdate.getDate()}/${currentdate.getMonth() + 1}/${currentdate.getFullYear()}`.brightBlue.bold} ${`│`.brightMagenta.bold}`
        }`
      if (typeof data == "string") {
        console.log(logstring, data.split("\n").map(d => `${d}`.green).join(`\n${logstring} `))
      } else if (typeof data == "object") {
        console.log(logstring, JSON.stringify(data, null, 3).green)
      } else if (typeof data == "boolean") {
        console.log(logstring, String(data).cyan)
      } else {
        console.log(logstring, data)
      }
    };

    // auto kill 
    setInterval(() => {
      if (set.REPL_SETTINGS.AUTO_KILL && set.REPL_USER) {
        if (client.isReady() == false) {
          client.logger("Rate limit assumed, restarting")
          process.kill(1)
        }
      }
    }, 5000)


  }
}