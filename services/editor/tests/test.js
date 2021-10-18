const chai =  require('chai');
const chaiHttp =  require('chai-http');
const app = require('../test_env');
const assert = chai.assert;
const expect = chai.expect;

// configure chai settings
chai.use(chaiHttp);
chai.should();

var session_id = 2000;

describe("Connections", () => {
    describe("GET /", () => {
        // Test to get all students record
        it("Should get all connections", (done) => {
             chai.request(app)
                 .get('/api/connection')
                 .end((err, res) => {
                     res.should.have.status(200);
                     res.body.should.be.a('object');
                     done();
                  });
         });
    });

    describe("POST /", () => {
        // Create new review
        it("Should create a new connection", (done) => {
            chai.request(app)
                .post("/api/connection")
                .set("content-type", "application/x-www-form-urlencoded")
                .send(
                    {
                        session_id: session_id
                    }
                )
                .end((err, res)=> {
                    if (err) {
                        done(err);
                    } else {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        done();
                    }
                });
        });
    });


    describe("GET /", () => {
        // Test to get all students record
        it("Should get the previously created connection", (done) => {
             chai.request(app)
                 .get('/api/connection/' + session_id)
                 .end((err, res) => {
                     res.should.have.status(200);
                     res.body.should.be.a('object');
                     done();
                  });
         });
    });

    describe("DELETE /", ()=> {
        // should delete the pizza inserted earlier
        it("Should Delete connection", (done) => {
            chai.request(app)
                .delete("/api/connection/" + session_id)
                .end((err, res) => {
                    if (err) {
                        done(err);
                    } else {
                        res.should.have.status(200);
                        res.body.should.be.a("object")
                        done();
                    }
                });
        });
    });
});