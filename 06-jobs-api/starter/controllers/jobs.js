const getAllJobs = async (req, res) => {
	res.send("GetAllJobs user");
};

const getJob = async (req, res) => {
	res.send("Get job");
};
const createJob = async (req, res) => {
	res.send("create Job ");
};
const updateJob = async (req, res) => {
	res.send("update Job ");
};
const deleteJob = async (req, res) => {
	res.send("delete Job ");
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
