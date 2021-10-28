const mongoose = require("mongoose");
// const uri = "mongodb://127.0.0.1:27017/matching"; // to be added
const uri = process.env.MONGO_URI || "mongodb+srv://match-admin:1NFBdz5xwHsyGkXo@cluster0.tjs9a.mongodb.net/matching?retryWrites=true&w=majority";

class DbHandler {
  constructor() {}
  connect() {
    mongoose
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
