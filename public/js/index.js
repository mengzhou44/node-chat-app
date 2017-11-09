var socket = io();

socket.on('connect', function() {
  console.log('Connected to server');
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

socket.on('welcome', function(message) {
  console.log(message);
});

socket.on('newUser', function(message) {
  console.log(message);
});

socket.on('newMessage', function(message) {
  var formattedTime = moment().format('h:mm a');

  var li = $('<li></li>');

  li.text(`${message.from} ${formattedTime}: ${message.text}`);
  $('#messages').append(li);
});

socket.on('newLocationMessage', function(message) {
  var formattedTime = moment().format('h:mm a');

  var li = $('<li></li>');
  var a = $(`<a target='_blank'> my current location </a>`);
  li.text(`${message.from} ${formattedTime}:`);
  a.attr('href', message.url);

  li.append(a);
  $('#messages').append(li);
});

$('#message-form').on('submit', function(e) {
  e.preventDefault();

  var messageTextbox = $('[name=message]');

  socket.emit(
    'createMessage',
    {
      from: 'User',
      text: messageTextbox.val()
    },
    function(message) {
      messageTextbox.val('');
    }
  );
});

var locationButton = $('#send-location');

locationButton.on('click', function() {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser!');
  }
  locationButton.attr('disabled', 'disabled').text('Sending location ...');
  navigator.geolocation.getCurrentPosition(
    function(position) {
      locationButton.removeAttr('disabled').text('Send location');
      socket.emit('locationMessage', {
        longitude: position.coords.longitude,
        latitude: position.coords.latitude
      });
    },
    function(err) {
      locationButton.removeAttr('disabled').text('Send location');
      alert('Unable to fecthc the location!');
    }
  );
});
