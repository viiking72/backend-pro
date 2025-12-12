const rateLimit = require("express-rate-limit");

// 1️⃣ Global rate limit (basic protection)
exports.globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,       // 1 minute
  max: 100,                       // Max 100 requests per minute per IP
  message: "Too many requests, please try again later."
});

// 2️⃣ Login limiter (anti-bruteforce)
exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,       // 15 minutes
  max: 5,                         // 5 attempts
  message: "Too many login attempts. Try again later."
});

// 3️⃣ Forgot-password limiter (prevent spam)
exports.forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,       // 1 hour
  max: 3,                         // 3 attempts per hour
  message: "Too many password reset requests. Try again in an hour."
});
