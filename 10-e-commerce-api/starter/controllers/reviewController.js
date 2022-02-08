const Review = require("../models/Review");
const Product = require("../models/Product");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { checkPermissions } = require("../utils");

const createReview = async (req, res) => {
	const productId = req.body.product;

	const isValidProduct = await Product.findOne({ _id: productId });
	if (!isValidProduct) {
		throw new CustomError.NotFoundError(`No product with id: ${productId}`);
	}

	const alreadySubmitted = await Review.findOne({
		product: productId,
		user: req.user.userId,
	});
	if (alreadySubmitted) {
		throw new CustomError.BadRequestError("Already submitted review for this product");
	}

	req.body.user = req.user.userId;
	const review = await Review.create(req.body);

	res.status(StatusCodes.CREATED).json({ message: "created", review });
};

const getAllReviews = async (req, res) => {
	const reviews = await Review.find({});
	res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const getSingleReview = async (req, res) => {
	const reviewId = req.params.id;

	const review = await Review.findOne({ _id: reviewId });
	if (!review) {
		throw new CustomError.BadRequestError(`Cannot find review with id: ${reviewId}`);
	}

	res.status(StatusCodes.OK).json(review);
};

const updateReview = async (req, res) => {
	const reviewId = req.params.id;
	const review = await Review.findOne({ _id: reviewId });
	if (!review) {
		throw new CustomError.NotFoundError(`Cannot find review with id: ${reviewId}`);
	}
	checkPermissions(req.user, review.user);

	const { rating, title, comment } = req.body;

	review.rating = rating;
	review.title = title;
	review.comment = comment;

	await review.save();
	res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
	const reviewId = req.params.id;

	const review = await Review.findOne({ _id: reviewId });
	if (!review) {
		throw new CustomError.NotFoundError(`Cannot find review with id: ${reviewId}`);
	}

	checkPermissions(req.user, review.user);
	// await Review.findOneAndRemove({ _id: reviewId });
	await review.remove();
	res.status(StatusCodes.OK).json({ message: "delete review" });
};

const getSingleProductReviews = async (req, res) => {
	const productId = req.params.id;
	const reviews = await Review.find({ product: productId });
	res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

module.exports = {
	createReview,
	getAllReviews,
	getSingleReview,
	updateReview,
	deleteReview,
	getSingleProductReviews,
};
