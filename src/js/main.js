const ws = new WebSocket("ws://localhost:8080");

const messageInput = document.querySelector('.message__input');
const sendButton = document.querySelector('.message__button');
const messageContainer = document.querySelector('.message-container');

ws.on('open', function open() {
    ws.send('something');
});
   
ws.on('message', function incoming(data) {
    console.log(data);
});

// ws.addEventListener('message', function(event) {
//     addMessage(event.data);
// });

// ws.addEventListener('error', function() {
//     alert('Соединение закрыто или не может быть открыто');
// });