const { StatusCodes } = require("http-status-codes");
const Product = require("../models/Product");
const CustomError = require("../errors");
const path = require("path");

const createProduct = async (req, res) => {
	req.body.user = req.user.userId;
	const product = await Product.create(req.body);

	res.status(StatusCodes.CREATED).json({ message: "Product created successfully", product });
};

const getAllProducts = async (req, res) => {
	const products = await Product.find({});
	res.status(StatusCodes.OK).json({ products, count: products.length });
};

const getSingleProduct = async (req, res) => {
	const productId = req.params.id;
	const product = await Product.findOne({ _id: productId }).populate("reviews");
	if (!product) {
		throw new CustomError.NotFoundError(`No product with this id : ${productId}`);
	}

	res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
	const productId = req.params.id;

	const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
		new: true,
		runValidators: true,
	});
	if (!product) {
		throw new CustomError.NotFoundError(`No product with this id : ${productId}`);
	}

	res.status(StatusCodes.OK).json({ message: "updated" });
};

const deleteProduct = async (req, res) => {
	const productId = req.params.id;
	const product = await Product.findOne({ _id: productId });
	if (!product) {
		throw new CustomError.NotFoundError(`No product with this id : ${productId}`);
	}

	await product.remove();

	res.status(StatusCodes.OK).json({ message: "Product deleted" });
};

const uploadImage = async (req, res) => {
	if (!req.files) {
		throw new CustomError.BadRequestError("No file uplaoded");
	}

	const productImage = req.files.image;
	if (!productImage.mimetype.startsWith("image")) {
		throw new CustomError.BadRequestError("Please uploaded image");
	}

	const maxSize = 1024 * 1024;
	if (productImage.size > maxSize) {
		throw new CustomError.BadRequestError("Please provide smaller size image : 1MB Max");
	}

	const imgPath = path.join(__dirname, "../public/uploads/" + productImage.name);
	await productImage.mv(imgPath);
	res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
};

module.exports = {
	createProduct,
	getAllProducts,
	getSingleProduct,
	updateProduct,
	deleteProduct,
	uploadImage,
};
