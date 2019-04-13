const { Command } = require('discord.js-commando');
const Discord = require('discord.js');

module.exports = class EventCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'evento',
			group: 'music',
			memberName: 'evento',
			description: `Comando para crear eventos`,
			details: `Comando para crear eventos`,
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			},

			args: [
				{
					key: 'mensaje',
					prompt: 'contenido del mensaje?\n',
					type: 'string'
				}
			]
		});
	}
	hasPermission(msg) {
		return this.client.isOwner(msg.author);
	}

	async run(msg, { mensaje }) {
		let msg2 = client.channels.get("566449611187945472").send(mensaje)
		msg2.react("548956503659249668")
		const filter = (reaction, _user) => (reaction.emoji.name === 'okpixel') && _user.id === message.author.id;
		const collector = msg2.createReactionCollector(filter, { time: 18970e3 });
		collector.on('collect', async reaction => {
			if (reaction.emoji.name === 'okpixel') {
				return client.channels.get("545128014942437376").send(_user.id + " esta participando.");
			}
		})
	}
};
