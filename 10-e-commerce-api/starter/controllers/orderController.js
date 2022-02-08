const Order = require("../models/Order");
const Product = require("../models/Product");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { checkPermissions } = require("../utils");

const createOrder = async (req, res) => {
	const { items: cartItems, tax, shippingFee } = req.body;
	if (!cartItems || cartItems.length < 1) {
		throw new CustomError.BadRequestError("No cart items provided");
	}

	if (!tax || !shippingFee) {
		throw new CustomError.BadRequestError("Please provid tax and shipping fee");
	}

	let orderItems = [];
	let subtotal = 0;

	for (const item of cartItems) {
		const dbProduct = await Product.findOne({ _id: item.product });

		if (!dbProduct) {
			throw new CustomError.NotFoundError(`No product with id: ${item.product} `);
		}
		const { name, price, image, _id } = dbProduct;
		const singleOrderItem = {
			amount: item.amount,
			name,
			price,
			image,
			product: _id,
		};

		// mapping cart items
		orderItems = [...orderItems, singleOrderItem];
		// Calculate total
		subtotal += item.amount * price;
	}

	res.status(StatusCodes.CREATED).json({ message: "created" });
};

const getAllOrders = async (req, res) => {
	res.status(StatusCodes.OK).json({ message: "get all orders" });
};
const getSingleOrder = async (req, res) => {
	res.status(StatusCodes.OK).json({ message: "get single order" });
};

const getCurrentUserOrder = async (req, res) => {
	res.status(StatusCodes.OK).json({ message: "get currend user order" });
};
const updateOrder = async (req, res) => {
	res.status(StatusCodes.OK).json({ message: "update orders" });
};
const deleteOrder = async (req, res) => {
	res.status(StatusCodes.OK).json({ message: "delete orders" });
};

module.exports = { createOrder, getAllOrders, getSingleOrder, getCurrentUserOrder, updateOrder, deleteOrder };
