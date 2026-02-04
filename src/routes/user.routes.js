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

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 */
/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get logged-in user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /api/users/me/profile-image:
 *   put:
 *     summary: Update logged-in user's profile image
 *     tags: [Users]
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
 *         description: Profile image updated
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Forbidden
 */
/**
 * @swagger
 * /api/users/{id}/restore:
 *   patch:
 *     summary: Restore a soft-deleted user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User restored
 *       403:
 *         description: Forbidden
 */
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User fetched
 *       404:
 *         description: User not found
 */
/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               name: Updated Name
 *     responses:
 *       200:
 *         description: User updated
 */
/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
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
