/* Defines the logic used in handling requests */
const Consumer = require("../services/consumer")
class NotificationController {
  constructor(io) {
    this.io = io
  }

  start() {
    var consumer = new Consumer("testQueue", "amqp://127.0.0.1:5672")
    consumer.registerHandler(this)
    consumer.connect()
  }

  /**
   * Publishes event to each user's room
   * @param {Object} req
   * @param {Object} user1
   * @param {Object} user2
   */
  handleMessage(msg) {
    switch (msg.type) {
      case "INFORM_MATCH":
        this.handleMatchPublish(msg)
    }
  }

  handleMatchPublish(msg) {
    for (var requestId of msg.requestIds) {
      this.io.to(requestId).emit(msg.sessionInfo)
      console.log(`> Emitted event to ${requestId} with payload: ${JSON.stringify(msg.sessionInfo)}`)
    }
  }
}

module.exports = NotificationController;
