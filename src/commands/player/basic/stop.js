const guildPlayers = require(`${process.cwd()}/src/store/guildPlayers`);
const config = require(`${process.cwd()}/config/config.json`);

const handle = async (message) => {
	// check command
	if (message.content.trim() !== `${config.PREFIX}stop`) return;

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
		message.reply("There is nothing to stop!.");
		message.react("😡");
		return;
	}

	player.stop();

	message.react("👍");

	const embed = {
		color: "#7ca8d9",
		author: {
			name: "| Player has been stopped!.",
			icon_url: "https://tinyurl.com/y4x8xlat",
		},
	};

	message.reply({ embed: embed });
};

module.exports = {
	handle,
};
