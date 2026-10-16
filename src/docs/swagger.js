const path = require("node:path");
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
      {
        name: "authentification",
        description: "Connexion et gestion de l'authentification JWT",
      }
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

  apis: [path.resolve(__dirname, "../routes/*.js")],
};

module.exports = swaggerJsdoc(options);