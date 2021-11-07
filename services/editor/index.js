const dotenv = require('dotenv');
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const { WebSocketServer } = require("ws");
const bodyParser = require("body-parser");
const uri = process.env.MONGO_URI || "mongodb+srv://atlas_admin:KEwpeOZbjbfrWIOQ@nodejs-reviews.0ekmm.mongodb.net/connection?retryWrites=true&w=majority";
const WebSocketJSONStream = require("@teamwork/websocket-json-stream");
const db = require('sharedb-mongo')(uri);
const ShareDB = require("sharedb");
const port = process.env.SERVER_PORT || 6001;
const app = express();
const server = require("http").createServer(app);
app.use(morgan("combined"));

const shareDBServer = new ShareDB({db});
const wss = new WebSocketServer({ server: server, path: "/socket"});
wss.on('connection', function connection(ws) {
  console.log('A new client Connected!');
  ws.send('Welcome New Client!');
  // For transport we are using a ws JSON stream for communication
  // that can read and write js objects.
  const jsonStream = new WebSocketJSONStream(ws);
  // console.log(shareDBServer);
  shareDBServer.listen(jsonStream);
});
// start database
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((db) => {
    console.log(">> SUCCESS: Database connected");
    app.emit("dbConnected");
  })
  .catch((err) => {
    console.log(">> ERROR: Database connection error");
  });

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
  next();
});
const routes = require("./api/routes");
// Send message for default URL
app.get("/editor/", (req, res) => res.send("Welcome to the editor service"));
app.use("/editor/api", routes);

server.listen(port, function () {
  console.log("Server started on port: " + port);
});

module.exports = app;
