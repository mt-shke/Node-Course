const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			required: [true, "Please provid valid name"],
			maxlength: [100, "Name cannot exced 100 characters"],
		},
		price: {
			type: Number,
			required: [true, "Please provide product price"],
			default: 0,
		},
		description: {
			type: String,
			required: [true, "Please provid valid description"],
			maxlength: [1000, "Description cannot exced 1000 characters"],
		},
		image: {
			type: String,
			default: "/uploads/example.jpeg",
		},
		category: {
			type: String,
			required: [true, "Please provide product category"],
			enum: ["office", "kitchen", "bedroom"],
		},
		company: {
			type: String,
			required: [true, "Please provide product company"],
			enum: {
				values: ["ikea", "liddy", "marcos"],
				message: "{VALUE} is not supported",
			},
		},
		colors: {
			type: [String],
			required: true,
		},
		featured: {
			type: Boolean,
			default: false,
		},
		freeShipping: {
			type: Boolean,
			default: false,
		},
		inventory: {
			type: Number,
			required: [true, "Please provide product inventory"],
			default: 15,
		},
		averageRating: {
			type: Number,
			default: 0,
		},
		numOfReviews: {
			type: Number,
			default: 0,
		},
		user: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ProductSchema.virtual("reviews", {
	ref: "Review",
	localField: "_id",
	foreignField: "product",
	justOne: false,
});

ProductSchema.pre("remove", async function (next) {
	await this.model("Review").deleteMany({ product: this._id });
});

module.exports = new mongoose.model("Product", ProductSchema);
