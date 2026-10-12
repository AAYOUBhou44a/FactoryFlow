const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "FactoryFlow API",
      version: "1.0.0",
      description:
        "API de gestion des matières premières et des ordres de fabrication.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Serveur local",
      },
    ],
    tags: [
      {
        name: "Installation",
        description: "Installation initiale de FactoryFlow",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },

  apis: ["./src/routes/*.js"],
};

module.exports = swaggerJsdoc(options);