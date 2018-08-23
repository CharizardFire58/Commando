const { Command } = require('discord.js-commando');
const yt = require('ytdl-core')

let queue = {};

module.exports = class MusicPlayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'queue',
			group: 'music',
			memberName: 'queue',
			description: `add a song`,
			details: `add a song`,
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			}
		});
    }
    
	async run(msg) {
        if (queue[msg.guild.id] === undefined) return msg.channel.sendMessage(`Add some songs to the queue first with p.add`);
		let tosend = [];
		queue[msg.guild.id].songs.forEach((song, i) => { tosend.push(`${i+1}. ${song.title} - Requested by: ${song.requester}`);});
		msg.channel.send(`__**${msg.guild.name}'s Music Queue:**__ Currently **${tosend.length}** songs queued ${(tosend.length > 15 ? '*[Only next 15 shown]*' : '')}\n\`\`\`${tosend.slice(0,15).join('\n')}\`\`\``);
    }
};