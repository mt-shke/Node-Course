const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");

const sendEmailEthereal = async (req, res) => {
	let testAccount = await nodemailer.createTestAccount();

	const transporter = nodemailer.createTransport({
		host: "smtp.ethereal.email",
		port: 587,
		auth: {
			user: "dedric.hansen85@ethereal.email",
			pass: "1saAkfkcTNrkpv2uwh",
		},
	});

	let info = await transporter.sendMail({
		from: '"Jean Pierre" <micheltt.dev@gmail.com>', // sender address
		to: "micheltt.dev@gmail.com, micheltt.dv@gmail.com", // list of receivers
		subject: "Hello ✔", // Subject line
		text: "Hello world?", // plain text body
		html: "<b>Hello world?</b>", // html body
	});

	res.json(info);
};

const sendEmail = async (req, res) => {
	sgMail.setApiKey(process.env.SENDGRID_API_KEY);

	const msg = {
		to: "micheltt.dv@gmail.com",
		from: "micheltt.dev@gmail.com",
		subject: "Sending with SendGrid is Fun",
		text: "and easy to do anywhere, even with Node.js",
		html: "<strong>and easy to do anywhere, even with Node.js</strong>",
	};
	sgMail
		.send(msg)
		.then(() => {
			console.log("Email sent");
		})
		.catch((error) => {
			console.error(error);
		});

	const info = await sgMail.send(msg);
	res.json(info);
};

module.exports = sendEmail;
