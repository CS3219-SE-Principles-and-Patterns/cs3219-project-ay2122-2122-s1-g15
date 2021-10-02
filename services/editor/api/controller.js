/* Controllers will editor services */
const service = require("../services/service");
class ConnectionController {
  constructor() {}
  create(req, res) {
    console.log("Calling the create service");
    service.create();
    res.send("Connection created");
  }

  delete(req, res) {
    console.log("Calling the delete service");
    service.delete();
    res.send("Connection deleted");
  }
}

let connectionController = new ConnectionController();
module.exports = connectionController;