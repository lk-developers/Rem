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

	// get track name or url. set to false if neither one is found
	const keywordOrUrl =
		message.content.trim().split(`${config.PREFIX}play`)[1].trim() || false;

	// if guild already has a running player, use it
	const player = guildSessions.get(message.guild.id);

	// check if player is paused if this is a resume command and keywordOrUrl is false
	if (!keywordOrUrl && player.state !== "paused") {
		message.reply("Please provide a valid track name or a url!.");
		message.react("😡");
		return;
	}

	if (player) {
		player.playYoutubeTracks(keywordOrUrl);
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

	newPlayer.playYoutubeTracks(keywordOrUrl);

	message.react("👍");
};

module.exports = {
	handle,
};
