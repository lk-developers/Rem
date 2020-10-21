const { existsSync } = require("fs");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const guildSessions = require(`${process.cwd()}/src/store/guildSessions`);
const config = require(`${process.cwd()}/config/config.json`);

const playlistDir = `${process.cwd()}/playlists`;

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

	const result = player.addTracksToQueue(tracks);

	// if everything went well
	if (!result.code) {
		if (player.getState() != "playing") {
			player.play();
		}

		message.reply("I added your playlist to the queue.");
		message.react("👍");
	} else {
		message.react("😞");
	}
};

module.exports = {
	handle,
};
