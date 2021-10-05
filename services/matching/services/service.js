/* Implements pure business logic, calls database if needed, etc. */
const { DIFFICULTY } = require("../constants/constants");
const { uuid } = require("uuidv4");
const { MatchRequest } = require("../model/match-request");
const errors = require("../errors/errors");
const { Question } = require("../model/question");
class Service {
  constructor() {}

  /**
   * Stores the match request
   * @param {*} difficulty
   * @param {*} userId
   * @returns Promise
   */
  storeMatchRequest(difficulty, userId) {
    requestId = uuid();
    matchRequest = new MatchRequest({
      requestId,
      userId,
      difficulty,
    });
    matchRequest
      .save()
      .then((matchRequest) => {
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
  checkForMatch(difficulty, requestId) {
    MatchRequest.checkForMatch(difficulty, requestId)
      .then((match) => {
        if (!match) {
          return null;
        }
        return match;
      })
      .catch((err) => {
        console.log(err);
        throw new Error(errors.ERROR_MATCHING);
      });
  }

  /**
   * Creates a session for the two given users by fetching a question for the session
   * @param {*} difficulty
   * @param {*} user1
   * @param {*} user2
   * @returns Promise containing the sessionInfo
   */
  createSession(difficulty, user1, user2) {
    Question.fetchRandomQuestion(difficulty)
      .then((question) => {
        if (!question) {
          throw new Error(errors.ERROR_NO_QUESTION);
        }
        var sessionId = uuid();
        var sessionInfo = {
          sessionId,
          difficulty,
          markdown: question.markdown,
        };

        // ASH TODO: unsure if creating a Session in the database is required. Also confirm what is needed by editor and chat service
        return sessionInfo;
      })
      .catch((err) => {
        console.log(err);
        throw new Error(errors.ERROR_FETCH_QUESTION);
      });
  }
}
