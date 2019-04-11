const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const Discord = require("discord.js");

const Bank = require('../../estructuras/dinero/Bank');
const Currency = require('../../estructuras/dinero/Currency');

module.exports = class MoneyInfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'money',
			aliases: ['bal', 'balance', 'donut', 'donuts', 'doughnut', 'doughnuts','dinero','esmeraldas','coins'],
			group: 'economy',
			memberName: 'money',
			description: `Muestra las ${Currency.textPlural} que tienes.`,
			details: `Muestra las ${Currency.textPlural} que tienes.`,
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			},

			args: [
				{
					key: 'member',
					prompt: `whose ${Currency.textPlural} would you like to view?\n`,
					type: 'member',
					default: ''
				}
			]
		});
	}

	async run(msg, args) {
		const member = args.member || msg.author;
		const money = await Currency.getBalance(member.id);
		const balance = await Bank.getBalance(member.id) || 0;
		const networth = (money || 0) + balance;

		if (args.member) {
			if (money === null) return msg.reply(`${member.displayName} no ha ganado ${Currency.textPlural} todavia.`);
			let embed = new Discord.RichEmbed()
                        .setAuthor(msg.author.username, msg.author.displayAvatarURL)
                        .addField("Inventario", Currency.convert(money))
                        .addField("Cofre", Currency.convert(balance))
                        .addField("Total", Currency.convert(networth));
                        msg.channel.send(embed);
		} else {
			if (money === null) return msg.reply(`todavia no has ganado ${Currency.textPlural}.`);
			let embed = new Discord.RichEmbed()
                        .setAuthor(msg.author.username, msg.author.displayAvatarURL)
                        .addField("Inventario", Currency.convert(money), true)
                        .addField("Cofre", Currency.convert(balance), true)
                        .addField("Total", Currency.convert(networth), true);
                        msg.channel.send(embed);
		}
	}
};
