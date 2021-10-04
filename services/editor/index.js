const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const port = 6001;
const app = express();
app.use(morgan("combined"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
const routes = require("./api/routes");
// Send message for default URL
app.get("/", (req, res) => res.send("Welcome to the editor service"));
app.use("/api", routes)

app.listen(port, function () {
  console.log("Server started on port: " + port);
});

