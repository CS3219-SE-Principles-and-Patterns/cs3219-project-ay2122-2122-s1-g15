var sinon = require("sinon");
var chai = require("chai");
var expect = chai.expect
var chaiHttp = require("chai-http");
var MatchRequest = require("../model/match-request");
var server = require("../index").server
var mongoose = require("mongoose");
var data = require("./data")
// configure chai
chai.use(chaiHttp);
chai.should(); // use should interface
var dotenv = require("dotenv")
dotenv.config()


afterEach(() => {
  sinon.restore();
});

describe("GET /health", () => {
  /**
   * Health check
   */
  it("should return successful health check", (done) => {
    chai
      .request(server)
      .get("/api/health")
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

/**
 * Match submit
 */
describe("POST /match/submit", () => {
  var user = data.user
  var requestId = data.requestId;
  var difficulty = data.difficulty;

  it("should return response with 200 status code and body containing requestId", (done) => {
    sinon
      .stub(MatchRequest.prototype, "save")
      .resolves(new MatchRequest({ requestId, user, difficulty }));

    chai
      .request(server)
      .post("/api/match/submit")
      .send({ user, difficulty })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("Object");
        res.body.should.eql({ requestId });
        done();
      });
  });

  it("should return a 400 error due to missing user object in request body", (done) => {
    chai
      .request(server)
      .post("/api/match/submit")
      .send({ difficulty })
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  it("should return a 400 error due to incorrect difficulty in request body", (done) => {
    chai
      .request(server)
      .post("/api/match/submit")
      .send({ user, difficulty: "hArD" })
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });
});

/**
 * Match cancel
 */
describe("PUT /match/cancel", () => {
  var requestId = data.requestId
  var findCriteria = { requestId };
  var update = { match: "USER_CANCELLED" };

  it("should return response with 200 status code", (done) => {
    sinon
      .stub(MatchRequest, "updateMatch")
      .withArgs(findCriteria, update)
      .resolves();

    sinon
      .stub(mongoose.Query.prototype, "findOneAndUpdate")
      .withArgs(findCriteria, update)
      .resolves();

    chai
      .request(server)
      .put("/api/match/cancel")
      .send({ requestId })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it("should return response with 400 status code due to incorrect requestId", (done) => {
    chai
      .request(server)
      .put("/api/match/cancel")
      .send({ requestId: "123" })
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });
});

describe("PUT /match/find", () => {
  var session1 = data.getSession(1)
  var session2 = data.getSession(2)
  var requestId1 = data.requestId1
  var requestId2 = data.requestId2
  var userReq1 = data.userReq1
  var userReq2 = data.userReq2
  it("should return response with 200 status code but with no match found", (done) => {
    sinon.stub(MatchRequest, "findUser").withArgs(requestId1).resolves(userReq1);
    sinon.stub(MatchRequest, "findMatch").withArgs(userReq1).resolves(null)
    chai.request(server)
    .put("/api/match/find")
    .send({requestId: requestId1})
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.eql({found: false})
      done()
    })
  })

  it("should return response with 200 status code and match found. service should search database for a match.", (done) => {
    sinon.stub(MatchRequest, "findUser").withArgs(requestId1).resolves(userReq1);
    sinon.stub(MatchRequest, "findMatch").withArgs(userReq1).resolves(userReq2)
    var saveStub = sinon.stub(MatchRequest.prototype, "save")
    chai.request(server)
    .put("/api/match/find")
    .send({requestId: requestId1})
    .end((err, res) => {
      res.should.have.status(200);
      res.body.found.should.equal(true)
      expect(res.body.session).to.not.be.null
      expect(res.body.session.requestId).to.equal(requestId1)
      saveStub.restore()
      sinon.assert.calledTwice(saveStub)
      done()
    })
  })

  it("should return response with 200 status code and match found. service should return the user's request as match was found previously.", (done) => {
    sinon.stub(MatchRequest, "findUser").withArgs(requestId1).resolves(session1);
    var saveStub = sinon.stub(MatchRequest.prototype, "save")
    chai.request(server)
    .put("/api/match/find")
    .send({requestId: requestId1})
    .end((err, res) => {
      res.should.have.status(200);
      res.body.found.should.equal(true)
      console.log(res.body)
      expect(res.body.session).to.not.be.null
      expect(res.body.session.match).to.equal(session1.match.toString())
      saveStub.restore()
      sinon.assert.notCalled(saveStub)
      done()
    })
  })

})