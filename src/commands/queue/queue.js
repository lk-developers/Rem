const guildPlayers = require("../../store/guildPlayers");
const config = require("../../../config/config.json");

const handle = async (message) => {
	// check command
	if (message.content.trim() !== `${config.PREFIX}queue`) return;

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

	// create a discord block for the playlist
	let tracks = "";
	player.queue.every((track, index) => {
		if (index == 10) return false;
		tracks += `(${index + 1}) ${track.name} (${track.type})\n`;
		return true;
	});

	const queue =
		"```diff\n" +
		`Total tracks: ${player.queue.length}\n\n` +
		`++ Current track:\n${player.currentTrack.name} (${player.currentTrack.type})\n\n` +
		`--Upcoming tracks:\n${tracks}` +
		"```";

	message.channel.send(queue);

	message.react("👍");
};

module.exports = {
	handle,
};
