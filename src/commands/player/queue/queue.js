const { formatSeconds } = require(`${process.cwd()}/src/util/common.js`);
const guildSessions = require(`${process.cwd()}/src/store/guildSessions`);
const config = require(`${process.cwd()}/config/config.json`);

const handle = async (message, prefix) => {
	// check command
	if (message.content.trim() !== `${prefix}queue`) return;

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

	try {
		const queue = player.getQueue();
		const currentTrack = player.getCurrentTrack();

		// queue is empty and there is no current track
		if (queue.length == 0 && !currentTrack) {
			message.reply("Queue is empty!.");
			message.react("🤔");
			return;
		}

		// create a discord block for the playlist
		let tracks = "";
		queue.every((track, index) => {
			if (index == 10) return false;
			const duration = track.duration
				? `[${formatSeconds(track.duration)}]`
				: "";
			tracks += `(${index + 1}) ${track.name} (${track.type}) ${duration}\n`;
			return true;
		});

		// when there are no tracks
		if (tracks == "") tracks = "None";

		let queueBlock;

		if (currentTrack) {
			const duration = currentTrack.duration
				? `[${formatSeconds(currentTrack.duration)}]`
				: "";
			queueBlock =
				"```diff\n" +
				`Total tracks: ${queue.length}\n\n` +
				`++ Current track:\n${currentTrack.name} (${currentTrack.type}) ${duration}\n\n` +
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
