const express = require('express');
const router = express.Router();

const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');
const tokenRoutes = require('./token.routes');
const uploadRoutes = require("./upload.routes");

// user routes
router.use('/users', userRoutes);

//auth routes
router.use('/auth', authRoutes);

//token routes
router.use('/token',tokenRoutes);

//upload routes
router.use("/upload", uploadRoutes);

// health check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    at: new Date().toISOString()
  });
});

// version
router.get('/version', (req, res) => {
  res.status(200).json({
    version: process.env.VERSION,
    app: process.env.APP_NAME,
    env: process.env.NODE_ENV
  });
});

// echo
router.post('/echo', (req, res) => {
  res.status(201).json({
    received: req.body,
    at: new Date().toISOString()
  });
});

module.exports = router;
