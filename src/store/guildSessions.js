const { Player } = require("../classes/Player");
const guildSessions = new Map();

const create = (guildId, textChannel, voiceConnection) => {
	const player = new Player(voiceConnection, textChannel);

	// setup player event listeners
	player.on("youtubeFailed", () => {
		sendGeneralEmbed("I couldn't find that track on Youtube!.");
	});

	player.on("themesFailed", () => {
		sendGeneralEmbed("I couldn't find themes for that anime!.");
	});

	player.on("trackAdded", (track) => {
		sendGeneralEmbed(`${track.name} added to the queue.`);
	});

	player.on("tracksAdded", (trackCount) => {
		sendGeneralEmbed(`${trackCount} tracks added to the queue.`);
	});

	player.on("trackSkipped", () => {
		sendGeneralEmbed("Track skipped");
	});

	player.on("trackSkipEmpty", () => {
		sendGeneralEmbed("There are no more tracks left!.");
	});

	player.on("queuePaused", () => {
		sendGeneralEmbed("Queue paused!.");
	});

	player.on("queueResumed", () => {
		sendGeneralEmbed("Queue resumed!.");
	});

	player.on("queueFull", () => {
		sendGeneralEmbed("Queue is full!. Skip or Stop the current session first.");
	});

	player.on("queueStopped", () => {
		sendGeneralEmbed("Queue stopped!.");
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

	player.on("queueFinished", () => {
		end(guildId);
		sendGeneralEmbed("Queue finished.");
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

const end = (guildId) => {
	guildSessions.delete(guildId);
};

const get = (guildId) => {
	const session = guildSessions.get(guildId);
	return session ? session : false;
};

module.exports = {
	create,
	end,
	get,
};
