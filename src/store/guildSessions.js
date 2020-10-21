const { RemPlayer } = require("@ipmanlk/rem-player");
const guildSessions = new Map();
const guildSessionTimeouts = new Map();

const createSession = (guildId, textChannel, voiceConnection) => {
	const player = new RemPlayer(voiceConnection, textChannel);

	// setup player event listeners
	player.on("youtubeFailed", () => {
		sendGeneralEmbed("I couldn't find that track on Youtube!.");
	});

	player.on("themesMoeFailed", () => {
		sendGeneralEmbed("I couldn't find themes for that anime!.");
	});

	player.on("nowPlaying", (track) => {
		const trackEmbed = {
			color: "#7ca8d9",
			author: {
				name: "| Now playing",
				icon_url: "https://tinyurl.com/y4x8xlat",
			},
			thumbnail: {
				url: "https://i.imgur.com/77Q5D0s.gif",
			},
			fields: [
				{
					name: `${track.name} (${track.type})`,
					value: `Source: [Click Here](${track.url})`,
				},
			],
		};

		player.textChannel.send({ embed: trackEmbed });
	});

	player.on("trackAdded", (track) => {
		sendGeneralEmbed(`${track.name} added to the queue.`);
	});

	player.on("tracksAdded", (trackCount) => {
		sendGeneralEmbed(`${trackCount} tracks added to the queue.`);
	});

	player.on("queueFull", () => {
		sendGeneralEmbed("Queue is full!. Skip or Stop the current session first.");
	});

	player.on("queueFinished", () => {
		endSession(guildId);
		sendGeneralEmbed("Queue finished.");
	});

	player.on("error", (e) => {
		console.log(`Error happened: ${e}`);
	});

	// embed for general responses
	const sendGeneralEmbed = (text) => {
		const embed = {
			color: "#7ca8d9",
			author: {
				name: `| ${text}`,
				icon_url: "https://tinyurl.com/y4x8xlat",
			},
		};
		player.textChannel.send({ embed });
	};

	guildSessions.set(guildId, player);

	return guildSessions.get(guildId);
};

const endSession = (guildId) => {
	guildSessions.delete(guildId);
};

const getSession = (guildId) => {
	const session = guildSessions.get(guildId);
	return session ? session : false;
};

const checkSessionTimeout = (oldState, newState) => {
	// find channels using channelID in state (state.channel is not working)
	const oldUserChannel = oldState.channel;
	const newUserChannel = newState.channel;

	if (!oldUserChannel && newUserChannel) {
		// when user joins the channel
		const guildId = newUserChannel.guild.id;
		const player = getSession(guildId);

		if (player) {
			// get player voice channel
			const playerVoiceChannel = player.getVoiceChannel();

			// if this voice channel is different than player's one, do nothing
			if (playerVoiceChannel.id != newUserChannel.id) {
				return;
			}

			// if there is an existing timeout, remove it
			if (guildSessionTimeouts.get(guildId)) {
				guildSessionTimeouts.delete(guildId);
			}
		}
	} else if (oldUserChannel && !newUserChannel) {
		// when user leaves the channel
		const guildId = oldUserChannel.guild.id;
		const player = getSession(guildId);

		// if voice channel has no members, start a timeout
		if (player && oldUserChannel.members.size == 1) {
			// get player voice channel
			const playerVoiceChannel = player.getVoiceChannel();

			// if this voice channel is different than player's one, do nothing
			if (playerVoiceChannel.id != oldUserChannel.id) {
				return;
			}
			const sessionTimeout = setTimeout(function () {
				player
					.getTextChannel()
					.send("_I'm leaving because no one is with me :)._");
				// delete session
				endSession(guildId);

				// disconnect the bot
				oldUserChannel.leave();

				// delete session timeout
				guildSessionTimeouts.delete(guildId);
			}, 120000);

			guildSessionTimeouts.set(guildId, sessionTimeout);
		}
	}
};

module.exports = {
	createSession,
	endSession,
	getSession,
	checkSessionTimeout,
};
