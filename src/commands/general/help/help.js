const config = require(`${process.cwd()}/config/config.json`);

const handle = (message) => {
	const embed = getHelpEmbed(config.PREFIX);
	message.reply({ embed: embed });
};

const getHelpEmbed = (prefix) => {
	return {
		description:
			"_I guess, as long as I have life, all I can do is fight with all my might._.",
		author: {
			name: "| Help",
			icon_url: "https://tinyurl.com/y4x8xlat",
			url: "https://github.com/lk-developers",
		},
		thumbnail: {
			url: "https://i.imgur.com/77Q5D0s.gif",
		},
		fields: [
			{
				name: "Commands summery",
				value: "----------------------------------------",
			},
			{
				name: `${prefix}help`,
				value: "Show help.",
			},
			{
				name: `${prefix}phelp`,
				value: "Show music player commands.",
			},
			{
				name: `${prefix}funhelp`,
				value: "Show fun commands.",
			},
		],
		footer: {
			text: "By LK Developers",
			icon_url: "https://tinyurl.com/yyhwlrqc",
		},
	};
};

module.exports = {
	handle,
};
