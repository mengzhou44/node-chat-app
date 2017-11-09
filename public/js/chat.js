var socket = io();

function scrollToBottom() {
  // Selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child');
  // Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

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
  var template = $('#message-template').html();

  var rendered = Mustache.render(template, {
    from: message.from,
    text: message.text,
    createdAt: formattedTime
  });

  $('#messages').append(rendered);
  scrollToBottom();
});

socket.on('newLocationMessage', function(message) {
  var formattedTime = moment().format('h:mm a');
  var template = $('#location-template').html();

  var rendered = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });
  $('#messages').append(rendered);
  scrollToBottom();
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
