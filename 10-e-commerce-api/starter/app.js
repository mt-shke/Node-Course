// Import
require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

// Packages
const morgan = require("morgan");

// DB
const connectDB = require("./db/connect");

// RoutesImport
const authRouter = require("./routes/authRoutes");

// MiddlewareImport
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/not-found");
// const authMiddleware = require('./middleware/authentication')

// app.use

app.use(morgan("tiny"));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
	res.send("welcome");
});
app.use("/api/v1/auth", authRouter);

// Middleware
app.use(notFoundMiddleware);
// call errorHandlerMiddleware in the end to handle errors
app.use(errorHandlerMiddleware);

// SERVER
const port = process.env.PORT || 5000;
const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		app.listen(port, () => console.log("Server is listening"));
	} catch (error) {
		console.log(error);
	}
};

start();
