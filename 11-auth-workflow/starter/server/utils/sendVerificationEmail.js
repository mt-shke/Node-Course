const sendEmail = require("./sendEmail");

const sendVerificationEmail = async ({ name, email, verificationToken, origin }) => {
	const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;
	const message = `<p>Please conform your email by click on the following link: <a href="${verifyEmail}">Verify your email</a></p>`;

	return sendEmail({
		to: email,
		subject: "Email confirmation",
		html: `<h4>Hello, ${name}</h4>
    ${message}
        `,
	});
};

module.exports = sendVerificationEmail;
