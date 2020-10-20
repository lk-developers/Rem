const config = require(`${process.cwd()}/config/config.json`);

const handle = (message) => {
	const embed = getHelpEmbed(config.PREFIX);
	message.reply({ embed: embed });
};

const getHelpEmbed = (prefix) => {
	return {
		description: "Send ♥ to themes.moe and jikan.moe for their amazing work!.",
		author: {
			name: "| Help",
			icon_url: "https://tinyurl.com/y4x8xlat",
			url: "https://github.com/lk-developers",
		},
		fields: [
			{
				name: "Main commands",
				value: "----------------------------------------",
			},
			{
				name: `${prefix}play <song name> or <youtube url> or <youtube playlist url>`,
				value: "Start playing a track from youtube.",
			},
			{
				name: `${prefix}playani <anime name>`,
				value: "Start playing OPs & EDs from themes.moe.\n\u200B",
			},
			{
				name: "Basic controls",
				value: "----------------------------------------",
			},
			{
				name: `${prefix}pause`,
				value: "Pause player.",
				inline: true,
			},
			{
				name: `${prefix}play`,
				value: "Resume player.",
				inline: true,
			},
			{
				name: `${prefix}stop`,
				value: "Stop player and clear the queue.",
				inline: true,
			},
			{
				name: `${prefix}np`,
				value: "Show currently playing track.",
				inline: true,
			},
			{
				name: `${prefix}leave`,
				value: "Leave from voice channel.\n\u200B",
				inline: true,
			},
			{
				name: "Queue commands",
				value: "----------------------------------------",
			},
			{
				name: `${prefix}queue`,
				value: "Show queue.",
				inline: true,
			},
			{
				name: `${prefix}skip`,
				value: "Skip to next track.",
				inline: true,
			},
			{
				name: `${prefix}skip <number>`,
				value: "Jump to a track in the queue.",
				inline: true,
			},
			{
				name: "Playlist commands",
				value: "----------------------------------------",
			},
			{
				name: `${prefix}plplay`,
				value: "Start your playlist (add to queue).",
				inline: true,
			},
			{
				name: `${prefix}pladd`,
				value: "Add current track to your playlist.",
				inline: true,
			},
			{
				name: `${prefix}plshow`,
				value: "Show your playlist.",
				inline: true,
			},
			{
				name: `${prefix}pldel <number>`,
				value: "Remove track from your playlist.",
				inline: true,
			},
			{
				name: `${prefix}plexport`,
				value: "Export your playlist.\n\u200B",
				inline: true,
			},
			// {
			// 	name: "Other commands",
			// 	value: "----------------------------------------",
			// },
			// {
			// 	name: `${prefix}help`,
			// 	value: "Show help.",
			// },
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
