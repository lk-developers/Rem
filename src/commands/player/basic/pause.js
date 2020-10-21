const guildSessions = require(`${process.cwd()}/src/store/guildSessions`);
const config = require(`${process.cwd()}/config/config.json`);

const handle = async (message) => {
	// check command
	if (message.content.trim() !== `${config.PREFIX}pause`) return;

	// check if member is in a voice channel
	const voiceChannel = message.member.voice.channel;
	if (!voiceChannel) {
		message.reply("Please connect to a voice channel first!.");
		message.react("😡");
		return;
	}

	// check if guild has a running player
	const player = guildSessions.getSession(message.guild.id);

	if (!player) {
		message.reply("There is nothing to pause!.");
		message.react("😡");
		return;
	}

	const result = player.pause();

	if (!result) {
		const embed = {
			color: "#7ca8d9",
			author: {
				name: "| Queue paused.",
				icon_url: "https://tinyurl.com/y4x8xlat",
			},
		};

		message.reply({ embed: embed });
		message.react("👍");
		return;
	}

	if (result.code == "noDispatcher") {
		message.reply("Nothing is playing right now!.");
		message.react("😡");
	}
};

module.exports = {
	handle,
};
