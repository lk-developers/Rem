const { MessageAttachment } = require("discord.js");

const Canvas = require("canvas");

const handle = async (message) => {
	// if there a member mentioned, use that member's avatar
	const member = message.mentions.members.first() || message.member;

	const canvas = Canvas.createCanvas(633, 800);
	const ctx = canvas.getContext("2d");

	// load image from directory
	const background = await Canvas.loadImage(`${__dirname}/img/remdp.png`);

	// stretch the image onto the entire canvas
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	// draw user avatar on the sign
	const avatar = await Canvas.loadImage(
		member.user.displayAvatarURL({ format: "jpg" })
	);

	ctx.drawImage(avatar, 274, 540, 250, 250);

	// process the file using MessageAttachment class
	const attachment = new MessageAttachment(
		canvas.toBuffer(),
		`${message.member.id}.png`
	);

	message.channel.send({ files: [attachment] });

	message.react("💘");
};

module.exports = {
	handle,
};
