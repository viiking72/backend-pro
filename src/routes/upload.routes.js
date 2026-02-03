const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload");
const { uploadImage } = require("../controllers/upload.controller");

router.post( "/single", upload.single("image"), uploadImage);

module.exports = router;
