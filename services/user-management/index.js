const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const routes = require("./api/routes");
const port = 3000;
const app = express();
app.use(morgan("combined"));
app.use(express.json());
routes(app);
app.listen(port, function () {
  console.log("Server started on port: " + port);
});
