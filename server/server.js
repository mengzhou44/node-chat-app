const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');

const app = express();
const server = http.createServer(app);
var io = socketIO(server);
const { generateMessage, generateLocationMessage } = require('./utils/message');

app.use(express.static(publicPath));

io.on('connection', socket => {
  console.log('New user is connected.');

  socket.emit('welcome', generateMessage('Admin', 'Welcome to chat app'));
  socket.broadcast.emit('newUser', generateMessage('Admin', 'New user joined'));

  socket.on('createMessage', (message, callback) => {
    console.log('emitting new message.');
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback();
  });

  socket.on('locationMessage', location => {
    io.emit(
      'newLocationMessage',
      generateLocationMessage('Admin', location.latitude, location.longitude)
    );
  });

  socket.on('disconnect', () => {
    console.log('User disconnected.');
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
