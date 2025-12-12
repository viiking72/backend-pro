require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');


const app = express();

// ===== Middlewares =====
app.use(express.json());   // JSON body parser
app.use(cors());           // Enable cross-origin
app.use(morgan('dev'));    // Request logger

// ======Database=======
const connectDB = require("./src/config/db");
connectDB();

// ======Rate Limiter======
const { globalLimiter } = require("./src/middlewares/rateLimiter");
app.use(globalLimiter);


// ===== Routes =====
const routes = require('./src/routes');
app.use('/api', routes);


// ===== 404 Handler =====
app.use((req, res, next) => {
  return res.status(404).json({
    error: 'Not Found',
    path: req.originalUrl
  });
});

// ===== Global Error Handler =====
app.use((err, req, res, next) => {
  console.error('💥 Error:', err.message);

  return res.status(err.statusCode || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// ===== Start Server =====
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});