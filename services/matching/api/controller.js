const { body, validationResult } = require("express-validator");
const {
  DIFFICULTY,
  HEADER_KEYS,
  HEADER_VALS,
} = require("../constants/constants");
const service = require("../services/service");

const queueName = "";
const connectionString = "";
/* Defines the logic used in handling requests */
class MatchingController {
  constructor() {
    this.queue = new Queue(queueName, connectionString);
  }

  /**
   * Receives a user request to find a match
   * @param {Object} req user request to to find a match
   * @returns {Object} 200, 400 or 500 codes
   */
  handleSubmitMatchRequest(req, res) {
    // ASH TODO: add request validation
    console.log(JSON.stringify(this.requests));

    var difficulty = req.body.difficulty;
    var userId = req.params.userId;

    // user params valid, accept request
    service
      .storeMatchRequest(userId, difficulty)
      .then((userRequest) => {
        if (!userRequest || userRequest.requestId) {
          throw new Error("userRequest and/or requestId is null");
        }
        var requestId = userRequest.requestId;
        res.status(200).send({ requestId });
        return userRequest;
      })
      .then((userRequest) => {
        // if there is a match, publish an event to inform both the users
        var io = req.app.get("io");

        // check if a match can be found and publishe
        this.handleMatchPublish(io, difficulty, userRequest);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }

  /**
   * Publishes event to each user's room
   * @param {Object} req
   * @param {Object} user1
   * @param {Object} user2
   */
  handleMatchPublish(io, difficulty, user1) {
    this.service
      .checkForMatch()
      .then((user2) => {
        if (!user2) {
          console.log(`No match for ${JSON.stringify(user1)} found`);
          return;
        }

        // if match found, pubish session information to both users through socket
        return this.service
          .createSession(difficulty, user1, user2)
          .then((sessionInfo) => {
            var requestId1 = user1.requestId;
            var requestId2 = user2.requestId;
            if (requestId1 && requestId2) {
              console.log(
                `emitted event to ${JSON.stringify(user1)} and ${JSON.stringify(
                  user2
                )}`
              );
              io.emit.to(requestId1, sessionInfo);
              io.emit.to(requestId2, sessionInfo);
            }
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = MatchingController;
