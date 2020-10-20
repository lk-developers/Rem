const guildSessions = require(`${process.cwd()}/src/store/guildSessions`);
const config = require(`${process.cwd()}/config/config.json`);

const handle = async (message) => {
	// check command
	if (message.content.trim() !== `${config.PREFIX}stop`) return;

	// check if member is in a voice channel
	const voiceChannel = message.member.voice.channel;
	if (!voiceChannel) {
		message.reply("Please connect to a voice channel first!.");
		message.react("😡");
		return;
	}

	// check if guild has a running player
	const player = guildSessions.get(message.guild.id);

	if (!player) {
		message.reply("There is nothing to stop!.");
		message.react("😡");
		return;
	}

	player.stop();
	guildSessions.end(message.guild.id);

	message.react("👍");
};

module.exports = {
	handle,
};
