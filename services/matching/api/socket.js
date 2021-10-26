const matchingController = require("./controller");
class SocketController {
  static onWait(socket, io) {
    socket.on("wait", (payload) => {
      var requestId = payload.requestId;
      if (requestId) {
        // check if the user has a match
        matchingController.handleFindMatch(requestId).then((emitted) => {
          if (emitted) {
            // console.log(`Emitted sessionInfo, disconnecting ${requestId}`)
            // socket.disconnect();
          }
        });
      }
    });
  }
  static onDisconnect(socket) {
    socket.on("disconnect", () => {
      
    });
  }
}
module.exports = SocketController;
