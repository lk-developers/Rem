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
		message.reply("There is nothing to seek!.");
		message.react("😡");
		return;
	}

	const content = message.content.trim();

	// extract duration
	const cmdPart = content.split(`${prefix}seek`)[1].trim();

	const duration = parseInt(cmdPart.substring(0, cmdPart.length - 1));

	if (isNaN(duration)) {
		message.reply("Please provide a valid duration!.");
		message.react("😡");
		return;
	}

	// extract time unit
	const timeUnit = cmdPart.charAt(cmdPart.length - 1);

	// check support
	if (!["ms", "s", "m", "h"].includes(timeUnit)) {
		message.reply("Please provide a valid time unit!.");
		message.react("😡");
		return;
	}

	/* eslint-disable indent */
	// calculate ms for given duration
	let ms;
	switch (timeUnit) {
		case "ms":
			ms = duration;
			break;
		case "s":
			ms = duration * 1000;
			break;
		case "m":
			ms = duration * 60000;
			break;
		case "h":
			ms = duration * 3.6e6;
			break;
		default:
			ms = 0;
	}

	player.seek(ms);

	const embed = {
		color: "#7ca8d9",
		author: {
			name: `| Track seeked by ${duration}${timeUnit}`,
			icon_url: "https://tinyurl.com/y4x8xlat",
		},
	};

	message.reply({ embed: embed });
	message.react("👍");
	return;
};

module.exports = {
	handle,
};
