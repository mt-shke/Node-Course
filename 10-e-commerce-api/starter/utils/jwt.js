const jwt = require("jsonwebtoken");

const createJWT = (tokenUser) => {
	const token = jwt.sign(tokenUser, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_LIFETIME,
	});
	return token;
};

const attachCookiesToResponse = ({ res, user }) => {
	const token = createJWT(user);
	const oneDay = 1000 * 60 * 60 * 24;

	res.cookie("token", token, {
		httpOnly: true,
		expires: new Date(Date.now() + oneDay),
		secure: process.env.NODE_ENV === "production",
		signed: true,
	});
};

const isTokenValid = (tokenUser) => jwt.verify(tokenUser, process.env.JWT_SECRET);

module.exports = { createJWT, isTokenValid, attachCookiesToResponse };
