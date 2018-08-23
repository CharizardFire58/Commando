const { Command } = require('discord.js-commando');
const yt = require('ytdl-core')

module.exports = class MusicPlayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'add',
			group: 'music',
			memberName: 'add',
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
        let url = msg.content.split(' ')[1];
		if (url == '' || url === undefined) return msg.channel.sendMessage(`You must add a YouTube video url, or id after r.add`);
		yt.getInfo(url, (err, info) => {
			if(err) return msg.channel.sendMessage('Invalid YouTube Link: ' + err);
			if (!queue.hasOwnProperty(msg.guild.id)) queue[msg.guild.id] = {}, queue[msg.guild.id].playing = false, queue[msg.guild.id].songs = [];
			queue[msg.guild.id].songs.push({url: url, title: info.title, requester: msg.author.username});
			msg.channel.sendMessage(`added **${info.title}** to the queue`);
		});
    }
};