const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Initialize app and server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// In-memory storage for users and messages
let users = [];
let messages = [];

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Routes to handle user registration and message sending
app.post('/join', (req, res) => {
    const { username } = req.body;

    // Check if the user already exists
    if (!users.includes(username)) {
        users.push(username);
    }

    res.json({ username });
});

// WebSocket handling for real-time chat
io.on('connection', socket => {
    console.log('New user connected');

    // Handle joining a chat
    socket.on('join', username => {
        socket.username = username;
        socket.emit('message', { user: 'System', text: `Welcome ${username}!` });
        
        // Broadcast to others when a new user joins
        socket.broadcast.emit('message', { user: 'System', text: `${username} has joined the chat.` });
    });

    // Handle receiving and broadcasting messages
    socket.on('sendMessage', (message, callback) => {
        const newMessage = { user: socket.username, text: message, timestamp: new Date() };
        messages.push(newMessage); // Store message in memory
        
        io.emit('message', newMessage);

        callback();
    });

    // Handle disconnecting
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Serve the frontend page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
