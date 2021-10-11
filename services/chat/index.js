const morgan = require("morgan");
const port = 5000;
const app = require('express')();
const server = require('http').createServer(app);

const io = require('socket.io')(server, {
  cors: {
    origin: "*" // TODO: Change to our deployed domain later on
    // methods: ["GET", "POST"],
    // allowedHeaders: ['my-customer-header']
  }
});

app.use(morgan("combined"));
app.use(express.json());

io.on('connection', (socket) => {
  console.log('user has been connected');
  socket.on('chat message', (payload) => {
    io.emit('chat message', payload);
    console.log(payload);
  });
  socket.on('disconnect', () => {
    io.emit('user disconnected');
    console.log('user disconnected');
  });
});

server.listen(port, () => {
  console.log("Server start on port: " + port);
});