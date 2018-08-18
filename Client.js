const commando = require('discord.js-commando');
const CommandoClient = require('./estructuras/CommandoClient');
const client = new CommandoClient({
	owner: '304354101523906561',
	commandPrefix: "p.",
	unknownCommandResponse: false,
	disableEveryone: true
});

client.registry.registerGroup('games', 'games')
client.registry.registerGroup('economy', 'economy')
client.registry.registerGroup('item', 'item')
client.registry.registerGroup('usuario', 'usuario')
client.registry.registerDefaults()
client.registry.registerCommandsIn(__dirname + "/comandos")

client.on('ready', () => {
  console.log("ola")
})

client.login(process.env.TOKEN);