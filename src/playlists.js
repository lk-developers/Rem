const { writeFileSync, existsSync, unlinkSync } = require("fs");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const playlistDir = `${__dirname}/../playlists`;

const saveToPlaylist = (memberId, guildPlayer) => {
	const playlistPath = `${playlistDir}/${memberId}.json`;

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
		sendEmbed(
			guildPlayer.textChannel,
			"Sorry!. Your playlist is full. Please delete some tracks first."
		);
		return;
	}

	// check for duplicates
	const track = playlistDb
		.get("tracks")
		.find({ url: guildPlayer.currentTrack.url })
		.value();

	if (track) {
		sendEmbed(
			guildPlayer.textChannel,
			"This track is already in your playlist!."
		);
		return;
	}

	// add to playlist
	playlistDb.get("tracks").push(guildPlayer.currentTrack).write();
	playlistDb.set("lastUpdated", new Date().toISOString()).write();

	sendEmbed(guildPlayer.textChannel, "Track saved to your playlist!.");
};

const removeFromPlaylist = (memberId, trackPosition, textChannel) => {
	const playlistPath = `${playlistDir}/${memberId}.json`;

	if (!existsSync(playlistPath)) {
		sendEmbed(textChannel, "You don't have a playlist!.");
		return;
	}

	const playlistAdapter = new FileSync(playlistPath);
	const playlistDb = low(playlistAdapter);

	const track = playlistDb
		.get("tracks")
		.nth(trackPosition - 1)
		.value();

	playlistDb.set("lastRead", new Date().toISOString()).write();

	if (!track) {
		sendEmbed(textChannel, "Invalid track position!.");
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

	sendEmbed(textChannel, "Track removed from your playlist!.");
};

const showPlaylist = (member, textChannel) => {
	const playlistPath = `${playlistDir}/${member.id}.json`;

	if (!existsSync(playlistPath)) {
		sendEmbed(textChannel, "You don't have a playlist!.");
		return;
	}

	const playlistAdapter = new FileSync(playlistPath);
	const playlistDb = low(playlistAdapter);

	const tracks = playlistDb.get("tracks").value();

	playlistDb.set("lastRead", new Date().toISOString()).write();

	let playlistStr =
		"```diff\n" +
		`++${member.user.username}'s Playlist (${tracks.length}/50 used)\n` +
		"--___________________________________--\n\n";

	tracks.forEach((t, index) => {
		playlistStr += `${index + 1}) ${t.name} (${t.type})\n`;
	});

	playlistStr += "```";

	textChannel.send(playlistStr);
};

const startPlaylist = (memberId, guildPlayer) => {
	const playlistPath = `${playlistDir}/${memberId}.json`;

	if (!existsSync(playlistPath)) {
		sendEmbed(guildPlayer.textChannel, "You don't have a playlist!.");
		return;
	}

	const playlistAdapter = new FileSync(playlistPath);
	const playlistDb = low(playlistAdapter);

	const tracks = playlistDb.get("tracks").value();

	guildPlayer.addTracksToQueue(tracks);

	sendEmbed(
		guildPlayer.textChannel,
		"Your playlist has been added to the queue!."
	);

	// if player is stopped (state = null)
	if (!guildPlayer.state) {
		guildPlayer.playTrack();
	}
};

const sendEmbed = (textChannel, name, title = null) => {
	const embed = {
		author: {
			name: `| ${name}`,
			icon_url: "https://tinyurl.com/y4x8xlat",
		},
	};

	if (title) embed["title"] = title;

	textChannel.send({ embed: embed });
};

module.exports = {
	saveToPlaylist,
	removeFromPlaylist,
	showPlaylist,
	startPlaylist,
};
