const guildPlayers = require(`${process.cwd()}/src/store/guildPlayers`);
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
	const player = guildPlayers.get(message.guild.id);

	if (!player) {
		message.reply("There is nothing playing atm!.");
		message.react("😡");
		return;
	}

	const positions = message.content
		.trim()
		.split(`${config.PREFIX}mv`)[1]
		.split(",");

	const currentPosition = parseInt(positions[0]) || false;
	const newPosition = parseInt(positions[1]) || false;

	if (!currentPosition || !newPosition) {
		message.reply(
			"Please provide the track number and the position you want to move it."
		);
		message.react("😡");
		return;
	}

	// move tracks
	player.queue = moveIndex(player.queue, currentPosition - 1, newPosition - 1);

	const embed = {
		color: "#7ca8d9",
		author: {
			name: "| Track moved!.",
			icon_url: "https://tinyurl.com/y4x8xlat",
		},
	};

	message.reply({ embed: embed });
	message.react("👍");
};

const moveIndex = (array, oldIndex, newIndex) => {
	if (newIndex >= array.length) {
		newIndex = array.length - 1;
	}
	array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
	return array;
};

module.exports = {
	handle,
};
