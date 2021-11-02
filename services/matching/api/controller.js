const { body, validationResult } = require("express-validator");
const { uuid } = require("uuidv4");
const {
  DIFFICULTY,
  HEADER_KEYS,
  HEADER_VALS,
} = require("../constants/constants");
const service = require("../services/service");

/* Defines the logic used in handling requests */
class MatchingController {
  start(io) {
    this.io = io;
  }
  /**
   * Receives a user request to find a match
   * @param {Object} req user request to to find a match
   * @returns {Object} 200, 400 or 500 codes
   */
  handleSubmitMatchRequest(req, res) {
    // ASH TODO: REQUEST VALIDATION

    var difficulty = req.body.difficulty;
    var user = req.body.user;

    // user params valid, accept request
    service.storeMatchRequest(user, difficulty).then((userRequest) => {
      if (!userRequest || !userRequest.requestId) {
        res.status(500).send("Unable to register your request");
        console.log("!ERROR: userRequest and/or requestId is null");
      }
      var requestId = userRequest.requestId;
      res.status(202).send({ requestId });
    });
  }

  handleFindMatch(requestId) {
    return service
      .checkForMatch(requestId)
      .then((users) => {
        if (!users) {
          console.log(`No match found for ${requestId}`);
          return false;
        }
        for (var user of users) {
          this.io.emit(user.requestId, user);
          console.log(
            `> Emitted event to ${
              user.requestId
            } with payload: ${user}`
          );
        }
        return true
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleMatchCancel(req, res) {
    var requestId = req.body.requestId
    service.cancelMatch(requestId)
    .then(() => {
      console.log(`Succesfully cancelled match for ${requestId}`)
      res.status(200).send("Successfully cancelled")
    })
    .catch(err => {
      console.log(`Error occured when cancelling match for ${requestId}: `)
      console.log(err)
      res.status(500).send("Error occured when cancelling")
    })
  }

}

var matchingController = new MatchingController();
module.exports = matchingController;
