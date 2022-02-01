const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
	const user = await User.create({ ...req.body });
	// without mongoose middleware
	// const token = jwt.sign({ userId: user._id, name: user.name }, "jwtSecret", { expiresIn: "30d" });
	// res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
	const token = user.createJWT();
	res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		throw new BadRequestError("Please provide a valid email and password");
	}

	const user = await User.findOne({ email });
	if (!user) {
		throw new UnauthenticatedError("Invalid User");
	}

	const isPasswordCorrect = await user.comparePassword(password);
	if (!isPasswordCorrect) {
		throw new UnauthenticatedError("Invalid Password");
	}

	const token = user.createJWT();
	res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = { register, login };
