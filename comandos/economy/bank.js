const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');
const moment = require('moment');

const Bank = require('../../estructuras/dinero/Bank');
const Currency = require('../../estructuras/dinero/Currency');

//addon
var momentDurationFormatSetup = require("moment-duration-format");
momentDurationFormatSetup(moment);
typeof moment.duration.format === "function";
//addon

module.exports = class BankInfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'banco',
			group: 'economy',
			memberName: 'bank',
			description: `Muestra la informacion del banco`,
			details: `Muestra el dinero y el interés del bando`,
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			}
		});
	}

	async run(msg) {
		const balance = await Currency.getBalance('bank');
		const interestRate = await Bank.getInterestRate();
		const nextUpdate = await Bank.nextUpdate();

		return msg.reply(stripIndents`
			El banco actualmente tiene ${Currency.convert(balance)}.
			El interés esta al ${(interestRate * 100).toFixed(3)}%.
			Se aplicará el interés en ${moment.duration(nextUpdate).format('hh [hours] mm [minutes]')}.
		`);
	}
};
