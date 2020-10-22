const handle = (message, prefix) => {
	const embed = getHelpEmbed(prefix);
	message.reply({ embed: embed });
};

const getHelpEmbed = (prefix) => {
	return {
		color: "#7ca8d9",
		description:
			"_What’s wrong with taking the path that’s easiest, that will let me live longer?._",
		author: {
			name: "| Fun Commands",
			icon_url: "https://tinyurl.com/y4x8xlat",
			url: "https://github.com/lk-developers",
		},
		thumbnail: {
			url: "https://i.imgur.com/B6N9S7l.gif",
		},
		fields: [
			{
				name: `${prefix}remme`,
				value: "Show your dp with rem.",
			},
			{
				name: `${prefix}remgif`,
				value: "Show a random rem gif.",
			},
		],
	};
};

module.exports = {
	handle,
};
