const io = require("socket.io-client");
const expect = require("chai").expect;
const main = require("../index").main;

describe("Chat Service Unit Tests", () => {
  var client1;
  const testPayload = { username: "test", sessionId: "test" };
  const socketURL = "http://localhost:5000";

  it("1. Client 1 should receive message sent by Client 2 in same room", function (done) {
    /**
     * Sets up event listener for client1 and performs assertion on event arguments.
     */
    client1 = io(socketURL, {
      path: "/chat/socket/socket.io/",
    });
    client1.on("chat message", function (args) {
      expect(args.message).to.equal("test");
      expect(args.sender).to.equal("client2");
      client2.disconnect();
      client1.disconnect();
      done();
    });

    /**
     * Sets up events to be emitted by client2 for the test.
     */
    client1.on("connect", function () {
      client1.emit("join room", testPayload);
      // Set up client2 connection
      client2 = io(socketURL, {
        path: "/chat/socket/socket.io",
      });
      client2.on("connect", function () {
        // Emit event when all clients are connected.
        client2.emit("join room", testPayload);
        client2.emit("chat message", {
          message: "test",
          sender: "client2",
          sessionId: "test",
        });
      });
    });
  });

  it("2. Client 1 should receive user disconnected event sent by Client 2 in same room", function (done) {
    /**
     * Sets up event listener for client1 and performs assertion on event arguments.
     */
    client1 = io(socketURL, {
      path: "/chat/socket/socket.io",
    });
    client1.on("user disconnected", function (args) {
      expect(args.sender).to.equal("server");
      expect(args.message).to.equal("client2 disconnected!");
      client2.disconnect();
      client1.disconnect();
      done();
    });

    /**
     * Sets up events to be emitted by client2 for the test.
     */
    client1.on("connect", function () {
      client1.emit("join room", testPayload);
      // Set up client2 connection
      client2 = io(socketURL, {
        path: "/chat/socket/socket.io",
      });
      client2.on("connect", function () {
        // Emit event when all clients are connected.
        client2.emit("join room", testPayload);
        client2.emit("initiate disconnect", {
          username: "client2",
          sessionId: "test",
        });
      });
    });
  });

  it("3. Client 1 should receive user connected event sent by Client 2 in same room", function (done) {
    /**
     * Sets up event listener for client1 and performs assertion on event arguments.
     */
    client1 = io(socketURL, {
      path: "/chat/socket/socket.io",
    });
    client1.on("user connected", function (args) {
      expect(args.sender).to.equal("server");
      expect(args.message).to.equal("client2 connected!");
      client2.disconnect();
      client1.disconnect();
      done();
    });

    /**
     * Sets up events to be emitted by client2 for the test.
     */
    client1.on("connect", function () {
      client1.emit("join room", testPayload);
      // Set up client2 connection
      client2 = io(socketURL, {
        path: "/chat/socket/socket.io",
      });
      client2.on("connect", function () {
        // Emit event when all clients are connected.
        client2.emit("join room", { username: "client2", sessionId: "test" });
      });
    });
  });
});
