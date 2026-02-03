const { uploadToCloudinary } = require("../utils/cloudinaryUpload");
const AppError = require("../utils/AppError");

exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError("No file uploaded", 400));
    }

    const localFilePath = req.file.path;

    const imageUrl = await uploadToCloudinary(localFilePath);

    if (!imageUrl) {
      return next(new AppError("Cloud upload failed", 502));
    }

    return res.status(200).json({
      message: "File uploaded successfully",
      url: imageUrl,
    });

  } catch (err) {
    next(err);
  }
};
