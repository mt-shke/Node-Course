const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please provide a name"],
		minlength: 3,
		maxlength: 50,
	},
	email: {
		type: String,
		unique: true,
		required: [true, "Please provide a email"],
		validate: {
			validator: validator.isEmail,
			message: "Please provid valid email",
		},
	},
	password: {
		type: String,
		required: [true, "Please provide a password"],
		minlength: 6,
	},
	role: {
		type: String,
		enum: ["admin", "user"],
		default: "user",
	},
});

UserSchema.pre("save", async function () {
	console.log(!this.isModified("password"));
	if (!this.isModified("password")) return;
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
	const isMatch = await bcrypt.compare(enteredPassword, this.password);
	return isMatch;
};

// UserSchema.methods.createToken = async function () {
// 	return await jwt.sign({ email: this.email, name: this.name }, process.env.JWT_SECRET, {
// 		expiresIn: process.env.JWT_LIFETIME,
// 	});
// };

module.exports = mongoose.model("User", UserSchema);
