const { MessageEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');
const { data } = require('../../index.js');

require('../ExtendedMessage.js');

module.exports = class BalCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'bal',
			aliases: ['balance'],
			group: 'economy',
			memberName: 'bal',
			description: 'Replies with your balance.',
		});
	}
	async run(message) {
		const user_data = data.db('Sentry_Data').collection('user_data');
		const result = await user_data.findOne({ id: message.author.id });

		if (!result) {
			user_data.insertOne({ id: `${message.author.id}`, balance: 0 });
		}

		message.inlineReply({
			embed: new MessageEmbed({
				title: `${message.author.username}'s Balance`,
				description: '```' + `${message.author.username} has ${result ? result.balance : '0'} coins.` + '```',
				color: 'DARK_GREY',
			}),
			allowedMentions: { repliedUser: false },
		});
	}
};