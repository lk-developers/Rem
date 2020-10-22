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
		message.reply("There is nothing playing atm!.");
		message.react("😡");
		return;
	}

	// check if a position is given (false when not given)
	let position =
		message.content.trim().split(`${prefix}skip`)[1] || false;
	position = isNaN(position) ? false : parseInt(position);

	// check if position is invalid
	if (position && !player.queue[position - 1]) {
		message.reply("Invalid position!. Please check the queue again.");
		message.react("😡");
		return;
	}

	// skip tracks
	const result = player.skip(position);

	if (!result) {
		const embed = {
			color: "#7ca8d9",
			author: {
				name: "| Track skipped.",
				icon_url: "https://tinyurl.com/y4x8xlat",
			},
		};

		message.reply({ embed: embed });
		message.react("👍");
		return;
	}

	if (result.code == "trackSkipEmpty") {
		message.reply("There are no more tracks to skip!.");
		message.react("😡");
	}

	if (result.code == "noDispatcher") {
		message.reply("Nothing is playing atm!.");
		message.react("😡");
	}
};

module.exports = {
	handle,
};
