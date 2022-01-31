// express use ony by default

// but we can create and use our own custom error handler this way
// plus importing in app

const { CustomAPIError } = require("../errors/custom-error");

const errorHandlerMiddleware = (err, req, res, next) => {
	if (err instanceof CustomAPIError) {
		return res.status(err.statusCode).json({ message: err.message });
	}

	// return res.status(err.status).json({ message: err.message });
	return res.status(500).json({ message: "Something went wrong error" });
};

module.exports = errorHandlerMiddleware;
