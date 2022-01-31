const mongoose = require("mongoose");
// https://mongoosejs.com/docs/models.html#compiling

const TaskSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "must provide name"],
		trim: true,
		maxlength: [20, "name can not be more than 20 characters"],
	},
	// completed: Boolean,
	completed: {
		type: Boolean,
		default: false,
	},
});

module.exports = mongoose.model("Task", TaskSchema);
