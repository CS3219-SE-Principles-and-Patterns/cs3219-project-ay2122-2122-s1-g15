const { createAdapter } = require("@socket.io/mongo-adapter");
const { MongoClient } = require("mongodb");

const DB = "peer-prep";
const COLLECTION = "socket.io-adapter-events";
const port = 5000;

const app = require('express')();
const server = require('http').createServer(app); 

const mongoClient = new MongoClient("mongodb+srv://chat-admin:fiESyt7PDeQpXtOi@cluster0.tjs9a.mongodb.net/peerprep?retryWrites=true&w=majority", {
  useUnifiedTopology: true,
});

const io = require('socket.io')(server, {
    cors: {
      origin: "*" // TODO: Change to our deployed domain later on
      // methods: ["GET", "POST"],
      // allowedHeaders: ['my-customer-header']
    }
  });  

const main = async () => {
  await mongoClient.connect();

  try {
    await mongoClient.db(DB).createCollection(COLLECTION, {
      capped: true,
      size: 1e6
    });
  } catch (e) {
    // collection already exists
  }
  const mongoCollection = mongoClient.db(DB).collection(COLLECTION);

  io.adapter(createAdapter(mongoCollection));

  const rooms = io.of("/").adapter.rooms;
  const sids = io.of("/").adapter.sids;

  io.on('connection', (socket) => {
    console.log('user has been connected');
    socket.on('join room', (sessionId) => {
      socket.join(sessionId);
      console.log('socket subscribed to ' + sessionId);
    })
    socket.on('chat message', ({message, sender, sessionId}) => {
      const payload = {
        message,
        sender
      };
      socket.to(sessionId).emit('chat message', payload);
    });
    socket.on('disconnect', () => {
      io.emit('user disconnected');
      console.log('user disconnected');
    });
  });
  
  server.listen(port, () => {
    console.log("Server start on port: " + port);
  });

}

main();