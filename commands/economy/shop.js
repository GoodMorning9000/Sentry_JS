const { MessageEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');
const { Utility } = require('../utils.js');
const { shop } = require('../../config.js');

require('../ExtendedMessage.js');

module.exports = class ShopCommand extends Command {
	constructor(c) {
		super(c, {
			name: 'shop',
			group: 'economy',
			memberName: 'shop',
			description: 'This command displays the shop.',
		});
	}
	run(message) {
		let p = '', ps = 0, cp = 1, i = 0;
		const contents = [];
		for (i = 0; i < Object.keys(shop).length; i++) {
			const pb = `${i + 1}- ${shop[Object.keys(shop)[i]]['cost']}- ${Object.keys(shop)[i]}: Increase growth per a grow by ${shop[Object.keys(shop)[i]]['Upgrade']}.\n`;
			if (i % 5 == 0) {
				p = '```' + pb;
			}
			else if (i == Object.keys(shop).length - 1 || i % 5 == 4) {
				p += pb + '```';
				contents.push(p);
			}
			else {
				p += pb;
			}
		}
		ps = contents.length;

		const e = new MessageEmbed({
			title: 'Shop',
			description: `*Page ${cp}/${ps}*:\n${contents[cp - 1]}`,
			color: 'DARK_GREY',
		});

		message.channel.send({ embed: e }).then((m) => {

			m.react('◀️').then(() => m.react('▶️')).then(() => m.react('x_:849378365730586634')).catch(error => console.log(error));

			const filter = (r, u) => (['◀️', '▶️'].includes(r.emoji.name) || ['849378365730586634'].includes(r.emoji.id)) && u.id === message.author.id;
			const collector = m.createReactionCollector(filter, { time: 30000 });

			collector.on('collect', (r, u) => {
				if (r.emoji.name === '▶️' && cp != ps) {
					cp += 1;
					e.setTitle('Shop').setDescription(`*Page ${cp}/${ps}*:\n${contents[cp - 1]}`).setColor('DARK_GREY');
					m.edit({ embed: e });
					Utility.removeReactionsFromUser(m, u.id);
				}
				else if (r.emoji.name === '◀️' && cp > 1) {
					cp -= 1;
					e.setTitle('Shop').setDescription(`*Page ${cp}/${ps}*:\n${contents[cp - 1]}`).setColor('DARK_GREY');
					m.edit({ embed: e });
					Utility.removeReactionsFromUser(m, u.id);
				}
				else if (r.emoji.id === '849378365730586634') {
					collector.stop();
				}
				else {
					Utility.removeReactionsFromUser(m, u.id);
				}
			});
			collector.on('end', () => {
				m.delete();
				message.channel.send(new MessageEmbed({
					title: '<:x_:849378365730586634>  -  Shop Closed',
					description: '```Use >shop to open the shop again.```',
					color: 'RED',
				}));
			});
		});
	}
};