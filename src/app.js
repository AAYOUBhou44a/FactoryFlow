const express = require("express");
const installationRoutes = require("./routes/installation.routes");
const errorMiddleware = require("./middlewares/error.middleware");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "FactoryFlow API is running" });
});

app.use("/api/installation", installationRoutes);

// Documentation Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Gestion des erreurs : à la fin
app.use(errorMiddleware);

module.exports = app;