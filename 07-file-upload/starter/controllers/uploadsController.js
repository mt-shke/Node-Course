const path = require("path");
const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const cloudinay = require("cloudinary").v2;
const fs = require("fs");

// LOCAL
const uploadProductImageLocal = async (req, res) => {
	// check if file exist, format, size
	if (!req.files) {
		throw new CustomError.BadRequestError("No File Uploaded");
	}
	const productImage = req.files.image;

	if (!productImage.mimetype.startsWith("image")) {
		throw new CustomError.BadRequestError("Please Uploaded Image");
	}

	const maxSize = 1024 * 1024;

	if (productImage.size > maxSize) {
		throw new CustomError.BadRequestError("Please upload image smaller 1KB");
	}

	const imagePath = path.join(__dirname, "../public/uploads/" + `${productImage.name}`);
	await productImage.mv(imagePath);
	return res.status(StatusCodes.OK).json({ image: { src: `/uploads/${productImage.name}` } });
};

// DIRECT TO CLOUDINARY
const uploadProductImage = async (req, res) => {
	const result = await cloudinay.uploader.upload(req.files.image.tempFilePath, {
		use_filename: true,
		folder: "file-upload",
	});

	// Delete temporary file
	fs.unlinkSync(req.files.image.tempFilePath);

	console.log(result);
	return res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
};

module.exports = { uploadProductImage };
