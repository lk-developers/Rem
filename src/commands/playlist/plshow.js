const { existsSync } = require("fs");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const config = require("../../../config/config.json");

const playlistDir = `${__dirname}/../../../playlists`;

const handle = async (message) => {
	// check command
	if (message.content.trim() !== `${config.PREFIX}plshow`) return;

	const playlistPath = `${playlistDir}/${message.member.id}.json`;

	if (!existsSync(playlistPath)) {
		message.reply("You don't have a playlist!");
		message.react("😡");
		return;
	}

	// read the playlist
	const playlistAdapter = new FileSync(playlistPath);
	const playlistDb = low(playlistAdapter);

	const tracks = playlistDb.get("tracks").value();

	playlistDb.set("lastRead", new Date().toISOString()).write();

	// build the playlist using discord blocks
	let playlistStr =
		"```diff\n" +
		`++${message.member.user.username}'s Playlist (${tracks.length}/50 used)\n` +
		"--___________________________________--\n\n";

	tracks.forEach((t, index) => {
		playlistStr += `${index + 1}) ${t.name} (${t.type})\n`;
	});

	playlistStr += "```";

	message.channel.send(playlistStr);
	message.react("👍");
};

module.exports = {
	handle,
};
