const { writeFileSync, existsSync } = require("fs");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const config = require(`${process.cwd()}/config/config.json`);

const prefixDbPath = `${process.cwd()}/data/guildInfo.json`;

// create db file if doesn't exist
if (!existsSync(prefixDbPath)) {
	writeFileSync(
		prefixDbPath,
		JSON.stringify({
			records: [],
		})
	);
}

const prefixDbAdapter = new FileSync(prefixDbPath);
const prefixDb = low(prefixDbAdapter);

const setGuildPrefix = (guildId, prefix) => {
	const record = prefixDb.get("records").find({ guildId: guildId }).value();
	prefixDb.get("records").remove({ guildId: guildId }).write();

	prefixDb
		.get("records")
		.push({
			guildId: guildId,
			prefix: prefix,
			allowedChannels: record.allowedChannels,
		})
		.write();
};

const getGuildPrefix = (guildId) => {
	const record = prefixDb.get("records").find({ guildId: guildId }).value();
	// if this guild has a custom prefix
	if (record) {
		return record.prefix;
	}

	// otherwise return default prefix
	return config.PREFIX;
};

const addAllowedChannel = (guildId, channelId) => {
	let record = prefixDb.get("records").find({ guildId: guildId }).value();
	if (record) {
		prefixDb.get("records").remove({ guildId: guildId }).write();
	} else {
		record = { guildId: guildId, prefix: config.PREFIX, allowedChannels: [] };
	}

	if (!record.allowedChannels.includes(channelId)) {
		record.allowedChannels.push(channelId);
	}

	prefixDb
		.get("records")
		.push({
			guildId: guildId,
			prefix: record.prefix,
			allowedChannels: record.allowedChannels,
		})
		.write();
};

const removeAllowedChannel = (guildId, channelId) => {
	let record = prefixDb.get("records").find({ guildId: guildId }).value();
	if (record) {
		prefixDb.get("records").remove({ guildId: guildId }).write();
	} else {
		record = { guildId: guildId, prefix: config.PREFIX, allowedChannels: [] };
	}

	prefixDb
		.get("records")
		.push({
			guildId: guildId,
			prefix: record.prefix,
			allowedChannels: record.allowedChannels.filter((cid) => cid != channelId),
		})
		.write();
};

const clearAllowedChannels = (guildId) => {
	let record = prefixDb.get("records").find({ guildId: guildId }).value();
	if (record) {
		prefixDb.get("records").remove({ guildId: guildId }).write();
	} else {
		record = { guildId: guildId, prefix: config.PREFIX, allowedChannels: [] };
	}

	prefixDb
		.get("records")
		.push({
			guildId: guildId,
			prefix: record.prefix,
			allowedChannels: [],
		})
		.write();
};

const getAllowedChannels = (guildId) => {
	const record = prefixDb.get("records").find({ guildId: guildId }).value();
	if (record) {
		return record.allowedChannels;
	} else {
		return [];
	}
};

module.exports = {
	setGuildPrefix,
	getGuildPrefix,
	addAllowedChannel,
	removeAllowedChannel,
	clearAllowedChannels,
	getAllowedChannels,
};
