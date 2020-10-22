const { writeFileSync, existsSync } = require("fs");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const config = require(`${process.cwd()}/config/config.json`);

const prefixDbPath = `${process.cwd()}/data/guildPrefixes.json`;

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
	prefixDb.get("records").remove({ guildId: guildId }).write();

	prefixDb.get("records").push({ guildId: guildId, prefix: prefix }).write();
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

module.exports = {
	setGuildPrefix,
	getGuildPrefix,
};
