const guildSessions = require(`${process.cwd()}/src/store/guildSessions`);
const config = require(`${process.cwd()}/config/config.json`);

const handle = async (message) => {
	// check command
	if (message.content.trim() !== `${config.PREFIX}loop`) return;

	// check if guild has a running player
	const player = guildSessions.get(message.guild.id);

	if (!player) {
		message.reply("There is nothing playing atm!.");
		message.react("😡");
		return;
	}

	let embedText;

	if (player.loopQueue) {
		player.loopQueue = false;
		embedText = "Queue looping disabled.";
	} else {
		player.loopQueue = true;
		// when enabling push current track back to the queue
		player.queue = [...player.queue, player.currentTrack];

		embedText = "Queue looping enabled.";
	}

	// create an embed for the current track
	const embed = {
		color: "#7ca8d9",
		author: {
			name: `| ${embedText}`,
			icon_url: "https://tinyurl.com/y4x8xlat",
		},
	};

	message.reply({ embed: embed });
	message.react("👍");
};

module.exports = {
	handle,
};
