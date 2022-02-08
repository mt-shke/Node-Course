const router = require("express").Router();
const {
	createReview,
	getAllReviews,
	getSingleReview,
	updateReview,
	deleteReview,
} = require("../controllers/reviewController");
const { authorizePermissions, authenticateUser } = require("../middleware/authentication");

router
	.route("/")
	.get(getAllReviews)
	.post([authenticateUser, authorizePermissions("user", "admin")], createReview);

router
	.route("/:id")
	.get(getSingleReview)
	.patch([authenticateUser, authorizePermissions("user", "admin")], updateReview)
	.delete([authenticateUser, authorizePermissions("user", "admin")], deleteReview);

module.exports = router;
