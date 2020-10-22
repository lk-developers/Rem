const { writeFileSync, existsSync } = require("fs");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const guildSessions = require(`${process.cwd()}/src/store/guildSessions`);

const playlistDir = `${process.cwd()}/playlists`;

const handle = async (message, prefix) => {
	// check command
	if (message.content.trim() !== `${prefix}pladd`) return;

	const playlistPath = `${playlistDir}/${message.member.id}.json`;

	// check if member is in a voice channel
	const voiceChannel = message.member.voice.channel;
	if (!voiceChannel) {
		message.reply("Please connect to a voice channel first!.");
		message.react("😡");
		return;
	}

	// check if guild has a running player
	const player = guildSessions.getSession(message.guild.id);

	if (!player || !player.getCurrentTrack()) {
		message.reply("There is nothing playing atm!.");
		message.react("😡");
		return;
	}

	// check if a playlist exists
	if (!existsSync(playlistPath)) {
		writeFileSync(
			playlistPath,
			JSON.stringify({
				lastUpdated: "",
				lastRead: "",
				tracks: [],
			})
		);
	}

	// read the playlist
	const playlistAdapter = new FileSync(playlistPath);
	const playlistDb = low(playlistAdapter);

	// check playlist size
	const playlistSize = playlistDb.get("tracks").value().length;

	if (playlistSize == 50) {
		message.reply(
			"Sorry!. Your playlist is full. Please delete some tracks first."
		);
		message.react("😞");
		return;
	}

	// check for duplicates
	const track = playlistDb
		.get("tracks")
		.find({ url: player.currentTrack.url })
		.value();

	if (track) {
		message.react("😁");
		message.reply("This track is already in your playlist!.");
		return;
	}

	// add to playlist
	playlistDb.get("tracks").push(player.currentTrack).write();
	playlistDb.set("lastUpdated", new Date().toISOString()).write();

	message.reply("Track saved to your playlist!.");

	message.react("👍");
};

module.exports = {
	handle,
};
