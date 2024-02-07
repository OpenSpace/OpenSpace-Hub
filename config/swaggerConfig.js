const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0", // OpenAPI version
    info: {
      title: "OpenSpace Hub APIs",
      version: "1.0.0",
      description: "APIs for OpenSpace Hub",
    },
  },
  apis: ["./routes/*.js", './index.js'], // API route files
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
