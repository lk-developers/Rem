const EventEmitter = require("events");
const themesMoe = require("./libs/themes.moe");
const youtube = require("./libs/youtube");

class Player extends EventEmitter {
	constructor(textChannel, voiceConnection) {
		super();
		// text channel is for commands and responses
		this.textChannel = textChannel;
		this.voiceConnection = voiceConnection;
		this.dispatcher = null;
		this.queue = [];
		this.currentTrack = null;
		// state is null when queue is empty. (can be null, playing, paused)
		this.state = null;
	}

	// play a single track from youtube
	playYoutubeTrack(keywordOrUrl) {
		if (this.state == "paused") {
			this.resume();
			return;
		}

		youtube
			.getTrack(keywordOrUrl)
			.then((track) => {
				// push to global tracks
				this.addTracksToQueue([track]);
				// start playing first track if state is null
				if (!this.state) this.playTrack();
			})
			.catch((e) => {
				this.emit("error", e);
				this.sendEmbed(e);
			});
	}

	// play OPs & EDs from themes.moe
	playAnimeTracks(animeName) {
		themesMoe
			.getTracks(animeName)
			.then((tracks) => {
				this.addTracksToQueue(tracks);
				if (!this.state) this.playTrack();
			})
			.catch((e) => {
				this.emit("error", e);
				this.sendEmbed(e, "Error");
			});
	}

	addTracksToQueue(tracks = []) {
		if (this.queue.length <= 100) {
			this.queue = [...this.queue, ...tracks];
			if (tracks.length == 1) {
				this.sendEmbed(`${tracks[0].name} added to the queue.`);
			} else {
				this.sendEmbed(`${tracks.length} tracks added to the queue.`);
			}
		} else {
			this.sendEmbed("Queue is full!. Skip or Stop the current session first.");
		}
	}

	// skip to next track or play track in the given position
	playTrack(position = null) {
		let track;

		if (!position) {
			track = this.queue.shift();
		} else {
			track = this.queue[position - 1];
			this.queue = this.queue.filter((t, index) => index !== position - 1);
		}

		this.currentTrack = track;
		if (this.dispatcher) this.dispatcher.destroy();
		this.dispatcher = this.voiceConnection.play(track.url, {
			bitrate: 320,
			volume: false,
		});
		this.state = "playing";

		this.sendEmbed(
			`Now Playing [${this.queue.length} left]`,
			`${track.name} (${track.type})`
		);

		this.registerDispatcherEventListeners();
	}

	skip(position = null) {
		if (this.dispatcher) {
			if (this.queue.length > 0) {
				if (position) {
					this.playTrack(position);
				} else {
					this.sendEmbed("Track Skipped!.");
					this.playTrack();
				}
			} else {
				this.sendEmbed("There are no more tracks left!.");
			}
		}
	}

	pause() {
		if (this.dispatcher) {
			this.state = "paused";
			this.dispatcher.pause();
			this.sendEmbed("Queue Paused!");
		}
	}

	resume() {
		if (this.dispatcher) {
			this.state = "playing";
			this.dispatcher.resume();
			this.sendEmbed("Queue Resumed!");
		}
	}

	stop() {
		if (this.dispatcher) {
			this.dispatcher.destroy();
			this.queue = [];
			this.state = null;
			this.currentTrack = null;
			this.emit("queueStopped");
		}
	}

	showQueue() {
		let tracks = "";
		this.queue.every((track, index) => {
			if (index == 10) return false;
			tracks += `(${index + 1}) ${track.name} (${track.type})\n`;
			return true;
		});

		const queue =
			"```diff\n" +
			`Total tracks: ${this.queue.length}\n\n` +
			`++ Current track:\n${this.currentTrack.name} (${this.currentTrack.type})\n\n` +
			`--Upcoming tracks:\n${tracks}` +
			"```";

		this.textChannel.send(queue);
	}

	registerDispatcherEventListeners() {
		this.dispatcher.on("finish", () => {
			if (this.queue.length > 0) {
				this.playTrack();
			} else {
				this.sendEmbed("Queue finished!");
				this.voiceConnection.disconnect();
				this.emit("queueFinished");
			}
		});

		this.dispatcher.on("error", (e) => this.emit("error", e));
	}

	sendEmbed(name, title = null) {
		const embed = {
			author: {
				name: `| ${name}`,
				icon_url: "https://tinyurl.com/y4x8xlat",
			},
		};

		if (title) embed["title"] = title;

		this.textChannel.send({ embed: embed });
	}
}

module.exports = {
	Player,
};
