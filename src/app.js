const express = require("express");

const app = express();

app.use(express.json());//Express de lire et analyser le JSON reçu dans le corps (body) d'une requête HTTP

app.get("/", (req, res) => {
    res.json({
        message: "FactoryFlow API is running"
    });
});

module.exports = app;