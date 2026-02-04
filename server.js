require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/config/swagger");

const errorHandler = require('./src/middlewares/error.middleware')


const app = express();

// ===== Middlewares =====
app.use(express.json());   // JSON body parser
app.use(cors());           // Enable cross-origin
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}   // Request logger
app.use(helmet());

// ======Database=======
const connectDB = require("./src/config/db");
connectDB();

// ======Rate Limiter======
const { globalLimiter } = require("./src/middlewares/rateLimiter");
app.use(globalLimiter);


// ===== Routes =====
const routes = require('./src/routes');
app.use('/api', routes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ===== 404 Handler =====
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl
  });
});

// ===== Global Error Handler =====
app.use(errorHandler);

// ===== Start Server =====
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});