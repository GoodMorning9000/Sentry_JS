const { CommandoClient } = require('discord.js-commando');
const config = require('./config.js');
const path = require('path');
const { MongoClient } = require('mongodb');

const client = new CommandoClient({ commandPrefix: config.prefix });

const data = new MongoClient(config.uri);
data.connect();

module.exports = { client, data };

client.registry
	.registerDefaultTypes()
	.registerGroups([
		['utility', 'Has all the utility commands'],
		['economy', 'Has all the economy commands'],
	])
	.registerDefaultGroups()
	.registerDefaultCommands({
		help: false,
		prefix: false,
		ping: false,
		_eval: false,
		unknownCommand: false,
		commandState: false,
	})
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}. (${client.user.id})`);
	client.user.setActivity('with Commando');
});

client.on('error', console.error);
client.login(config.TOKEN);