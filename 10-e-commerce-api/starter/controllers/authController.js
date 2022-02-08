const CustomError = require("../errors/");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const { attachCookiesToResponse, createTokenUser } = require("../utils/");

const register = async (req, res) => {
	const { name, email, password } = req.body;
	if (!name || !email || !password) {
		throw new CustomError.BadRequestError("Please provide name, password and email");
	}

	const emailExist = await User.findOne({ email });
	if (emailExist) {
		throw new CustomError.BadRequestError("Email already exist");
	}

	const isFirstAccount = (await User.countDocuments({})) === 0;
	const role = isFirstAccount ? "admin" : "user";
	const user = await User.create({ name, email, password, role });

	const tokenUser = createTokenUser(user);

	attachCookiesToResponse({ res, user: tokenUser });

	res.status(StatusCodes.CREATED).json(user);
};

const login = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		throw new CustomError.BadRequestError("Please provid valid email and password");
	}

	const user = await User.findOne({ email });
	if (!user) {
		throw new CustomError.BadRequestError("No user found with this email");
	}

	const passwordMatch = await user.comparePassword(password);
	if (!passwordMatch) {
		throw new CustomError.UnauthenticatedError("Incorrect password");
	}

	const tokenUser = createTokenUser(user);
	attachCookiesToResponse({ res, user: tokenUser });

	res.status(200).json({ message: "login", token: tokenUser });
};

const logout = async (req, res) => {
	res.cookie("token", "logout", {
		httpOnly: true,
		expires: new Date(Date.now()),
	});

	res.status(StatusCodes.OK).json({ message: "User logged out" });
};

module.exports = { register, login, logout };
