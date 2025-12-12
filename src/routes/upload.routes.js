const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload");
const { uploadToCloudinary } = require("../utils/cloudinaryUpload");

router.post("/single", upload.single("image"), async (req, res) => {
  try {
    const localFilePath = req.file.path;

    const imageUrl = await uploadToCloudinary(localFilePath);

    if (!imageUrl) {
      return res.status(500).json({ error: "Cloud upload failed" });
    }

    return res.status(200).json({
      message: "File uploaded successfully",
      url: imageUrl,
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
