const mongoose = require("mongoose");

const SingleCartItemSchema = mongoose.Schema({
	name: { type: String, required: true },
	image: { type: String, required: true },
	price: { type: Number, required: true },
	amount: { type: Number, required: true },
	product: {
		type: mongoose.Schema.ObjectId,
		ref: "Product",
		required: true,
	},
});

const OrderSchema = new mongoose.Schema({
	tax: {
		type: Number,
		required: [true, "Please provide order tax"],
	},
	shippingFee: {
		type: Number,
		required: [true, "Please provide order shipping fee"],
	},
	subtotal: {
		type: Number,
		required: [true, "Please provide order subtotal"],
	},
	total: {
		type: Number,
		required: [true, "Please provide order total"],
	},
	orderItems: [SingleCartItemSchema],
	status: {
		type: String,
		enum: ["pending", "failed", "delivered", "paid", "canceled"],
		default: "pending",
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
		required: true,
	},
	clientSecret: {
		type: String,
		required: true,
	},
	paymentIntendId: { type: String },
});

module.exports = new mongoose.model("Order", OrderSchema);
