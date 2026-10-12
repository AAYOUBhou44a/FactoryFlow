const express = require("express");
const installationRoutes = require("./routes/installation.routes");
const authRoutes = require("./routes/auth.routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "FactoryFlow API is running"
    });
});

app.use("/api/installation", installationRoutes);
app.use("/api/auth", authRoutes);

app.use(errorMiddleware);

module.exports = app;