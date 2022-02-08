const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
	{
		rating: {
			type: Number,
			min: 1,
			max: 5,
			required: [true, "Please provid rating"],
		},
		title: {
			type: String,
			trim: true,
			required: [true, "Please provide review title"],
		},
		comment: {
			type: String,
			required: [true, "Please provide review text"],
		},
		user: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			required: true,
		},
		product: {
			type: mongoose.Types.ObjectId,
			ref: "Product",
			required: true,
		},
	},
	{ timestamps: true }
);

// only one review per user
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Aggregation pipeline
ReviewSchema.statics.calculateAverageRating = async function (productId) {
	const result = await this.aggregate([
		{
			$match: { product: productId },
		},
		{
			$group: {
				_id: null,
				averageRating: { $avg: "$rating" },
				numOfReviews: { $sum: 1 },
			},
		},
	]);

	try {
		await this.model("Product").findOneAndUpdate(
			{ _id: productId },
			{
				averageRating: Math.ceil(result[0]?.averageRating || 0),
				numOfReviews: result[0]?.numOfReviews || 0,
			}
		);
	} catch (error) {
		console.log(error);
	}
};

// Calc when these methods are called
ReviewSchema.post("save", async function () {
	await this.constructor.calculateAverageRating(this.product);
});

ReviewSchema.post("remove", async function () {
	await this.constructor.calculateAverageRating(this.product);
});

module.exports = new mongoose.model("Review", ReviewSchema);
