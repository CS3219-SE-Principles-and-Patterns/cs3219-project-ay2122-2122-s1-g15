const dotenv = require('dotenv');
dotenv.config();
const mongoose = require("mongoose");
const app = require('../index');
const uri = process.env.MONGO_URI;

class DbHandler {
  constructor() {}
  connect() {
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
  }
}
let dbHandler = new DbHandler();
module.exports = dbHandler;
