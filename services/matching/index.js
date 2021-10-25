const express = require("express");
const morgan = require("morgan");
const { Server } = require("socket.io");
const http = require("http");
const routes = require("./api/routes");
const SocketController = require("./api/socket");
const matchingController = require("./api/controller");

// create express app
const port = 4000;
const app = express();
// express middleware
app.use(morgan("combined"));
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
  next();
});
app.use("/api", routes);

// start controller
matchingController.start();

app.listen(port, function () {
  console.log(">> Server started on port: " + port);
});
