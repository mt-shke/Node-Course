const mongoose = require("mongoose");
const connectionString =
	"mongodb+srv://node:nodepass@cluster0.chfbj.mongodb.net/03-TASK-MANAGER?retryWrites=true&w=majority";

const connectDB = (url) => {
	return mongoose.connect(url);
};

module.exports = connectDB;
