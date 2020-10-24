// This will format seconds to HH:mm:ss format
const formatSeconds = (seconds) => {
	const date = new Date(0);
	date.setSeconds(seconds);
	const timeStringParts = date.toISOString().substr(11, 8).split(":");
	// if hrs are 00, remove that
	if (timeStringParts[0] == "00") timeStringParts.shift();
	const timeString = timeStringParts.join(":");
	return timeString;
};

module.exports = {
	formatSeconds,
};
