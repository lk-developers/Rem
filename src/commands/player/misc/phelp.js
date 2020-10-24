const handle = (message, prefix) => {
	const embed = getHelpEmbed(prefix);
	message.reply({ embed: embed });
};

const getHelpEmbed = (prefix) => {
	return {
		color: "#7ca8d9",
		description: "Send ♥ to themes.moe and jikan.moe for their amazing work!.",
		author: {
			name: "| Music Player Commands",
			icon_url: "https://tinyurl.com/y4x8xlat",
			url: "https://github.com/lk-developers",
		},
		thumbnail: {
			url: "https://i.imgur.com/oDElnA4.gif",
		},
		fields: [
			{
				name: "Main commands",
				value: "----------------------------------------",
			},
			{
				name: `${prefix}play <song name> or <url> -type <source>`,
				value:
					"Start playing tracks.\n\nTrack names, Youtube links, Spotify Links and many more are supported. \n\nYou can use optional **-type** flag to avoid automatic detection. **Supported flag values are: yt/youtube, sp/spotify, mh/mp3hunter, tm/themesmoe**\n\nExample,\n,play Naruto op1\n,play Naruto -type tm\n\u200B",
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
				value: "Leave from voice channel.",
				inline: true,
			},
			{
				name: `${prefix}seek <duration>`,
				value:
					"Seek track by given duration. **ms,s,m,h units are supported.**\n\nExample,\n,seek 30s\n\u200B",
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
				name: `${prefix}rm <number>`,
				value: "Remove track from the queue.",
				inline: true,
			},
			{
				name: `${prefix}loop`,
				value: "Toggle queue looping.\n\u200B",
				inline: true,
			},
			{
				name: `${prefix}mv <track number>,<new position>`,
				value: "Move track to a new position.\n\u200B",
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
	};
};

module.exports = {
	handle,
};
