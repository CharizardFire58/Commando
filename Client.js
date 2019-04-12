const commando = require('discord.js-commando');
const Discord = require('discord.js')
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

const events = {
	MESSAGE_REACTION_ADD: 'messageReactionAdd',
	MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};

client.on('ready', () => {
  console.log("ola")
  client.user.setGame("con los nehgrozh.")
})
	.on('raw', async event => {
		if (!events.hasOwnProperty(event.t)) return;

		const { d: data } = event;
		const user = client.users.get(data.user_id);
		const channel = client.channels.get(data.channel_id) || await user.createDM();

		if (channel.messages.has(data.message_id)) return;

		const message = await channel.fetchMessage(data.message_id);
		const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
		let reaction = message.reactions.get(emojiKey);

		if (!reaction) {
			const emoji = new Discord.Emoji(client.guilds.get(data.guild_id), data.emoji);
			reaction = new Discord.MessageReaction(message, emoji, 1, data.user_id === client.user.id);
		}

		client.emit(events[event.t], reaction, user);
	})
	.on('messageReactionAdd', (reaction, user) => {
		const embed = new Discord.RichEmbed()
		.setColor("#36393F")
		.setTitle("Reaccion Agregada")
		.setAuthor(user.username, user.displayAvatarURL)
		.addField('Reaccion:', reaction.emoji.name, true)
		.addField('Canal:', reaction.channel, true)
		client.channels.get("545127956624834578").send(embed);
	})
	.on('messageReactionRemove', (reaction, user) => {
		const embed = new Discord.RichEmbed()
		.setColor("#36393F")
		.setTitle("Reaccion Removida")
		.setAuthor(user.username, user.displayAvatarURL)
		.addField('Reaccion:', reaction.emoji.name, true)
		.addField('Canal:', reaction.channel, true)
		client.channels.get("545127956624834578").send(embed);
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
