const { writeFileSync, existsSync } = require("fs");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const guildPlayers = require("../../store/guildPlayers");
const config = require("../../../config/config.json");

const playlistDir = `${__dirname}/../../../playlists`;

const handle = async (message) => {
	// check command
	if (message.content.trim() !== `${config.PREFIX}plplay`) return;

	const playlistPath = `${playlistDir}/${message.member.id}.json`;

	if (!existsSync(playlistPath)) {
		message.reply("You don't have a playlist!");
		message.react("😡");
		return;
	}

	// check if member is in a voice channel
	const voiceChannel = message.member.voice.channel;
	if (!voiceChannel) {
		message.reply("Please connect to a voice channel first!.");
		message.react("😡");
		return;
	}

	// read the playlist
	const playlistAdapter = new FileSync(playlistPath);
	const playlistDb = low(playlistAdapter);

	const tracks = playlistDb.get("tracks").value();
	playlistDb.set("lastRead", new Date().toISOString()).write();

	// if guild already has a running player, use it
	const player = guildPlayers.get(message.guild.id);

	message.reply("I added your playlist to the queue.");

	if (player) {
		player.addTracksToQueue(tracks);
		if (!player.state) player.playTrack();
		message.react("👍");
		return;
	}

	// else, create a new player instance for the guild
	const voiceConnection = await voiceChannel.join();

	const newPlayer = guildPlayers.assign(
		message.guild.id,
		message.channel,
		voiceConnection
	);

	newPlayer.on("queueFinished", () => {
		console.log(`Queue finished @ ${message.guild.name}`);
		guildPlayers.remove(message.guild.id);
	});

	newPlayer.on("queueStopped", () => {
		console.log(`Queue stopped @ ${message.guild.name}`);
		guildPlayers.remove(message.guild.id);
	});

	newPlayer.on("error", (e) => {
		console.log("Error happend: ", e);
	});

	newPlayer.addTracksToQueue(tracks);
	newPlayer.playTrack();

	message.react("👍");
};

module.exports = {
	handle,
};
