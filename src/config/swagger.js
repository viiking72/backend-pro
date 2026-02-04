const swaggerJsdoc = require("swagger-jsdoc");

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Backend Pro API",
      version: "1.0.0",
      description: "Backend-only REST API with JWT authentication"
    },
    servers: [
      {
        url: "https://backend-pro-1-56ud.onrender.com"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ["./src/routes/*.js"], // important for your structure
});

module.exports = swaggerSpec;
