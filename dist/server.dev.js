"use strict";

var express = require('express');

var http = require('http');

var socketIo = require('socket.io'); // Initialize app and server


var app = express();
var server = http.createServer(app);
var io = socketIo(server); // In-memory storage for users and messages

var users = [];
var messages = []; // Middleware

app.use(express["static"]('public'));
app.use(express.json()); // Routes to handle user registration and message sending

app.post('/join', function (req, res) {
  var username = req.body.username; // Check if the user already exists

  if (!users.includes(username)) {
    users.push(username);
  }

  res.json({
    username: username
  });
}); // WebSocket handling for real-time chat

io.on('connection', function (socket) {
  console.log('New user connected'); // Handle joining a chat

  socket.on('join', function (username) {
    socket.username = username;
    socket.emit('message', {
      user: 'System',
      text: "Welcome ".concat(username, "!")
    }); // Broadcast to others when a new user joins

    socket.broadcast.emit('message', {
      user: 'System',
      text: "".concat(username, " has joined the chat.")
    });
  }); // Handle receiving and broadcasting messages

  socket.on('sendMessage', function (message, callback) {
    var newMessage = {
      user: socket.username,
      text: message,
      timestamp: new Date()
    };
    messages.push(newMessage); // Store message in memory

    io.emit('message', newMessage);
    callback();
  }); // Handle disconnecting

  socket.on('disconnect', function () {
    console.log('User disconnected');
  });
}); // Serve the frontend page

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
}); // Start the server

var PORT = process.env.PORT || 5000;
server.listen(PORT, function () {
  console.log("Server running on port ".concat(PORT));
});
//# sourceMappingURL=server.dev.js.map
