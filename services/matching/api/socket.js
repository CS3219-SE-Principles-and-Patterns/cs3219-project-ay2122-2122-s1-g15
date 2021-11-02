const matchingController = require("./controller");
class SocketController {
  static onWait(socket, io) {
    socket.on("wait", (payload) => {
      var requestId = payload.requestId;
      if (requestId) {
        console.log(`A user waiting on socket with requestId ${requestId}`)
        matchingController.handleFindMatch(requestId)
      }
    });
  }
  static onDisconnect(socket) {
    socket.on("disconnect", () => {
      console.log("A user disconnected")
    });
  }
}
module.exports = SocketController;
