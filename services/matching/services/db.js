const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const uri = process.env.MONGO_URI;

class DbHandler {
  constructor() {}
  connect() {
    return mongoose
      .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((db) => {
        console.log(">> Database connected");
      })
      .catch((err) => {
        console.log("!Database connection error: %s", err);
      });
  }
}

let dbHandler = new DbHandler();
module.exports = dbHandler;
