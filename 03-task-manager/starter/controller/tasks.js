const Task = require("../models/Task");
const asyncWrapper = require("../middleware/asyncWrapper");
const { createCustomError } = require("../errors/custom-error");

const getAllTasks = asyncWrapper(async (req, res) => {
	const tasks = await Task.find({});
	// res.status(200).json({ tasks, amount: tasks.length });
	res.status(200).json({ success: true, data: { tasks, nbHits: tasks.length } });
});

const createTask = asyncWrapper(async (req, res) => {
	const task = await Task.create(req.body);
	res.status(201).json({ task });
});

const getTask = asyncWrapper(async (req, res, next) => {
	const { id: taskID } = req.params;
	const task = await Task.findOne({ _id: taskID });
	if (!task) {
		// try catch method
		// return res.status(404).json({ message: `No task with this id: ${taskID}` });

		// asyncWrapper error handler method
		// const error = new Error("Not Found");
		// error.status = 404;
		// return next(error);

		// custom error method
		return next(createCustomError(`No task with this id: ${taskID}`, 404));
	}
	res.status(200).json({ task });
});

const deleteTask = asyncWrapper(async (req, res) => {
	const { id: taskID } = req.params;
	const task = await Task.findOneAndDelete({ _id: taskID });
	if (!task) {
		return next(createCustomError(`No task with this id: ${taskID}`, 404));
	}
	res.status(200).json({ task });
	// res.status(200).send();
	// res.status(200).json({ task: null, status: "success" });
});

const updateTask = asyncWrapper(async (req, res) => {
	const { id: taskID } = req.params;
	const task = await Task.findOneAndUpdate({ _id: taskID }, req.body, { new: true, runValidators: true });
	if (!task) {
		return next(createCustomError(`No task with this id: ${taskID}`, 404));
	}
	res.status(200).json({ task });
});

// Post method = only replace value
// Put method overwrite = delete and replace whole object
// const editTask = async (req, res) => {
// 	try {
// 		const { id: taskID } = req.params;
// 		const task = await Task.findOneAndUpdate({ _id: taskID }, req.body, {
// 			new: true,
// 			runValidators: true,
// 			overwrite: true,
// 		});
// 		if (!task) {
// 			return res.status(404).json({ message: `No task with this id: ${taskID}` });
// 		}
// 		res.status(200).json({ task });
// 	} catch (error) {
// 		res.status(500).json({ message: error });
// 	}
// };

module.exports = { getAllTasks, createTask, getTask, updateTask, deleteTask };
