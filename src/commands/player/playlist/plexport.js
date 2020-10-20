const { MessageAttachment } = require("discord.js");
const { existsSync } = require("fs");

const config = require(`${process.cwd()}/config/config.json`);

const playlistDir = `${process.cwd()}/playlists`;

const handle = async (message) => {
	// check command
	if (message.content.trim() !== `${config.PREFIX}plexport`) return;

	const playlistPath = `${playlistDir}/${message.member.id}.json`;

	if (!existsSync(playlistPath)) {
		message.reply("You don't have a playlist!");
		message.react("😡");
		return;
	}

	const attachment = new MessageAttachment(playlistPath);
	message.channel
		.send(`<@${message.member.id}>, here is your playlist.`, attachment)
		.then(() => message.react("👍"))
		.catch(() => {
			message.reply("I don't have permission to send attachments!.");
			message.react("😭");
		});
};

module.exports = {
	handle,
};
