/**
 * This file will create an object with command as key
 * and relevant js file as value.
 */

const { promisify } = require("util");
const { resolve, basename } = require("path");
const fs = require("fs");
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

const commandsPath = `${__dirname}/commands/`;

// search recursively for files in a given directory
async function getFiles(dir) {
	const subdirs = await readdir(dir);
	const files = await Promise.all(
		subdirs.map(async (subdir) => {
			const res = resolve(dir, subdir);
			return (await stat(res)).isDirectory() ? getFiles(res) : res;
		})
	);
	// return an array of absolute paths of files
	return files.reduce((a, f) => a.concat(f), []);
}

// create an object with command and absolute path to relevant js file
async function getCommands() {
	const commands = {};

	const commandFiles = await getFiles(commandsPath);
	commandFiles.forEach((file) => {
		const command = basename(file).split(".js")[0];
		commands[command] = file;
	});

	return commands;
}

module.exports = {
	getCommands,
};
