const guildSessions = require(`${process.cwd()}/src/store/guildSessions`);
const config = require(`${process.cwd()}/config/config.json`);

const handle = async (message) => {
	// check if member is in a voice channel
	const voiceChannel = message.member.voice.channel;
	if (!voiceChannel) {
		message.reply("Please connect to a voice channel first!.");
		message.react("😡");
		return;
	}

	// get track name or url. set to false if neither one is found
	const keywordOrUrl =
		message.content.trim().split(`${config.PREFIX}play`)[1].trim() || false;

	// get a new voice connection
	const voiceConnection = await voiceChannel.join();

	// if guild already has a running player, use it
	let player = guildSessions.getSession(message.guild.id);

	// if there is no existing player, create one
	if (!player) {
		player = guildSessions.createSession(
			message.guild.id,
			message.channel,
			voiceConnection
		);
	}

	// if this is a resume command, keyword is false
	if (!keywordOrUrl) {
		const result = player.play();

		// no result if everything went fine
		if (!result) {
			const embed = {
				color: "#7ca8d9",
				author: {
					name: "| Queue resumed.",
					icon_url: "https://tinyurl.com/y4x8xlat",
				},
			};

			message.reply({ embed: embed });
			return;
		}

		// else, use error codes to determine what happened
		if (result.code == "queueNotPaused") {
			message.reply("Queue is not paused!.");
			message.react("😡");
		}

		if (result.code == "noDispatcher") {
			message.reply("Please provide a track name or a url!.");
			message.react("😡");
		}
		return;
	}

	// otherwise, consider this a new play command with a keyword or link
	const result = player.playYoutubeTracks(keywordOrUrl);

	if (!result) {
		message.react("👍");
		return;
	}

	if (result.code == "keywordEmpty") {
		message.reply("Please provide a valid track name or a url!.");
		message.react("😡");
	}
};

module.exports = {
	handle,
};
