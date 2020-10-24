const guildSessions = require(`${process.cwd()}/src/store/guildSessions`);

const handle = async (message, prefix) => {
	// check command
	if (message.content.trim() !== `${prefix}leave`) return;

	// check if member is in a voice channel
	const voiceChannel = message.member.voice.channel;
	if (!voiceChannel) {
		message.reply("Please connect to a voice channel first!.");
		message.react("😡");
		return;
	}

	// if there is a active session, end it
	const player = guildSessions.getSession(message.guild.id);

	if (player) {
		player.stop();
		guildSessions.endSession(message.guild.id);
	}

	// disconnect bot from vc
	voiceChannel.leave();

	message.react("😞");
	message.reply("Bye!");
};

module.exports = {
	handle,
};
