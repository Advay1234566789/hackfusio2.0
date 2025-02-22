const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware or routes can go here
app.get('/', (req, res) => {
  res.send('Socket.IO server is running.');
});

// Set up a basic connection listener
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);
  
  // Define other socket event listeners as needed

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Listen on port 4500
server.listen(4500, () => {
  console.log('Server is running on http://localhost:4500');
});
