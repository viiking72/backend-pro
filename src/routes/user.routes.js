/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized
 */
const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const upload = require("../middlewares/upload");
const { validateCreateUser } = require("../validators/user.validator");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { requireAdmin } = require("../middlewares/role.middleware");
const { updateProfileImage } = require("../controllers/user.controller");
const { cacheMiddleware } = require("../middlewares/cache.middleware");
const { buildUsersCacheKey } = require("../cache/keys/users.cacheKey");

// -------- SPECIFIC ROUTES FIRST --------

// Create user
router.post("/", validateCreateUser, userController.createUser);

// Get logged-in user's profile
router.get("/me", authMiddleware, userController.getProfile);

// Update logged-in user's profile image
router.put("/me/profile-image", authMiddleware, upload.single("image"), updateProfileImage);

// Get all users
router.get('/',authMiddleware, requireAdmin,
cacheMiddleware(buildUsersCacheKey, 60_000), userController.getAllUsers);

// -------- GENERIC ROUTES LAST --------

// Restore a soft-deleted user (ADMIN ONLY)
router.patch("/:id/restore", authMiddleware, requireAdmin, userController.restoreUser);

router.get('/:id', authMiddleware, userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
