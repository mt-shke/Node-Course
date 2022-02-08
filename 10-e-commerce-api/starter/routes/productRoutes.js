const router = require("express").Router();
const {
	createProduct,
	getAllProducts,
	getSingleProduct,
	updateProduct,
	deleteProduct,
	uploadImage,
} = require("../controllers/productController");
const { getSingleProductReviews } = require("../controllers/reviewController");

const { authenticateUser } = require("../middleware/authentication");

router.route("/").get(getAllProducts).post(authenticateUser, createProduct);

router.route("/uploadimage").post(authenticateUser, uploadImage);

router
	.route("/:id")
	.get(getSingleProduct)
	.patch(authenticateUser, updateProduct)
	.delete(authenticateUser, deleteProduct);

router.route("/:id/reviews").get(getSingleProductReviews);

module.exports = router;
