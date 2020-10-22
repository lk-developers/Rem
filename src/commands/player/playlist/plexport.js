const { MessageAttachment } = require("discord.js");
const { existsSync } = require("fs");

const playlistDir = `${process.cwd()}/playlists`;

const handle = async (message, prefix) => {
	// check command
	if (message.content.trim() !== `${prefix}plexport`) return;

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
