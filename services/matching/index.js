const express = require("express");
const morgan = require("morgan");
const { Server } = require("socket.io");
const http = require("http");
const routes = require("./api/routes");
const SocketController = require("./api/socket");
const matchingController = require("./api/controller");
const db = require("./services/db");

// start database
db.connect();

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

// socket.io
var httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
  pingInterval: 3000,
  pingTimeout: 60000
});


matchingController.start(io)

io.on("connection", (socket) => {
  console.log("> a user connected");
  SocketController.onWait(socket);
  // SocketController.onDisconnect(socket);
});


httpServer.listen(port, function () {
  console.log(">> Server started on port: " + port);
});