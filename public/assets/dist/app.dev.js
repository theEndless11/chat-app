"use strict";

var socket = io();
var username = ''; // Handle user joining

document.getElementById('join-button').addEventListener('click', function () {
  username = document.getElementById('username').value.trim();

  if (username) {
    socket.emit('join', username);
    document.getElementById('join-section').style.display = 'none';
    document.getElementById('chat-section').style.display = 'block';
  }
}); // Display message in chat window

function displayMessage(message, sender) {
  var chatRoom = document.getElementById('chat-room');
  var messageDiv = document.createElement('div');
  messageDiv.classList.add('message');
  messageDiv.classList.add(sender === username ? 'user' : 'other');
  var currentTime = new Date(message.timestamp).toLocaleTimeString();
  messageDiv.innerHTML = "\n        <div class=\"username\">".concat(sender, " <span class=\"timestamp\">(").concat(currentTime, ")</span></div>\n        <div class=\"message-content\">").concat(message.text, "</div>\n    ");
  chatRoom.appendChild(messageDiv);
  chatRoom.scrollTop = chatRoom.scrollHeight;
} // Send message when clicking the send button


document.getElementById('send-message').addEventListener('click', function () {
  var message = document.getElementById('message-input').value.trim();

  if (message) {
    socket.emit('sendMessage', message, function () {
      displayMessage({
        text: message,
        timestamp: new Date()
      }, username);
      document.getElementById('message-input').value = '';
    });
  }
}); // Listen for messages from other users

socket.on('message', function (message) {
  displayMessage(message, message.user);
});
//# sourceMappingURL=app.dev.js.map
