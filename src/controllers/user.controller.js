const userService = require('../services/user.service');
const { uploadToCloudinary } = require("../utils/cloudinaryUpload");
const User = require("../models/user.model");
const { invalidateUsersCache } = require("../cache/invalidate");

exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const user = await userService.getProfile(userId);
    
    return res.status(200).json(user);

  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const data = await userService.createUser(req.body);
    invalidateUsersCache();
    return res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Sorting
    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;

    // Filtering
    const role = req.query.role;

    // ✅ Controller decides HTTP-driven flags
    const includeDeleted = req.query.includeDeleted === "true";

    const data = await userService.getAllUsers({
      page,
      limit,
      sortBy,
      order,
      role,
      includeDeleted, // ✅ pass explicitly
    });

    return res.status(200).json({
      success: true,
      data: data.users,
      meta: {
        page,
        limit,
        totalUsers: data.totalUsers,
        totalPages: data.totalPages,
      },
    });

  } catch (err) {
    next(err);
  }
};





exports.getUserById = async (req, res, next) => {
  try {
    const data = await userService.getUserById(req.params.id);
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const data = await userService.updateUser(req.params.id, req.body);
    invalidateUsersCache();
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const data = await userService.deleteUser(req.params.id);
    invalidateUsersCache();
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

exports.restoreUser = async (req, res, next) => {
  try {
    const user = await userService.restoreUser(req.params.id);
    invalidateUsersCache();

    return res.status(200).json({
      message: "User restored successfully",
      user
    });

  } catch (err) {
    next(err);
  }
};

exports.updateProfileImage = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imageUrl = await uploadToCloudinary(req.file.path);

    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage: imageUrl },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      message: "Profile image updated successfully",
      user,
    });

  } catch (err) {
    next(err);
  }
};