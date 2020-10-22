const Discord = require("discord.js");
const { checkSessionTimeout } = require("./store/guildSessions");
const { getGuildPrefix } = require("./store/guildPrefixes");

const loader = require("./loader");
const config = require("../config/config.json");

const client = new Discord.Client();

let COMMANDS;
// load commands
loader.getCommands().then((commands) => {
	COMMANDS = commands;
	console.log("bot commands have been loaded!.");
});

client.once("ready", () => {
	console.log("Ready!");
	client.user.setActivity("to themes.moe with ♥", { type: "LISTENING" });
});

client.on("message", async (message) => {
	// get prefix for this guild
	const PREFIX = getGuildPrefix(message.guild.id);

	// ignore bot messages and messages doesn't start with the prefix
	if (message.author.bot || !message.content.startsWith(PREFIX)) return;

	// forward message to the relevant module (command)
	try {
		const messageContent = message.content.trim();
		const command = messageContent.split(PREFIX)[1].split(" ")[0];
		const module = require(COMMANDS[command]);
		module.handle(message, PREFIX);
	} catch (e) {
		if (e.code !== "ERR_INVALID_ARG_TYPE") console.log(e);
		message.reply("Invalid command!");
	}
});

// to detect when members join and leave a voice channel
client.on("voiceStateUpdate", (oldState, newState) => {
	checkSessionTimeout(oldState, newState);
});

client.login(config.TOKEN);
