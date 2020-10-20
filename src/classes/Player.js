const EventEmitter = require("events");
const themesMoe = require("../libs/themes.moe");
const youtube = require("../libs/youtube");
const ytdl = require("ytdl-core-discord");

class Player extends EventEmitter {
	constructor(voiceConnection, textChannel) {
		super();
		this.voiceConnection = voiceConnection;
		this.textChannel = textChannel;
		this.dispatcher = null;
		this.queue = [];
		this.currentTrack = null;
		// state is null when queue is empty. (can be null, playing, paused)
		this.state = null;
		this.loopQueue = false;
	}

	// play a single track from youtube
	playYoutubeTracks(keywordOrUrl) {
		if (this.state == "paused") {
			this.resume();
			return;
		}

		youtube
			.getTracks(keywordOrUrl)
			.then((track) => {
				// push to global tracks
				this.addTracksToQueue(track);
				// start playing first track if state is null
				if (!this.state) this.playTrack();
			})
			.catch((e) => {
				this.emit("youtubeFailed");
				this.emit("error", e);
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
				this.emit("themesFailed");
				this.emit("error", e);
			});
	}

	addTracksToQueue(tracks = []) {
		if (this.queue.length <= 100) {
			this.queue = [...this.queue, ...tracks];
			if (tracks.length == 1) {
				this.emit("trackAdded", tracks[0]);
			} else {
				this.emit("tracksAdded", tracks.length);
			}
		} else {
			this.emit("queueFull");
		}
	}

	// skip to next track or play track in the given position
	async playTrack(position = null) {
		let track;

		if (!position) {
			track = this.queue.shift();
		} else {
			track = this.queue[position - 1];
			this.queue = this.queue.filter((t, index) => index !== position - 1);
		}

		// push track back to the end when loop queue is enabled
		if (this.loopQueue) this.queue.push(track);

		this.currentTrack = track;

		// remove existing dispatcher if there is one
		if (this.dispatcher) this.dispatcher.destroy();

		if (track.type == "Youtube") {
			// on a ytdl error, jump to the next track
			try {
				this.dispatcher = this.voiceConnection.play(await ytdl(track.url), {
					type: "opus",
					bitrate: 320,
					volume: false,
				});
			} catch (e) {
				this.playTrack();
			}
		} else {
			this.dispatcher = this.voiceConnection.play(track.url, {
				bitrate: 320,
				volume: false,
			});
		}

		this.state = "playing";

		this.emit("nowPlaying", this.currentTrack);

		// register event listener for the dispatcher
		this.dispatcher.on("finish", () => {
			if (this.queue.length > 0) {
				this.playTrack();
			} else {
				this.emit("queueFinished");
				this.voiceConnection.disconnect();
			}
		});

		this.dispatcher.on("error", (e) => this.emit("error", e));
	}

	skip(position = null) {
		if (this.dispatcher) {
			if (this.queue.length > 0) {
				if (position) {
					this.playTrack(position);
				} else {
					this.emit("trackSkipped");
					this.playTrack();
				}
			} else {
				this.emit("trackSkipEmpty");
			}
		}
	}

	pause() {
		if (this.dispatcher) {
			this.dispatcher.pause();
			this.state = "paused";
			this.emit("queuePaused");
		}
	}

	resume() {
		if (this.dispatcher) {
			this.dispatcher.resume();
			this.state = "playing";
			this.emit("queueResumed");
		}
	}

	stop() {
		if (this.dispatcher) {
			this.dispatcher.destroy();
			this.queue = [];
			this.state = null;
			this.currentTrack = null;
		}
		this.emit("queueStopped");
	}
}

module.exports = {
	Player,
};
