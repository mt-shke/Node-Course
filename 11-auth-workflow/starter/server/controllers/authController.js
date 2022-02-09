const User = require("../models/User");
const Token = require("../models/Token");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
	attachCookiesToResponse,
	createTokenUser,
	sendVerificationEmail,
	sendResetPasswordEmail,
	createHash,
} = require("../utils");
const crypto = require("crypto");

const origin = "http://localhost:3000";

const register = async (req, res) => {
	const { email, name, password } = req.body;
	const emailAlreadyExists = await User.findOne({ email });
	if (emailAlreadyExists) {
		throw new CustomError.BadRequestError("Email already exists");
	}

	// first registered user is an admin
	const isFirstAccount = (await User.countDocuments({})) === 0;
	const role = isFirstAccount ? "admin" : "user";

	const verificationToken = crypto.randomBytes(40).toString("hex");

	const user = await User.create({ name, email, password, role, verificationToken });

	// const newOrigin = 'https://react-node-user-workflow-front-end.netlify.app';

	// console.log(req)
	// const tempOrigin = req.get('origin');
	// const protocol = req.protocol;
	// const host = req.get('host');
	// const forwardedHost = req.get('x-forwarded-host');
	// const forwardedProtocol = req.get('x-forwarded-proto');

	await sendVerificationEmail({
		name: user.name,
		email: user.email,
		verificationToken: user.verificationToken,
		origin,
	});
	res.status(StatusCodes.CREATED).json({
		msg: "Success! Check your email to verify account",
	});

	// const tokenUser = createTokenUser(user);
	// attachCookiesToResponse({ res, user: tokenUser });
	// res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

// LOGIN function

const login = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		throw new CustomError.BadRequestError("Please provide email and password");
	}

	const user = await User.findOne({ email });
	if (!user) {
		throw new CustomError.UnauthenticatedError("Invalid Credentials");
	}

	const isPasswordCorrect = await user.comparePassword(password);
	if (!isPasswordCorrect) {
		throw new CustomError.UnauthenticatedError("Invalid Credentials");
	}
	if (!user.isVerified) {
		throw new CustomError.UnauthenticatedError("Please verify your email");
	}

	const tokenUser = createTokenUser(user);

	let refreshToken = "";
	// Check for existing token
	const existingToken = await Token.findOne({ user: user._id });
	if (existingToken) {
		const { isValid } = existingToken;
		if (!isValid) {
			throw new CustomError.UnauthenticatedError("Token is invalid");
		}
		refreshToken = existingToken.refreshToken;
		attachCookiesToResponse({ res, user: tokenUser, refreshToken });
		res.status(StatusCodes.OK).json({ user: tokenUser });
		return;
	}

	refreshToken = crypto.randomBytes(40).toString("hex");
	// create refresh token
	const userAgent = req.headers["user-agent"];
	const ip = req.ip;
	const userToken = { refreshToken, ip, userAgent, user: user._id };

	await Token.create(userToken);

	attachCookiesToResponse({ res, user: tokenUser, refreshToken });
	res.status(StatusCodes.OK).json({ user: tokenUser });
};

// LOGOUT function

const logout = async (req, res) => {
	await Token.findOneAndDelete({ user: req.user.userId });

	res.cookie("accessToken", "logout", {
		httpOnly: true,
		expires: new Date(Date.now()),
	});
	res.cookie("refreshToken", "logout", {
		httpOnly: true,
		expires: new Date(Date.now()),
	});
	res.status(StatusCodes.OK).json({ msg: "User logged out!" });
};

// email verification

const verifyEmail = async (req, res) => {
	const { email, verificationToken } = req.body;
	if (!email || !verificationToken) {
		throw new CustomError.BadRequestError("Email or verificationToken invlid");
	}

	const user = await User.findOne({ email });
	if (!user) {
		throw new CustomError.BadRequestError("No user found while verifying email");
	}
	if (verificationToken !== user.verificationToken) {
		throw new CustomError.BadRequestError("Invalid token while email verification");
	}

	user.isVerified = true;
	user.verified = Date.now();
	user.verificationToken = "";

	await user.save();
	res.status(StatusCodes.OK).json({ message: "Email verification success!" });
};

// Forgort password

const forgotPassword = async (req, res) => {
	const { email } = req.body;
	if (!email) {
		throw new CustomError.BadRequestError("Please provide email");
	}

	const user = await User.findOne({ email });
	if (user) {
		const passwordToken = crypto.randomBytes(70).toString("hex");
		const tenMinutes = 1000 * 60 * 10;
		await sendResetPasswordEmail({ name: user.name, email: user.email, passwordToken, origin });
		user.passwordToken = createHash(passwordToken);
		user.passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);
		await user.save();
	}

	res.status(StatusCodes.OK).json({ message: "email sent" });
};

// Reset password
const resetPassword = async (req, res) => {
	const { password, token, email } = req.body;
	if (!password || !token || !email) {
		throw new CustomError.BadRequestError("Please provide all values");
	}
	const user = await User.findOne({ email });

	if (user) {
		const currentDate = new Date();

		if (user.passwordToken === createHash(token) && user.passwordTokenExpirationDate > currentDate) {
			user.password = password;
			user.passwordToken = null;
			user.passwordTokenExpirationDate = null;
			await user.save();
		}
	}

	res.status(StatusCodes.OK).json({ message: "Reset Password Success!" });
};

module.exports = {
	register,
	login,
	logout,
	verifyEmail,
	resetPassword,
	forgotPassword,
};

// const resetPassword = async (req, res) => {
// 	const { newPassword, confirmedNewPassword, passwordToken, email } = req.body;
// 	if (newPassword !== confirmedNewPassword) {
// 		throw new CustomError.BadRequestError("Passwords does not match");
// 	}
// 	if (!passwordToken || !email || !newPassword) {
// 		throw new CustomError.BadRequestError("Email or password token invalid");
// 	}
// 	const user = await User.findOne({ email });
// 	if (!user) {
// 		throw new CustomError.BadRequestError("No user found");
// 	}
// 	if (passwordToken !== user.passwordToken) {
// 		throw new CustomError.BadRequestError("Password Tokens does not match");
// 	}
// 	if (user.passwordTokenExpirationDate < new Date(Date.now())) {
// 		throw new CustomError.BadRequestError("Too late try again faster");
// 	}
// 	user.password = newPassword;
// 	user.passwordTokenExpirationDate = "";
// 	await user.save();
// 	res.status(StatusCodes.OK).json({ message: "Reset Password Success!" });
// };
