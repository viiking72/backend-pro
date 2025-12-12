const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const transporter = require("../config/email");

const User = require("../models/user.model");

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    return res.status(201).json({
      message: "User registered successfully",
      userId: user._id
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Access token (short-lived)
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Refresh token (long-lived)
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    return res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken
    });

  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token is required" });
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(400).json({ error: "Invalid token" });
    }

    // Remove refresh token from DB
    user.refreshToken = null;
    await user.save();

    return res.status(200).json({
      message: "Logged out successfully"
    });

  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // 1️⃣ Always respond same message (security)
    const genericMessage = {
      message: "If an account exists for this email, a reset link has been sent."
    };

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // 2️⃣ Find user by email
    const user = await User.findOne({ email });

    // If user not found → return generic response (no hint)
    if (!user) {
      return res.status(200).json(genericMessage);
    }

    // 3️⃣ Generate raw reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 4️⃣ Hash the token to store in DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // 5️⃣ Save hashed token + expiry on user
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    // 6️⃣ Create reset URL for frontend
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // 7️⃣ Send email (or log it for dev)
    const mailOptions = {
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <p>You requested a password reset.</p>
        <p>Click the link below to reset your password (valid for 10 minutes):</p>
        <a href="${resetUrl}">${resetUrl}</a>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailErr) {
      console.error("Error sending reset email:", emailErr.message);
      // dev fallback
      console.log("👉 DEV RESET LINK:", resetUrl);
    }

    // Always generic response
    return res.status(200).json(genericMessage);

  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: "Token and password are required" });
    }

    // 1️⃣ Hash the incoming raw token
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // 2️⃣ Find user with matching hashed token AND not expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() } // token not expired
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    // 3️⃣ Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Update user password + clear token fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({
      message: "Password reset successful. You can now log in."
    });

  } catch (err) {
    next(err);
  }
};


