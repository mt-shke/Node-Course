const router = require("express").Router();
const { getAllJobs, getJob, deleteJob, createJob, updateJob } = require("../controllers/jobs");

router.route("/").post(createJob).get(getAllJobs);
router.route("/:id").get(getJob).patch(updateJob).delete(deleteJob);

module.exports = router;
