/**
 * @swagger
 * /api/token/refresh:
 *   post:
 *     summary: Refresh access token using refresh token
 *     tags: [Token]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: New access token issued
 *       401:
 *         description: Invalid or expired refresh token
 */


const express = require("express");
const router = express.Router();
const tokenController = require("../controllers/token.controller");

router.post("/refresh", tokenController.refreshAccessToken);

module.exports = router;
