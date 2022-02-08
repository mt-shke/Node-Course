const router = require("express").Router();
const {
	getAllUsers,
	getSingleUser,
	showCurrentUser,
	updateUser,
	updateUserPassword,
} = require("../controllers/userController");
const { authenticateUser, authorizePermissions } = require("../middleware/authentication");

router.route("/").get(authenticateUser, authorizePermissions("admin", "owner"), getAllUsers);

router.route("/showme").get(authenticateUser, showCurrentUser);
router.route("/updateuser").patch(authenticateUser, updateUser);
router.route("/updatepassword").patch(authenticateUser, updateUserPassword);

router.route("/:id").get(authenticateUser, getSingleUser);

module.exports = router;
