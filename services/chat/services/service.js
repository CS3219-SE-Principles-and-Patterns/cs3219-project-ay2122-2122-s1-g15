/* Implements pure business logic, calls database if needed, etc. */
const dbHandler = require("./db");
class ChatService {
  constructor() {}
  example() {
    console.log("I implement business logic");
    dbHandler.connect();
  }
}

let chatService = new ChatService();
module.exports = chatService;
