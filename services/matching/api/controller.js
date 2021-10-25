const { body, validationResult } = require("express-validator");
const { uuid } = require("uuidv4");
const {
  DIFFICULTY,
  HEADER_KEYS,
  HEADER_VALS,
} = require("../constants/constants");
const Service = require("../services/service");
const Producer = require("../services/producer");
const db = require("../services/db");

/* Defines the logic used in handling requests */
class MatchingController {
  constructor() {
    this.service = new Service();
  }

  start() {
    db.connect();
    this.producer = new Producer("testProducer", "amqp://127.0.0.1:5672");
    this.producer.connect();
  }

  /**
   * Receives a user request to find a match
   * @param {Object} req user request to to find a match
   * @returns {Object} 200, 400 or 500 codes
   */
  handleSubmitMatchRequest(req, res) {
    // ASH TODO: REQUEST VALIDATION
    console.log(req.body);

    var difficulty = req.body.difficulty;
    var user = req.body.user;

    // user params valid, accept request
    this.service
      .storeMatchRequest(user, difficulty)
      .then((userRequest) => {
        if (!userRequest || !userRequest.requestId) {
          res.status(500).send("Unable to register your request");
          throw new Error("userRequest and/or requestId is null");
        }
        var requestId = userRequest.requestId;
        res.status(202).send({ requestId });
        return userRequest;
      })
      .then((userRequest) => {
        this.handleMatchPublish(difficulty, userRequest)
      })
      .catch((err) => {
        console.log(err);
      });
  }

  /**
   * Publishes event to each user's room
   * @param {Object} req
   * @param {Object} user1
   * @param {Object} user2
   */
  handleMatchPublish(difficulty, user1) {
    this.service.checkForMatch(difficulty, user1).then((user2) => {
      if (!user2) {
        console.log(`!ERROR: No match for ${JSON.stringify(user1)} found`);
        return;
      }

      // if match found, pubish session information to both users through socket
      return this.service
        .createSession(difficulty, user1, user2)
        .then((sessionInfo) => {
          var requestId1 = user1.requestId;
          var requestId2 = user2.requestId;
          if (requestId1 && requestId2) {
            var payload = {
              type: "INFORM_MATCH",
              requestIds: [requestId1, requestId2],
              sessionInfo,
            };
            this.producer.publish(payload);
          } else {
            console.log("!ERROR: missing request ids")
          }
        });
    });
  }
}

var matchingController = new MatchingController();
module.exports = matchingController;
