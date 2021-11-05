const dotenv = require('dotenv');
dotenv.config();
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
const port = process.env.SERVER_PORT || 4000;
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
  res.header("Access-Control-Allow-Methods", "POST, GET");
  next();
});
app.use((req, res, next)=> { console.log(req.url); next(); });

// socket.io
var httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
  pingInterval: process.env.SOCKET_PING_INTERVAL || 3000,
  pingTimeout: process.env.SOCKET_PING_TIMEOUT || 60000,
  path: "/matching/socket",
  allowEIO3: true
});
// io.path("/matching")

matchingController.start(io);

io.on("connection", (socket) => {
  console.log("> a user connected");
  SocketController.onWait(socket);
  // SocketController.onDisconnect(socket);
});


httpServer.listen(port, function () {
  console.log(">> Server started on port: " + port);
});
app.use("/matching/api", routes);
