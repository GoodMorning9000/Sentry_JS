const { MessageEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');
const { Utility } = require('../utils.js');
const { data } = require('../../index.js');

require('../ExtendedMessage.js');

module.exports = class GiveCommand extends Command {
	constructor(c) {
		super(c, {
			name: 'give',
			group: 'economy',
			memberName: 'give',
			description: 'Give your money to a specified person.',
		});
	}
	async run(message) {
		const args = Utility.getArgs(message);
		const user = Utility.getUserFromMention(args[0]);
		const amount = parseInt(args[1]);

		if (args.length != 2 || !Number.isInteger(amount) || typeof user == 'undefined') {
			return message.inlineReply({
				embed: new MessageEmbed({
					title: '<:x_:849378365730586634>  -  Error',
					description: '```You must provide the specified arguments.\nThe command syntax is:\n >give (person: mention) (amount: integer).```',
					color: 'RED',
				}),
				allowedMentions: { repliedUser: false },
			});
		}

		const user_data = data.db('Sentry_Data').collection('user_data');
		const e = new MessageEmbed();

		const gb = await user_data.findOne({ id: message.author.id });
		const rb = await user_data.findOne({ id: user.id });

		if (rb && gb && amount <= gb.balance && amount > 0 && message.author.id != user.id) {

			user_data.updateOne({ id: user.id }, { $set: { balance: rb.balance + amount } });
			user_data.updateOne({ id: message.author.id }, { $set: { balance: gb.balance - amount } });

			e.setTitle(`${message.author.username}'s Give`)
				.setDescription('```' + `${message.author.username} has given ${user.username} ${amount} coins.\nThey now have ${rb.balance + amount} coins.` + '```')
				.setColor('DARK_GREY');
		}
		else if (!rb) {
			e.setTitle('<:x_:849378365730586634>  -  Error')
				.setDescription('```This person does not have an account.\nTell this person to use the >bal command.```')
				.setColor('RED');
		}
		else if (!gb) {
			e.setTitle('<:x_:849378365730586634>  -  Error')
				.setDescription('```You do not have an account.\n Use >bal to make one.```')
				.setColor('RED');
		}
		else if (amount > gb.balance) {
			e.setTitle('<:x_:849378365730586634>  -  Error')
				.setDescription('```You can not give more than you have.```')
				.setColor('RED');
		}
		else if (amount <= 0) {
			e.setTitle('<:x_:849378365730586634>  -  Error')
				.setDescription('```You have to choose a number greater than 0.```')
				.setColor('RED');
		}
		else if (message.author.id == user.id) {
			e.setTitle('<:x_:849378365730586634>  -  Error')
				.setDescription('```You can not give coins to yourself. ```')
				.setColor('RED');
		}

		message.inlineReply({
			embed: e,
			allowedMentions: { repliedUser: false },
		});
	}
};