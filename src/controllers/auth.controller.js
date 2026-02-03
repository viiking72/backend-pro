const authService = require("../services/auth.service");

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await authService.registerUser({ name, email, password, role });
    return res.status(201).json({ message: "User registered successfully", userId: user._id });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await authService.loginUser({ email, password });

    if (!data) return res.status(400).json({ error: "Invalid email or password" });

    return res.status(200).json({
      message: "Login successful",
      accessToken: data.accessToken,
      refreshToken: data.refreshToken
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: "Refresh token is required" });

    const result = await authService.logoutUser(refreshToken);
    if (!result) return res.status(400).json({ error: "Invalid token" });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const response = await authService.forgotPassword(email);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ error: "Token and password are required" });

    const result = await authService.resetUserPassword({ token, password });
    if (!result) return res.status(400).json({ error: "Invalid or expired reset token" });

    return res.status(200).json({ message: "Password reset successful. You can now log in." });
  } catch (err) {
    next(err);
  }
};













// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const crypto = require("crypto");
// const transporter = require("../config/email");

// const User = require("../models/user.model");

// exports.register = async (req, res, next) => {
//   try {
//     const { name, email, password, role } = req.body;

//     // hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role
//     });

//     return res.status(201).json({
//       message: "User registered successfully",
//       userId: user._id
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// exports.login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ error: "Invalid email or password" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ error: "Invalid email or password" });
//     }

//     // Access token (short-lived)
//     const accessToken = jwt.sign(
//       { userId: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "15m" }
//     );

//     // Refresh token (long-lived)
//     const refreshToken = jwt.sign(
//       { userId: user._id },
//       process.env.JWT_REFRESH_SECRET,
//       { expiresIn: "7d" }
//     );

//     // Save refresh token in DB
//     user.refreshToken = refreshToken;
//     await user.save();

//     return res.status(200).json({
//       message: "Login successful",
//       accessToken,
//       refreshToken
//     });

//   } catch (err) {
//     next(err);
//   }
// };

// exports.logout = async (req, res, next) => {
//   try {
//     const { refreshToken } = req.body;

//     if (!refreshToken) {
//       return res.status(400).json({ error: "Refresh token is required" });
//     }

//     const user = await User.findOne({ refreshToken });
//     if (!user) {
//       return res.status(400).json({ error: "Invalid token" });
//     }

//     // Remove refresh token from DB
//     user.refreshToken = null;
//     await user.save();

//     return res.status(200).json({
//       message: "Logged out successfully"
//     });

//   } catch (err) {
//     next(err);
//   }
// };

// exports.forgotPassword = async (req, res, next) => {
//   const { email } = req.body;

//   const genericMessage = {
//     message: "If an account exists for this email, a reset link has been sent."
//   };

//   try {
//     // 1️⃣ Validate input early
//     if (!email) {
//       return res.status(400).json({ error: "Email is required" });
//     }

//     // 2️⃣ Idempotency check (safe optimization)
//     const existing = await User.findOne({
//       email,
//       resetPasswordExpires: { $gt: Date.now() }
//     });

//     if (existing) {
//       return res.status(200).json(genericMessage);
//     }

//     const session = await mongoose.startSession();

//     try {
//       session.startTransaction();

//       const user = await User.findOne({ email }).session(session);

//       if (!user) {
//         await session.abortTransaction();
//         return res.status(200).json(genericMessage);
//       }

//       const resetToken = crypto.randomBytes(32).toString("hex");
//       const hashedToken = crypto
//         .createHash("sha256")
//         .update(resetToken)
//         .digest("hex");

//       user.resetPasswordToken = hashedToken;
//       user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

//       await user.save({ session });
//       await session.commitTransaction();

//       // 3️⃣ Send email AFTER commit
//       const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

//       try {
//         await transporter.sendMail({
//           from: `"Support" <${process.env.EMAIL_USER}>`,
//           to: user.email,
//           subject: "Password Reset Request",
//           html: `
//             <p>You requested a password reset.</p>
//             <p>Click the link below to reset your password (valid for 10 minutes):</p>
//             <a href="${resetUrl}">${resetUrl}</a>
//           `,
//         });
//       } catch (emailErr) {
//         console.error("Email failed:", emailErr.message);
//         console.log("👉 DEV RESET LINK:", resetUrl);
//       }

//       return res.status(200).json(genericMessage);

//     } finally {
//       session.endSession();
//     }

//   } catch (err) {
//     next(err);
//   }
// };


// exports.resetPassword = async (req, res, next) => {
//   try {
//     const { token, password } = req.body;

//     if (!token || !password) {
//       return res.status(400).json({ error: "Token and password are required" });
//     }

//     // 1️⃣ Hash the incoming raw token
//     const hashedToken = crypto
//       .createHash("sha256")
//       .update(token)
//       .digest("hex");

//     // 2️⃣ Find user with matching hashed token AND not expired
//     const user = await User.findOne({
//       resetPasswordToken: hashedToken,
//       resetPasswordExpires: { $gt: Date.now() } // token not expired
//     });

//     if (!user) {
//       return res.status(400).json({ error: "Invalid or expired reset token" });
//     }

//     // 3️⃣ Hash the new password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // 4️⃣ Update user password + clear token fields
//     user.password = hashedPassword;
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;

//     await user.save();

//     return res.status(200).json({
//       message: "Password reset successful. You can now log in."
//     });

//   } catch (err) {
//     next(err);
//   }
// };