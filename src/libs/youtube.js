const fetch = require("node-fetch");
const cheerio = require("cheerio");
const ytdl = require("ytdl-core-discord");
const ytsr = require("ytsr");
const cache = require("./cache");

const getTrack = async (keywordOrUrl) => {
	// check cache first
	const cachedTrack = cache.getYoutube(keywordOrUrl);

	if (cachedTrack) {
		return cachedTrack.track;
	}

	let youtubeLink;

	// check if this is a youtube url or not
	const youtubeUrlRegex = new RegExp(
		"^(https?://)?(www.youtube.com|youtu.?be)/.+$"
	);

	if (!youtubeUrlRegex.test(keywordOrUrl)) {
		// find track from youtube
		try {
			const searchResults = await ytsr(keywordOrUrl, {
				limit: 1,
				safeSearch: false,
			});

			youtubeLink = searchResults.items[0].link;
		} catch (e) {
			youtubeLink = await searchInvidio(keywordOrUrl);
		}

		if (!youtubeLink) {
			throw "Sorry!. I couldn't find a track for that keyword!.";
		}
	} else {
		youtubeLink = keywordOrUrl;
	}

	// get track info using ytdl
	const trackInfo = await ytdl.getInfo(youtubeLink).catch(() => {
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

// fallback for youtube search queries fails
const searchInvidio = async (keyword) => {
	// parse and find the first result
	const retries = 4;
	let currentTry = 0;

	let link = null;

	while (link == null && currentTry < retries) {
		// html response
		const response = await (
			await fetch(`https://tube.connect.cafe/search?q=${keyword}`)
		).text();

		const $ = cheerio.load(response);
		const a = $(".pure-u-1.pure-u-md-1-4 .h-box a").first();
		if (a) link = a.attr("href");
		currentTry++;
	}

	return `https://www.youtube.com/${link}`;
};

module.exports = { getTrack };
