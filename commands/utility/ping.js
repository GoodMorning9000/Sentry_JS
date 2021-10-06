const { MessageEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');

require('../ExtendedMessage.js');

module.exports = class PingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ping',
			aliases: ['latency'],
			group: 'utility',
			memberName: 'ping',
			description: 'Replies with your latency.',
		});
	}
	run(message) {
		message.channel.send('\u2800').then((m) => {
			const ping = m.createdTimestamp - message.createdTimestamp; m.delete();

			const embed = new MessageEmbed()
				.setTitle(`${message.author.username}'s Latency`)
				.setDescription('```' + `Your latency is ${ping}` + '```')
				.setColor('DARK_GREY');

			message.inlineReply({
				embed: embed,
				allowedMentions: { repliedUser: false },
			});
		});
	}
};