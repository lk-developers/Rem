const guildPlayers = require("../../store/guildPlayers");
const config = require("../../../config/config.json");

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
	const player = guildPlayers.get(message.guild.id);

	if (!player) {
		message.reply("There is nothing to pause!.");
		message.react("😡");
		return;
	}

	player.pause();

	message.react("👍");

	const embed = {
		author: {
			name: "| Queue paused!.",
			icon_url: "https://tinyurl.com/y4x8xlat",
		},
	};

	message.reply({ embed: embed });
};

module.exports = {
	handle,
};
