const { writeFileSync, existsSync } = require("fs");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const animeDbPath = `${__dirname}/../../cache/anime.json`;
const youtubeDbPath = `${__dirname}/../../cache/youtube.json`;

if (!existsSync(animeDbPath)) {
	writeFileSync(
		animeDbPath,
		JSON.stringify({
			tracks: [],
		})
	);
}

if (!existsSync(youtubeDbPath)) {
	writeFileSync(
		youtubeDbPath,
		JSON.stringify({
			tracks: [],
		})
	);
}

const animeAdapter = new FileSync(animeDbPath);
const youtubeAdapter = new FileSync(youtubeDbPath);
const animeDb = low(animeAdapter);
const youtubeDb = low(youtubeAdapter);

const saveAnime = (keyword, tracks) => {
	animeDb.get("tracks").push({ key: keyword, tracks: tracks }).write();
};

const saveYoutube = (keyword, track) => {
	youtubeDb.get("tracks").push({ key: keyword, track: track }).write();
};

const getAnime = (keyword) => {
	return animeDb
		.get("tracks")
		.find({ key: keyword.toLowerCase().trim() })
		.value();
};

const getYoutube = (keyword) => {
	return youtubeDb
		.get("tracks")
		.find({ key: keyword.toLowerCase().trim() })
		.value();
};

module.exports = {
	saveAnime,
	saveYoutube,
	getAnime,
	getYoutube,
};
