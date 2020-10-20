const fetch = require("node-fetch");

const getRandomGif = async (keyword) => {
	let response;
	try {
		response = await (
			await fetch(
				`https://api.gfycat.com/v1/gfycats/search?search_text=${keyword}&count=100`,
				{ timeout: 5000 }
			)
		).json();
	} catch (e) {
		throw "Unable to contact the gfycat api!.";
	}

	// select a random gif url
	const gifs = response.gfycats;
	const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
	const randomGifUrl = randomGif.max5mbGif || randomGif.max2mbGif;

	return randomGifUrl;
};

getRandomGif("re zero rem").then((url) => {
	console.log(url);
});

module.exports = {
	getRandomGif,
};
