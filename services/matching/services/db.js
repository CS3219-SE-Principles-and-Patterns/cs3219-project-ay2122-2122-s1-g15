const mongoose = require("mongoose");
const uri = ""; // to be added

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
      })
      .catch((err) => {
        console.log(">> ERROR: Database connection error");
      });
  }
}

let dbHandler = new DbHandler();
module.exports = dbHandler;
