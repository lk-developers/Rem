const guildSessions = require(`${process.cwd()}/src/store/guildSessions`);
const config = require(`${process.cwd()}/config/config.json`);

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
	const player = guildSessions.getSession(message.guild.id);

	if (!player) {
		message.reply("There is nothing playing atm!.");
		message.react("😡");
		return;
	}

	// get queue from the player
	const queue = player.getQueue();

	if (queue.length == 0) {
		message.reply("Queue is empty!.");
		message.react("🤔");
		return;
	}

	try {
		const currentTrack = player.getCurrentTrack();

		// create a discord block for the playlist
		let tracks = "";
		queue.every((track, index) => {
			if (index == 10) return false;
			tracks += `(${index + 1}) ${track.name} (${track.type})\n`;
			return true;
		});

		let queueBlock;

		if (currentTrack) {
			queueBlock =
				"```diff\n" +
				`Total tracks: ${queue.length}\n\n` +
				`++ Current track:\n${currentTrack.name || "none"} (${
					currentTrack.type
				}) "\n\n` +
				`--Upcoming tracks:\n${tracks}` +
				"```";
		} else {
			queueBlock =
				"```diff\n" +
				`Total tracks: ${queue.length}\n\n` +
				`--Upcoming tracks:\n${tracks}` +
				"```";
		}

		message.channel.send(queueBlock);

		message.react("👍");
	} catch (e) {
		message.reply("Sorry!. I can't show you the queue right now.");
		message.react("😢");
	}
};

module.exports = {
	handle,
};
