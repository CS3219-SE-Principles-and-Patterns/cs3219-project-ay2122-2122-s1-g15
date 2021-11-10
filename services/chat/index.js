const cors = require("cors");
const express = require("express");
const routes = require("./api/routes");
const port = 5000;
const { uuid } = require("uuidv4");

const app = express();
app.use(cors());
app.use("/chat/health", routes);
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
app.use((req, res, next) => {
  console.log(req.url);
  next();
});
const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
  path: "/chat/socket",
  allowEIO3: true,
});

const main = () => {
  io.on("connection", (socket) => {
    socket.on("join room", ({ sessionId, username }) => {
      socket.join(sessionId);
      message = `${username} connected!`;
      const payload = {
        message,
        sender: "server",
      };
      socket.to(sessionId).emit("user connected", payload);
      console.log(`user ${username} has been connected`);
      console.log(`socket subscribed to ${sessionId}`);
    });
    socket.on("chat message", ({ message, sender, sessionId, chatId }) => {
      const payload = {
        message,
        sender,
        chatId,
        sessionId,
      };
      socket.to(sessionId).emit("chat message", payload);
      console.log(payload);
    });
    socket.on("initiate disconnect", ({ sessionId, username }) => {
      message = `${username} disconnected!`;
      const chatId = uuid();
      const payload = {
        message,
        sender: "server",
        chatId,
      };
      console.log(message);
      socket.to(sessionId).emit("user disconnected", payload);
      socket.disconnect();
    });
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  server.listen(port, () => {
    console.log("Server start on port: " + port);
  });
};

main();

module.exports.main = main;
