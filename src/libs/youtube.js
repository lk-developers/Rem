const ytdl = require("ytdl-core-discord");
const ytsr = require("ytsr");
const cache = require("./cache");

const getTrack = async (keywordOrUrl) => {
	// check cache first
	const cachedTrack = cache.getYoutube(keywordOrUrl);

	if (cachedTrack) {
		return cachedTrack.track;
	}

	let searchResult;

	// check if this is a youtube url or not
	const youtubeUrlRegex = new RegExp(
		"^(https?://)?(www.youtube.com|youtu.?be)/.+$"
	);

	if (!youtubeUrlRegex.test(keywordOrUrl)) {
		// find track from youtube
		const searchResults = await ytsr(keywordOrUrl, {
			limit: 1,
			safeSearch: false,
		}).catch(() => {
			throw "Sorry!. Youtube is blocking my requests :(.";
		});

		if (!searchResults.items && searchResults.items.length !== 1) {
			throw "Sorry!. I couldn't find a track for that keyword!.";
		}

		searchResult = searchResults.items[0].link;
	}

	// get track info using ytdl
	const trackInfo = await ytdl
		.getInfo(searchResult || keywordOrUrl)
		.catch(() => {
			throw "Sorry!. I couldn't find info for that track!.";
		});

	// find a format with good audio quality
	const format = trackInfo.formats.find(
		(f) => f.audioQuality == "AUDIO_QUALITY_MEDIUM"
	);

	if (!format) {
		throw "Sorry!. I couldn't find a good audio for that track!.";
	}

	const track = {
		name: trackInfo.videoDetails.title,
		type: "Youtube",
		url: format.url,
	};

	// save to cache
	cache.saveYoutube(keywordOrUrl, track);

	return track;
};

module.exports = { getTrack };
