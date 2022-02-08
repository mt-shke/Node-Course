const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { attachCookiesToResponse, createTokenUser, checkPermissions } = require("../utils");

const getAllUsers = async (req, res) => {
	const users = await User.find({ role: "user" }).select("-password");
	res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
	const user = await User.findOne({ _id: req.params.id, role: "user" }).select("-password");
	if (!user) {
		throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`);
	}
	console.log(req.user);
	console.log(user._id);
	checkPermissions(req.user, user._id);
	res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
	res.status(StatusCodes.OK).json(req.user);
};

const updateUserPassword = async (req, res) => {
	const { oldPassword, newPassword } = req.body;
	if (!newPassword || !oldPassword) {
		throw new CustomError.BadRequestError("Please provide passwords");
	}

	const user = await User.findOne({ _id: req.user.userId, role: "user" });
	if (!user) {
		throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`);
	}

	const isPasswordCorrect = await user.comparePassword(oldPassword);
	if (!isPasswordCorrect) {
		throw new CustomError.UnauthenticatedError("Invalid Credentials");
	}

	user.password = newPassword;
	await user.save();

	res.status(StatusCodes.OK).json({ message: "Update success" });
};

// updateUser with findOneAndUpdate
// const updateUser = async (req, res) => {
// 	const { name, email } = req.body;
// 	if (!name || !email) {
// 		throw new CustomError.BadRequestError("Please provide valid email and password");
// 	}
// 	const user = await User.findOneAndUpdate(
// 		{ _id: req.user.userId },
// 		{ email, name },
// 		{
// 			new: true,
// 			runValidators: true,
// 		}
// 	);
// 	const tokenUser = createTokenUser(user);
// 	attachCookiesToResponse({ res, user: tokenUser });

// 	res.status(StatusCodes.ACCEPTED).json({ message: "User updated successfully", user: tokenUser });
// };

// updateUser with user.save()
const updateUser = async (req, res) => {
	const { name, email } = req.body;
	if (!name || !email) {
		throw new CustomError.BadRequestError("Please provide valid email and password");
	}

	const user = await User.findOne({ _id: req.user.userId });
	user.email = email;
	user.name = name;

	const updatedUser = await user.save();
	// check for user.save() hook

	const tokenUser = createTokenUser(updatedUser);
	attachCookiesToResponse({ res, user: tokenUser });
	res.status(StatusCodes.OK).json({ message: "Update success" });
};

module.exports = { getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword };
