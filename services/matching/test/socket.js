const sinon = require("sinon");
const sinonMongoose = require("sinon-mongoose")
const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const io = require("socket.io-client");
const expect = require("chai").expect;
const service = require("../services/service");
const data = require("./data");
const dotenv = require("dotenv");
const mongoose = require("mongoose")
const TEST_PORT = 4001;
const MatchRequest = require("../model/match-request");
dotenv.config();
var SocketController = require("../api/socket");
var matchingController = require("../api/controller");
const app = express();
const httpServer = http.createServer(app);
// socket.io
const ioServer = new Server(httpServer, {
  cors: {
    origin: "*",
  },
  pingInterval: process.env.SOCKET_PING_INTERVAL || 3000,
  pingTimeout: process.env.SOCKET_PING_TIMEOUT || 60000,
});

describe("Websocket tests", () => {
  var client1, client2
  before((done) => {
    matchingController.start(ioServer);
    httpServer.listen(TEST_PORT, function () {
      console.log(">> Server started on port: " + TEST_PORT);
      ioServer.on("connection", (socket) => {
        console.log("> a user connected");
        SocketController.onWait(socket);
      });

      // connect clients to server
      client1 = io.connect(serverUrl)
  

      client1.on("connect", () => {
        client2 = io.connect(serverUrl)
        client2.on("connect", done)
      })
    });
  });

  afterEach(() => {
    sinon.restore();
  });
  
  var serverUrl = `${process.env.SERVER_HOST}:${TEST_PORT}`;

  var requestId1 = data.requestId1;
  var requestId2 = data.requestId2;
  var userReq1 = data.userReq1;
  var userReq2 = data.userReq2;
  var difficulty = data.difficulty;
  var question = data.question;
  var sessionId = data.sessionId;
  // ignore sessionId
  var sessionInfo = {
    sessionId,
    difficulty,
    question,
  };

  var session1 = { ...userReq1 };
  session1.match = userReq2._id;
  session1.matchedUser = userReq2.user;
  session1.sessionInfo = sessionInfo;

  var session2 = { ...userReq2 };
  session2.match = userReq1._id;
  session2.matchedUser = userReq1.user;
  session2.sessionInfo = sessionInfo;

  it("Should find a match for the user, save it and emit to both clients", (done) => {
    var findUserStub = sinon.stub(MatchRequest, "findUser");
    findUserStub.withArgs(requestId1).resolves(userReq1);

    var findMatchStub = sinon.stub(MatchRequest, "findMatch");
    findMatchStub.withArgs(userReq1).resolves(userReq2);
    findMatchStub.withArgs(userReq2).resolves(userReq1);

    var saveStub = sinon.stub(MatchRequest.prototype, "save");

    sinon
      .stub(service, "createSession")
      .withArgs(difficulty)
      .resolves(sessionInfo);

    // emit the wait
    client1.emit("wait", { requestId: requestId1 });

    client2.on(`${requestId2}`, (res) => {
      res = JSON.parse(JSON.stringify(res));
      expect(res.requestId).to.equal(requestId2);
      expect(res.sessionInfo.question._id).to.equal(question._id.toString());
      expect(res.matchedUser).to.eql(userReq1.user);
      expect(res.sessionInfo.sessionId).to.equal(sessionId);

      saveStub.restore()
      sinon.assert.calledTwice(saveStub)
      done();
    });
  });

  // it("Should skip the creation of a new session as a match has already been found for this user", (done) => {
  //   var findUserStub = sinon.stub(MatchRequest, "findUser");
  //   findUserStub.withArgs(requestId1).resolves(session1);
  //   // findUserStub.withArgs(requestId2).resolves(userReq2);

  //   // var findMatchStub = sinon.stub(MatchRequest, "findMatch");
  //   // findMatchStub.withArgs(userReq1).resolves(userReq2);
  //   // findMatchStub.withArgs(userReq2).resolves(userReq1);

  //   sinon.mock(MatchRequest).expects("findById").withArgs(userReq2._id).chain("exec").resolves(session2)

  //   sinon
  //     .stub(service, "createSession")
  //     .withArgs(difficulty)
  //     .resolves(sessionInfo);

  //   // emit the wait
  //   client1.emit("wait", { requestId: requestId1 });

  //   client1.on(`${requestId1}`, (res) => {
  //     res = JSON.parse(JSON.stringify(res));
  //     expect(res.requestId).to.equal(requestId1);
  //     expect(res.sessionInfo.question._id).to.equal(question._id.toString());
  //     expect(res.matchedUser).to.eql(userReq2.user);
  //     expect(res.sessionInfo.sessionId).to.equal(sessionId);
  //     done();
  //   });
  // });
});
