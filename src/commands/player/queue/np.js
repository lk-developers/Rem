const guildSessions = require(`${process.cwd()}/src/store/guildSessions`);
const config = require(`${process.cwd()}/config/config.json`);

const handle = async (message) => {
	// check command
	if (message.content.trim() !== `${config.PREFIX}np`) return;

	// check if guild has a running player
	const player = guildSessions.getSession(message.guild.id);
	const currentTrack = player.getCurrentTrack() || false;

	if (!player || !currentTrack) {
		message.reply("There is nothing playing atm!.");
		message.react("😡");
		return;
	}

	// create an embed for the current track
	const trackEmbed = {
		color: "#7ca8d9",
		author: {
			name: "| Now playing",
			icon_url: "https://tinyurl.com/y4x8xlat",
		},
		thumbnail: {
			url: "https://i.imgur.com/77Q5D0s.gif",
		},
		fields: [
			{
				name: `${currentTrack.name} (${currentTrack.type})`,
				value: `Source: [Click Here](${currentTrack.url})`,
			},
		],
	};

	message.channel.send({ embed: trackEmbed });

	message.react("👍");
};

module.exports = {
	handle,
};
