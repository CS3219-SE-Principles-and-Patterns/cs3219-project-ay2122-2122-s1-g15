const express = require("express");
const morgan = require("morgan");
const { Server } = require("socket.io");
const http = require("http");
const SocketController = require("./api/socket");
const NotificationController = require("./api/controller")

// create express app
const port = 8000;
const app = express();
// express middleware
app.use(morgan("combined"));
app.use(express.json());
// socket.io
var httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});
io.use((socket, next) => {
  // ASH TODO: middleware for authentication using user jwt token
  // Possible call required to user management service
  const token = socket.handshake.auth.token;
  /*
   const err = new Error("not authorized");
  err.data = { content: "Please retry later" }; // additional details
  next(err);
  */
  next();
});

io.on("connection", (socket) => {
  console.log("> a user connected");
  SocketController.onWait(socket);
  SocketController.onDisconnect(socket);
});

// start controller
var notificationController = new NotificationController(io)
notificationController.start()

httpServer.listen(port, function () {
  console.log(">> Server started on port: " + port);
});
