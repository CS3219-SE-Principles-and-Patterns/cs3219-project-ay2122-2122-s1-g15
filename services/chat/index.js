const cors = require("cors");

const port = 5000;
const { uuid } = require("uuidv4");

const app = require("express")();
app.use(cors());
const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*", // TODO: Change to our deployed domain later on
    // methods: ["GET", "POST"],
    // allowedHeaders: ["Access-Control-Allow-Origin"],
  },
  path: "/chat",
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
    socket.on("chat message", ({ message, sender, sessionId }) => {
      const chatId = uuid();
      const payload = {
        message,
        sender,
        chatId,
      };
      io.sockets.in(sessionId).emit("chat message", payload);
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
