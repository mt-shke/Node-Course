require("dotenv").config();
// express async error package
require("express-async-errors");

const express = require("express");
const app = express();

const connectDB = require("./db/connect");
const productsRouter = require("./routes/products");

// middeware
const notFound = require("./middleware/not-found");
const errorMiddeware = require("./middleware/error-handler");

app.use(express.json());

// Route
app.get("/", (req, res) => {
	res.send('<h1>Store API</h1><a href="/api/v1/products">Products route</a>');
});

app.use("/api/v1/products", productsRouter);

app.use(notFound);
app.use(errorMiddeware);

const port = process.env.PORT || 3000;

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		app.listen(port, console.log("Server listening..."));
	} catch (error) {
		console.log(error);
	}
};

start();
