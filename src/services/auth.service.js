const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const mongoose = require("mongoose");
const transporter = require("../config/email");

const User = require("../models/user.model");

exports.registerUser = async ({ name, email, password, role }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword, role });
  return user;
};

exports.loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null;

  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
};

exports.logoutUser = async (refreshToken) => {
  const user = await User.findOne({ refreshToken });
  if (!user) return null;

  user.refreshToken = null;
  await user.save();
  return true;
};

exports.forgotPassword = async (email) => {
  const genericMessage = {
    message: "If an account exists for this email, a reset link has been sent."
  };

  const existing = await User.findOne({
    email,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (existing) return genericMessage;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const user = await User.findOne({ email }).session(session);
    if (!user) {
      await session.abortTransaction();
      return genericMessage;
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

    await user.save({ session });
    await session.commitTransaction();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    try {
      await transporter.sendMail({
        from: `"Support" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Password Reset Request",
        html: `<p>You requested a password reset.</p>
               <p>Click the link below to reset your password (valid for 10 minutes):</p>
               <a href="${resetUrl}">${resetUrl}</a>`
      });
    } catch (emailErr) {
      console.error("Email failed:", emailErr.message);
      console.log("👉 DEV RESET LINK:", resetUrl);
    }

    return genericMessage;
  } finally {
    session.endSession();
  }
};

exports.resetUserPassword = async ({ token, password }) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) return null;

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();
  return true;
};
