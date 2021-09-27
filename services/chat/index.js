const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const router = require("./api/routes");
const port = 5000;
const app = express();
app.use(morgan("combined"));
app.use("/", router);
app.listen(port, function () {
  console.log("Server started on port: " + port);
});
