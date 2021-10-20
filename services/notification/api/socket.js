class SocketController {
  static onWait(socket) {
    socket.on("wait", (payload) => {
      console.log(payload);
      var requestId = payload.requestId;
      if (requestId) {
        // make the user join the room for that requestId
        socket.join(requestId);
      }
    });
  }
  static onDisconnect(socket) {
    socket.on("disconnect", (payload) => {
      console.log("a user disconnected");
      console.log(payload);
      // ASH TODO: recovery? how to inform another user?
    });
  }
}
module.exports = SocketController;
