/* Implements pure business logic, calls database if needed, etc. */
const { uuid } = require("uuidv4");
const MatchRequest = require("../model/match-request");
const errors = require("../errors/errors");
const Question = require("../model/question");
class Service {
  /**
   * Stores the match request
   * @param {*} difficulty
   * @param {*} userId
   * @returns Promise
   */
  static storeMatchRequest(user, difficulty) {
    var requestId = uuid();
    var matchRequest = new MatchRequest({
      requestId,
      user,
      difficulty,
    });
    return matchRequest
      .save()
      .then((matchRequest) => {
        console.log(matchRequest);
        return matchRequest;
      })
      .catch((err) => {
        console.log(err);
        throw new Error(errors.ERROR_STORE_REQUEST);
      });
  }

  /**
   * Searches for a match for the selected difficulty
   * Ensures that the same user who requested the match is not returned as their own match
   * @param {string} difficulty
   * @param {string} requestId
   * @returns Promise
   */
  static checkForMatch(requestId) {
    return MatchRequest.findUser(requestId)
      .then((userReq) => {
        if (userReq && userReq.match) {
            return userReq
        }
        if (!userReq) {
          // return null;
          throw new Error(`User with requestId ${requestId} not found in database`);
        }

        return MatchRequest.findMatch(userReq)
          .then((otherReq) => {
            if (!otherReq) {
              return null;
            }

            console.log(`Match found for ${requestId}: ${JSON.stringify(otherReq)}`)

            return this.createSession(userReq.difficulty)
            .then(sessionInfo => {
              userReq.match = otherReq._id;
              userReq.matchedUser = otherReq.user;
              userReq.sessionInfo = sessionInfo;
              otherReq.match = userReq._id;
              otherReq.matchedUser = userReq.user;
              otherReq.sessionInfo = sessionInfo;
              userReq.save();
              otherReq.save();
              return userReq;
            })
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        console.log(err)
        throw new Error(errors.ERROR_MATCHING_USER);
      });
  }

  /**
   * Creates a session for the two given users by fetching a question for the session
   * @param {*} difficulty
   * @returns Promise containing the sessionInfo
   */
  static createSession(difficulty) {
    return Question.fetchRandomQuestion(difficulty)
      .then((question) => {
        if (!question) {
          throw new Error(errors.ERROR_NO_QUESTION);
        }
        console.log(`Retrieved random question: ${JSON.stringify(question)}`)
        var sessionId = uuid();
        var sessionInfo = {
          sessionId,
          difficulty,
          question
        };
        return sessionInfo;
      })
      .catch((err) => {
        console.log(err);
        throw new Error(errors.ERROR_FETCH_QUESTION);
      });
  }

  static cancelMatch(requestId) {
    var findCriteria = {requestId}
    var update = {
      match: "USER_CANCELLED"
    }
    return MatchRequest.updateMatch(findCriteria, update)
  }
}

module.exports = Service;
