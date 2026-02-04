/**
 * @swagger
 * /api/upload/single:
 *   post:
 *     summary: Upload a single image
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       400:
 *         description: Invalid file
 *       401:
 *         description: Unauthorized
 */


const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload");
const { uploadImage } = require("../controllers/upload.controller");

router.post( "/single", upload.single("image"), uploadImage);

module.exports = router;
