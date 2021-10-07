/** Utility class is used for general things in discord.js and discrd.js commando.*/
class Utility {
	/** Client object for the Utility class. */
	static client = require('../index.js').client;
	static discord = require('discord.js');

	/** Removes all reactions from specific user on a specific message.
	 * @param {discord.Message} message The message of the reactions you want to delete.
	 * @param {String} id The user ID of the person who made the reactions you want to delete.*/

	static removeReactionsFromUser(message, id) {
		const userReactions = message.reactions.cache.filter(r => r.users.cache.has(id));
		try { for (const r of userReactions.values()) { r.users.remove(id); } }
		catch (error) { console.error('Failed to remove reactions.'); }
	}

	/** Returns the formatted user object of a mention.
	 * @param {String} mention The mention you want formatted.*/

	static getUserFromMention(mention) {
		if (mention.startsWith('<@') && mention.endsWith('>')) {
			mention = mention.slice(2, -1);
			if (mention.startsWith('!')) { mention = mention.slice(1); }
			return this.client.users.cache.get(mention);
		}
	}
	/** Returns the arguments of a command message.
	 * @param {discord.Message} message The message you want the arguments from.*/

	static getArgs(message) {
		const args = message.argString.split(' ');
		if (args[0] === '') { args.shift(); } return args
	}
}

module.exports = { Utility };