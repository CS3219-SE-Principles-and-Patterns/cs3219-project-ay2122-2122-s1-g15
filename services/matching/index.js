const express = require("express");
const morgan = require("morgan");
const { Server } = require("socket.io");
const http = require("http");
const routes = require("./api/routes");
const SocketController = require("./api/socket");
// create express app
const port = 4000;
const app = express();
// express middleware
app.use(morgan("combined"));
app.use(express.json());
app.use("/api", routes);
// socket.io
var httpServer = http.createServer(app);
const io = new Server(httpServer);
app.set("io", io);
io.use((socket, next) => {
  // ASH TODO: middleware for authentication using user jwt token
  // Possible call required to user management service
  next();
});

io.on("connection", (socket) => {
  console.log("a user connected");
  SocketController.onWait(socket);
  SocketController.onDisconnect(socket);
});

httpServer.listen(port, function () {
  console.log("Server started on port: " + port);
});
