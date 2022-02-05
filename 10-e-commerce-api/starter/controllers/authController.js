const CustomError = require("../errors/");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");

const register = async (req, res) => {
	const { name, password, email } = req.body;

	if (!name || !email || !password) {
		throw new CustomError.BadRequestError("Please provide name, password and email");
	}

	const emailExist = await User.findOne({ email });

	if (emailExist) {
		throw new CustomError.BadRequestError("Email already exist");
	}

	const user = await User.create(req.body);
	res.status(StatusCodes.CREATED).json(user);
};

const login = async (req, res) => {
	res.status(200).json({ message: "login" });
};

const logout = async (req, res) => {
	res.status(200).json({ message: "logout" });
};

module.exports = { register, login, logout };
