const Discord = require("discord.js");
const { Player } = require("./player");
const config = require("../config/config.json");
const client = new Discord.Client();

const prefix = config.PREFIX;

// store players for each guild
const guildPlayers = new Map();

client.once("ready", () => {
	console.log("Ready!");
	client.user.setActivity("to themes.moe with ♥", { type: "LISTENING" });
});

client.on("message", async (message) => {
	// ignore non bot commands
	if (!message.content.startsWith(prefix)) return;

	if (message.content.trim() == `${prefix}help`) {
		sendHelp(message.channel);
		return;
	}

	const voiceChannel = message.member.voice.channel;
	const guildPlayer = guildPlayers.get(message.guild.id);

	// if member is no in a voice channel
	if (!voiceChannel) {
		message.reply("Please connect to a voice channel first!.");
		message.react("😡");
		return;
	}

	if (message.content.startsWith(`${prefix}play`)) {
		const keywordOrUrl =
			message.content.split(`${prefix}play`)[1].trim() || false;

		if (guildPlayer) {
			// if bot is in a different voice channel, join that channel first
			if (guildPlayer.voiceConnection.channel.id !== voiceChannel.id) {
				await voiceChannel.join();
			}
			guildPlayer.playYoutubeTracks(keywordOrUrl);
			message.react("👍");
			return;
		}

		const voiceConnection = await voiceChannel.join();

		const player = new Player(message.channel, voiceConnection);
		player.playYoutubeTracks(keywordOrUrl);

		registerGuildPlayerEventListeners(message, player);

		// add player to global players
		guildPlayers.set(message.guild.id, player);
		message.react("👍");
		return;
	}

	if (message.content.startsWith(`${prefix}anime`)) {
		const animeName =
			message.content.split(`${prefix}anime`)[1].trim() || false;

		if (guildPlayer) {
			// if bot is in a different voice channel, join that channel first
			if (guildPlayer.voiceConnection.channel.id !== voiceChannel.id) {
				await voiceChannel.join();
			}
			guildPlayer.playAnimeTracks(animeName);
			message.react("👍");
			return;
		}

		const voiceConnection = await voiceChannel.join();

		const player = new Player(message.channel, voiceConnection);
		player.playAnimeTracks(animeName);

		registerGuildPlayerEventListeners(message, player);

		// add player to global players
		guildPlayers.set(message.guild.id, player);
		message.react("👍");
		return;
	}

	if (!guildPlayer) {
		message.reply("Nothing is playing at the moment!.");
		message.react("😡");
		return;
	}

	if (message.content.trim() == `${prefix}play`) {
		guildPlayer.play();
		message.react("👍");
	}

	if (message.content.trim() == `${prefix}pause`) {
		guildPlayer.pause();
		message.react("👍");
	}

	if (message.content.trim().startsWith(`${prefix}skip`)) {
		// check if a position is given (null when not given)
		let position = message.content.trim().split(`${prefix}skip`)[1] || null;
		position = isNaN(position) ? null : parseInt(position);

		// skip tracks
		guildPlayer.skip(position);
		message.react("👍");
	}

	if (message.content.trim() == `${prefix}stop`) {
		guildPlayer.stop();
		message.react("👍");
	}

	if (message.content.trim() == `${prefix}queue`) {
		guildPlayer.showQueue();
		message.react("👍");
	}
});

const registerGuildPlayerEventListeners = (message, player) => {
	// remove player from global players when queue is finished
	player.on("queueFinished", () => {
		console.log(`Queue finished @ ${message.guild.name}`);
		guildPlayers.delete(message.guild.id);
	});

	player.on("queueStopped", () => {
		console.log(`Queue stopped @ ${message.guild.name}`);
		guildPlayers.delete(message.guild.id);
	});

	player.on("error", (e) => {
		console.log("Error happend: ", e);
	});
};

const sendHelp = (channel) => {
	const embed = {
		description: "Send ♥ to themes.moe and jikan.moe for their amazing work!.",
		author: {
			name: "| Help",
			icon_url: "https://tinyurl.com/y4x8xlat",
			url: "https://github.com/lk-developers",
		},
		fields: [
			{
				name: `${prefix}play <song name> or <youtube url> or <youtube playlist url>`,
				value: "Start playing a track from youtube.",
			},
			{
				name: `${prefix}anime <anime name>`,
				value: "Start playing OPs & EDs from themes.moe.",
			},
			{
				name: `${prefix}queue`,
				value: "Show queue.",
			},
			{
				name: `${prefix}skip`,
				value: "Skip to next track.",
			},
			{
				name: `${prefix}skip <number>`,
				value: "Jump to a track in the queue.",
			},
			{
				name: `${prefix}pause`,
				value: "Pause player.",
			},
			{
				name: `${prefix}stop`,
				value: "Stop player and clear the queue.",
			},
			{
				name: `${prefix}help`,
				value: "Show help.",
			},
		],
		footer: {
			text: "By LK Developers",
			icon_url: "https://tinyurl.com/yyhwlrqc",
		},
	};

	channel.send({ embed: embed });
};

client.login(config.TOKEN);
