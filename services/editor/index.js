const dotenv = require('dotenv');
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const port = process.env.SERVER_PORT || 6001;
const uri = process.env.MONGO_URI || "mongodb+srv://atlas_admin:KEwpeOZbjbfrWIOQ@nodejs-reviews.0ekmm.mongodb.net/connection?retryWrites=true&w=majority";
const app = express();
app.use(morgan("combined"));

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
app.get("/", (req, res) => res.send("Welcome to the editor service"));
app.use("/api", routes);

app.listen(port, function () {
  console.log("Server started on port: " + port);
});

module.exports = app;
