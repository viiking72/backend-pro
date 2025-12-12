const cloudinary = require("../config/cloudinary");
const fs = require("fs");

exports.uploadToCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload file to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      folder: "mern_uploads",   // optional folder
    });

    // Remove local file after upload
    fs.unlinkSync(localFilePath);

    return uploadResult.secure_url;

  } catch (err) {
    console.error("Cloudinary upload error:", err);
    fs.unlinkSync(localFilePath); // remove file even if upload fails
    return null;
  }
};
