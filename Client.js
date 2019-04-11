const commando = require('discord.js-commando');
const CommandoClient = require('./estructuras/CommandoClient');
const client = new CommandoClient({
	owner: '304354101523906561',
	commandPrefix: "n!",
	unknownCommandResponse: false,
	disableEveryone: true
});

client.registry.registerGroup('games', 'games')
client.registry.registerGroup('economy', 'economy')
client.registry.registerGroup('item', 'item')
client.registry.registerGroup('usuario', 'usuario')
client.registry.registerGroup('music', 'music')
client.registry.registerDefaults()
client.registry.registerCommandsIn(__dirname + "/comandos")

const Currency = require('./estructuras/dinero/Currency');
const Experience = require('./estructuras/dinero/Experience');
const userName = require('./models/UserName');

const SequelizeProvider = require('./providers/Sequelize');
client.setProvider(new SequelizeProvider(client.database));

let earnedRecently = [];
let gainedXPRecently = [];


client.on('ready', () => {
  console.log("ola")
  client.user.setGame("con los nehgrozh.")
})
	.on('message', async message => {
		if (message.channel.type === 'dm') return;
		if (message.author.bot) return;

		const channelLocks = client.provider.get(message.guild.id, 'locks', []);
		if (channelLocks.includes(message.channel.id)) return;
		if (!earnedRecently.includes(message.author.id)) {
			const hasImageAttachment = message.attachments.some(attachment =>
				attachment.url.match(/\.(png|jpg|jpeg|gif|webp)$/)
			);
			const moneyEarned = hasImageAttachment
				? Math.ceil(Math.random() * 7) + 5
				: Math.ceil(Math.random() * 7) + 1;

			Currency._changeBalance(message.author.id, moneyEarned);

			earnedRecently.push(message.author.id);
			setTimeout(() => {
				const index = earnedRecently.indexOf(message.author.id);
				earnedRecently.splice(index, 1);
			}, 8000);
		}

		if (!gainedXPRecently.includes(message.author.id)) {
			const xpEarned = Math.ceil(Math.random() * 9) + 3;
			const oldLevel = await Experience.getLevel(message.author.id);

			Experience.addExperience(message.author.id, xpEarned).then(async () => {
				const newLevel = await Experience.getLevel(message.author.id);
				if (newLevel > oldLevel) {
					Currency._changeBalance(message.author.id, 100 * newLevel);
				}
			}).catch(err => null); // eslint-disable-line no-unused-vars, handle-callback-err

			gainedXPRecently.push(message.author.id);
			setTimeout(() => {
				const index = gainedXPRecently.indexOf(message.author.id);
				gainedXPRecently.splice(index, 1);
			}, 60 * 1000);
		}
	})

client.login(process.env.TOKEN);
