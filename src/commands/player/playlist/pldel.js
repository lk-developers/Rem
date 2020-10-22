const { existsSync, unlinkSync } = require("fs");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const playlistDir = `${process.cwd()}/playlists`;

const handle = async (message, prefix) => {
	const playlistPath = `${playlistDir}/${message.member.id}.json`;

	if (!existsSync(playlistPath)) {
		message.reply("You don't have a playlist!");
		message.react("😡");
		return;
	}

	// check if position is given
	let trackPosition =
		message.content.trim().split(`${prefix}pldel`)[1] || null;
	trackPosition = isNaN(trackPosition) ? null : parseInt(trackPosition);

	if (!trackPosition) {
		message.reply("Please provide a track position!.");
		message.react("😡");
		return;
	}

	// read the playlist
	const playlistAdapter = new FileSync(playlistPath);
	const playlistDb = low(playlistAdapter);

	const track = playlistDb
		.get("tracks")
		.nth(trackPosition - 1)
		.value();

	playlistDb.set("lastRead", new Date().toISOString()).write();

	if (!track) {
		message.reply("Invalid track position!.");
		message.react("😡");
		return;
	}

	playlistDb
		.get("tracks")
		.pullAt(trackPosition - 1)
		.write();

	playlistDb.set("lastUpdated", new Date().toISOString()).write();

	// if there are no tracks, remove playlist
	if (playlistDb.get("tracks").value().length == 0) {
		unlinkSync(playlistPath);
	}

	message.reply("Track removed from your playlist!.");
	message.react("👍");
};

module.exports = {
	handle,
};
