const User = require("../models/user.model");

exports.getProfile = async (id) => {
  const user = await User.findById(id).select("-password");

  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  return user;
};

exports.createUser = async (userData) => {
  const user = await User.create(userData);
  return user;
};

exports.getAllUsers = async () => {
  const users = await User.find().sort({ createdAt: -1 });
  return users;
};

exports.getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }
  return user;
};

exports.updateUser = async (id, updateData) => {
  const user = await User.findByIdAndUpdate(id, updateData, {
    new: true,
  });

  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  return user;
};

exports.deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }
  return user;
};
