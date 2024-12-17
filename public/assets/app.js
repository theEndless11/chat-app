const socket = io();
let username = '';

// Handle user joining
document.getElementById('join-button').addEventListener('click', function() {
    username = document.getElementById('username').value.trim();
    if (username) {
        socket.emit('join', username);
        document.getElementById('join-section').style.display = 'none';
        document.getElementById('chat-section').style.display = 'block';
    }
});

// Display message in chat window
function displayMessage(message, sender) {
    const chatRoom = document.getElementById('chat-room');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(sender === username ? 'user' : 'other');
    
    const currentTime = new Date(message.timestamp).toLocaleTimeString();
    messageDiv.innerHTML = `
        <div class="username">${sender} <span class="timestamp">(${currentTime})</span></div>
        <div class="message-content">${message.text}</div>
    `;
    chatRoom.appendChild(messageDiv);
    chatRoom.scrollTop = chatRoom.scrollHeight;
}

// Send message when clicking the send button
document.getElementById('send-message').addEventListener('click', function() {
    const message = document.getElementById('message-input').value.trim();
    if (message) {
        socket.emit('sendMessage', message, () => {
            displayMessage({ text: message, timestamp: new Date() }, username);
            document.getElementById('message-input').value = '';
        });
    }
});

// Listen for messages from other users
socket.on('message', (message) => {
    displayMessage(message, message.user);
});
