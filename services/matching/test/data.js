var { uuid } = require("uuidv4");
var mongoose = require("mongoose");
var MatchRequest = require("../model/match-request");
var Question = require("../model/question");
class TestData {
  requestId = uuid();
  requestId1 = uuid();
  requestId2 = uuid();
  sessionId = uuid();
  difficulty = "hard";
  user1 = {
    displayName: "test1",
    email: "test1@gmail.com",
  };
  user2 = {
    displayName: "test2",
    email: "test2@gmail.com",
  };
  user = {
    displayName: "test",
    email: "test@gmail.com",
  };

  userReq1 = new MatchRequest({
    _id: new mongoose.Types.ObjectId(),
    user: this.user1,
    difficulty: this.difficulty,
    requestId: this.requestId1,
  });

  userReq2 = new MatchRequest({
    _id: new mongoose.Types.ObjectId(),
    user: this.user2,
    difficulty: this.difficulty,
    requestId: this.requestId2,
  });

  question = new Question({
    difficulty: this.difficulty,
    markdown: "test",
    title: "title",
  });

  getSession(sessionNum) {
    // ignore sessionId
    var sessionInfo = {
      sessionId: this.sessionId,
      difficulty: this.difficulty,
      question: this.question,
    };

    if (sessionNum === 1) {
      var session1 = { ...this.userReq1 };
      session1.match = this.userReq2._id;
      session1.matchedUser = this.userReq2.user;
      session1.sessionInfo = sessionInfo;
      return session1;
    } else {
      var session2 = { ...this.userReq2 };
      session2.match = this.userReq1._id;
      session2.matchedUser = this.userReq1.user;
      session2.sessionInfo = sessionInfo;
    }
  }

  // getUsers() {
  //   var session1 = {...userReq1}
  //   session1.match = userReq2.__id
  //   session1.matchedUser = user2
  //   session1.sessionInfo = sessionInfo
  //   var session2 = {...userReq2}
  //   session2.match = userReq1.__id
  //   session2.matchedUser = user1
  //   session2.sessionInfo = sessionInfo
  // }
}

var data = new TestData();
module.exports = data;
