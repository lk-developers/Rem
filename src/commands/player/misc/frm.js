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

	const filterName =
		message.content.trim().split(`${prefix}frm`)[1].trim() || false;

	if (!filterName) {
		message.reply("Please provide a filter!.");
		message.react("😡");
		return;
	}

	const result = player.removeFilter(filterName);

	if (!result) {
		const embed = {
			color: "#7ca8d9",
			author: {
				name: "| Filter applied.",
				icon_url: "https://tinyurl.com/y4x8xlat",
			},
		};

		message.reply({ embed: embed });
		message.react("👍");
		return;
	}

	if (result.code == "invalidFilter") {
		message.reply("Please provide a valid filter!.");
		message.react("😡");
		return;
	}

	if (result.code == "noActiveFilter") {
		message.reply("That filter is not applied!.");
		message.react("😡");
		return;
	}
};

module.exports = {
	handle,
};
