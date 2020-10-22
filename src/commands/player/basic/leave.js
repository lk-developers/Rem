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

	// disconnect bot from vc
	voiceChannel.leave();

	message.react("😞");
	message.reply("Bye!");
};

module.exports = {
	handle,
};
