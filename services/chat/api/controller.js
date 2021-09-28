/* Controllers will call services */
const service = require("../services/service");
class ChatController {
  constructor() {}
  example(req, res) {
    console.log("I call the service");
    service.example();
    res.send("Hi");
  }
}

let chatController = new ChatController();
module.exports = chatController;
