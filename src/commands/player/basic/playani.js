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

	if (!animeName) {
		message.reply("Please provide a valid anime name!");
		return;
	}

	// if guild already has a running player, use it
	const player = guildSessions.get(message.guild.id);

	if (player) {
		player.playAnimeTracks(animeName);
		message.react("👍");
		return;
	}

	// else, create a new player instance for the guild
	const voiceConnection = await voiceChannel.join();

	const newPlayer = guildSessions.create(
		message.guild.id,
		message.channel,
		voiceConnection
	);

	newPlayer.playAnimeTracks(animeName);

	message.react("👍");
};

module.exports = {
	handle,
};
