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

	// check if guild has a running player
	const player = guildSessions.get(message.guild.id);

	if (!player) {
		message.reply("There is nothing playing atm!.");
		message.react("😡");
		return;
	}

	// check if a position is given (null when not given)
	let position =
		message.content.trim().split(`${config.PREFIX}skip`)[1] || null;
	position = isNaN(position) ? null : parseInt(position);

	// skip tracks
	player.skip(position);

	message.react("👍");
};

module.exports = {
	handle,
};
