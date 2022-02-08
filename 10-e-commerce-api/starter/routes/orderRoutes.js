const router = require("express").Router();
const { authorizePermissions, authenticateUser } = require("../middleware/authentication");
const {
	createOrder,
	getAllOrders,
	getSingleOrder,
	getCurrentUserOrder,
	updateOrder,
	deleteOrder,
} = require("../controllers/orderController");

router
	.route("/")
	.get([authenticateUser, authorizePermissions("admin")], getAllOrders)
	.post(authenticateUser, createOrder);

router.route("/showAllMyOrder").get(authenticateUser, getCurrentUserOrder);

router
	.route("/:id")
	.get(authenticateUser, getSingleOrder)
	.patch(authenticateUser, updateOrder)
	.delete(deleteOrder);

module.exports = router;
