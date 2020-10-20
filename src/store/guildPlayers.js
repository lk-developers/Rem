const { Player } = require("../classes/Player");
const guildPlayers = new Map();

const assign = (guildId, textChannel, voiceConnection) => {
	const player = new Player(textChannel, voiceConnection);
	guildPlayers.set(guildId, player);
	return guildPlayers.get(guildId);
};

const remove = (guildId) => {
	guildPlayers.delete(guildId);
};

const get = (guildId) => {
	const player = guildPlayers.get(guildId);
	return player ? player : false;
};

module.exports = {
	assign,
	remove,
	get,
};
