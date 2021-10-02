const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const routes = require("./api/routes");
const port = 6000;
const app = express();
app.use(morgan("combined"));
// Send message for default URL
app.get("/", (req, res) => res.send("Welcome to the ediotr service"));
app.use("/api", routes)
app.listen(port, function () {
  console.log("Server started on port: " + port);
});

