const fetch = require("node-fetch");
const cache = require("./cache");

const getTracks = async (animeName) => {
	if (!animeName || animeName.length < 4) {
		throw "Please provide a valid anime name!";
	}

	// check cache first
	const cachedAnime = cache.getAnime(animeName);
	if (cachedAnime) {
		return cachedAnime.tracks;
	}

	// find given anime on mal
	const malResponse = await request(
		`https://api.jikan.moe/v3/search/anime?q=${animeName}&limit=1`
	).catch((e) => {
		console.log(e);
		throw "Unable to contact the jikan api!.";
	});

	if (!malResponse.results || malResponse.results.length == 0) {
		throw "No anime found under the given name!.";
	}

	// extract mal id from mal url
	const malId = malResponse.results[0].url.split("/").reverse()[1];

	// get track info
	const themesResponse = await request(
		`https://themes.moe/api/themes/${malId}`
	).catch((e) => {
		console.log(e);
		throw "Unable to contact jikan api!.";
	});

	// extrat track info
	const tracks = themesResponse[0].themes.map((theme) => {
		return {
			anime: themesResponse[0].name,
			type: theme.themeType,
			name: theme.themeName,
			url: theme.mirror.mirrorURL,
		};
	});

	if (tracks.length == 0) throw `No tracks found for ${animeName}`;

	// save to cache
	cache.saveAnime(animeName, tracks);

	return tracks;
};

const request = async (url) => {
	return await (await fetch(url)).json();
};

module.exports = {
	getTracks,
};
