const CustomError = require("../errors");
const { isTokenValid } = require("../utils");

const authenticateUser = async (req, res, next) => {
	const token = req.signedCookies.token;
	if (!token) {
		throw new CustomError.UnauthenticatedError("Authentication Invalid");
	}

	try {
		const payload = isTokenValid(token);
		req.user = { userId: payload.userId, name: payload.name, email: payload.email, role: payload.role };
		next();
	} catch (error) {
		throw new CustomError.UnauthenticatedError("Authentication Invalid Token");
	}
};

const authorizePermissions = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			throw new CustomError.UnauthorizedError("Unauthorized to access this route");
		}
		next();
	};
	// if (req.user.role !== "admin") {
	// 	throw new CustomError.UnauthorizedError("Unauthorized to access this route");
	// }
};

module.exports = { authenticateUser, authorizePermissions };
