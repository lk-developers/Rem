const gfycat = require(`${process.cwd()}/src/libs/gfycat`);

const handle = (message, prefix) => {
	// check command
	if (message.content.trim() !== `${prefix}remgif`) return;

	gfycat
		.getRandomGif("re zero rem")
		.then((url) => {
			message.channel.send(url);
			message.react("🤟");
		})
		.catch(() => {
			message.channel.send("I couldn't find any gifs.");
			message.react("😭");
		});
};

module.exports = {
	handle,
};
