const { setGuildPrefix } = require(`${process.cwd()}/src/store/guildPrefixes`);

const handle = async (message, prefix) => {
	const newPrefix =
		message.content.trim().split(`${prefix}setprefix`)[1].trim() || false;

	if (!newPrefix || newPrefix.trim() == "") {
		message.reply("Please provide a valid prefix!.");
		message.react("😡");
		return;
	}

	setGuildPrefix(message.guild.id, newPrefix);

	const embed = {
		color: "#7ca8d9",
		author: {
			name: `| Prefix of this server is now set to ${newPrefix}`,
			icon_url: "https://tinyurl.com/y4x8xlat",
		},
	};

	message.reply({ embed: embed });
	message.react("👍");
};

module.exports = {
	handle,
};
