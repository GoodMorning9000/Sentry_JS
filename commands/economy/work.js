const { MessageEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');
const { data } = require('../../index.js');

require('../ExtendedMessage.js');

module.exports = class WorkCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'work',
			group: 'economy',
			memberName: 'work',
			description: 'Work to earn money.',
		});
	}
	run(message) {
		async function main() {
			try {
				const user_data = data.db('Sentry_Data').collection('user_data');
				const result = await user_data.findOne({ id: message.author.id });
				const e = new MessageEmbed();

				if (result) {
					user_data.updateOne({ id: message.author.id }, { $set: { balance: result.balance + 10 } });
					e.setTitle(`${message.author.username}'s Work`)
						.setDescription('```' + `${message.author.username} has worked for 10 coins.\nThey now have ${result.balance + 10} coins.` + '```')
						.setColor('DARK_GREY');
				}
				else {
					e.setTitle('Error!')
						.setDescription('```' + `${message.author.username}, you don't have an account yet!\nUse >bal to make one.` + '```')
						.setColor('RED');
				}
				message.inlineReply({
					embed: e,
					allowedMentions: { repliedUser: false },
				});
			}
			catch (e) {
				console.error(e);
			}
		}
		main().catch(console.error);
	}
};