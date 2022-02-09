const sendEmail = require("./sendEmail");

const sendResetPasswordEmail = async ({ name, email, verificationToken, origin }) => {
	const resetPassword = `${origin}/user/reset-password?token=${verificationToken}&email=${email}`;
	const message = `<p>You asked for a password reset, please set a new password by clicking on the following link: <a href="${resetPassword}">Reset password</a></p><p>If you are not the author of the request, please ignore this message.</p>`;

	return sendEmail({
		to: email,
		subject: "Email confirmation",
		html: `<h4>Hello, ${name}</h4>
    ${message}
        `,
	});
};

module.exports = sendResetPasswordEmail;
