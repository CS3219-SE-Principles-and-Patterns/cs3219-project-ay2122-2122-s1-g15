const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index");
const assert = chai.assert;
const expect = chai.expect;

// configure chai settings
chai.use(chaiHttp);
chai.should();

var session_id = 2000;

describe("Connections", () => {
  before(function(done) {
    app.on("dbConnected", function() {
      done();
    })
  })
  describe("GET /", () => {
    it("Should get all connections", (done) => {
      chai
        .request(app)
        .get("/editor/api/connection")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          done();
        });
    });
  });

  describe("POST /", () => {
    it("Should create a new connection", (done) => {
      chai
        .request(app)
        .post("/editor/api/connection")
        .set("content-type", "application/x-www-form-urlencoded")
        .send({
          session_id: session_id,
        })
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            res.should.have.status(200);
            res.body.should.be.a("object");
            done();
          }
        });
    });
  });

  describe("GET /", () => {
    it("Should get the previously created connection", (done) => {
      chai
        .request(app)
        .get("/editor/api/connection/" + session_id)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          done();
        });
    });
  });

  describe("DELETE /", () => {
    it("Should Delete connection", (done) => {
      chai
        .request(app)
        .delete("/editor/api/connection/" + session_id)
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            res.should.have.status(200);
            res.body.should.be.a("object");
            done();
          }
        });
    });
  });
});
