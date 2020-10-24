const guildSessions = require(`${process.cwd()}/src/store/guildSessions`);

const handle = async (message, prefix) => {
	// check if member is in a voice channel
	const voiceChannel = message.member.voice.channel;
	if (!voiceChannel) {
		message.reply("Please connect to a voice channel first!.");
		message.react("😡");
		return;
	}

	// get track name or url. set to false if neither one is found
	let keywordOrUrl =
		message.content.trim().split(`${prefix}play`)[1].trim() || false;

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

	const typeAlias = {
		yt: "youtube",
		sp: "spotify",
		mh: "mp3hunter",
		tm: "themesmoe",
	};

	// check if type options are provided
	let type = false;
	if (keywordOrUrl.indexOf("-type") > -1) {
		const parts = keywordOrUrl.split("-type");
		keywordOrUrl = parts[0].trim();
		type = parts[1].trim() == "" ? false : parts[1].trim();
		if (typeAlias[type]) type = typeAlias[type];
	}

	// otherwise, consider this a new play command with a keyword or link
	const result = player.playTracks(keywordOrUrl, { type: type });

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
