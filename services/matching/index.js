const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const morgan = require("morgan");
const { Server } = require("socket.io");
const http = require("http");
const routes = require("./api/routes");
const SocketController = require("./api/socket");
const matchingController = require("./api/controller");
const db = require("./services/db");
const port = process.env.SERVER_PORT || 4000;
const app = express();
const httpServer = http.createServer(app);

const setupConnections = () => {
  // start database
  return db.connect();
};

const startRoutes = () => {
  // express middleware
  app.use(morgan("combined"));
  app.use(express.json());
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT");
    next();
  });
  app.use("/api", routes);
};

const startSocketListeners = () => {
  // socket.io
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
    pingInterval: process.env.SOCKET_PING_INTERVAL || 3000,
    pingTimeout: process.env.SOCKET_PING_TIMEOUT || 60000,
  });

  matchingController.start(io);

  io.on("connection", (socket) => {
    console.log("> a user connected");
    SocketController.onWait(socket);
    // SocketController.onDisconnect(socket);
  });
};

const startServer = () => {
  httpServer.listen(port, async function () {
    await setupConnections()
    console.log(">> Server started on port: " + port);
  });
}

const start = async () => {
  // await setupConnections();
  startRoutes();
  startSocketListeners();
  startServer()
}

start()


module.exports = {
  server: httpServer
}