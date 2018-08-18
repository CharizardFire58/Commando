const commando = require('discord.js-commando');
const client = new commando.Client()

client.registry.registerGroup('games', 'games')
client.registry.registerDefaults()
client.registry.registerCommandsIn(__dirname + "/comandos")

client.on('ready', () => {
  console.log("ola")
})

client.login(process.env.TOKEN);