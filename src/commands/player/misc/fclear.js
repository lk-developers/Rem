const guildSessions = require(`${process.cwd()}/src/store/guildSessions`);

const handle = async (message, prefix) => {
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
		message.reply("Nothing is playing atm!.");
		message.react("😡");
		return;
	}

	const result = player.clearFilters();

	if (!result) {
		const embed = {
			color: "#7ca8d9",
			author: {
				name: "| All filters removed.",
				icon_url: "https://tinyurl.com/y4x8xlat",
			},
		};
		message.reply({ embed: embed });
		message.react("👍");
	} else {
		message.reply("Please apply some filters first!.");
		message.react("😡");
	}
};

module.exports = {
	handle,
};
