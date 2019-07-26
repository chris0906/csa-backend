const express = require("express");
const Route = express.Router();

Route.get("/api-auth", (req, res) => {
  res.status(200).send("<h1>hello world</h1>");
});

module.exports = Route;
