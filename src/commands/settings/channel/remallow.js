const guildInfo = require(`${process.cwd()}/src/store/guildInfo`);

const handle = async (message, prefix) => {
	const command =
		message.content.trim().split(`${prefix}remallow`)[1].trim() || false;

	// when no args are given, consider as add channel to allowed list
	if (!command) {
		const allowedChannels = guildInfo.getAllowedChannels(message.guild.id);
		if (allowedChannels.includes(message.channel.id)) {
			message.reply("This channel is already in the allowed channels list!.");
			message.react("😡");
			return;
		}
		guildInfo.addAllowedChannel(message.guild.id, message.channel.id);
		message.reply("This channel is now in the allowed channels list!.");
		message.react("👍");
		return;
	}

	if (command == "rm") {
		const allowedChannels = guildInfo.getAllowedChannels(message.guild.id);
		if (!allowedChannels.includes(message.channel.id)) {
			message.reply("This channel is not in the allowed channels list!.");
			message.react("😡");
			return;
		}
		guildInfo.removeAllowedChannel(message.guild.id, message.channel.id);
		message.reply("Channel removed from the allowed list!.");
		message.react("👍");
		return;
	}

	if (command == "clear") {
		const allowedChannels = guildInfo.getAllowedChannels(message.guild.id);
		if (allowedChannels.length == 0) {
			message.reply("Allowed channels list is empty!.");
			message.react("😡");
			return;
		}
		guildInfo.clearAllowedChannels(message.guild.id);
		message.reply("Allowed channels list cleared!.");
		message.react("👍");
		return;
	}

	message.reply("Invalid command!.");
	message.react("😡");
	return;
};

module.exports = {
	handle,
};
