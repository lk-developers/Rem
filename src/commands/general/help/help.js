const handle = (message, prefix) => {
	const embed = getHelpEmbed(prefix);
	message.reply({ embed: embed });
};

const getHelpEmbed = (prefix) => {
	return {
		color: "#7ca8d9",
		description:
			"_I guess, as long as I have life, all I can do is fight with all my might._",
		author: {
			name: "| Help",
			icon_url: "https://tinyurl.com/y4x8xlat",
			url: "https://github.com/lk-developers",
		},
		thumbnail: {
			url: "https://i.imgur.com/ZXQOUQ9.gif",
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
				name: `${prefix}shelp`,
				value: "Show configuration commands.",
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
	};
};

module.exports = {
	handle,
};
