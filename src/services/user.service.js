const User = require("../models/user.model");
const AppError = require("../utils/AppError");


exports.getProfile = async (id) => {
  const user = await User.findById(id).select("-password -refreshToken -resetPasswordToken");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

exports.createUser = async (userData) => {
  const user = await User.create(userData);
  return user;
};

exports.getAllUsers = async ({
  page,
  limit,
  sortBy,
  order,
  role,
  includeDeleted,
}) => {
  const skip = (page - 1) * limit;

  // ✅ Service-level filter (pure business logic)
  const filter = {};

  if (!includeDeleted) {
    filter.isDeleted = false;
  }

  if (role) {
    filter.role = role;
  }

  const users = await User.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: order });

  const totalUsers = await User.countDocuments(filter);

  return {
    users,
    totalUsers,
    totalPages: Math.ceil(totalUsers / limit),
  };
};



exports.getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};

exports.updateUser = async (id, updateData) => {
  const user = await User.findByIdAndUpdate(id, updateData, {
    new: true,
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

exports.deleteUser = async (id) => {
  const user = await User.findById(id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.isDeleted = true;
  user.deletedAt = new Date();
  await user.save();

  return user;
};

exports.restoreUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.isDeleted = false;
  user.deletedAt = null;
  await user.save();

  return user;
};



