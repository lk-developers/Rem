const guildSessions = require(`${process.cwd()}/src/store/guildSessions`);
const config = require(`${process.cwd()}/config/config.json`);

const handle = async (message) => {
	// check if member is in a voice channel
	const voiceChannel = message.member.voice.channel;
	if (!voiceChannel) {
		message.reply("Please connect to a voice channel first!.");
		message.react("😡");
		return;
	}

	// get anime name, set to false if not found
	const animeName =
		message.content.trim().split(`${config.PREFIX}playani`)[1].trim() || false;

	// get a new voice connection
	const voiceConnection = await voiceChannel.join();

	// if guild already has a running player, use it
	let player = guildSessions.getSession(message.guild.id);

	// if there is no existing player, create one
	if (!player) {
		player = guildSessions.createSession(
			message.guild.id,
			message.channel,
			voiceConnection
		);
	}

	const result = player.playAnimeTracks(animeName);

	// no result if everything went fine
	if (!result) {
		message.react("👍");
		return;
	}

	// else, use error codes to determine what happened
	if (result.code == "keywordEmpty") {
		message.reply("Please provide a valid anime name!.");
		message.react("😡");
	}
};

module.exports = {
	handle,
};
