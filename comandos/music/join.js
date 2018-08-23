const { Command } = require('discord.js-commando');
const yt = require('ytdl-core')

let queue = require('./queue.json');

module.exports = class MusicPlayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'join',
			group: 'music',
			memberName: 'join',
			description: `join a music channel`,
			details: `join channel voice`,
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			}
		});
	}

	async run(msg) {
        return new Promise((resolve, reject) => {
			const voiceChannel = msg.member.voiceChannel;
			if (!voiceChannel || voiceChannel.type !== 'voice') return msg.reply('I couldn\'t connect to your voice channel...');
			voiceChannel.join()
		});
    }
};